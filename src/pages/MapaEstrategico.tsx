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
            {statsPorLider.map((s) => (
              <Marker key={s.id} position={[s.coords.lat, s.coords.lng]}>
                <Popup>
                  <div className="text-sm p-1">
                    <strong className="text-primary block mb-1">{s.nome}</strong>
                    <div className="font-bold border-b border-border pb-1 mb-1">
                      {s.total} Liderados ({s.percentualGeral.toFixed(1)}%)
                    </div>
                    <div className="flex flex-col gap-0.5 mt-2">
                      <div className="flex justify-between gap-4">
                        <span className="text-green-500">Apoiadores:</span>
                        <span className="font-bold">{s.apoiadores}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-yellow-500">Indecisos:</span>
                        <span className="font-bold">{s.indecisos}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-red-500">Rejeição:</span>
                        <span className="font-bold">{s.rejeicao}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>

        {/* Leader cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsPorLider.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl p-4 border border-white/5 hover:border-primary/30 transition-all"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground truncate max-w-[120px]">{s.nome}</h3>
                </div>
                <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                  {s.percentualGeral.toFixed(1)}%
                </Badge>
              </div>
              
              <div className="flex items-baseline gap-1 mb-2">
                <span className={`text-2xl font-bold ${getStatusColor(s)}`}>{s.total}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Liderados</span>
              </div>

              <div className="space-y-2">
                <div className="flex h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="bg-green-500" style={{ width: `${(s.apoiadores / s.total) * 100}%` }} />
                  <div className="bg-yellow-500" style={{ width: `${(s.indecisos / s.total) * 100}%` }} />
                  <div className="bg-red-500" style={{ width: `${(s.rejeicao / s.total) * 100}%` }} />
                </div>
                
                <div className="flex justify-between items-center text-[9px] font-bold">
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span className="text-muted-foreground">{s.apoiadores}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                    <span className="text-muted-foreground">{s.indecisos}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    <span className="text-muted-foreground">{s.rejeicao}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default MapaEstrategico;
