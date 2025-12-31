
"use client"
import { useState } from "react";

import LeftPanel from "@/components/left-panel";
import { RouteSummary } from "@/components/right-panel";
import Map from "@/components/map";
import Header from "@/components/Header";

export default function page() {
const [mapTarget, setMapTarget] = useState<[number, number] | null>(null);
  return (
    <>
    <div><Header /></div>
      
      <div className="flex h-screen">
        <div className="w-1/4 bg-green-100 border-r">
          <LeftPanel onSearchLocation={(lat, lng) => setMapTarget([lat, lng])} />
        </div>

        <div className="flex-1 bg-gray-50">
          <Map geolocateCenter={mapTarget} />
        </div>

        <div className="w-1/5 bg-green-50 border-l p-2">
          <RouteSummary />
        </div>
      </div>
    </>

  )
}
