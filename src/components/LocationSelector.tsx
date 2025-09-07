"use client";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";

export default function LocationSelector({
  value,
  onChange,
}: {
  value: [number, number];
  onChange: (newValue: [number, number]) => void;
}) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const clickMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: valueRef.current,
      zoom: 1,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken!,
      marker: false,
      placeholder: "Search city or country…",
      types: "place,region,country",
      proximity: {
        longitude: valueRef.current[0],
        latitude: valueRef.current[1],
      },
      language: "en",
      limit: 5,
    });

    mapRef.current!.addControl(geocoder, "top-right");

    geocoder.on("result", (e) => {
      const [lng, lat] = e.result.center as [number, number];
      clickMarkerRef.current?.remove();

      clickMarkerRef.current = new mapboxgl.Marker({ color: "#F7ECCF" })
        .setLngLat([lng, lat])
        .addTo(mapRef.current!);

      mapRef.current!.flyTo({
        center: [lng, lat],
        zoom: 9,
        speed: 1.4,
        curve: 1.4,
      });
      onChangeRef.current([lng, lat]);
    });

    geocoder.on("clear", () => {
      if (clickMarkerRef.current) {
        clickMarkerRef.current.remove();
        clickMarkerRef.current = null;
      }
    });

    mapRef.current.on("move", () => {
      if (!mapRef.current) return;
      const mapCenter = mapRef.current.getCenter();
      onChangeRef.current([mapCenter.lng, mapCenter.lat]);
    });

    mapRef.current.on("click", (e) => {
      if (!mapRef.current) return;

      if (!clickMarkerRef.current) {
        clickMarkerRef.current = new mapboxgl.Marker({
          color: "#F7ECCF",
        })
          .setLngLat(e.lngLat)
          .addTo(mapRef.current);
      } else {
        clickMarkerRef.current.setLngLat(e.lngLat);
      }

      mapRef.current.easeTo({
        center: e.lngLat,
        zoom: mapRef.current.getZoom() + 1,
        duration: 1500,
      });
      onChangeRef.current([e.lngLat.lng, e.lngLat.lat]);
    });

    return () => {
      clickMarkerRef.current?.remove();
      mapRef.current?.remove();
    };
  }, []);

  return (
    <div className="mt-4 h-100">
      <div className="sidebar hidden sm:block">
        Lat: {value[1].toFixed(4)} | Lng: {value[0].toFixed(4)}
      </div>

      <div id="map-container" className="h-96 w-full" ref={mapContainerRef} />
    </div>
  );
}
