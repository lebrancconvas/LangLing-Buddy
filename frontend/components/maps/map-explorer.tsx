"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Globe2, Loader2, MapPin, Search } from "lucide-react";
import { api } from "@/lib/api";
import type { Map } from "leaflet";

type PresetRegion = { id: string; label: string; bounds: number[] };
type PresetCountry = { id: string; name: string; bounds: number[] };
type LevelHelp = { id: string; title: string; detail: string };

type MapSearchHit = {
  name: string;
  display_name: string;
  lat: number;
  lon: number;
  category: string;
  type: string;
  importance: number;
};

type LeafletModule = typeof import("leaflet");

export default function MapExplorer() {
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);
  const markersRef = useRef<import("leaflet").LayerGroup | null>(null);

  const [mapReady, setMapReady] = useState(false);
  const [presets, setPresets] = useState<{
    regions: PresetRegion[];
    countries: PresetCountry[];
    levels: LevelHelp[];
  } | null>(null);
  const [loadError, setLoadError] = useState("");

  const [mapMode, setMapMode] = useState<"world" | "region" | "country" | "search">("world");
  const [regionId, setRegionId] = useState("asia");
  const [countryId, setCountryId] = useState("TH");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCountryFilter, setSearchCountryFilter] = useState("");
  const [searchBusy, setSearchBusy] = useState(false);
  const [searchResults, setSearchResults] = useState<MapSearchHit[]>([]);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const data = await api.mapPresets();
        setPresets(data);
      } catch {
        setLoadError("Could not load map presets. Is the backend running?");
      }
    })();
  }, []);

  useEffect(() => {
    let destroyed = false;
    let map: Map | null = null;

    void (async () => {
      await import("leaflet/dist/leaflet.css");
      const L = await import("leaflet");
      if (destroyed || !mapElRef.current) return;
      leafletRef.current = L;
      map = L.map(mapElRef.current, {
        worldCopyJump: true,
      }).setView([20, 0], 2);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      markersRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setMapReady(true);
      setTimeout(() => map?.invalidateSize(), 150);
    })();

    return () => {
      destroyed = true;
      map?.remove();
      mapRef.current = null;
      markersRef.current = null;
      leafletRef.current = null;
      setMapReady(false);
    };
  }, []);

  const fitBounds = useCallback((bounds: number[], maxZoom?: number) => {
    const L = leafletRef.current;
    const m = mapRef.current;
    if (!L || !m || bounds.length < 4) return;
    const [south, west, north, east] = bounds;
    const b = L.latLngBounds(L.latLng(south, west), L.latLng(north, east));
    m.fitBounds(b, { padding: [28, 28], maxZoom: maxZoom ?? 12 });
  }, []);

  const flyToPoint = useCallback((lat: number, lon: number, zoom = 11) => {
    const m = mapRef.current;
    if (!m) return;
    m.flyTo([lat, lon], Math.min(zoom, 16), { duration: 0.85 });
  }, []);

  useEffect(() => {
    if (!mapReady || !markersRef.current || !leafletRef.current) return;
    const L = leafletRef.current;
    markersRef.current.clearLayers();
  }, [mapReady, mapMode, regionId, countryId]);

  useEffect(() => {
    if (!mapReady) return;
    if (mapMode === "world") {
      fitBounds([-56, -179, 85, 179], 3);
      return;
    }
    if (mapMode === "region" && presets?.regions.length) {
      const r = presets.regions.find((x) => x.id === regionId);
      if (r?.bounds?.length === 4) fitBounds(r.bounds, 5);
      return;
    }
    if (mapMode === "country" && presets?.countries.length) {
      const c = presets.countries.find((x) => x.id === countryId);
      if (c?.bounds?.length === 4) fitBounds(c.bounds, 7);
    }
  }, [mapReady, mapMode, regionId, countryId, presets, fitBounds]);

  const runSearch = useCallback(async () => {
    const q = searchQuery.trim();
    if (q.length < 2) return;
    setSearchBusy(true);
    setSearchError("");
    setSearchResults([]);
    try {
      const res = await api.mapSearch(q, searchCountryFilter.trim(), 12);
      setSearchResults(res.results);
      if (res.results.length === 0) {
        setSearchError("No results. Try another spelling or broader name.");
      } else {
        setMapMode("search");
        const L = leafletRef.current;
        const layer = markersRef.current;
        if (L && layer && mapRef.current) {
          layer.clearLayers();
          for (const hit of res.results) {
            L.circleMarker([hit.lat, hit.lon], {
              radius: 7,
              color: "#6366f1",
              fillColor: "#818cf8",
              fillOpacity: 0.85,
              weight: 2,
            })
              .bindPopup(`<strong>${hit.name || "Place"}</strong><br/>${hit.display_name}`)
              .addTo(layer);
          }
          if (res.results.length === 1) {
            flyToPoint(res.results[0].lat, res.results[0].lon, 12);
          } else {
            const lats = res.results.map((r) => r.lat);
            const lons = res.results.map((r) => r.lon);
            const pad = 0.6;
            fitBounds(
              [
                Math.min(...lats) - pad,
                Math.min(...lons) - pad,
                Math.max(...lats) + pad,
                Math.max(...lons) + pad,
              ],
              10
            );
          }
        }
      }
    } catch (e) {
      setSearchError(e instanceof Error ? e.message : "Search failed.");
    } finally {
      setSearchBusy(false);
    }
  }, [searchQuery, searchCountryFilter, fitBounds, flyToPoint]);

  const focusSearchHit = useCallback((hit: MapSearchHit) => {
    flyToPoint(hit.lat, hit.lon, 13);
  }, [flyToPoint]);

  return (
    <div className="flex h-full min-h-[calc(100vh-4rem)] flex-col">
      <header className="flex shrink-0 flex-col gap-3 border-b border-zinc-800 px-4 py-3 sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white">
            <Globe2 size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Interactive maps</h1>
            <p className="text-xs text-zinc-400">
              World → regions → countries → place search (provinces, districts, cities via OpenStreetMap).
            </p>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 lg:flex-row lg:gap-0 lg:p-0">
        <aside className="flex w-full shrink-0 flex-col gap-4 overflow-y-auto border-zinc-800 lg:w-[340px] lg:border-r lg:p-4">
          {loadError && (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
              {loadError}
            </p>
          )}

          {presets?.levels && (
            <div className="rounded-xl border border-zinc-700 bg-zinc-900/40 p-3 text-xs text-zinc-400">
              <p className="mb-2 font-semibold text-zinc-300">Map levels</p>
              <ul className="space-y-2">
                {presets.levels.map((lv) => (
                  <li key={lv.id}>
                    <span className="text-zinc-200">{lv.title}:</span> {lv.detail}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {(
              [
                ["world", "World"],
                ["region", "Region"],
                ["country", "Country"],
                ["search", "Search place"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setMapMode(key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  mapMode === key
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {mapMode === "region" && presets && (
            <label className="block text-xs text-zinc-400">
              Region
              <select
                value={regionId}
                onChange={(e) => setRegionId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
              >
                {presets.regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          {mapMode === "country" && presets && (
            <label className="block text-xs text-zinc-400">
              Country
              <select
                value={countryId}
                onChange={(e) => setCountryId(e.target.value)}
                className="mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200"
              >
                {presets.countries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          {mapMode === "search" && (
            <div className="space-y-2 rounded-xl border border-zinc-700 bg-zinc-900/40 p-3">
              <p className="text-xs font-medium text-zinc-300">Find a place</p>
              <p className="text-[11px] leading-snug text-zinc-500">
                Search neighborhoods, provinces, districts, landmarks, or cities. Results come from OpenStreetMap (rate-limited);
                use the country code filter to narrow results.
              </p>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Chiang Mai, Bavaria, Shinjuku"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500"
                onKeyDown={(e) => e.key === "Enter" && runSearch()}
              />
              <input
                value={searchCountryFilter}
                onChange={(e) => setSearchCountryFilter(e.target.value.toUpperCase())}
                placeholder="Country code (optional, e.g. TH, JP)"
                maxLength={2}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500"
              />
              <button
                type="button"
                disabled={searchBusy || searchQuery.trim().length < 2}
                onClick={() => void runSearch()}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white disabled:opacity-40"
              >
                {searchBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search size={16} />}
                Search
              </button>
              {searchError && (
                <p className="text-xs text-red-300">{searchError}</p>
              )}
              {searchResults.length > 0 && (
                <ul className="max-h-48 space-y-1 overflow-y-auto text-xs text-zinc-300">
                  {searchResults.map((hit, i) => (
                    <li key={`${hit.lat}-${hit.lon}-${i}`}>
                      <button
                        type="button"
                        onClick={() => focusSearchHit(hit)}
                        className="flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-zinc-800"
                      >
                        <MapPin size={14} className="mt-0.5 shrink-0 text-sky-400" />
                        <span className="line-clamp-3">{hit.display_name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <p className="text-[10px] leading-relaxed text-zinc-600">
            Map data © OpenStreetMap contributors. Geocoding via Nominatim—please throttle usage on shared servers.
          </p>
        </aside>

        <div className="relative min-h-[320px] flex-1 lg:min-h-0">
          {!mapReady && (
            <div className="absolute inset-0 z-[500] flex items-center justify-center bg-zinc-950/80 text-sm text-zinc-400">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading map…
            </div>
          )}
          <div ref={mapElRef} className="h-full min-h-[50vh] w-full" />
        </div>
      </div>
    </div>
  );
}
