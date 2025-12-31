"use client";
import { useState } from 'react';
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

interface LeftPanelProps {
  onSearchLocation: (lat: number, lng: number) => void;
}
export default function LeftPanel({ onSearchLocation }: LeftPanelProps) {

  const result = useGeolocation();
  const handleLocationFound = (lat: number, lng: number, name: string) => {
    onSearchLocation(lat, lng); // ✅ This will now work without errors
  };

  const [startCoords, setStartCoords] = useState<[number, number] | null>(null);
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);

  // 2. Input Text state (What the user sees)
  const [startText, setStartText] = useState("");
  const [destText, setDestText] = useState("");
  // Helper to handle GPS button
  const handleUseMyLocation = () => {
    if (position?.lat && position?.lng) {
      const coords: [number, number] = [position.lat, position.lng];
      setStartCoords(coords);
      setStartText("My Current Location");
      onSearchLocation(coords[0], coords[1]); // Move map to show me
    }
  };

  // Helper to search for Destination (or manual Start)
  const handleResolveLocation = async (query: string, type: 'start' | 'dest') => {
    // Reuse your search logic (Local DB -> OSM)
    // For brevity, let's assume a function 'findCoords(query)' exists
    const result = await findCoords(query); 
    if (result) {
      if (type === 'start') setStartCoords([result.lat, result.lng]);
      else setDestCoords([result.lat, result.lng]);
      
      onSearchLocation(result.lat, result.lng); // Hover map to result
    }
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
              onChange={(e) => setStartText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleResolveLocation(startText, 'start')}
              className={startCoords ? "border-green-500" : ""}
             
            />
          </div>

          <div className="space-y-2">
            <label className='pl-1 font-medium'>Enter Destination:</label>
            <Input 
            placeholder='Enter destination point'
            value={destText}
            onChange={(e) => setDestText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleResolveLocation(destText, 'dest')}
            className={destCoords ? "border-green-500" : ""}
            />
          </div>

          <div className="space-y-2">
            <h3 className='font-bold text-sm uppercase tracking-wider text-slate-400'>
              Select means
            </h3>
            <div className='grid grid-cols-3 gap-2'>
              <Button variant="outline" className='h-16 flex flex-col font-bold hover:bg-green-500 hover:text-white'>
                Walk
              </Button>
              <Button variant="outline" className='h-16 flex flex-col font-bold hover:bg-green-500 hover:text-white'>
                Drive
              </Button>
              <Button 
              disabled ={!startCoords || !destCoords}
              onClick={() => alert(`Routing from ${startCoords} to ${destCoords}`)}
              variant="outline" className='h-16 flex flex-col font-bold hover:bg-green-500 hover:text-white'>
                Cycle
              </Button>
            </div>
          </div>

          <Button className='w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6'>
            Generate Route
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}