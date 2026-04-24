import { AlertTriangle, Clock, PhoneOff, TrendingUp } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useLideradosStore } from "@/store/useLideradosStore";
import { useMemo } from "react";

const tabs = [
  { label: "Indecisos Recentes", icon: Clock },
  { label: "Sem Contato", icon: PhoneOff },
  { label: "Alta Conversão", icon: TrendingUp },
];

const prioridades = [];

const Prioridades = () => {
  const { liderados } = useLideradosStore();

  const dynamicPrioridades = useMemo(() => {
    return liderados
      .filter(l => l.status === 'indeciso')
      .map(l => ({
        nome: l.nome,
        bairro: l.bairro,
        motivo: "Indeciso - Requer contato",
        chance: 60 // Base chance for all for now
      }))
      .slice(0, 10);
  }, [liderados]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Central de Prioridades</h1>
          <p className="text-sm text-muted-foreground">Eleitores que merecem atenção imediata</p>
        </div>

        <div className="space-y-3">
          {dynamicPrioridades.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center border border-dashed border-border/50">
              <p className="text-muted-foreground">Nenhuma prioridade identificada no momento.</p>
            </div>
          ) : (
            dynamicPrioridades.map((p, i) => (
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
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Prioridades;
