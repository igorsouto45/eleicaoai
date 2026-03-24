import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import HeatmapLayer from "@/components/HeatmapLayer";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const bairros = [
  { nome: "Centro", apoiadores: 220, indecisos: 89, rejeicao: 31, total: 340, lat: -22.9068, lng: -43.1729 },
  { nome: "Copacabana", apoiadores: 160, indecisos: 78, rejeicao: 42, total: 280, lat: -22.9711, lng: -43.1826 },
  { nome: "Tijuca", apoiadores: 130, indecisos: 52, rejeicao: 28, total: 210, lat: -22.9325, lng: -43.2436 },
  { nome: "Barra da Tijuca", apoiadores: 110, indecisos: 40, rejeicao: 25, total: 175, lat: -23.0004, lng: -43.3658 },
  { nome: "Madureira", apoiadores: 80, indecisos: 38, rejeicao: 22, total: 140, lat: -22.8731, lng: -43.3392 },
  { nome: "Méier", apoiadores: 65, indecisos: 30, rejeicao: 15, total: 110, lat: -22.9025, lng: -43.2822 },
  { nome: "Campo Grande", apoiadores: 55, indecisos: 25, rejeicao: 10, total: 90, lat: -22.9035, lng: -43.5618 },
  { nome: "Botafogo", apoiadores: 40, indecisos: 20, rejeicao: 8, total: 68, lat: -22.9519, lng: -43.1857 },
  { nome: "Ipanema", apoiadores: 95, indecisos: 35, rejeicao: 18, total: 148, lat: -22.9838, lng: -43.2096 },
  { nome: "Santa Cruz", apoiadores: 45, indecisos: 60, rejeicao: 35, total: 140, lat: -22.9135, lng: -43.6868 },
  { nome: "Bangu", apoiadores: 70, indecisos: 55, rejeicao: 30, total: 155, lat: -22.8749, lng: -43.4631 },
  { nome: "Penha", apoiadores: 50, indecisos: 45, rejeicao: 25, total: 120, lat: -22.8383, lng: -43.2781 },
];

const MapaEstrategico = () => {
  const maxTotal = Math.max(...bairros.map((b) => b.total));

  // Generate heatmap points: more points = higher intensity per bairro
  const heatPoints: [number, number, number][] = bairros.flatMap((b) => {
    const points: [number, number, number][] = [];
    // Apoiadores (green intensity at base)
    const intensity = b.total / maxTotal;
    // Spread points around bairro center
    for (let i = 0; i < Math.ceil(b.total / 20); i++) {
      const jitterLat = (Math.random() - 0.5) * 0.015;
      const jitterLng = (Math.random() - 0.5) * 0.015;
      points.push([b.lat + jitterLat, b.lng + jitterLng, intensity]);
    }
    return points;
  });

  const getStatusColor = (b: typeof bairros[0]) => {
    if (b.apoiadores > b.indecisos + b.rejeicao) return "text-green-400";
    if (b.indecisos > b.apoiadores) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mapa Estratégico</h1>
          <p className="text-sm text-muted-foreground">Distribuição de eleitores por região — Rio de Janeiro</p>
        </div>

        {/* Legend */}
        <div className="flex gap-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-3 w-3 rounded-full bg-green-500" /> Apoiadores
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-3 w-3 rounded-full bg-yellow-500" /> Indecisos
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-3 w-3 rounded-full bg-red-500" /> Rejeição
          </div>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden rounded-xl"
          style={{ height: "500px" }}
        >
          <MapContainer
            center={[-22.9068, -43.1729]}
            zoom={11}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            <HeatmapLayer points={heatPoints} />
            {bairros.map((b) => (
              <Marker key={b.nome} position={[b.lat, b.lng]}>
                <Popup>
                  <div className="text-sm">
                    <strong>{b.nome}</strong>
                    <div>Total: {b.total}</div>
                    <div style={{ color: "#22c55e" }}>Apoiadores: {b.apoiadores}</div>
                    <div style={{ color: "#eab308" }}>Indecisos: {b.indecisos}</div>
                    <div style={{ color: "#ef4444" }}>Rejeição: {b.rejeicao}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>

        {/* Bairro cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {bairros.map((b, i) => (
            <motion.div
              key={b.nome}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">{b.nome}</h3>
              </div>
              <p className={`text-xl font-bold ${getStatusColor(b)} mb-2`}>{b.total}</p>
              <div className="flex h-2.5 overflow-hidden rounded-full">
                <div className="bg-green-500" style={{ width: `${(b.apoiadores / b.total) * 100}%` }} />
                <div className="bg-yellow-500" style={{ width: `${(b.indecisos / b.total) * 100}%` }} />
                <div className="bg-red-500" style={{ width: `${(b.rejeicao / b.total) * 100}%` }} />
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
                <span>{b.apoiadores}</span>
                <span>{b.indecisos}</span>
                <span>{b.rejeicao}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default MapaEstrategico;
