import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { timelineEvents, allProvinces, allCities } from "@/data/events";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CubaMap from "@/components/CubaMap"; 

const Map = () => {
  const navigate = useNavigate();
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [eventCounts, setEventCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const counts: Record<string, number> = {};
    allProvinces.forEach(province => {
      counts[province] = timelineEvents.filter(
        event => event.location.province === province
      ).length;
    });
    setEventCounts(counts);
  }, []);

  const handleProvinceClick = (province: string) => {
    setSelectedProvince(province);
    navigate(`/?province=${province}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-cuba-navy">Cuba: Musical Regions</h2>
        <p className="text-gray-600 mb-6">
          Click on a province to view its musical history in the timeline.
          This interactive map highlights the diverse musical traditions across Cuba.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Leaflet map */}
          <div className="bg-blue-50 rounded-lg p-4 relative min-h-[400px] flex items-center justify-center">
            <CubaMap 
              eventCounts={eventCounts}
              onProvinceClick={handleProvinceClick}
            />
          </div>

          {/* Province list */}
          <div>
            <h3 className="text-lg font-medium mb-4">Provinces</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allProvinces.map(province => (
                <Card 
                  key={province}
                  className={`cursor-pointer transition-all ${
                    hoveredProvince === province 
                      ? 'border-cuba-blue shadow-md' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleProvinceClick(province)}
                  onMouseEnter={() => setHoveredProvince(province)}
                  onMouseLeave={() => setHoveredProvince(null)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{province}</p>
                      <p className="text-xs text-gray-500">
                        {eventCounts[province] || 0} musical events
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-cuba-blue/10 border-cuba-blue/20">
                      {eventCounts[province] || 0}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <h3 className="text-lg font-medium mt-6 mb-4">Notable Cities</h3>
            <div className="flex flex-wrap gap-2">
              {allCities.map(city => (
                <Badge 
                  key={city} 
                  className="cursor-pointer bg-cuba-red/10 hover:bg-cuba-red/20 text-cuba-red border-cuba-red/20"
                  onClick={() => navigate(`/?city=${city}`)}
                >
                  {city}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Musical Region Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3 bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-6">
          <div className="text-gray-500 text-center">
            <p className="font-medium">Advertisement Banner</p>
            <p className="text-xs">728x90 banner ad space</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2">Western Cuba</h3>
            <p className="text-gray-600 text-sm mb-3">
              Home to the birth of Danzón, Cha-Cha-Chá and development of modern Salsa.
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="bg-cuba-teal/10 text-cuba-teal">Danzón</Badge>
              <Badge variant="outline" className="bg-cuba-teal/10 text-cuba-teal">Cha-Cha-Chá</Badge>
              <Badge variant="outline" className="bg-cuba-teal/10 text-cuba-teal">Salsa</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2">Central Cuba</h3>
            <p className="text-gray-600 text-sm mb-3">
              Known for Punto Guajiro and rural musical traditions with Spanish influences.
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="bg-cuba-teal/10 text-cuba-teal">Punto Guajiro</Badge>
              <Badge variant="outline" className="bg-cuba-teal/10 text-cuba-teal">Guajira</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-2">Eastern Cuba</h3>
            <p className="text-gray-600 text-sm mb-3">
              Birthplace of Son Cubano with strong African rhythmic influences.
            </p>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="bg-cuba-teal/10 text-cuba-teal">Son Cubano</Badge>
              <Badge variant="outline" className="bg-cuba-teal/10 text-cuba-teal">Changüí</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Map;
