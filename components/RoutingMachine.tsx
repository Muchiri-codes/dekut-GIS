"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

interface RoutingMachineProps {
  start: [number, number];
  end: [number, number];
  onRouteFound: (data: { distance: number; duration: number }) => void;
}

export default function RoutingMachine({ start, end, onRouteFound }: RoutingMachineProps) {
 const map = useMap();
 const lastRouteRef = useRef<string>("");
  useEffect(() => {
    if (!map || !start || !end) return;

    const routeKey = `${start.join(',')}-${end.join(',')}`;
    // Create the routing control
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(end[0], end[1])
      ],
      lineOptions: {
        styles: [{ color: "#eab308", weight: 5, opacity: 0.9 }], // DeKUT Yellow
        extendToWaypoints: true,
        missingRouteTolerance: 10
      },
      // --- UI CONTROL ---
      show: false, 
      addWaypoints: false,
      routeWhileDragging: false,
      fitSelectedRoutes: true,
      // Force the default summary box to be hidden via a CSS class
      itineraryClassName: "hidden", 
    }).addTo(map);

    // --- DATA EMITTER ---
    routingControl.on('routesfound', (e) => {
  
      const summary = e.routes[0].summary;
      
    if (lastRouteRef.current !== routeKey) {
        lastRouteRef.current = routeKey;
        onRouteFound({
          distance: summary.totalDistance,
          duration: summary.totalTime
        });
      }
    });

    return () => {
      if (map && routingControl) {
        map.removeControl(routingControl);
        
      
        const container = document.querySelector('.leaflet-routing-container');
        if (container) container.remove();
      }
    };
  }, [map, start, end]); // Added onRouteFound to dependencies

  return null; 
}