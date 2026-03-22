import { Bell, UserPlus, ArrowUpDown, MapPin, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";

const alertas = [
  { id: 1, icon: UserPlus, tipo: "Novo cadastro", msg: "Maria Silva foi cadastrada por João (Líder)", tempo: "Há 5 min", cor: "text-[hsl(var(--success))]" },
  { id: 2, icon: ArrowUpDown, tipo: "Mudança de status", msg: "Carlos Santos mudou de Indeciso para Apoiador", tempo: "Há 15 min", cor: "text-primary" },
  { id: 3, icon: MapPin, tipo: "Crescimento regional", msg: "Bairro Centro atingiu 340 eleitores cadastrados", tempo: "Há 1h", cor: "text-[hsl(var(--warning))]" },
  { id: 4, icon: TrendingDown, tipo: "Queda de engajamento", msg: "Bairro Jardim América teve queda de 12% em cadastros", tempo: "Há 2h", cor: "text-[hsl(var(--destructive))]" },
  { id: 5, icon: UserPlus, tipo: "Novo cadastro", msg: "Paulo Mendes foi cadastrado por Ana (Líder)", tempo: "Há 3h", cor: "text-[hsl(var(--success))]" },
];

const Alertas = () => (
  <AppLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Alertas</h1>
          <p className="text-sm text-muted-foreground">Notificações em tempo real da campanha</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary shadow-primary animate-pulse-glow">
          <Bell className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>

      <div className="space-y-3">
        {alertas.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card flex items-start gap-4 rounded-xl p-4"
          >
            <div className={`mt-0.5 ${a.cor}`}>
              <a.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{a.tipo}</p>
              <p className="mt-1 text-sm text-foreground">{a.msg}</p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">{a.tempo}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </AppLayout>
);

export default Alertas;
