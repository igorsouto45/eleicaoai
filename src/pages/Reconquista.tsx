import { Target, MessageCircle, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";

const reconquistaList = [
  { id: 1, nome: "Carlos Santos", bairro: "Jardim América", status: "indeciso", tentativas: 1, ultimoContato: "Há 3 dias", chance: "Alta" },
  { id: 2, nome: "Ana Costa", bairro: "São José", status: "indeciso", tentativas: 0, ultimoContato: "Nunca", chance: "Média" },
  { id: 3, nome: "Marcos Souza", bairro: "Vila Nova", status: "indeciso", tentativas: 2, ultimoContato: "Há 7 dias", chance: "Média" },
  { id: 4, nome: "Fernanda Oliveira", bairro: "Vila Nova", status: "rejeicao", tentativas: 1, ultimoContato: "Há 5 dias", chance: "Baixa" },
];

const chanceColors: Record<string, string> = {
  Alta: "text-[hsl(var(--success))]",
  Média: "text-[hsl(var(--warning))]",
  Baixa: "text-[hsl(var(--destructive))]",
};

const Reconquista = () => (
  <AppLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reconquista de Eleitores</h1>
        <p className="text-sm text-muted-foreground">Eleitores indecisos e de rejeição com potencial de conversão</p>
      </div>

      <div className="space-y-3">
        {reconquistaList.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card flex items-center justify-between rounded-xl p-5"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${e.status === "indeciso" ? "bg-status-indeciso" : "bg-status-rejeicao"}`}>
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{e.nome}</p>
                <p className="text-xs text-muted-foreground">{e.bairro} · {e.status === "indeciso" ? "Indeciso" : "Rejeição"}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Tentativas</p>
                <p className="text-sm font-bold text-foreground">{e.tentativas}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Último contato</p>
                <p className="text-sm text-foreground">{e.ultimoContato}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Chance</p>
                <p className={`text-sm font-bold ${chanceColors[e.chance]}`}>{e.chance}</p>
              </div>
              <Button size="sm" className="gradient-primary text-primary-foreground shadow-primary">
                <MessageCircle className="mr-1 h-3 w-3" /> Abordar
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </AppLayout>
);

export default Reconquista;
