"use client";
import { useState, useCallback, useEffect } from 'react';
import LeftPanel from '@/components/left-panel';
import dynamic from "next/dynamic";
import { RouteSummary } from '@/components/right-panel';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer'

const Map = dynamic(() => import("@/components/map"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-900 animate-pulse" /> 
});

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [startCoords, setStartCoords] = useState<[number, number] | null>(null);
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);
  const [activeMode, setActiveMode] = useState<'walk' | 'drive' | 'cycle' | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [routeData, setRouteData] = useState<any>(null);
  const [mobileView, setMobileView] = useState<'none' | 'search' | 'navigator'>('none');

  const handleSearch = useCallback((lat: number, lng: number) => {
    setMapCenter([lat, lng]);
  }, []);

  const handleRouteFound = useCallback((data: any) => {
    setRouteData(data);
  }, []);

  if (!hasMounted) return <div className="h-screen w-full bg-slate-950" />;

  return (
    <div className="relative h-screen w-full bg-slate-950 overflow-hidden flex flex-col">
      <Header />

      <main className="flex flex-1 relative overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <div className="hidden md:block w-87.5 bg-slate-900 border-r border-slate-800 z-20">
          <LeftPanel 
            onSearchLocation={handleSearch}
            setStartCoords={setStartCoords}
            setDestCoords={setDestCoords}
            setActiveMode={setActiveMode}
            setShowRoute={setShowRoute}
            startCoords={startCoords}
            destCoords={destCoords}
            activeMode={activeMode}
            showRoute={showRoute}
            viewMode="all" 
          />
        </div>

        <div className="flex-1 relative">
          <Map 
            geolocateCenter={mapCenter} 
            startPoint={startCoords} 
            endPoint={destCoords} 
            showRoute={showRoute} 
            setRouteData={handleRouteFound} 
            activeMode={activeMode} 
          />

          {/* MOBILE TOGGLE BUTTONS */}
          <div className="md:hidden absolute top-4 left-0 right-0 z-[1001] flex flex-col items-center gap-4 px-4 pointer-events-none">
            <div className="flex gap-2 p-2 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700/50 shadow-xl pointer-events-auto">
              <button
                type="button"
                onClick={() => setMobileView(mobileView === 'search' ? 'none' : 'search')}
                className={`rounded-full px-6 py-2 text-xs font-bold transition-all ${mobileView === 'search' ? 'bg-yellow-500 text-black' : 'text-slate-300'}`}
              >
                 Search
              </button>
              <button
                type="button"
                onClick={() => setMobileView(mobileView === 'navigator' ? 'none' : 'navigator')}
                className={`rounded-full px-6 py-2 text-xs font-bold transition-all ${mobileView === 'navigator' ? 'bg-indigo-600 text-white' : 'text-slate-300'}`}
              >
                 Navigate
              </button>
            </div>
          </div>

          {/* FLOATING MOBILE PANEL (Left Side) */}
          <AnimatePresence mode="wait">
            {mobileView !== 'none' && (
              <motion.div
                key="mobile-nav-panel"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="md:hidden absolute top-20 left-4 z-1001 w-[85%] max-w-75 pointer-events-auto"
              >
                <button
                  type="button"
                  onClick={() => setMobileView('none')}
                  className="absolute -top-2 -right-2 z-1002 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-slate-900 font-bold hover:bg-red-700 transition-all"
                >
                  ✕
                </button>

                <div className="max-h-[70vh] overflow-y-auto rounded-2xl shadow-2xl md:bg-slate-900 border border-slate-700">
                  <LeftPanel
                    onSearchLocation={handleSearch}
                    setStartCoords={setStartCoords}
                    setDestCoords={setDestCoords}
                    setActiveMode={setActiveMode}
                    setShowRoute={setShowRoute}
                    startCoords={startCoords}
                    destCoords={destCoords}
                    activeMode={activeMode}
                    showRoute={showRoute}
                    viewMode={mobileView}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* RIGHT-ALIGNED ROUTE SUMMARY PANEL */}
          <AnimatePresence>
            {showRoute && routeData && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-20 right-4 z-[1002] w-[80%] max-w-72" // Fixed width and right-aligned
              >
                <div className="rounded-2xl shadow-2xl backdrop-blur-xl border border-slate-700 overflow-hidden">
                  <RouteSummary 
                    {...routeData} 
                    start={startCoords} 
                    end={destCoords} 
                    mode={activeMode} 
                    onClose={() => { setShowRoute(false); setRouteData(null); }} 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}