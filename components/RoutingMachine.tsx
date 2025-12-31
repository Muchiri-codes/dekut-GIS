"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

interface RoutingMachineProps {
  start: [number, number];
  end: [number, number];
  mode: 'walk' | 'drive' | 'cycle'|null;
  onRouteFound: (data: { distance: number; duration: number }) => void;
}

export default function RoutingMachine({ start, end, onRouteFound, mode }: RoutingMachineProps) {
 const map = useMap();
 const lastRouteRef = useRef<string>("");
  useEffect(() => {
    if (!map || !start || !end) return;

    const router = L.Routing.osrmv1({
    serviceUrl: "https://router.project-osrm.org/route/v1",
    profile: mode === 'walk' ? 'foot' : mode === 'cycle' ? 'bicycle' : 'driving',
  });

    const routeKey = `${start.join(',')}-${end.join(',')}`;
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
      itineraryClassName: "hidden", 
    }).addTo(map);

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
  }, [map, start, end, mode]); // Added onRouteFound to dependencies

  return null; 
}