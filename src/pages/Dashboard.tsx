import { Users, UserCheck, HelpCircle, UserX, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import AppLayout from "@/components/AppLayout";
import KpiCard from "@/components/KpiCard";
import AiInsightCard from "@/components/AiInsightCard";
import { useAuthStore } from "@/store/useAuthStore";
import { useLideradosStore } from "@/store/useLideradosStore";

const dailyData = [
  { dia: "Seg", cadastros: 45, conversoes: 12 },
  { dia: "Ter", cadastros: 62, conversoes: 18 },
  { dia: "Qua", cadastros: 78, conversoes: 24 },
  { dia: "Qui", cadastros: 91, conversoes: 31 },
  { dia: "Sex", cadastros: 120, conversoes: 42 },
  { dia: "Sáb", cadastros: 85, conversoes: 29 },
  { dia: "Dom", cadastros: 53, conversoes: 15 },
];

const bairroData = [
  { bairro: "Centro", total: 340 },
  { bairro: "Jardim", total: 280 },
  { bairro: "Vila Nova", total: 210 },
  { bairro: "Boa Vista", total: 175 },
  { bairro: "São José", total: 140 },
];

const statusData = [
  { name: "Apoiadores", value: 8420, color: "hsl(142, 71%, 45%)" },
  { name: "Indecisos", value: 3150, color: "hsl(45, 93%, 47%)" },
  { name: "Rejeição", value: 1183, color: "hsl(0, 72%, 51%)" },
];

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Painel de Guerra</h1>
          <p className="text-sm text-muted-foreground">Visão geral da campanha eleitoral</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard title="Total Eleitores" value={12753} change="+234 hoje" changeType="positive" icon={Users} />
          <KpiCard title="Apoiadores" value={8420} change="66,1% do total" changeType="positive" icon={UserCheck} colorClass="bg-status-apoiador" />
          <KpiCard title="Indecisos" value={3150} change="24,7% do total" changeType="neutral" icon={HelpCircle} colorClass="bg-status-indeciso" />
          <KpiCard title="Rejeição" value={1183} change="9,2% do total" changeType="negative" icon={UserX} colorClass="bg-status-rejeicao" />
          <KpiCard title="Crescimento" value="+4,2%" change="vs. semana anterior" changeType="positive" icon={TrendingUp} />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Daily evolution */}
          <div className="glass-card col-span-2 rounded-xl p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Evolução Diária</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="gradCadastros" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(262, 71%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(262, 71%, 50%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradConversoes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 6%, 18%)" />
                <XAxis dataKey="dia" tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 12 }} />
                <YAxis tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "hsl(240, 8%, 10%)", border: "1px solid hsl(240, 6%, 18%)", borderRadius: 8, color: "hsl(0, 0%, 95%)" }} />
                <Area type="monotone" dataKey="cadastros" stroke="hsl(262, 71%, 50%)" fill="url(#gradCadastros)" strokeWidth={2} name="Cadastros" />
                <Area type="monotone" dataKey="conversoes" stroke="hsl(142, 71%, 45%)" fill="url(#gradConversoes)" strokeWidth={2} name="Conversões" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Distribuição por Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(240, 8%, 10%)", border: "1px solid hsl(240, 6%, 18%)", borderRadius: 8, color: "hsl(0, 0%, 95%)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-2">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-muted-foreground">{s.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">{s.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Bar chart by bairro */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Eleitores por Bairro</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={bairroData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 6%, 18%)" />
                <XAxis dataKey="bairro" tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(240, 5%, 55%)", fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "hsl(240, 8%, 10%)", border: "1px solid hsl(240, 6%, 18%)", borderRadius: 8, color: "hsl(0, 0%, 95%)" }} />
                <Bar dataKey="total" fill="hsl(262, 71%, 50%)" radius={[4, 4, 0, 0]} name="Eleitores" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* AI Insights */}
          <AiInsightCard />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
