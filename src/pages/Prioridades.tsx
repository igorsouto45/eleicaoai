import { AlertTriangle, Clock, PhoneOff, TrendingUp } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const tabs = [
  { label: "Indecisos Recentes", icon: Clock },
  { label: "Sem Contato", icon: PhoneOff },
  { label: "Alta Conversão", icon: TrendingUp },
];

const prioridades = [
  { nome: "Ana Costa", bairro: "São José", motivo: "Indecisa há 2 dias, sem contato", chance: 82 },
  { nome: "Carlos Santos", bairro: "Jardim América", motivo: "Indeciso, 1 tentativa sem resposta", chance: 71 },
  { nome: "Marcos Souza", bairro: "Vila Nova", motivo: "Indeciso, cadastrado hoje", chance: 65 },
  { nome: "Lucia Ferreira", bairro: "Jardim América", motivo: "Apoiadora anterior, mudou para indecisa", chance: 58 },
];

const Prioridades = () => (
  <AppLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Central de Prioridades</h1>
        <p className="text-sm text-muted-foreground">Eleitores que merecem atenção imediata</p>
      </div>

      <div className="space-y-3">
        {prioridades.map((p, i) => (
          <div key={i} className="glass-card flex items-center justify-between rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-indeciso">
                <AlertTriangle className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{p.nome}</p>
                <p className="text-xs text-muted-foreground">{p.bairro}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.motivo}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Chance de conversão</p>
              <p className="text-2xl font-bold text-gradient">{p.chance}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </AppLayout>
);

export default Prioridades;
