import { Trophy, Medal, TrendingUp, Fuel, Calculator, History as HistoryIcon, Plus } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useState } from "react";
import { useLideradosStore } from "@/store/useLideradosStore";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const ranking = [
  { id: "2", pos: 1, nome: "João Líder", tipo: "Líder", cadastros: 142, conversoes: 98, taxa: 69 },
  { id: "3", pos: 2, nome: "Ana Líder", tipo: "Líder", cadastros: 89, conversoes: 61, taxa: 68 },
];

const medalColors = ["text-[hsl(45,93%,47%)]", "text-muted-foreground", "text-[hsl(25,80%,50%)]"];

const Liderancas = () => {
  const { registrosCombustivel, registrarCombustivel } = useLideradosStore();
  const [selectedLider, setSelectedLider] = useState<any>(null);
  const [fuelValue, setFuelValue] = useState("");
  const [kmValue, setKmValue] = useState("");

  const handleFuelSubmit = () => {
    if (!selectedLider || !fuelValue || !kmValue) {
      toast.error("Preencha todos os campos");
      return;
    }
    registrarCombustivel(
      selectedLider.id, 
      selectedLider.nome, 
      Number(fuelValue), 
      Number(kmValue)
    );
    setFuelValue("");
    setKmValue("");
    setSelectedLider(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestão de Lideranças</h1>
            <p className="text-sm text-muted-foreground">Ranking e controle de ajuda de custo</p>
          </div>

          <Dialog open={!!selectedLider} onOpenChange={(open) => !open && setSelectedLider(null)}>
            <DialogContent className="glass-card border-border sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Fuel className="h-5 w-5 text-primary" />
                  Ajuda de Combustível
                </DialogTitle>
                <DialogDescription>
                  Registrar pagamento para <strong>{selectedLider?.nome}</strong>.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium">Valor Pago (R$)</label>
                  <Input 
                    type="number" 
                    placeholder="0,00" 
                    value={fuelValue} 
                    onChange={e => setFuelValue(e.target.value)}
                    className="bg-muted/30 border-border" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Kilometragem Atual (KM)</label>
                  <Input 
                    type="number" 
                    placeholder="KM no painel" 
                    value={kmValue} 
                    onChange={e => setKmValue(e.target.value)}
                    className="bg-muted/30 border-border" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setSelectedLider(null)}>Cancelar</Button>
                <Button className="gradient-primary" onClick={handleFuelSubmit}>Confirmar Pagamento</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

      {/* Top 3 cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {ranking.slice(0, 3).map((r, i) => (
          <motion.div
            key={r.pos}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card rounded-xl p-5 text-center ${i === 0 ? "border-[hsl(var(--warning))] border" : ""}`}
          >
            <Medal className={`mx-auto mb-2 h-8 w-8 ${medalColors[i]}`} />
            <h3 className="text-lg font-bold text-foreground">{r.nome}</h3>
            <p className="text-xs text-muted-foreground mb-3">{r.tipo}</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-foreground">{r.cadastros}</p>
                <p className="text-[10px] text-muted-foreground">Liderados</p>
              </div>
              <div>
                <p className="text-lg font-bold status-apoiador">{r.conversoes}</p>
                <p className="text-[10px] text-muted-foreground">Conversões</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gradient">{r.taxa}%</p>
                <p className="text-[10px] text-muted-foreground">Taxa</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full ranking table */}
      <div className="glass-card overflow-hidden rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">#</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tipo</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Liderados</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conversões</th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Taxa</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((r) => (
              <tr key={r.pos} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3.5 text-sm font-bold text-foreground">{r.pos}</td>
                <td className="px-5 py-3.5 text-sm font-medium text-foreground">{r.nome}</td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{r.tipo}</td>
                <td className="px-5 py-3.5 text-sm text-foreground">{r.cadastros}</td>
                <td className="px-5 py-3.5 text-sm status-apoiador">{r.conversoes}</td>
                <td className="px-5 py-3.5 text-sm text-gradient font-semibold">{r.taxa}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
);

export default Liderancas;
