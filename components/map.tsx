"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Dispatch, SetStateAction } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useGeolocation } from "@/hooks/UseGeolocation";
import RoutingMachine from "./RoutingMachine";
import { useState, useEffect, useMemo } from "react";

interface MapProps {
  geolocateCenter: [number, number] | null;
  startPoint: [number, number] | null;
  endPoint: [number, number] | null;
  showRoute: boolean;
  activeMode: 'walk' | 'drive' | 'cycle' | null;
  setRouteData: (data: { distance: number; duration: number }) => void;
}
// Default Icon
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Start Icon (Green)
const startIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// End Icon (Red)
const endIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
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

export default function Map({ geolocateCenter, startPoint, endPoint, showRoute, activeMode, setRouteData }: MapProps) {
  const { position } = useGeolocation();
  const dkuCenter: [number, number] = [-0.397, 36.961];

  const [places, setPlaces] = useState<any[]>([]);
  useEffect(() => {
    async function fetchLandmarks() {
      try {
        const response = await fetch('/api/landmarks');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setPlaces(data);
      } catch (error) {
        console.error("Error loading landmarks:", error);
      }
    }
    fetchLandmarks();
  }, []);

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <MapContainer
        center={dkuCenter}
        zoom={17}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* 1. CAMPUS LANDMARKS */}
        {places.map((place, index) => (
          // Note: Using index as key if MongoDB _id isn't available, but place._id is better
          <Marker key={place._id || index} position={[place.lat, place.lng]} icon={customIcon}>
            <Popup>
              <strong>{place.name}</strong><br />
              {place.description || "Campus Landmark"}
            </Popup>
          </Marker>
        ))}

        {/* User Location */}
        {position?.lat && position?.lng && (
          <Marker position={[position.lat, position.lng]} icon={customIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* 3. SEARCH RESULT MARKER */}
        {geolocateCenter && (
          <Marker position={geolocateCenter} icon={customIcon}>
            <Popup>Search Result</Popup>
          </Marker>
        )}

        {/* 4. ROUTE SPECIFIC MARKERS */}
        {startPoint && (
          <Marker position={startPoint} icon={startIcon}>
            <Popup>Start Point</Popup>
          </Marker>
        )}

        {endPoint && (
          <Marker position={endPoint} icon={endIcon}>
            <Popup>Destination</Popup>
          </Marker>
        )}


        {/* Routing Logic */}
        {showRoute && startPoint && endPoint && activeMode && (
          <RoutingMachine 
            start={startPoint} 
            end={endPoint}
            mode={activeMode}
            onRouteFound={(data) => setRouteData(data)} 
          />
        )}

        <MapController center={geolocateCenter} />
      </MapContainer>
    </div>
  );
}