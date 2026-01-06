"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

interface RoutingMachineProps {
  start: [number, number];
  end: [number, number];
  mode: "walk" | "drive" | "cycle";
  onRouteFound: (data: {
    distance: number;
    duration: number;
    steps: any[];
    routeName: string;
  }) => void;
}
export default function RoutingMachine({ start, end, mode, onRouteFound }: RoutingMachineProps) {
  const map = useMap();
  const routingControlRef = useRef<any>(null); 
  useEffect(() => {
    if (!map || !start || !end) return;

    const routingControl = (L.Routing as any).control({
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
        profile: mode === "walk" ? "foot" : mode === "cycle" ? "bicycle" : "car",
      }),
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      createMarker: () => null,
      lineOptions: {
        styles: [{ color: " #1e40af", weight: 4, opacity: 0.9 }],
        addWaypoints: false,
      },
      show: true,
      addWaypoints: false,
      fitSelectedRoutes: true,
    }).addTo(map);

    routingControlRef.current = routingControl;
    routingControl.on('routesfound', (e: any) => {

      if (!routingControlRef.current) return;

      const route = e.routes[0];
      onRouteFound({
        distance: route.summary.totalDistance,
        duration: route.summary.totalTime,
        steps: route.instructions || [],
        routeName: route.name || ""
      });
    });

   
    return () => {
      if (routingControlRef.current) {
        const instance = routingControlRef.current;
        routingControlRef.current = null; 

        try {
          instance.off();
          if (instance.getRouter() && (instance.getRouter() as any).abort) {
            (instance.getRouter() as any).abort();
          }
          if (instance._line) {
            map.removeLayer(instance._line);
            instance._line = null;
          }

          map.removeControl(instance);
        } catch (err) {
          console.debug("Cleanup handled safely");
        }
      }
    };
  }, [map, start[0], start[1], end[0], end[1], mode]);

  return null;
}