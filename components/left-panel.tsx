"use client";
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useGeolocation } from '@/hooks/UseGeolocation';
import { SearchInput } from './SearchInput';
import { getLandmarksFromDB } from '@/app/action';

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
  viewMode?: 'search' | 'navigator' | 'all'; // NEW PROP
}

interface Landmark { name: string; lat: number; lng: number; }

export default function LeftPanel({
  onSearchLocation, setStartCoords, setDestCoords, setActiveMode,
  setShowRoute, startCoords, destCoords, activeMode, viewMode = 'all'
}: LeftPanelProps) {

  const result = useGeolocation();
  const [startSuggestions, setStartSuggestions] = useState<Landmark[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<Landmark[]>([]);
  const [showStartDrop, setShowStartDrop] = useState(false);
  const [showDestDrop, setShowDestDrop] = useState(false);
  const [startText, setStartText] = useState("");
  const [destText, setDestText] = useState("");
  const speeds = { walk: 5, drive: 40, cycle: 15 };

  const handleLocationFound = (lat: number, lng: number) => onSearchLocation(lat, lng);

  const position = typeof result === 'object' && result !== null && 'position' in result ? (result as any).position : result;
  const error = typeof result === 'object' && result !== null && 'error' in result ? (result as any).error : null;

  const handleUseMyLocation = () => {
    if (position?.lat && position?.lng) {
      const coords: [number, number] = [position.lat, position.lng];
      setStartCoords(coords);
      setStartText("My Current Location");
      onSearchLocation(coords[0], coords[1]);
    }
  };

  const handleSelect = (item: Landmark, type: 'start' | 'dest') => {
    const coords: [number, number] = [item.lat, item.lng];
    if (type === 'start') { setStartCoords(coords); setStartText(item.name); setShowStartDrop(false); }
    else { setDestCoords(coords); setDestText(item.name); setShowDestDrop(false); }
    onSearchLocation(item.lat, item.lng);
  };

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (startText.length > 1) { const res = await getLandmarksFromDB(startText); setStartSuggestions(res); setShowStartDrop(true); }
      else setShowStartDrop(false);
    }, 300);
    return () => clearTimeout(delay);
  }, [startText]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (destText.length > 1 && !destCoords) { const res = await getLandmarksFromDB(destText); setDestSuggestions(res); setShowDestDrop(true); }
      else setShowDestDrop(false);
    }, 300);
    return () => clearTimeout(delay);
  }, [destText, destCoords]);

  return (
   <div className="flex flex-col gap-4 p-2 lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto">
      {/* SEARCH SECTION */}
      {(viewMode === 'all' || viewMode === 'search') && (
        <Card className="bg-green-900/30 border-green-500/40 backdrop-blur-lg shadow-xl">
          <CardHeader>
            <CardTitle className="text-yellow-400">
              Search Location
            </CardTitle>
            <CardDescription className="text-green-100/80">
              Search the location of any feature within dedan Kiathi university ie. ADMAT, toilets, cafeteria etc...
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            <SearchInput onLocationFound={handleLocationFound} />
            {error && <p className="text-red-400 text-xs">{error}</p>}
          </CardContent>
        </Card>

      )}

      {/* NAVIGATOR SECTION */}
      {(viewMode === 'all' || viewMode === 'navigator') && (
        <Card className="bg-green-900/30 border-green-500/40 backdrop-blur-lg shadow-xl">
          <CardHeader><CardTitle>Navigator</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className='text-sm font-medium text-slate-400'>Start Point:</label>
              <Button onClick={handleUseMyLocation} variant="secondary" className='w-full text-xs bg-amber-500 hover:bg-amber-600 text-black'>Use My Location</Button>
              <Input placeholder='Search start point...' value={startText} onChange={(e) => setStartText(e.target.value)} className=" border-slate-700" />
              {showStartDrop && startSuggestions.length > 0 && (
                <ul className="absolute z-50 bg-slate-900 border border-slate-700 w-[80%] rounded-md shadow-2xl">
                  {startSuggestions.map((item, i) => <li key={i} onClick={() => handleSelect(item, 'start')} className="p-2 hover:bg-slate-800 cursor-pointer text-sm border-b border-slate-800">{item.name}</li>)}
                </ul>
              )}
            </div>

            <div className="space-y-2 relative">
              <label className='text-sm font-medium text-slate-400'>Destination:</label>
              <Input placeholder='Search destination...' value={destText} onChange={(e) => setDestText(e.target.value)} className=" border-slate-700" />
              {showDestDrop && destSuggestions.length > 0 && (
                <ul className="absolute z-50 bg-slate-900 border border-slate-700 w-[80%] rounded-md shadow-2xl">
                  {destSuggestions.map((item, i) => <li key={i} onClick={() => handleSelect(item, 'dest')} className="p-2 hover:bg-slate-800 cursor-pointer text-sm border-b border-slate-800">{item.name}</li>)}
                </ul>
              )}
            </div>

            <div className='grid grid-cols-3 gap-2'>
              {['walk', 'drive', 'cycle'].map((mode) => (
                <Button key={mode} variant={activeMode === mode ? 'default' : 'outline'} className={`h-14 flex flex-col text-[10px] font-bold ${activeMode === mode ? 'bg-green-600' : 'border-slate-700'}`} onClick={() => setActiveMode(mode as any)}>
                  {mode.toUpperCase()}
                  <span className="opacity-60">{speeds[mode as keyof typeof speeds]} km/h</span>
                </Button>
              ))}
            </div>

            <Button className='w-full bg-green-600 hover:bg-green-700 py-6 font-bold' disabled={!startCoords || !destCoords || !activeMode} onClick={() => setShowRoute(true)}>
              Generate Route
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}