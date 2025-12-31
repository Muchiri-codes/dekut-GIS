"use client";

import { useState } from 'react';
import { Button } from './ui/button';

// Speed constants for your calculations
const SPEEDS = {
  walk: 5,
  drive: 40,
  cycle: 15
};

type TravelMode = 'walk' | 'drive' | 'cycle';

export default function LeftPanel({ onSearchLocation }: LeftPanelProps) {
  const [startCoords, setStartCoords] = useState<[number, number] | null>(null);
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);
  
  // Track which mode is currently selected
  const [activeMode, setActiveMode] = useState<TravelMode | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {/* ... (Search and Navigator Inputs) ... */}

      <div className="space-y-2">
        <h3 className='font-bold text-sm uppercase tracking-wider text-slate-400'>
          Select means
        </h3>
        
        <div className='grid grid-cols-3 gap-2'>
          {/* WALK BUTTON */}
          <Button 
            variant={activeMode === 'walk' ? 'default' : 'outline'}
            className={`h-16 flex flex-col font-bold transition-colors ${
              activeMode === 'walk' ? 'bg-green-600 text-white' : 'hover:bg-green-500 hover:text-white'
            }`}
            onClick={() => setActiveMode('walk')}
          >
            Walk
            <span className="text-[10px] opacity-70">{SPEEDS.walk} km/h</span>
          </Button>

          {/* DRIVE BUTTON */}
          <Button 
            variant={activeMode === 'drive' ? 'default' : 'outline'}
            className={`h-16 flex flex-col font-bold transition-colors ${
              activeMode === 'drive' ? 'bg-green-600 text-white' : 'hover:bg-green-500 hover:text-white'
            }`}
            onClick={() => setActiveMode('drive')}
          >
            Drive
            <span className="text-[10px] opacity-70">{SPEEDS.drive} km/h</span>
          </Button>

          {/* CYCLE BUTTON */}
          <Button 
            disabled={!startCoords || !destCoords}
            variant={activeMode === 'cycle' ? 'default' : 'outline'}
            className={`h-16 flex flex-col font-bold transition-colors ${
              activeMode === 'cycle' ? 'bg-green-600 text-white' : 'hover:bg-green-500 hover:text-white'
            }`}
            onClick={() => {
              setActiveMode('cycle');
              // Optional: You can keep your alert here or move it to the final Start Tracking button
              if(startCoords && destCoords) console.log("Ready to cycle!");
            }}
          >
            Cycle
            <span className="text-[10px] opacity-70">{SPEEDS.cycle} km/h</span>
          </Button>
        </div>
      </div>

      {/* FINAL ACTION BUTTON */}
      <Button 
        className='w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 mt-4'
        disabled={!startCoords || !destCoords || !activeMode}
        onClick={() => {
          alert(`Routing from ${startCoords} to ${destCoords} via ${activeMode}`);
        }}
      >
        START NAVIGATION
      </Button>
    </div>
  );
}