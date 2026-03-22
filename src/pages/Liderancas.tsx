import { Trophy, Medal, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";

const ranking = [
  { pos: 1, nome: "João Silva", tipo: "Líder", cadastros: 142, conversoes: 98, taxa: 69 },
  { pos: 2, nome: "Ana Costa", tipo: "Líder", cadastros: 89, conversoes: 61, taxa: 68 },
  { pos: 3, nome: "Pedro Lima", tipo: "Operador", cadastros: 56, conversoes: 34, taxa: 61 },
  { pos: 4, nome: "Maria Souza", tipo: "Operador", cadastros: 43, conversoes: 25, taxa: 58 },
  { pos: 5, nome: "Carlos Mendes", tipo: "Líder", cadastros: 38, conversoes: 20, taxa: 53 },
];

const medalColors = ["text-[hsl(45,93%,47%)]", "text-muted-foreground", "text-[hsl(25,80%,50%)]"];

const Liderancas = () => (
  <AppLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Gestão de Lideranças</h1>
        <p className="text-sm text-muted-foreground">Ranking e desempenho da equipe</p>
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
                <p className="text-[10px] text-muted-foreground">Cadastros</p>
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
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cadastros</th>
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
