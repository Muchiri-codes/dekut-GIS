"use client";
import { useState, useCallback } from 'react';
import LeftPanel from '@/components/left-panel';
import dynamic from "next/dynamic";
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

  // --- MOBILE UI STATE ---
  const [mobileView, setMobileView] = useState<'none' | 'search' | 'navigator'>('none');

  const handleRouteFound = useCallback((data: any) => {
    setRouteData(data);
    setMobileView('none'); 
  }, []);

  return (
    <div className="relative h-screen w-full bg-slate-950 overflow-hidden flex flex-col">
      <Header />

      <main className="flex flex-1 relative overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <div className="hidden md:block w-[350px] bg-slate-900 border-r border-slate-800 z-20">
          <LeftPanel {...{onSearchLocation: (lat, lng) => setMapCenter([lat, lng]), setStartCoords, setDestCoords, setActiveMode, setShowRoute, startCoords, destCoords, activeMode, showRoute}} viewMode="all" />
        </div>

        {/* MAP AREA */}
        <div className="flex-1 relative">
          <Map geolocateCenter={mapCenter} startPoint={startCoords} endPoint={destCoords} showRoute={showRoute} setRouteData={handleRouteFound} activeMode={activeMode}
          onMapTouch={() => setMobileView('none')} />

          {/* MOBILE CONTROLS CONTAINER */}
          <div className="md:hidden absolute top-4 left-0 right-0 z-[1001] flex flex-col items-center gap-4 px-4 pointer-events-none">
            
            {/* TOGGLE BUTTONS (Enable pointer events for buttons only) */}
            <div className="flex gap-2 p-1 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700/50 shadow-xl pointer-events-auto">
              <button 
                onClick={() => setMobileView(mobileView === 'search' ? 'none' : 'search')}
                className={`rounded-full px-6 py-2 text-xs font-bold transition-all ${mobileView === 'search' ? 'bg-yellow-500 text-black' : 'text-slate-300'}`}
              >
                🔍 Search
              </button>
              <button 
                onClick={() => setMobileView(mobileView === 'navigator' ? 'none' : 'navigator')}
                className={`rounded-full px-6 py-2 text-xs font-bold transition-all ${mobileView === 'navigator' ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}
              >
                🚀 Navigate
              </button>
            </div>

            {/* WELCOME TEXT: Only shows when no panel is open */}
            <AnimatePresence>
              {mobileView === 'none' && !showRoute && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full max-w-xs overflow-hidden rounded-lg bg-indigo-600/20 backdrop-blur-sm border border-indigo-500/30 py-1"
                >
                  <motion.p 
                    initial={{ x: "100%" }}
                    animate={{ x: "-100%" }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="text-[10px] font-bold text-indigo-300 uppercase whitespace-nowrap"
                  >
                    Welcome to DeKUT Nav • Select a panel above to start exploring Kimathi University 🎓
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FLOATING MOBILE PANEL */}
          <AnimatePresence>
            {mobileView !== 'none' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="md:hidden absolute top-20 left-4 right-4 z-[1001] max-h-[70vh] overflow-y-auto rounded-2xl shadow-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/50"
              >
                <LeftPanel 
                   {...{onSearchLocation: (lat, lng) => {setMapCenter([lat, lng]); setMobileView('none')}, setStartCoords, setDestCoords, setActiveMode, setShowRoute, startCoords, destCoords, activeMode, showRoute}} 
                   viewMode={mobileView} 
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ROUTE SUMMARY */}
          <AnimatePresence>
            {showRoute && routeData && (
              <div className="absolute bottom-6 left-4 right-4 md:top-4 md:right-4 md:left-auto z-[1002] md:w-80">
                <RouteSummary {...routeData} start={startCoords} end={destCoords} mode={activeMode} onClose={() => {setShowRoute(false); setRouteData(null);}} />
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}