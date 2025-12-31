"use client";
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from '@/components/ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useGeolocation } from '@/hooks/UseGeolocation';
import { SearchInput } from './SearchInput';
import { RouteSummary } from './right-panel';

const DEKUT_DB = [
  { name: "Science Park", lat: -0.3985, lng: 36.9605 },
  { name: "Library", lat: -0.3975, lng: 36.9620 },
  { name: "Main Gate", lat: -0.3965, lng: 36.9595 },
  { name: "Freedom C", lat: -0.3990, lng: 36.9615 },
];

interface LeftPanelProps {
  onSearchLocation: (lat: number, lng: number) => void;
  setStartCoords: Dispatch<SetStateAction<[number, number] | null>>;
  setDestCoords: Dispatch<SetStateAction<[number, number] | null>>;
  setActiveMode: Dispatch<SetStateAction<'walk' | 'drive' | 'cycle' | null>>;
  setShowRoute: Dispatch<SetStateAction<boolean>>;
  startCoords: [number, number] | null;
  destCoords: [number, number] | null;
  activeMode: 'walk' | 'drive' | 'cycle' | null;
  showRoute: boolean; 
}
export default function LeftPanel({
  onSearchLocation,
  setStartCoords,
  setDestCoords,
  setActiveMode,
  setShowRoute,
  startCoords,
  destCoords,
  activeMode }: LeftPanelProps) {

  const result = useGeolocation();
  const handleLocationFound = (lat: number, lng: number, name: string) => {
    onSearchLocation(lat, lng);
  };

  const findCoords = async (query: string) => {
    if (!query.trim()) return null;

    // 1. Try Local DB
    const localMatch = DEKUT_DB.find(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    if (localMatch) return localMatch;

    // 2. Try OSM Fallback
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          name: data[0].display_name,
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
    } catch (err) {
      console.error("Geocoding error", err);
    }
    return null;
  };

  const [startSuggestions, setStartSuggestions] = useState<typeof DEKUT_DB>([]);
  const [destSuggestions, setDestSuggestions] = useState<typeof DEKUT_DB>([]);
  const [showStartDrop, setShowStartDrop] = useState(false);
  const [showDestDrop, setShowDestDrop] = useState(false);
  const speeds = { walk: 5, drive: 40, cycle: 15 };

  // 2. Input Text state (What the user sees)
  const [startText, setStartText] = useState("");
  const [destText, setDestText] = useState("");

  //  GPS button
  const handleUseMyLocation = () => {
    if (position?.lat && position?.lng) {
      const coords: [number, number] = [position.lat, position.lng];
      setStartCoords(coords);
      setStartText("My Current Location");
      onSearchLocation(coords[0], coords[1]); // Move map to show me
    }
  };

  const handleInputChange = (setter: Function, value: string) => {
    setter(value);
    setShowRoute(false); 
  };
  // Helper to search for Destination (or manual Start)
  const handleResolveLocation = async (query: string, type: 'start' | 'dest') => {
    const result = await findCoords(query); // Your Database/OSM search logic

    if (result) {
      if (type === 'start') {
        setStartCoords([result.lat, result.lng]);
        setStartText(result.name);
      } else {
        setDestCoords([result.lat, result.lng]);
        setDestText(result.name);
      }
      onSearchLocation(result.lat, result.lng);
    }
  };


  const isRouteReady =
    Array.isArray(startCoords) &&
    Array.isArray(destCoords) &&
    startCoords.length === 2 &&
    destCoords.length === 2 &&
    activeMode !== null;
  useEffect(() => {
    if (startText.length > 1 && !startCoords) {
      const filtered = DEKUT_DB.filter(item =>
        item.name.toLowerCase().includes(startText.toLowerCase())
      );
      setStartSuggestions(filtered);
      setShowStartDrop(true);
    } else {
      setShowStartDrop(false);
    }
  }, [startText, startCoords]);

  useEffect(() => {
    if (destText.length > 1 && !destCoords) {
      const filtered = DEKUT_DB.filter(item =>
        item.name.toLowerCase().includes(destText.toLowerCase())
      );
      setDestSuggestions(filtered);
      setShowDestDrop(true);
    } else {
      setShowDestDrop(false);
    }
  }, [destText, destCoords]);

  // Handle selecting from dropdown
  const handleSelect = (item: typeof DEKUT_DB[0], type: 'start' | 'dest') => {
    const coords: [number, number] = [item.lat, item.lng];
    if (type === 'start') {
      setStartCoords(coords);
      setStartText(item.name);
      setShowStartDrop(false);
    } else {
      setDestCoords(coords);
      setDestText(item.name);
      setShowDestDrop(false);
    }
    onSearchLocation(item.lat, item.lng);
  };

  const position = typeof result === 'object' && result !== null && 'position' in result
    ? (result as any).position
    : result;

  const error = typeof result === 'object' && result !== null && 'error' in result
    ? (result as any).error
    : null;

  // Format coordinates for the input display
  const coordsString = position
    ? `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`
    : "";

  return (
    <div className="flex flex-col gap-4 p-2">
      <h2 className='font-bold pl-2 pb-2 text-2xl text-yellow-400'>
        DEKUT NAVIGATION
      </h2>

      <Card>
        <CardHeader>
          <CardDescription className='text-lg text-slate-500'>
            Dekut navigation is an app that is meant to aid in easier navigation
            for visitors and dekut students as well.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <h3 className='font-bold text-yellow-400'>Search any location below:</h3>
          <SearchInput onLocationFound={handleLocationFound} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Navigator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className='pl-1 font-medium'>Enter start:</label>

            <div className='pt-2'>
              <button
                onClick={handleUseMyLocation}
                className='bg-amber-400 p-2 rounded-2xl text-black' >
                use my location
              </button>
            </div>

            <Input
              placeholder='Waiting for GPS...'
              value={startText}
              onChange={(e) => {
                handleInputChange(setStartText, e.target.value);
                if (startCoords) setStartCoords(null);
              }}
              className={startCoords ? "border-green-500 bg-green-900/10" : "border-slate-700"}
            />
            {showStartDrop && startSuggestions.length > 0 && (
              <ul className="absolute z-50 w-full bg-slate-900 border border-slate-700 rounded-md shadow-xl mt-1 max-h-40 overflow-auto">
                {startSuggestions.map((item) => (
                  <li
                    key={item.name}
                    onClick={() => handleSelect(item, 'start')}
                    className="p-2 hover:bg-slate-800 cursor-pointer text-sm text-slate-200 border-b border-slate-800 last:border-0"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2">
            <label className='pl-1 font-medium'>Enter Destination:</label>
            <Input
              placeholder='Enter destination point'
              value={destText}
              onChange={(e) => {
                // ✅ Call the helper here too
                handleInputChange(setDestText, e.target.value);
                if (destCoords) setDestCoords(null);
              }}
              className={destCoords ? "border-blue-500 bg-blue-900/10" : "border-slate-700"}
            />
            {showDestDrop && destSuggestions.length > 0 && (
              <ul className="absolute z-50 w-full bg-slate-900 border border-slate-700 rounded-md shadow-xl mt-1 max-h-40 overflow-auto">
                {destSuggestions.map((item) => (
                  <li
                    key={item.name}
                    onClick={() => handleSelect(item, 'dest')}
                    className="p-2 hover:bg-slate-800 cursor-pointer text-sm text-slate-200 border-b border-slate-800 last:border-0"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2">
            <h3 className='font-bold text-sm uppercase tracking-wider text-slate-400'>
              Select means
            </h3>
            <div className='grid grid-cols-3 gap-2'>
              {['walk', 'drive', 'cycle'].map((mode) => (
                <Button
                  key={mode}
                  variant={activeMode === mode ? 'default' : 'outline'}
                  className={`h-16 flex flex-col font-bold transition-all ${activeMode === mode ? 'bg-green-600 text-white' : 'hover:bg-green-500 hover:text-white'
                    }`}
                  onClick={() => {
                    setActiveMode(mode as any);
                    setShowRoute(false); // ✅ Hide the summary when mode changes
                  }}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <Button className='w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6'
            disabled={!startCoords || !destCoords || !activeMode}
            onClick={() => setShowRoute(true)}
          >
            Generate Route
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}