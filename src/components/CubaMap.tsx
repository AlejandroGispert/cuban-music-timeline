// components/CubaMap.tsx
import { useRef, useCallback } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { MapContainerProps, TileLayerProps, GeoJSONProps } from "react-leaflet";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import { LeafletMouseEvent, Layer, GeoJSON as LeafletGeoJSON, Map } from "leaflet";
import { useNavigate } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import rawData from "@/data/cuba-provinces.json";
import { LeafyGreen } from "lucide-react";

const provinceGeoJson = rawData as FeatureCollection;

interface CubaMapProps {
  eventCounts: Record<string, number>;
  onProvinceClick?: (province: string) => void;
  selectedProvince?: string | null;
}

// const getProvinceColor = (count: number) => {
//   if (count > 30) return "#800026";
//   if (count > 20) return "#BD0026";
//   if (count > 10) return "#E31A1C";
//   if (count > 5) return "#FC4E2A";
//   if (count > 0) return "#FD8D3C";
//   return "#FFEDA0";
// };

const CubaMap = ({ eventCounts, onProvinceClick }: CubaMapProps) => {
  const geoJsonRef = useRef<LeafletGeoJSON | null>(null);
  const navigate = useNavigate();
  const mapRef = useRef<Map | null>(null);
  const lastClickedRef = useRef<{ province: string | null }>({ province: null });

  const handleProvinceClick = useCallback(
    (provinceName: string) => {
      const map = mapRef.current;
      if (!map) return;

      if (lastClickedRef.current.province === provinceName) {
        // Navigate on second click
        navigate(`/?province=${provinceName}`);
      } else {
        // Zoom to province bounds on first click
        const layer = geoJsonRef.current
          ?.getLayers()
          .find((l: any) => l.feature.properties.province === provinceName);
        if (layer && layer.getBounds) {
          map.fitBounds(layer.getBounds());
        }
        lastClickedRef.current.province = provinceName;
      }
    },
    [navigate]
  );

  const onEachFeature = useCallback(
    (feature: Feature<Geometry, { province: string }>, layer: Layer) => {
      const provinceName = feature.properties.province;
      const count = eventCounts[provinceName] || 0;

      geoJsonRef.current?.resetStyle(layer);
      layer.setStyle({
        // fillColor: getProvinceColor(count),
        weight: 2,
        opacity: 1,
        dashArray: "3",
        fillOpacity: 0,
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
        mouseout: () => {
          geoJsonRef.current?.resetStyle(layer);
        },
        click: () => handleProvinceClick(provinceName),
      });
    },
    [eventCounts, handleProvinceClick]
  );

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={[21.7, -79.5]}
        zoom={6.5}
        scrollWheelZoom={true}
        ref={mapRef}
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
