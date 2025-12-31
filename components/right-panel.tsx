"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Timer, MapPin, TrendingUp, Landmark, Ruler } from "lucide-react";

interface RouteSummaryProps {
  start: [number, number];
  end: [number, number];
  mode: 'walk' | 'drive' | 'cycle';
  distance: number;
  duration: number; 
  onClose:() =>void
}

export function RouteSummary({distance, duration, start, end, mode, onClose }: RouteSummaryProps) {
  const distanceInKm = (distance / 1000).toFixed(2);
  const timeInMinutes = Math.round(duration / 60);
  // --- MOCK CALCULATION LOGIC ---
  // In a real app, these values would come from an API like OSRM or Google Routes

  const speeds = { walk: 5, cycle: 15, drive: 40 };
  const time = Math.round((distance / speeds[mode]) * 60);
  const elevation = mode === 'cycle' ? "+12m / -5m" : "+8m";
  
  const spots = ["DeKUT Main Gate", "Science Park", "Library"];

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="overflow-hidden"
    >
      <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 mt-4 space-y-4">
        <h3 className="text-yellow-400 font-bold flex items-center gap-2">
          <MapPin size={18} /> ROUTE DETAILS
        </h3>
        <div className="flex flex-wrap gap-3">
          <div className="bg-slate-800 p-3 rounded-lg flex flex-col items-center">
            <Timer className="text-blue-400 mb-1" size={20} />
            <span className="text-xs text-slate-400">EST. TIME</span>
            <span className="font-bold text-white">{timeInMinutes} mins</span>
          </div>
          <div className="bg-slate-800 p-3 rounded-lg flex flex-col items-center">
            <Ruler className="text-green-400 mb-1" size={22} />
            <span className="text-xs text-slate-400">DISTANCE</span>
            <span className="font-bold text-white">{distanceInKm} km</span>
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
            <span className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
              <Landmark size={14} /> Landmarks Along the Way
            </span>
            <div className="flex flex-wrap gap-2">
              {spots.map((spot) => (
                <span key={spot} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
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