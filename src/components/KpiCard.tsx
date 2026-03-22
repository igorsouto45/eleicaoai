import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  colorClass?: string;
}

const KpiCard = ({ title, value, change, changeType = "neutral", icon: Icon, colorClass }: KpiCardProps) => {
  const changeColor =
    changeType === "positive"
      ? "text-[hsl(var(--success))]"
      : changeType === "negative"
      ? "text-[hsl(var(--destructive))]"
      : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-xl p-5"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value.toLocaleString()}</p>
          {change && (
            <p className={`text-xs font-medium ${changeColor}`}>{change}</p>
          )}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClass ?? "gradient-primary"}`}>
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
      </div>
    </motion.div>
  );
};

export default KpiCard;
