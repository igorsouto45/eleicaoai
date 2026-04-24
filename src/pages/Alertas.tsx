import { Bell, UserPlus, ArrowLeftRight, Activity, Trash2, Clock, Download, Filter, User } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useLideradosStore } from "@/store/useLideradosStore";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";

const Alertas = () => {
  const { notificacoes, limparNotificacoes } = useLideradosStore();
  const [filterTipo, setFilterTipo] = useState<string>("todos");
  const [searchLider, setSearchLider] = useState("");

  const filteredNotificacoes = notificacoes.filter(n => {
    const matchTipo = filterTipo === "todos" || n.tipo === filterTipo;
    const matchLider = n.liderNome.toLowerCase().includes(searchLider.toLowerCase());
    return matchTipo && matchLider;
  });

  const exportLog = () => {
    toast.success("Log de atividades exportado com sucesso! (CSV)");
  };

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'cadastro': return <UserPlus className="h-4 w-4 text-success" />;
      case 'transferencia': return <ArrowLeftRight className="h-4 w-4 text-primary" />;
      case 'status': return <Activity className="h-4 w-4 text-warning" />;
      default: return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Histórico de Atividades</h1>
            <p className="text-sm text-muted-foreground">Monitore cadastros e mudanças em tempo real</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Filter className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <select 
                value={filterTipo} 
                onChange={e => setFilterTipo(e.target.value)}
                className="pl-8 pr-4 h-9 text-xs bg-card border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
              >
                <option value="todos">Todos Eventos</option>
                <option value="cadastro">Cadastros</option>
                <option value="status">Status</option>
                <option value="transferencia">Transferências</option>
                <option value="combustivel">Combustível</option>
              </select>
            </div>
            <Button variant="outline" size="sm" onClick={exportLog} className="text-xs h-9">
              <Download className="h-3.5 w-3.5 mr-2" /> Exportar Log
            </Button>
            <Button variant="ghost" size="sm" onClick={limparNotificacoes} className="text-xs h-9 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5 mr-2" /> Limpar
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {notificacoes.length === 0 ? (
            <div className="glass-card rounded-xl p-10 text-center">
              <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-sm text-muted-foreground">Nenhuma atividade recente registrada.</p>
            </div>
          ) : (
            notificacoes.map((n) => (
              <div key={n.id} className="glass-card p-4 rounded-xl flex items-start gap-4 hover:bg-muted/30 transition-colors border-l-4 border-l-primary/30">
                <div className="h-9 w-9 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
                  {getIcon(n.tipo)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-foreground">{n.mensagem}</p>
                    <span className="text-[10px] text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(new Date(n.data), "HH:mm 'de' d 'de' MMM", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-bold text-primary/70">Líder:</span> {n.liderNome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-bold text-primary/70">Liderado:</span> {n.lideradoNome}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Alertas;