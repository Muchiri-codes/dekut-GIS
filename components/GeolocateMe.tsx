"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";

interface Props {
  onLocate: (lat: number, lng: number) => void;
  className?: string;
}

export function GeolocateButton({ onLocate, className }: Props) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGeolocate = () => {
    if (!mounted || typeof window === "undefined") return;

    setLoading(true);
    setError(null);

    
    console.log(" Geolocation started...");

    const successCallback = (pos: GeolocationPosition) => {
      console.log(" Location found:", pos.coords);
      setLoading(false);
      onLocate(pos.coords.latitude, pos.coords.longitude);
    };

    const errorCallback = (err: GeolocationPositionError) => {
      console.error(" Geolocation Error:", err);
      setLoading(false);
      
      if (err.code === 2) setError("Position unavailable (Check Wi-Fi/GPS).");
      else if (err.code === 3) setError("Timed out. Try again.");
      else setError("Location error occurred.");
    };


    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
      enableHighAccuracy: false, 
      timeout: 10000,
      maximumAge: Infinity
    });
  };

  if (!mounted) return <div className="h-10 w-32 bg-slate-800 animate-pulse rounded-md" />;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <Button 
        type="button"
        onClick={(e) => {
          e.preventDefault();
          handleGeolocate();
        }} 
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
        <span className="ml-2">{loading ? "Locating..." : "Use My Location"}</span>
      </Button>

      {error && (
        <p className="text-[10px] text-red-400 mt-1 bg-red-950/20 px-2 py-1 rounded border border-red-500/20">
          {error}
        </p>
      )}
    </div>
  );
}