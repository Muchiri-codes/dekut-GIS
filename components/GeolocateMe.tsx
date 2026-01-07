"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";

interface Props {
  onLocate: (lat: number, lng: number) => void;
  className?: string;
}

export function GeolocateButton({ onLocate }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLoading(false);
        onLocate(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        setLoading(false);
        if (err.code === err.TIMEOUT)
          setError("Location request timed out");
        else
          setError("Unable to retrieve location");
      },
      { enableHighAccuracy: true, timeout: 30000 }
    );
  };

  return (
    <div className="flex flex-col gap-1">
      <Button 
      onClick={handleGeolocate} 
      disabled={loading}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MapPin className="h-4 w-4" />
        )}
        {loading ? "Locating…" : "Geolocate me"}
      </Button>

     {error && (
        <div className="absolute left-14 top-1/2 -translate-y-1/2 w-48 pointer-events-none">
           <p className="text-[10px] leading-tight text-red-400 bg-slate-950/80 px-2 py-1 rounded border border-red-500/30 backdrop-blur-sm">
             {error}
           </p>
        </div>
      )}
    </div>
  );
}
