"use client";

import { Dispatch, SetStateAction } from 'react';
import { Button } from './ui/button';
import { Footprints, Car, Bike } from 'lucide-react'; // Ensure lucide-react is installed

// Define the interface that was missing
interface LeftPanelProps {
  onSearchLocation: (lat: number, lng: number) => void;
  // State Setters from parent
  setStartCoords: Dispatch<SetStateAction<[number, number] | null>>;
  setDestCoords: Dispatch<SetStateAction<[number, number] | null>>;
  setActiveMode: Dispatch<SetStateAction<'walk' | 'drive' | 'cycle' | null>>;
  setShowRoute: Dispatch<SetStateAction<boolean>>;
  // State Values from parent
  startCoords: [number, number] | null;
  destCoords: [number, number] | null;
  activeMode: 'walk' | 'drive' | 'cycle' | null;
}

const SPEEDS = { walk: 5, drive: 40, cycle: 15 };

export default function LeftPanel({ 
  setStartCoords, 
  setDestCoords, 
  setActiveMode, 
  setShowRoute,
  startCoords,
  destCoords,
  activeMode 
}: LeftPanelProps) {

  // Data for the travel modes
  const modes = [
    { id: 'walk', label: 'Walk', icon: Footprints, speed: SPEEDS.walk },
    { id: 'drive', label: 'Drive', icon: Car, speed: SPEEDS.drive },
    { id: 'cycle', label: 'Cycle', icon: Bike, speed: SPEEDS.cycle },
  ] as const;

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-3">
        <h3 className='font-bold text-xs uppercase tracking-widest text-slate-500 pl-1'>
          Travel Mode
        </h3>
        
        <div className='grid grid-cols-3 gap-3'>
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;

            return (
              <button 
                key={mode.id}
                type="button"
                className={`h-20 flex flex-col items-center justify-center gap-1 rounded-xl font-bold transition-all border-2 ${
                  isActive 
                    ? 'bg-yellow-400 text-black border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)] scale-105' 
                    : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:border-slate-500'
                }`}
                onClick={() => {
                  setActiveMode(mode.id);
                  setShowRoute(false); // Hide the old route summary
                }}
              >
                <Icon size={24} className={isActive ? 'text-black' : 'text-slate-500'} />
                <span className="text-xs">{mode.label}</span>
                <span className={`text-[9px] font-medium ${isActive ? 'text-black/70' : 'text-slate-600'}`}>
                  {mode.speed} km/h
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Button 
        className='w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-7 rounded-xl shadow-lg active:scale-95 transition-all text-base uppercase'
        disabled={!startCoords || !destCoords || !activeMode}
        onClick={() => setShowRoute(true)}
      >
        Generate Route
      </Button>
    </div>
  );
}