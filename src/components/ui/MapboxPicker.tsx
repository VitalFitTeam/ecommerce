"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { BranchMapData } from "@/app/[locale]/(public)/branches/FindBranch";

export type MapboxPickerProps = {
  branches: BranchMapData[];
  isLoading?: boolean;
};

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

export default function MapboxPicker({
  branches,
  isLoading,
}: MapboxPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || isLoading) {
      return;
    }

    if (map.current && (map.current as any)._loaded) {
      map.current.remove();
      map.current = null;
    }

    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-66.9036, 10.4806],
      zoom: 6,
    });

    map.current = newMap;

    newMap.addControl(new mapboxgl.NavigationControl(), "top-right");

    newMap.on("load", () => {
      markers.current.forEach((m) => m.remove());
      markers.current = [];

      const bounds = new mapboxgl.LngLatBounds();

      branches.forEach((branch) => {
        if (!branch.latitude || !branch.longitude) {
          return;
        }

        const marker = new mapboxgl.Marker({ color: "#f97316" })
          .setLngLat([branch.longitude, branch.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div style="font-family: sans-serif; font-size: 14px;">
              <strong>${branch.name}</strong><br/>
              ${branch.address}<br/>
            ${branch.phone || "N/A"}
            </div>
          `),
          )
          .addTo(newMap);

        markers.current.push(marker);
        bounds.extend([branch.longitude, branch.latitude]);
      });

      if (branches.length > 0) {
        newMap.fitBounds(bounds, { padding: 50 });
      }
    });

    // ✅ Cleanup seguro
    return () => {
      if (map.current && (map.current as any)._loaded) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [branches, isLoading]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-[550px] border border-gray-300 rounded-xl overflow-hidden"
    />
  );
}
