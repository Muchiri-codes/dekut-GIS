"use client";
import { useState, useCallback, useEffect } from 'react';
import LeftPanel from '@/components/left-panel';
import dynamic from "next/dynamic";
import { RouteSummary } from '@/components/right-panel';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer'
import CornerResizeContainer from '@/components/DragContainer';

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

  const handleClearRoute = useCallback(() => {
    setShowRoute(false);
    setRouteData(null);
    setStartCoords(null);
    setDestCoords(null);
    setActiveMode(null);
  }, []);

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
        <div className="hidden md:block w-87.5 bg-slate-900 border-r border-slate-800 z-20 ">
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
            <div className="flex gap-2 p-2 bg-slate-900/90 backdrop-blur-md rounded-full border border-slate-700/50 shadow-xl pointer-events-auto">
              <button
                type="button"
                onClick={() => setMobileView(mobileView === 'search' ? 'none' : 'search')}
                className={`rounded-full px-6 py-2 text-xs font-bold transition-all ${mobileView === 'search' ? 'bg-yellow-500 text-black' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setMobileView(mobileView === 'navigator' ? 'none' : 'navigator')}
                className={`rounded-full px-6 py-2 text-xs font-bold transition-all ${mobileView === 'navigator' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                Navigate
              </button>
            </div>
          </div>

          {/* FLOATING MOBILE PANEL */}
          <AnimatePresence mode="wait">
            {mobileView !== 'none' && (
              <motion.div
                key="mobile-nav-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="md:hidden absolute top-20 left-4 z-1005 w-[90%] max-w-75 pointer-events-auto"
              >
                <div className="relative md:bg-slate-900 rounded-2xl shadow-2xl border md:border-slate-700 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setMobileView('none')}
                    className="absolute top-3 right-3 z-1006 text-white rounded-full w-7 h-7 flex items-center justify-center border border-slate-600 font-bold hover:bg-red-600 transition-all"
                  >
                    ✕
                  </button>

                  <div className="max-h-[60vh] overflow-y-auto p-1">
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
                      // Crucial: passing "all" or specific mode correctly
                      viewMode={mobileView}
                    />
                  </div>
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
                className="absolute top-20 right-4 z-1002 w-[85%] max-w-72"
              >
                <div className="rounded-2xl shadow-2xl backdrop-blur-xl border overflow-hidden ">
                  <CornerResizeContainer
                    anchor="top-left"
                    handlePosition="bottom-right"
                    icon="↖"
                  >
                  <RouteSummary
                    {...routeData}
                    start={startCoords}
                    end={destCoords}
                    mode={activeMode}
                    onClose={handleClearRoute}
                  />
                  </CornerResizeContainer>
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