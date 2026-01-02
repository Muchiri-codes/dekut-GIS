"use client";
import { useState, useCallback, useEffect } from 'react';
import LeftPanel from '@/components/left-panel';
import dynamic from "next/dynamic";
import { RouteSummary } from '@/components/right-panel';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/Header';

const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
});

export default function Home() {
  const [startCoords, setStartCoords] = useState<[number, number] | null>(null);
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);
  const [activeMode, setActiveMode] = useState<'walk' | 'drive' | 'cycle' | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [routeData, setRouteData] = useState<{ distance: number, duration: number, steps: any[], routeName: string } | null>(null);

  // --- MOBILE UI STATE ---
  const [mobilePanel, setMobilePanel] = useState<'none' | 'search' | 'navigator'>('none');
  const [showWelcome, setShowWelcome] = useState(true);

  const handleRouteFound = useCallback((data: { distance: number; duration: number, steps: any[], routeName: string }) => {
    setRouteData(prev => {
      if (prev?.distance === data.distance && prev?.routeName === data.routeName) {
        return prev;
      }
      return data;
    });
    // Auto-hide panel when route is generated on mobile
    setMobilePanel('none');
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 overflow-hidden">
      <Header />
      
      <main className="flex flex-1 w-full overflow-hidden relative">
        
        {/* --- DESKTOP LEFT PANEL (Hidden on Mobile) --- */}
        <div className="hidden md:block w-[350px] h-full border-r border-slate-800 z-20 bg-slate-900">
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

        {/* --- MAP AREA (Full screen on mobile) --- */}
        <div className="flex-1 relative h-full w-full">
          <Map 
            geolocateCenter={mapCenter}
            startPoint={startCoords}
            endPoint={destCoords}
            showRoute={showRoute}
            setRouteData={handleRouteFound}
            activeMode={activeMode}
          />

          {/* --- MOBILE TOGGLE CONTROLS (Floating) --- */}
          <div className="md:hidden absolute top-4 left-1/2 -translate-x-1/2 z-[1001] flex gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-full shadow-2xl border border-slate-700">
            <button 
              onClick={() => setMobilePanel(mobilePanel === 'search' ? 'none' : 'search')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mobilePanel === 'search' ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}
            >
              🔍 Search
            </button>
            <button 
              onClick={() => setMobilePanel(mobilePanel === 'navigator' ? 'none' : 'navigator')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${mobilePanel === 'navigator' ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}
            >
              🚀 Navigate
            </button>
          </div>

          {/* --- MOBILE FLOATING PANEL --- */}
          <AnimatePresence>
            {mobilePanel !== 'none' && (
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="md:hidden absolute top-20 left-4 right-4 z-[1001] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 overflow-hidden"
              >
                <LeftPanel
                  // On mobile, we only show the part of the panel the user toggled
                  // You might need to adjust LeftPanel to accept a "mode" prop if needed
                  onSearchLocation={(lat, lng) => {
                    setMapCenter([lat, lng]);
                    setMobilePanel('none');
                  }}
                  setStartCoords={setStartCoords}
                  setDestCoords={setDestCoords}
                  setActiveMode={setActiveMode}
                  setShowRoute={setShowRoute}
                  startCoords={startCoords}
                  destCoords={destCoords}
                  activeMode={activeMode}
                  showRoute={showRoute}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* --- ROUTE SUMMARY (Floating) --- */}
          <AnimatePresence>
            {showRoute && startCoords && destCoords && activeMode && routeData && (
              <div className="absolute bottom-4 left-4 right-4 md:top-4 md:right-4 md:bottom-auto md:left-auto z-[1000] md:w-[320px]">
                <RouteSummary
                  start={startCoords}
                  end={destCoords}
                  mode={activeMode}
                  distance={routeData.distance}
                  duration={routeData.duration}
                  steps={routeData.steps}
                  routeName={routeData.routeName}
                  onClose={() => {
                    setShowRoute(false);
                    setRouteData(null);
                  }}
                />
              </div>
            )}
          </AnimatePresence>

          {/* --- WELCOME MARQUEE (Mobile Only) --- */}
          {showWelcome && (
            <div className="md:hidden absolute bottom-0 left-0 w-full z-[1001] bg-indigo-600/90 backdrop-blur-sm text-white py-1 text-xs font-medium border-t border-indigo-400 pointer-events-none">
              <div className="animate-marquee whitespace-nowrap">
                Welcome to DeKUT Nav! 🎓 Your campus guide is ready. Find any lecture hall, office, or landmark instantly. 📍
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}