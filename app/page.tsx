"use client";
import { useState, useCallback} from 'react';
import LeftPanel from '@/components/left-panel';
import Map from '@/components/map';
import { RouteSummary } from '@/components/right-panel';
import { AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';

export default function Home() {
  const [startCoords, setStartCoords] = useState<[number, number] | null>(null);
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);
  const [activeMode, setActiveMode] = useState<'walk' | 'drive' | 'cycle' | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [routeData, setRouteData] = useState<{ distance: number, duration: number } | null>(null);
  const handleRouteFound = useCallback((data: { distance: number; duration: number }) => {
  setRouteData(prev => {
    
    if (prev?.distance === data.distance && prev?.duration === data.duration) {
      return prev;
    }
    return data;
  });
}, []);

  return (
    <main className="flex h-screen w-full bg-slate-950 overflow-hidden">
    
      <div className="w-[350px] h-full border-r border-slate-800 z-20 bg-slate-900">
        <LeftPanel
          onSearchLocation={(lat, lng) => setMapCenter([lat, lng])}
          setStartCoords={setStartCoords}
          setDestCoords={setDestCoords}
          setActiveMode={setActiveMode}
          setShowRoute={setShowRoute}
          startCoords={startCoords}
          destCoords={destCoords}
          activeMode={activeMode}
          showRoute={showRoute}
        />
      </div>

      {/* MAP AREA (The Anchor) */}
      <div className="flex-1 relative h-full">
        <Map geolocateCenter={mapCenter}
          startPoint={startCoords}
          endPoint={destCoords}
          showRoute={showRoute}
          setRouteData={handleRouteFound}
        />


        <AnimatePresence>
          {showRoute && startCoords && destCoords && activeMode && routeData && (
            <div className="absolute top-4 right-4 z-[1001] w-[320px] pointer-events-auto">
              <RouteSummary
                start={startCoords}
                end={destCoords}
                mode={activeMode}
                distance={routeData.distance}
                duration={routeData.duration}
                onClose={() => {
                  setShowRoute(false);
                  setRouteData(null);
                }}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}