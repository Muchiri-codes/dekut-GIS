"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useGeolocation } from "@/hooks/UseGeolocation";
import { useEffect } from "react";

// fix default marker icon
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 17); // animate to position
    }
  }, [center, map]); // Added useEffect to prevent infinite render loops
  return null;
}

export default function Map({ geolocateCenter }: { geolocateCenter: [number, number] | null }) {
  const { position, error } = useGeolocation();

  const dkuCenter: [number, number] = [-0.397, 36.961]; 

  // Example campus markers
  const places = [
    { name: "Library", lat: -0.3975, lng: 36.9620 },
    { name: "Science Park", lat: -0.3985, lng: 36.9605 },
    { name: "Main Gate", lat: -0.3965, lng: 36.9595 },
  ];

  return (
    <MapContainer
      center={dkuCenter}
      zoom={17}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        attribution="&copy; OpenStreetMap contributors" 
      />

      {position && position.lat && position.lng && (
        <Marker position={[position.lat, position.lng]}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {places.map((place) => (
        <Marker key={place.name} position={[place.lat, place.lng]}>
          <Popup>{place.name}</Popup>
        </Marker>
      ))}

      {/* Fly to geolocateCenter if button clicked */}
      {geolocateCenter && <MapController center={geolocateCenter} />}
    </MapContainer>
  );
}