"use client";

import { motion } from "framer-motion";
import { Timer, MapPin, TrendingUp, Landmark, Ruler, X, Navigation, ChevronRight } from "lucide-react";

interface RouteSummaryProps {
  start: [number, number];
  end: [number, number];
  mode: 'walk' | 'drive' | 'cycle';
  distance: number; 
  duration: number; 
  steps?: any[];
  routeName?: string;
  onClose: () => void;
}

// 1. Added steps and routeName to the destructured props
export function RouteSummary({ distance, duration, start, end, mode, steps, routeName, onClose }: RouteSummaryProps) {
  const distanceInKm = (distance / 1000).toFixed(2);
  const numDistanceKm = distance / 1000;

  const speeds = { walk: 5, cycle: 15, drive: 40 };
  const calculatedTime = Math.round((numDistanceKm / speeds[mode]) * 60);
  const displayTime = calculatedTime < 1 ? 1 : calculatedTime;

  const elevation = mode === 'cycle' ? "+12m / -5m" : "+8m";

  return (
    <motion.div
      initial={{ height: 0, opacity: 0, y: 20 }}
      animate={{ height: "auto", opacity: 1, y: 0 }}
      exit={{ height: 0, opacity: 0, y: 20 }}
      className="overflow-hidden"
    >
      <div className="relative bg-slate-900/90 border border-slate-700 rounded-xl p-4 mt-4 space-y-4 backdrop-blur-md shadow-2xl max-h-[80vh] flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors z-10"
        >
          <X size={18} />
        </button>

        {/* 2. DYNAMIC TITLE: Using routeName if available */}
        <div className="pr-6">
          <h3 className="text-yellow-400 font-bold flex items-start gap-2 leading-tight uppercase text-sm">
            <MapPin className="shrink-0 mt-0.5" size={18} /> 
            {routeName || "Calculating Route..."}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg flex flex-col items-center">
            <Timer className="text-blue-400 mb-1" size={20} />
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Est. Time</span>
            <span className="font-bold text-white text-lg">{displayTime} mins</span>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg flex flex-col items-center">
            <Ruler className="text-green-400 mb-1" size={22} />
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Distance</span>
            <span className="font-bold text-white text-lg">{distanceInKm} km</span>
          </div>
        </div>

        {/* 3. DIRECTIONS SECTION: Dynamic Steps from Leaflet */}
        <div className="space-y-2 border-t border-slate-700 pt-3 flex-1 overflow-hidden flex flex-col">
          <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
            <Navigation size={12} className="text-amber-500" /> Turn-by-Turn Directions
          </span>
          
          <div className="overflow-y-auto space-y-3 pr-2 custom-scrollbar max-h-48">
            {steps && steps.length > 0 ? (
              steps.map((step, i) => (
                <div key={i} className="flex gap-3 items-start group">
                  <div className="flex flex-col items-center shrink-0 mt-1">
                    <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-mono group-hover:border-amber-500 group-hover:text-amber-500 transition-colors">
                      {i + 1}
                    </div>
                    {i !== steps.length - 1 && <div className="w-[1px] h-full bg-slate-700 mt-1" />}
                  </div>
                  <div className="flex flex-col pb-2">
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {step.text}
                    </p>
                    <span className="text-[10px] text-slate-500 italic">
                      for {Math.round(step.distance)} meters
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No specific maneuvers available.</p>
            )}
          </div>
        </div>

        {/* Elevation Info */}
        <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-400">
            <TrendingUp size={14} /> Campus Gradient
          </span>
          <span className="text-white font-mono">{elevation}</span>
        </div>
      </div>
    </motion.div>
  );
}