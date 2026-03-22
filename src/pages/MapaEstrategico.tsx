import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";

const bairros = [
  { nome: "Centro", apoiadores: 220, indecisos: 89, rejeicao: 31, total: 340 },
  { nome: "Jardim América", apoiadores: 160, indecisos: 78, rejeicao: 42, total: 280 },
  { nome: "Vila Nova", apoiadores: 130, indecisos: 52, rejeicao: 28, total: 210 },
  { nome: "Boa Vista", apoiadores: 110, indecisos: 40, rejeicao: 25, total: 175 },
  { nome: "São José", apoiadores: 80, indecisos: 38, rejeicao: 22, total: 140 },
  { nome: "Liberdade", apoiadores: 65, indecisos: 30, rejeicao: 15, total: 110 },
  { nome: "Santa Cruz", apoiadores: 55, indecisos: 25, rejeicao: 10, total: 90 },
  { nome: "Bela Vista", apoiadores: 40, indecisos: 20, rejeicao: 8, total: 68 },
];

const MapaEstrategico = () => {
  const maxTotal = Math.max(...bairros.map((b) => b.total));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mapa Estratégico</h1>
          <p className="text-sm text-muted-foreground">Distribuição de eleitores por região</p>
        </div>

        {/* Legend */}
        <div className="flex gap-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-3 w-3 rounded-full bg-status-apoiador" /> Apoiadores
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-3 w-3 rounded-full bg-status-indeciso" /> Indecisos
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-3 w-3 rounded-full bg-status-rejeicao" /> Rejeição
          </div>
        </div>

        {/* Grid map visualization */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {bairros.map((b, i) => {
            const scale = b.total / maxTotal;
            return (
              <motion.div
                key={b.nome}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-xl p-5"
              >
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">{b.nome}</h3>
                </div>
                <p className="text-2xl font-bold text-foreground mb-3">{b.total}</p>
                {/* Stacked bar */}
                <div className="flex h-3 overflow-hidden rounded-full">
                  <div className="bg-status-apoiador" style={{ width: `${(b.apoiadores / b.total) * 100}%` }} />
                  <div className="bg-status-indeciso" style={{ width: `${(b.indecisos / b.total) * 100}%` }} />
                  <div className="bg-status-rejeicao" style={{ width: `${(b.rejeicao / b.total) * 100}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                  <span>{b.apoiadores} apoio</span>
                  <span>{b.indecisos} indec.</span>
                  <span>{b.rejeicao} rej.</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default MapaEstrategico;
