// components/CubaMap.tsx
import { useRef, useCallback, forwardRef, useImperativeHandle, useEffect } from "react";
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

export interface CubaMapRef {
  zoomToProvince: (province: string) => void;
}

// const getProvinceColor = (count: number) => {
//   if (count > 30) return "#800026";
//   if (count > 20) return "#BD0026";
//   if (count > 10) return "#E31A1C";
//   if (count > 5) return "#FC4E2A";
//   if (count > 0) return "#FD8D3C";
//   return "#FFEDA0";
// };

const CubaMap = forwardRef<CubaMapRef, CubaMapProps>(
  ({ eventCounts, onProvinceClick, selectedProvince }, ref) => {
    const geoJsonRef = useRef<LeafletGeoJSON | null>(null);
    const navigate = useNavigate();
    const mapRef = useRef<Map | null>(null);
    const lastClickedRef = useRef<{ province: string | null }>({ province: null });

    const zoomToProvince = useCallback((provinceName: string) => {
      const map = mapRef.current;
      if (!map) return;

      const layer = geoJsonRef.current
        ?.getLayers()
        .find((l: Layer) => (l as any).feature?.properties?.province === provinceName);

      if (layer && layer.getBounds) {
        map.fitBounds(layer.getBounds());
      }
    }, []);

    useImperativeHandle(ref, () => ({
      zoomToProvince,
    }));

    const handleProvinceClick = useCallback(
      (provinceName: string) => {
        if (onProvinceClick) {
          onProvinceClick(provinceName);
        }
        zoomToProvince(provinceName);
      },
      [onProvinceClick, zoomToProvince]
    );

    const handleProvinceDoubleClick = useCallback(
      (provinceName: string) => {
        navigate(`/?province=${encodeURIComponent(provinceName)}`);
      },
      [navigate]
    );

    const onEachFeature = useCallback(
      (feature: Feature<Geometry, { province: string }>, layer: Layer) => {
        const provinceName = feature.properties.province;

        geoJsonRef.current?.resetStyle(layer);
        layer.setStyle({
          weight: 2,
          opacity: 1,
          dashArray: "3",
          fillOpacity: selectedProvince === provinceName ? 0.5 : 0,
          fillColor: "#4ade80",
          color: "green",
        });

        layer.on({
          mouseover: () => {
            if (selectedProvince !== provinceName) {
              layer.setStyle({
                weight: 3,
                color: "green",
                fillOpacity: 0.5,
                fillColor: "#4ade80",
              });
            }
            layer
              .bindTooltip(`<strong>${provinceName}</strong>`, {
                sticky: true,
              })
              .openTooltip();
          },
          mouseout: () => {
            if (selectedProvince !== provinceName) {
              layer.setStyle({
                weight: 2,
                opacity: 1,
                dashArray: "3",
                fillOpacity: 0,
                fillColor: "#4ade80",
                color: "green",
              });
            } else {
              layer.setStyle({
                weight: 2,
                opacity: 1,
                dashArray: "3",
                fillOpacity: 0.5,
                fillColor: "#4ade80",
                color: "green",
              });
            }
          },
          click: () => handleProvinceClick(provinceName),
          dblclick: () => handleProvinceDoubleClick(provinceName),
        });
      },
      [handleProvinceClick, handleProvinceDoubleClick, selectedProvince]
    );

    // Update styles when selectedProvince changes
    useEffect(() => {
      if (!geoJsonRef.current) return;

      geoJsonRef.current.getLayers().forEach((layer: Layer) => {
        const provinceName = (layer as any).feature?.properties?.province;
        if (provinceName) {
          layer.setStyle({
            weight: 2,
            opacity: 1,
            dashArray: "3",
            fillOpacity: selectedProvince === provinceName ? 0.5 : 0,
            fillColor: "#4ade80",
            color: "green",
          });
        }
      });
    }, [selectedProvince]);

    return (
      <>
        <style>
          {`
            .leaflet-container:focus,
            .leaflet-container:focus-visible,
            .leaflet-container:focus-within,
            .leaflet-container *:focus,
            .leaflet-container *:focus-visible,
            .leaflet-container *:focus-within {
              outline: none !important;
              box-shadow: none !important;
            }
          `}
        </style>
        <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-md relative z-0">
          <MapContainer
            center={[21.7, -79.5]}
            zoom={6.5}
            scrollWheelZoom={true}
            ref={mapRef}
            style={{ height: "100%", width: "100%", outline: "none" }}
            className="z-0 focus:outline-none focus-visible:outline-none"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
              tileSize={256}
              detectRetina={true}
            />
            <GeoJSON
              ref={geoJsonRef}
              data={provinceGeoJson}
              onEachFeature={onEachFeature}
              style={{
                color: "green",
                weight: 2,
                opacity: 1,
                fillOpacity: 0,
                outline: "none",
              }}
            />
          </MapContainer>
        </div>
      </>
    );
  }
);

CubaMap.displayName = "CubaMap";

export default CubaMap;
