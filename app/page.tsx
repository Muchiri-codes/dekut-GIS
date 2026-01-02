"use client";
import { useState, useCallback, useEffect } from 'react';
import LeftPanel from '@/components/left-panel';
import dynamic from "next/dynamic";
import { Button } from '@/components/ui/button';
import { RouteSummary } from '@/components/right-panel';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/Header';

const Map = dynamic(() => import("@/components/map"), { ssr: false });

export default function Home() {
  const [startCoords, setStartCoords] = useState<[number, number] | null>(null);
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);
  const [activeMode, setActiveMode] = useState<'walk' | 'drive' | 'cycle' | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [routeData, setRouteData] = useState<any>(null);

  // --- MOBILE UI STATES ---
  const [mobileView, setMobileView] = useState<'none' | 'search' | 'navigator'>('none');
  const [showWelcome, setShowWelcome] = useState(true);

  // Hide welcome after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  const handleRouteFound = useCallback((data: any) => {
    setRouteData(data);
    setMobileView('none'); // HIDE PANEL ON ROUTE GENERATION
  }, []);

  return (
    <div className="relative h-screen w-full bg-slate-950 overflow-hidden flex flex-col">
      <Header />

      {/* --- HUGE WELCOME OVERLAY --- */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            exit={{ opacity: 0 }}
            // Reduced blur to 'sm' (4px) or 'md' (8px) instead of 'backdrop-blur-md'
            className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm pointer-events-none"
          >
            <div className="w-full overflow-hidden border-y border-yellow-400/20 bg-slate-900/50 py-4">
              <motion.h1
                initial={{ x: "100%" }}
                animate={{ x: "-100%" }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                // Reduced size to text-4xl or 5xl
                className="text-4xl md:text-6xl font-black text-yellow-400 uppercase tracking-tighter whitespace-nowrap"
              >
                WELCOME TO DEKUT NAVIGATION • YOUR CAMPUS GUIDE • EXPLORE KIMATHI •
              </motion.h1>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex flex-1 relative overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <div className="hidden md:block w-[350px] bg-slate-900 border-r border-slate-800 z-20">
          <LeftPanel {...{ onSearchLocation: (lat, lng) => setMapCenter([lat, lng]), setStartCoords, setDestCoords, setActiveMode, setShowRoute, startCoords, destCoords, activeMode, showRoute }} viewMode="all" />
        </div>

        {/* MAP AREA */}
        <div className="flex-1 relative">
          <Map geolocateCenter={mapCenter} startPoint={startCoords} endPoint={destCoords} showRoute={showRoute} setRouteData={handleRouteFound} activeMode={activeMode} />

          {/* MOBILE TOGGLE BUTTONS */}
          <div className="md:hidden absolute top-4 left-1/2 -translate-x-1/2 z-1001 flex gap-2">
            <Button
              onClick={() => setMobileView(mobileView === 'search' ? 'none' : 'search')}
              className={`rounded-full px-6 shadow-xl ${mobileView === 'search' ? 'bg-yellow-500 text-black' : 'bg-slate-800'}`}
            >
              Search
            </Button>
            <Button
              onClick={() => setMobileView(mobileView === 'navigator' ? 'none' : 'navigator')}
              className={`rounded-full px-6 shadow-xl ${mobileView === 'navigator' ? 'bg-indigo-600' : 'bg-slate-800'}`}
            >
              Navigate
            </Button>
          </div>

          {/* FLOATING MOBILE PANEL */}
          <AnimatePresence>
            {mobileView !== 'none' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                // Added 'opacity-90' or 'bg-slate-900/80' to make it semi-transparent
                className="md:hidden absolute top-20 left-4 right-4 z-[1001] max-h-[70vh] overflow-y-auto rounded-2xl shadow-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/50"
              >
                <LeftPanel
                  {...{ onSearchLocation: (lat, lng) => { setMapCenter([lat, lng]); setMobileView('none') }, setStartCoords, setDestCoords, setActiveMode, setShowRoute, startCoords, destCoords, activeMode, showRoute }}
                  viewMode={mobileView}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ROUTE SUMMARY */}
          <AnimatePresence>
            {showRoute && routeData && (
              <div className="absolute bottom-6 left-4 right-4 md:top-4 md:right-4 md:left-auto z-1002 md:w-80">
                <RouteSummary {...routeData} start={startCoords} end={destCoords} mode={activeMode} onClose={() => { setShowRoute(false); setRouteData(null); }} />
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}