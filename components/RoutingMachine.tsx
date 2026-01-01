"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

interface RoutingMachineProps {
  start: [number, number];
  end: [number, number];
  mode: 'walk' | 'drive' | 'cycle' | null;
  onRouteFound: (data: { distance: number; duration: number; steps: any[]; 
    routeName: string }) => void;
}

export default function RoutingMachine({ start, end, onRouteFound, mode }: RoutingMachineProps) {
  const map = useMap();
  const lastRouteRef = useRef<string>("");
  const controlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!map || !start || !end || !mode) return;

    
    const router = L.Routing.osrmv1({
      serviceUrl: "https://router.project-osrm.org/route/v1",
      profile: mode === 'walk' ? 'foot' : mode === 'cycle' ? 'bicycle' : 'driving',
    });

    const routeKey = `${start.join(',')}-${end.join(',')}-${mode}`;

    // Create the routing control
    const routingControl = L.Routing.control({
      router: router,
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      lineOptions: {
        styles: [{ color: "#eab308", weight: 5, opacity: 0.9 }],
        extendToWaypoints: true,
        missingRouteTolerance: 10
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
      // @ts-ignore - Leaflet types sometimes miss this
      itineraryClassName: "hidden",
    });

    controlRef.current = routingControl;

    try {
      routingControl.addTo(map);
    } catch (err) {
      console.error("Leaflet routing attachment error:", err);
    }

    routingControl.on('routesfound', (e) => {
      const route = e.routes[0];
      const summary = route.summary;
      const instructions = route.instructions; 
      const routeName = route.name;
      if (lastRouteRef.current !== routeKey) {
        lastRouteRef.current = routeKey;
        onRouteFound({
          distance: summary.totalDistance,
          duration: summary.totalTime,
          steps: instructions, 
          routeName: routeName
        });
      }
    });

return () => {
  if (controlRef.current && map) {
    try {
      const control = controlRef.current;
      
      if (control.getPlan()) {
        control.getPlan().setWaypoints([]);
      }

      if ((map as any)._loaded) {
        map.removeControl(control);
      }
    } catch (e) {
      console.debug("Routing cleanup: Handled internal Leaflet race condition.");
    } finally {
      controlRef.current = null;
    }
  }

  // DOM cleanup for the itinerary boxes
  const containers = document.querySelectorAll('.leaflet-routing-container');
  containers.forEach(container => {
    try {
      container.remove();
    } catch (err) {
    }
  });
};
  }, [map, start, end, mode, onRouteFound]);

  return null;
}