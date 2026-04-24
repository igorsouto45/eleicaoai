import { useState, useMemo } from "react";
import { Users, UserCheck, HelpCircle, UserX, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import AppLayout from "@/components/AppLayout";
import KpiCard from "@/components/KpiCard";
import AiInsightCard from "@/components/AiInsightCard";
import { useAuthStore } from "@/store/useAuthStore";
import { useLideradosStore } from "@/store/useLideradosStore";

const dailyData = [];
const bairroData = [];
const statusData = [
  { name: "Apoiadores", value: 0, color: "hsl(142, 71%, 45%)" },
  { name: "Indecisos", value: 0, color: "hsl(45, 93%, 47%)" },
  { name: "Rejeição", value: 0, color: "hsl(0, 72%, 51%)" },
];

const Dashboard = () => {
  const { user } = useAuthStore();
  const { liderados } = useLideradosStore();
  const isAdmin = user?.tipo === "admin";

  const myLiderados = isAdmin ? liderados : liderados.filter(l => l.origemId === user?.id);
  
  const stats = useMemo(() => {
    return {
      total: myLiderados.length,
      apoiadores: myLiderados.filter(l => l.status === 'apoiador').length,
      indecisos: myLiderados.filter(l => l.status === 'indeciso').length,
      rejeicao: myLiderados.filter(l => l.status === 'rejeicao').length,
    };
  }, [myLiderados]);

  const dynamicStatusData = useMemo(() => [
    { name: "Apoiadores", value: stats.apoiadores, color: "hsl(142, 71%, 45%)" },
    { name: "Indecisos", value: stats.indecisos, color: "hsl(45, 93%, 47%)" },
    { name: "Rejeição", value: stats.rejeicao, color: "hsl(0, 72%, 51%)" },
  ], [stats]);

  const dynamicBairroData = useMemo(() => {
    const counts: Record<string, number> = {};
    myLiderados.forEach(l => {
      counts[l.bairro] = (counts[l.bairro] || 0) + 1;
    });
    return Object.entries(counts).map(([bairro, total]) => ({ bairro, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [myLiderados]);

  const dynamicDailyData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });

    const counts: Record<string, { cadastros: number; conversoes: number }> = {};
    last7Days.forEach(day => counts[day] = { cadastros: 0, conversoes: 0 });

    myLiderados.forEach(l => {
      if (counts[l.data]) {
        counts[l.data].cadastros++;
        if (l.status === 'apoiador') counts[l.data].conversoes++;
      }
    });

    const diaMap: Record<number, string> = { 0: "Dom", 1: "Seg", 2: "Ter", 3: "Qua", 4: "Qui", 5: "Sex", 6: "Sáb" };

    return Object.entries(counts).map(([date, data]) => ({
      dia: diaMap[new Date(date + 'T12:00:00').getDay()],
      ...data
    }));
  }, [myLiderados]);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isAdmin ? "Painel de Guerra" : `Comando de ${user?.nome}`}
          </h1>
          <p className="text-sm text-muted-foreground">Bem-vindo à inteligência estratégica da campanha.</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title={isAdmin ? "Total Eleitores" : "Meus Liderados"} value={stats.total} change="+12 hoje" changeType="positive" icon={Users} />
          <KpiCard title="Apoiadores" value={stats.apoiadores} change="Em crescimento" changeType="positive" icon={UserCheck} colorClass="bg-status-apoiador" />
          <KpiCard title="Indecisos" value={stats.indecisos} change="Foco em conversão" changeType="neutral" icon={HelpCircle} colorClass="bg-status-indeciso" />
          <KpiCard title="Rejeição" value={stats.rejeicao} change="Monitorar" changeType="negative" icon={UserX} colorClass="bg-status-rejeicao" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Daily evolution */}
          <div className="glass-card col-span-2 rounded-xl p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Evolução Diária</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={dynamicDailyData}>
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
                <Pie data={dynamicStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {dynamicStatusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(240, 8%, 10%)", border: "1px solid hsl(240, 6%, 18%)", borderRadius: 8, color: "hsl(0, 0%, 95%)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-2">
              {dynamicStatusData.map((s) => (
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
              <BarChart data={dynamicBairroData}>
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
