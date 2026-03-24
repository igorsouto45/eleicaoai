import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

interface HeatmapLayerProps {
  points: [number, number, number][]; // [lat, lng, intensity]
}

declare module "leaflet" {
  function heatLayer(
    latlngs: [number, number, number][],
    options?: Record<string, unknown>
  ): L.Layer;
}

const HeatmapLayer = ({ points }: HeatmapLayerProps) => {
  const map = useMap();

  useEffect(() => {
    const heat = L.heatLayer(points, {
      radius: 30,
      blur: 20,
      maxZoom: 15,
      max: 1.0,
      gradient: {
        0.2: "#22c55e",
        0.5: "#eab308",
        0.8: "#ef4444",
        1.0: "#dc2626",
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
};

export default HeatmapLayer;
