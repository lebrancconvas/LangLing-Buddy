import logging

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.models.schemas import ChineseHandwritingResponse, VisionOcrResponse
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
            max_tokens=4096,
        )
        parsed = extract_json_object(raw)
        if not parsed:
            return ChineseHandwritingResponse(
                usage_notes="Could not parse JSON; see raw model output.",
                raw_model_text=raw,
            )
        return ChineseHandwritingResponse(
            primary_character=str(parsed.get("primary_character") or ""),
            alternatives=_as_str_list(parsed.get("alternatives"))[:8],
            simplified=str(parsed.get("simplified") or ""),
            traditional=str(parsed.get("traditional") or ""),
            pinyin=str(parsed.get("pinyin") or ""),
            meaning=str(parsed.get("meaning") or ""),
            stroke_count=_as_int(parsed.get("stroke_count")),
            stroke_order_description=str(
                parsed.get("stroke_order_description") or ""
            ),
            example_words=_as_str_list(parsed.get("example_words"))[:12],
            usage_notes=str(parsed.get("usage_notes") or ""),
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
