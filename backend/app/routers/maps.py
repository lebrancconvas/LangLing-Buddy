import logging
from typing import Any

import httpx
from fastapi import APIRouter, HTTPException, Query

from app.data.map_presets import COUNTRY_BOUNDS, MAP_LEVELS_HELP, REGION_BOUNDS
from app.models.schemas import MapSearchResponse, MapSearchResult

logger = logging.getLogger(__name__)

router = APIRouter()

NOMINATIM_SEARCH = "https://nominatim.openstreetmap.org/search"
NOMINATIM_USER_AGENT = "LangLing/1.0 (Educational map search; contact via project maintainer)"

"""Follow Nominatim usage policy: identify the app, cache where possible, do not exceed fair use."""


@router.get("/presets")
async def map_presets() -> dict[str, Any]:
    regions = [
        {"id": key, "label": val["label"], "bounds": val["bounds"]}
        for key, val in REGION_BOUNDS.items()
    ]
    countries = [
        {"id": key, "name": val["name"], "bounds": val["bounds"]}
        for key, val in sorted(
            COUNTRY_BOUNDS.items(), key=lambda x: str(x[1]["name"])
        )
    ]
    levels = MAP_LEVELS_HELP
    return {"regions": regions, "countries": countries, "levels": levels}


@router.get("/search", response_model=MapSearchResponse)
async def map_search(
    q: str = Query(..., min_length=2, max_length=256),
    limit: int = Query(10, ge=1, le=15),
    country_code: str = Query("", max_length=2),
) -> MapSearchResponse:
    params: dict[str, str | int] = {
        "q": q.strip(),
        "format": "json",
        "limit": min(limit, 15),
        "addressdetails": 1,
    }
    cc = country_code.strip().lower()
    if cc and len(cc) == 2:
        params["countrycodes"] = cc

    headers = {"User-Agent": NOMINATIM_USER_AGENT, "Accept-Language": "en"}

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.get(NOMINATIM_SEARCH, params=params, headers=headers)
    except httpx.RequestError as exc:
        logger.warning("Nominatim request failed: %s", exc)
        raise HTTPException(status_code=502, detail="Geocoding service unreachable") from exc

    if resp.status_code == 429:
        raise HTTPException(
            status_code=429,
            detail="Search rate limit from geocoder. Wait a moment and try again.",
        )

    resp.raise_for_status()
    data = resp.json()
    if not isinstance(data, list):
        return MapSearchResponse(results=[])

    results: list[MapSearchResult] = []
    for item in data[: min(limit, 15)]:
        try:
            lat = float(item.get("lat", 0))
            lon = float(item.get("lon", 0))
        except (TypeError, ValueError):
            continue
        addr = item.get("addresstype") or item.get("type") or ""
        results.append(
            MapSearchResult(
                name=str(item.get("name") or ""),
                display_name=str(item.get("display_name") or ""),
                lat=lat,
                lon=lon,
                category=str(item.get("category") or ""),
                type=str(addr),
                importance=float(item.get("importance") or 0),
            )
        )

    return MapSearchResponse(results=results)
