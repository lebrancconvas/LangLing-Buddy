import logging
from typing import Any

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.models.schemas import (
    ChineseCharacterReadings,
    ChineseHandwritingCandidate,
    ChineseHandwritingResponse,
    VisionOcrResponse,
)
from app.prompts.vision import CHINESE_HW_SYSTEM, CHINESE_HW_USER, OCR_SYSTEM, OCR_USER
from app.services.ai_router import ai_router
from app.utils.json_extract import extract_json_object

logger = logging.getLogger(__name__)

router = APIRouter()

MAX_IMAGE_BYTES = 4 * 1024 * 1024
_ALLOWED_MIME = frozenset(
    {"image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"}
)


def _as_str_list(val) -> list[str]:
    if val is None:
        return []
    if isinstance(val, list):
        return [str(x).strip() for x in val if str(x).strip()]
    if isinstance(val, str) and val.strip():
        return [val.strip()]
    return []


def _as_int(val) -> int | None:
    if val is None:
        return None
    try:
        return int(val)
    except (TypeError, ValueError):
        return None


def _pick(d: dict[str, Any], *keys: str) -> str:
    for k in keys:
        v = d.get(k)
        if v is None:
            continue
        s = str(v).strip()
        if s:
            return s
    return ""


def _parse_readings(sub: Any) -> ChineseCharacterReadings:
    if not isinstance(sub, dict):
        return ChineseCharacterReadings()
    d = sub
    return ChineseCharacterReadings(
        pinyin=_pick(d, "pinyin"),
        zhuyin_bopomofo=_pick(d, "zhuyin_bopomofo", "bopomofo", "zhuyin"),
        wade_giles=_pick(d, "wade_giles", "wade_giles_syllable"),
        cantonese_jyutping=_pick(d, "cantonese_jyutping", "jyutping"),
        cantonese_yale=_pick(d, "cantonese_yale", "yale_cantonese"),
        hokkien_poj=_pick(d, "hokkien_poj", "poj", "pehoeji"),
        teochew_pengim=_pick(d, "teochew_pengim", "pengim"),
        hakka_pin_yim=_pick(d, "hakka_pin_yim", "hakka"),
        hainanese=_pick(d, "hainanese", "hainan"),
        shanghainese_wugniu=_pick(
            d, "shanghainese_wugniu", "wugniu", "shanghainese"
        ),
    )


def _parse_candidate_row(row: Any, fallback_rank: int) -> ChineseHandwritingCandidate | None:
    if not isinstance(row, dict):
        return None
    char = str(row.get("character") or "").strip()
    rank = _as_int(row.get("rank")) or fallback_rank
    readings = _parse_readings(row.get("readings"))
    return ChineseHandwritingCandidate(
        rank=rank,
        character=char,
        confidence_note=str(row.get("confidence_note") or ""),
        simplified=str(row.get("simplified") or ""),
        traditional=str(row.get("traditional") or ""),
        readings=readings,
        meaning=str(row.get("meaning") or ""),
        stroke_count=_as_int(row.get("stroke_count")),
        stroke_order_description=str(row.get("stroke_order_description") or ""),
        example_words=_as_str_list(row.get("example_words"))[:12],
        usage_notes=str(row.get("usage_notes") or ""),
    )


def _normalize_candidates(
    parsed: dict[str, Any],
) -> list[ChineseHandwritingCandidate]:
    raw_list = parsed.get("candidates")
    out: list[ChineseHandwritingCandidate] = []
    if isinstance(raw_list, list):
        for i, row in enumerate(raw_list, start=1):
            c = _parse_candidate_row(row, i)
            if c is not None:
                out.append(c)
    # Legacy single-character API shape
    if not out:
        leg_char = str(parsed.get("primary_character") or "").strip()
        if leg_char:
            top = ChineseHandwritingCandidate(
                rank=1,
                character=leg_char,
                simplified=str(parsed.get("simplified") or ""),
                traditional=str(parsed.get("traditional") or ""),
                readings=ChineseCharacterReadings(
                    pinyin=str(parsed.get("pinyin") or ""),
                ),
                meaning=str(parsed.get("meaning") or ""),
                stroke_count=_as_int(parsed.get("stroke_count")),
                stroke_order_description=str(
                    parsed.get("stroke_order_description") or ""
                ),
                example_words=_as_str_list(parsed.get("example_words"))[:12],
                usage_notes=str(parsed.get("usage_notes") or ""),
            )
            out.append(top)
            for j, alt in enumerate(_as_str_list(parsed.get("alternatives")), start=2):
                if j > 11:
                    break
                if alt == leg_char:
                    continue
                out.append(
                    ChineseHandwritingCandidate(
                        rank=j,
                        character=alt,
                        readings=ChineseCharacterReadings(),
                    )
                )

    out.sort(key=lambda x: x.rank)
    seen: set[str] = set()
    deduped: list[ChineseHandwritingCandidate] = []
    for c in out:
        if not c.character:
            continue
        if c.character in seen:
            continue
        seen.add(c.character)
        deduped.append(c)
    deduped = deduped[:11]
    normalized: list[ChineseHandwritingCandidate] = []
    for i, c in enumerate(deduped, start=1):
        normalized.append(c.model_copy(update={"rank": i}))
    return normalized


async def _read_image(file: UploadFile) -> tuple[bytes, str]:
    data = await file.read()
    if len(data) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Image too large (max 4MB)")
    mime = (file.content_type or "image/png").split(";")[0].strip().lower()
    if mime == "image/jpg":
        mime = "image/jpeg"
    if mime not in _ALLOWED_MIME:
        mime = "image/png"
    return data, mime


@router.post("/ocr", response_model=VisionOcrResponse)
async def ocr_from_image(file: UploadFile = File(...)) -> VisionOcrResponse:
    try:
        image_bytes, mime = await _read_image(file)
        raw = await ai_router.generate_with_image(
            OCR_USER,
            image_bytes,
            mime,
            system_prompt=OCR_SYSTEM,
            temperature=0.15,
            max_tokens=8192,
        )
        parsed = extract_json_object(raw)
        if not parsed:
            return VisionOcrResponse(
                confidence_note="Could not parse JSON; showing raw model output.",
                raw_model_text=raw,
            )
        return VisionOcrResponse(
            writing_systems=_as_str_list(parsed.get("writing_systems")),
            language_guess=str(parsed.get("language_guess") or ""),
            full_transcription=str(parsed.get("full_transcription") or ""),
            words=_as_str_list(parsed.get("words")),
            sentences=_as_str_list(parsed.get("sentences")),
            alphabet_or_script_notes=str(parsed.get("alphabet_or_script_notes") or ""),
            confidence_note=str(parsed.get("confidence_note") or ""),
            raw_model_text=raw,
        )
    except HTTPException:
        raise
    except RuntimeError as exc:
        logger.warning("Vision OCR unavailable: %s", exc)
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("OCR failed")
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@router.post("/chinese-handwriting", response_model=ChineseHandwritingResponse)
async def chinese_handwriting(file: UploadFile = File(...)) -> ChineseHandwritingResponse:
    try:
        image_bytes, mime = await _read_image(file)
        raw = await ai_router.generate_with_image(
            CHINESE_HW_USER,
            image_bytes,
            mime,
            system_prompt=CHINESE_HW_SYSTEM,
            temperature=0.15,
            max_tokens=16384,
        )
        parsed = extract_json_object(raw)
        if not parsed:
            return ChineseHandwritingResponse(
                drawing_note="Could not parse JSON; see raw model output.",
                raw_model_text=raw,
            )
        candidates = _normalize_candidates(parsed)
        drawing_note = str(parsed.get("drawing_note") or "")
        if not candidates and parsed.get("usage_notes"):
            drawing_note = (drawing_note + " " + str(parsed.get("usage_notes"))).strip()
        return ChineseHandwritingResponse(
            candidates=candidates,
            drawing_note=drawing_note,
            raw_model_text=raw,
        )
    except HTTPException:
        raise
    except RuntimeError as exc:
        logger.warning("Chinese handwriting vision unavailable: %s", exc)
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        logger.exception("Chinese handwriting failed")
        raise HTTPException(status_code=500, detail=str(exc)) from exc
