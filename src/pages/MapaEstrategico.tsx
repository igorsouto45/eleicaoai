import { Trophy, Users, TrendingUp, PieChart as PieIcon } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import HeatmapLayer from "@/components/HeatmapLayer";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLideradosStore } from "@/store/useLideradosStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useMemo } from "react";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Coordenadas centrais aproximadas para representação no mapa (Rio de Janeiro)
const LIDER_COORDS: Record<string, { lat: number; lng: number }> = {
  "2": { lat: -22.9068, lng: -43.1729 }, // João Líder (Centro)
  "3": { lat: -22.9711, lng: -43.1826 }, // Ana Líder (Copacabana)
  "unknown": { lat: -22.9325, lng: -43.2436 }, // Sistema/Outros (Tijuca)
};

const MapaEstrategico = () => {
  const { liderados } = useLideradosStore();
  const totalGeral = liderados.length;

  const statsPorLider = useMemo(() => {
    const mapa = new Map();
    liderados.forEach(l => {
      const entry = mapa.get(l.origemId) || { 
        id: l.origemId,
        nome: l.origemNome, 
        apoiadores: 0, 
        indecisos: 0, 
        rejeicao: 0, 
        total: 0,
        coords: LIDER_COORDS[l.origemId] || LIDER_COORDS["unknown"]
      };
      
      entry.total++;
      if (l.status === 'apoiador') entry.apoiadores++;
      else if (l.status === 'indeciso') entry.indecisos++;
      else if (l.status === 'rejeicao') entry.rejeicao++;
      
      mapa.set(l.origemId, entry);
    });
    
    return Array.from(mapa.values()).map(l => ({
      ...l,
      percentualGeral: totalGeral > 0 ? (l.total / totalGeral) * 100 : 0
    })).sort((a, b) => b.total - a.total);
  }, [liderados, totalGeral]);

  const maxTotal = Math.max(...statsPorLider.map((s) => s.total), 1);

  // Generate heatmap points baseados nos líderes
  const heatPoints: [number, number, number][] = statsPorLider.flatMap((s) => {
    const points: [number, number, number][] = [];
    const intensity = s.total / maxTotal;
    
    for (let i = 0; i < Math.ceil(s.total * 2); i++) {
      const jitterLat = (Math.random() - 0.5) * 0.05;
      const jitterLng = (Math.random() - 0.5) * 0.05;
      points.push([s.coords.lat + jitterLat, s.coords.lng + jitterLng, intensity]);
    }
    return points;
  });

  const getStatusColor = (s: any) => {
    if (s.apoiadores > s.indecisos + s.rejeicao) return "text-green-400";
    if (s.indecisos > s.apoiadores) return "text-yellow-400";
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
