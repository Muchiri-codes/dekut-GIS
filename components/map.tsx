"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useGeolocation } from "@/hooks/UseGeolocation";
import { useEffect, useMemo } from "react";

// Create a stable custom icon instance
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 17, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function Map({ geolocateCenter }: { geolocateCenter: [number, number] | null }) {
  const { position } = useGeolocation();
  const dkuCenter: [number, number] = [-0.397, 36.961];

  const places = useMemo(() => [
    { name: "Library", lat: -0.3975, lng: 36.9620 },
    { name: "Science Park", lat: -0.3985, lng: 36.9605 },
    { name: "Main Gate", lat: -0.3965, lng: 36.9595 },
  ], []);

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <MapContainer
        center={dkuCenter}
        zoom={17}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        {geolocateCenter && (
        <Marker position={geolocateCenter}>
          <Popup>Search Result</Popup>
        </Marker>
      )}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* User Location Marker */}
        {position?.lat && position?.lng && (
          <Marker position={[position.lat, position.lng]} icon={customIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Static Landmarks */}
        {places.map((place) => (
          <Marker key={place.name} position={[place.lat, place.lng]} icon={customIcon}>
            <Popup>{place.name}</Popup>
          </Marker>
        ))}

        <MapController center={geolocateCenter} />
      </MapContainer>
    </div>
  );
}