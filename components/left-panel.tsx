"use client";

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

export default function LeftPanel() {
  const result = useGeolocation();
  

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
          <CardDescription className='text-lg text-slate-200'>
            Dekut navigation is an app that is meant to aid in easier navigation 
            for visitors and dekut students as well.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col gap-3">
          <h3 className='font-bold text-yellow-400'>Search any location below:</h3>
          <Input 
            type='text' 
            placeholder='Enter place name...' 
            className='bg-slate-800 text-white border-slate-700'
          />
          <Button 
            className='bg-amber-400 text-green-900 hover:bg-amber-500' 
            onClick={() => {
              if (position) alert(`Current Location: ${coordsString}`);
            }}
          >
            {position ? "Location Active" : "Searching for GPS..."}
          </Button>
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
            <Input 
              placeholder='Waiting for GPS...' 
              // 3. Changed 'location' to 'position' to match your hook
              value={coordsString}
              readOnly
              className="bg-slate-50"
            />
          </div>

          <div className="space-y-2">
            <label className='pl-1 font-medium'>Enter Destination:</label>
            <Input placeholder='Enter destination point' />
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
              <Button variant="outline" className='h-16 flex flex-col font-bold hover:bg-green-500 hover:text-white'>
                Cycle
              </Button>
            </div>
          </div>

          <Button className='w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6'>
            Start Tracking
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}