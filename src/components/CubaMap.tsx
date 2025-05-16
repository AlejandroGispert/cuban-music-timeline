// components/CubaMap.tsx
import { useRef } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { MapContainerProps } from "react-leaflet";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import { LeafletMouseEvent, Layer } from "leaflet";
import { GeoJSON as LeafletGeoJSON } from "leaflet";
import { useNavigate } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import rawData from "@/data/cuba-provinces.json";

const provinceGeoJson = rawData as FeatureCollection;

interface CubaMapProps {
  eventCounts: Record<string, number>;
  onProvinceClick?: (province: string) => void;
}

const getProvinceColor = (count: number) => {
  if (count > 30) return "#800026";
  if (count > 20) return "#BD0026";
  if (count > 10) return "#E31A1C";
  if (count > 5) return "#FC4E2A";
  if (count > 0) return "#FD8D3C";
  return "#FFEDA0";
};

const CubaMap = ({ eventCounts, onProvinceClick }: CubaMapProps) => {
  const geoJsonRef = useRef<LeafletGeoJSON | null>(null);
  const navigate = useNavigate();

  const mapRef = useRef<any>(null);
const lastClickedRef = useRef<{ province: string | null }>({ province: null });


  const onEachFeature = (feature: Feature<Geometry, { province: string }>, layer: Layer) => {
    const provinceName = feature.properties.province;
    const count = eventCounts[provinceName] || 0;

    layer.setStyle({
      fillColor: getProvinceColor(count),
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    });

    layer.on({
      mouseover: () => {
       
        layer.setStyle({
          weight: 3,
          color: "green",
          fillOpacity: 0.9,
        });
        layer
          .bindTooltip(`<strong>${provinceName}</strong><br>${count} musical events`, {
            sticky: true,
          })
          .openTooltip();
      },
      mouseout: function (){
        geoJsonRef.current?.resetStyle(layer);
      },
      click: () => {
        const map = mapRef.current;
        if (!map) return;
      
        if (lastClickedRef.current.province === provinceName) {
          // Navigate on second click
          navigate(`/?province=${provinceName}`);
        } else {
          // Zoom to province bounds on first click
          const bounds = layer.getBounds?.();
          if (bounds && map.fitBounds) {
            map.fitBounds(bounds);
          }
          lastClickedRef.current.province = provinceName;
        }
      },
    });
  };

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={[21.7, -79.5]}
        zoom={6.5}
        scrollWheelZoom={true}
        whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        />
        <GeoJSON ref={geoJsonRef} data={provinceGeoJson} onEachFeature={onEachFeature} />
      </MapContainer>
    </div>
  );
};

export default CubaMap;
