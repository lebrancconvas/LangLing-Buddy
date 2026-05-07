"use client";

import dynamic from "next/dynamic";

const MapExplorer = dynamic(() => import("@/components/maps/map-explorer"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[50vh] items-center justify-center text-zinc-400">Loading map…</div>
  ),
});

export default function MapsPage() {
  return <MapExplorer />;
}
