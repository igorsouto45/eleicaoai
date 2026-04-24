import { Target, TrendingUp, MessageSquare, Phone, AlertCircle, CheckCircle2, History, Search, Calendar, Filter, Clock as ClockIcon } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { useLideradosStore } from "@/store/useLideradosStore";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

const Reconquista = () => {
  const { liderados, updateStatus, agendarContato } = useLideradosStore();
  const [search, setSearch] = useState("");
  const [filterBairro, setFilterBairro] = useState("");
  const [agendamentoLiderado, setAgendamentoLiderado] = useState<any>(null);
  const [dataAgendamento, setDataAgendamento] = useState("");
  
  // Filtra indecisos e rejeição, ordenando por probabilidade (maior primeiro)
  const listaReconquista = liderados
    .filter(l => (l.status === 'indeciso' || l.status === 'rejeicao'))
    .filter(l => l.nome.toLowerCase().includes(search.toLowerCase()) || l.bairro.toLowerCase().includes(search.toLowerCase()))
    .filter(l => !filterBairro || l.bairro === filterBairro)
    .sort((a, b) => (b.probabilidadeReconquista || 0) - (a.probabilidadeReconquista || 0));

  const bairros = Array.from(new Set(liderados.map(l => l.bairro)));

  const handleAgendar = () => {
    if (!agendamentoLiderado || !dataAgendamento) return;
    agendarContato(agendamentoLiderado.id, dataAgendamento);
    setAgendamentoLiderado(null);
    setDataAgendamento("");
  };

  const handleAction = (id: string, action: string) => {
    toast.success(`Ação registrada: ${action}`);
  };

  const converterParaApoiador = (id: string) => {
    updateStatus(id, 'apoiador');
    toast.success("Parabéns! Eleitor convertido para APOIADOR! 🎉");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Operação Reconquista</h1>
            <p className="text-sm text-muted-foreground">Foco estratégico em converter indecisos e mitigar rejeições</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative w-48">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Buscar..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                className="pl-8 bg-card border-border h-9 text-xs" 
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <select 
                value={filterBairro} 
                onChange={e => setFilterBairro(e.target.value)}
                className="pl-8 pr-4 h-9 text-xs bg-card border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
              >
                <option value="">Todos os Bairros</option>
                {bairros.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {listaReconquista.length === 0 ? (
            <div className="col-span-2 glass-card p-10 text-center rounded-xl">
              <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground">Excelente! Não há indecisos ou rejeições na sua base.</p>
            </div>
          ) : (
            listaReconquista.map((l) => (
              <div key={l.id} className="glass-card p-5 rounded-xl border-l-4 border-l-warning space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                      {l.nome}
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${l.status === 'indeciso' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}>
                        {l.status.toUpperCase()}
                      </span>
                    </h3>
                    <p className="text-xs text-muted-foreground">{l.bairro} • {l.telefone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Chance de Conversão</p>
                    <div className="flex items-center gap-2">
                      <Progress value={l.probabilidadeReconquista} className="h-2 w-24 bg-muted" />
                      <span className="text-xs font-bold text-primary">{l.probabilidadeReconquista}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                  <p className="text-[10px] uppercase font-bold text-primary mb-2 flex items-center gap-1">
                    <Target className="h-3 w-3" /> Ação Recomendada
                  </p>
                  <p className="text-xs text-foreground leading-relaxed italic">
                    {l.status === 'indeciso' 
                      ? "Enviar vídeo do candidato sobre propostas para o bairro. Focar em segurança e saúde."
                      : "Abordagem neutra. Enviar convite para café comunitário sem pressão política."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="text-xs h-8 border-border" onClick={() => handleAction(l.id, 'WhatsApp')}>
                    <MessageSquare className="h-3.5 w-3.5 mr-1 text-success" /> WhatsApp
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs h-8 border-border" onClick={() => handleAction(l.id, 'Ligação')}>
                    <Phone className="h-3.5 w-3.5 mr-1 text-primary" /> Ligar
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="text-xs h-8 border-border">
                        <History className="h-3.5 w-3.5 mr-1" /> Histórico
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="glass-card border-border">
                      <DialogHeader>
                        <DialogTitle>Histórico de Tentativas: {l.nome}</DialogTitle>
                        <DialogDescription>Ações realizadas para converter este eleitor.</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 py-4">
                        {l.historicoReconquista?.map((h, i) => (
                          <div key={i} className="flex gap-3 text-xs p-2 rounded bg-muted/50 border border-border">
                            <ClockIcon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span>{h}</span>
                          </div>
                        )) || <p className="text-xs text-muted-foreground text-center">Nenhuma tentativa registrada ainda.</p>}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button size="sm" variant="outline" className="text-xs h-8 border-border" onClick={() => setAgendamentoLiderado(l)}>
                    <Calendar className="h-3.5 w-3.5 mr-1 text-primary" /> 
                    {l.proximoContato ? format(new Date(l.proximoContato), "dd/MM 'às' HH:mm", { locale: ptBR }) : "Agendar"}
                  </Button>

                  <Button size="sm" className="text-xs h-8 gradient-primary ml-auto" onClick={() => converterParaApoiador(l.id)}>
                    Convertido!
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog open={!!agendamentoLiderado} onOpenChange={(open) => !open && setAgendamentoLiderado(null)}>
        <DialogContent className="glass-card border-border sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Agendar Próximo Contato</DialogTitle>
            <DialogDescription>Defina quando realizar a próxima abordagem com <strong>{agendamentoLiderado?.nome}</strong>.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              type="datetime-local" 
              value={dataAgendamento} 
              onChange={e => setDataAgendamento(e.target.value)}
              className="bg-muted/30 border-border" 
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAgendamentoLiderado(null)}>Cancelar</Button>
            <Button className="gradient-primary" onClick={handleAgendar}>Salvar Agendamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

const Clock = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

export default Reconquista;