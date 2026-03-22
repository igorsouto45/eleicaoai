import { motion } from "framer-motion";
import { Brain, TrendingUp, MapPin, AlertTriangle } from "lucide-react";

const insights = [
  {
    icon: TrendingUp,
    text: "Você precisa de mais 1.247 votos para atingir sua meta de 15.000.",
    type: "info" as const,
  },
  {
    icon: MapPin,
    text: "O bairro Centro possui 89 indecisos — alto potencial de conversão.",
    type: "warning" as const,
  },
  {
    icon: TrendingUp,
    text: "A campanha está crescendo 4,2% ao dia. Ritmo acima da média!",
    type: "success" as const,
  },
  {
    icon: AlertTriangle,
    text: "Queda de 12% no engajamento no bairro Jardim América.",
    type: "danger" as const,
  },
];

const typeStyles = {
  info: "border-l-primary bg-primary/5",
  warning: "border-l-[hsl(var(--warning))] bg-[hsl(var(--warning)/0.05)]",
  success: "border-l-[hsl(var(--success))] bg-[hsl(var(--success)/0.05)]",
  danger: "border-l-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.05)]",
};

const AiInsightCard = () => {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
          <Brain className="h-4 w-4 text-primary-foreground" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Inteligência Artificial</h3>
      </div>
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-start gap-3 rounded-lg border-l-2 p-3 ${typeStyles[insight.type]}`}
          >
            <insight.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-xs leading-relaxed text-secondary-foreground">{insight.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AiInsightCard;
