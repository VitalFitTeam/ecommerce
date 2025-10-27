"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export type MapboxPickerProps = {
  lat?: string;
  lng?: string;
};

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

export default function MapboxPicker({ lat, lng }: MapboxPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) {
      return;
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [
        lng ? parseFloat(lng) : -66.9036,
        lat ? parseFloat(lat) : 10.4806,
      ],
      zoom: 12,
    });

    map.current.on("click", async (e) => {
      const longitude = e.lngLat.lng;
      const latitude = e.lngLat.lat;

      if (marker.current) {
        marker.current.setLngLat([longitude, latitude]);
      } else {
        marker.current = new mapboxgl.Marker({ color: "#f97316" })
          .setLngLat([longitude, latitude])
          .addTo(map.current!);
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [lat, lng]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-128 border border-gray-300 rounded-md overflow-hidden"
    />
  );
}
