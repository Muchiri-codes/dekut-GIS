import LeftPanel from "@/components/left-panel";
import RightPanel from "@/components/right-panel";
import Map from "@/components/map";
import Header from "@/components/Header";
export default function page() {

  return (
    <>
    <div><Header /></div>
      
      <div className="flex h-screen">
        <div className="w-1/4 bg-green-100 border-r border-yellow-400 p-4">
          <LeftPanel />
        </div>

        <div className="flex-1 bg-gray-50">
          <Map geolocateCenter={null} />
        </div>

        <div className="w-1/5 bg-green-50 border-l border-yellow-400 p-4">
          <RightPanel />
        </div>
      </div>
    </>

  )
}
