"use client";

import { useState, useEffect } from "react";

export interface Position {
  lat: number;
  lng: number;
}

export function useGeolocation() {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000, // 10 seconds
        timeout: 5000,
      }
    );

    // Cleanup on unmount
    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, []);

  return {position, error}
}
