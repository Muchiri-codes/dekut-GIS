"use client";

import { motion } from "framer-motion";
import { Timer, MapPin, TrendingUp, Landmark, Ruler, X } from "lucide-react";

interface RouteSummaryProps {
  start: [number, number];
  end: [number, number];
  mode: 'walk' | 'drive' | 'cycle';
  distance: number; // Expecting meters from Leaflet/OSM
  duration: number; 
  onClose: () => void;
}

export function RouteSummary({ distance, duration, start, end, mode, onClose }: RouteSummaryProps) {
  // 1. Convert distance to KM for display
  const distanceInKm = (distance / 1000).toFixed(2);
  const numDistanceKm = distance / 1000;

  //Dynamic Time Calculation based on Mode
  const speeds = { walk: 5, cycle: 15, drive: 40 };
  
  // Math: (Distance in KM / Speed) * 60 minutes
  const calculatedTime = Math.round((numDistanceKm / speeds[mode]) * 60);
  
  //If distance is very short, it shows at least 1 min
  const displayTime = calculatedTime < 1 ? 1 : calculatedTime;

  const elevation = mode === 'cycle' ? "+12m / -5m" : "+8m";
  const spots = ["DeKUT Main Gate", "Science Park", "Library"];

  return (
    <motion.div
      initial={{ height: 0, opacity: 0, y: 20 }}
      animate={{ height: "auto", opacity: 1, y: 0 }}
      exit={{ height: 0, opacity: 0, y: 20 }}
      className="overflow-hidden"
    >
      <div className="relative bg-slate-900/80 border border-slate-700 rounded-xl p-4 mt-4 space-y-4 backdrop-blur-md shadow-2xl">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <h3 className="text-yellow-400 font-bold flex items-center gap-2">
          <MapPin size={18} /> ROUTE DETAILS
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* TIME BOX - Now using displayTime */}
          <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg flex flex-col items-center">
            <Timer className="text-blue-400 mb-1" size={20} />
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Est. Time</span>
            <span className="font-bold text-white text-lg">{displayTime} mins</span>
          </div>

          {/* DISTANCE BOX */}
          <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-lg flex flex-col items-center">
            <Ruler className="text-green-400 mb-1" size={22} />
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Distance</span>
            <span className="font-bold text-white text-lg">{distanceInKm} km</span>
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-700 pt-3">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-400">
              <TrendingUp size={16} /> Elevation
            </span>
            <span className="text-white font-medium">{elevation}</span>
          </div>

          <div className="space-y-2">
            <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
              <Landmark size={14} /> Landmarks Along the Way
            </span>
            <div className="flex flex-wrap gap-2">
              {spots.map((spot) => (
                <span key={spot} className="text-[9px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                  {spot}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}