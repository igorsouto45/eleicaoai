import { Brain, MessageCircle, Settings, Zap } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";

const fluxos = [
  { nome: "Mensagem Inicial", desc: "Primeiro contato com o eleitor, apresentação do candidato", status: "Ativo", msgs: 1245 },
  { nome: "Intenção de Voto", desc: "Pergunta sobre intenção de voto e classificação automática", status: "Ativo", msgs: 890 },
  { nome: "Reconquista", desc: "Fluxo para indecisos, com argumentos personalizados", status: "Rascunho", msgs: 0 },
];

const IaWhatsapp = () => (
  <AppLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">IA de Atendimento</h1>
          <p className="text-sm text-muted-foreground">Integração WhatsApp com Evolution API</p>
        </div>
        <Button className="gradient-primary text-primary-foreground shadow-primary">
          <Settings className="mr-2 h-4 w-4" /> Configurar API
        </Button>
      </div>

      {/* Status */}
      <div className="glass-card flex items-center gap-4 rounded-xl p-5">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-primary">
          <Zap className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Status da Integração</p>
          <p className="text-xs text-muted-foreground">Aguardando configuração da Evolution API</p>
        </div>
        <span className="ml-auto inline-flex items-center rounded-full border border-[hsl(var(--warning)/0.3)] bg-[hsl(var(--warning)/0.1)] px-3 py-1 text-xs font-medium text-[hsl(var(--warning))]">
          Pendente
        </span>
      </div>

      {/* Fluxos */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Fluxos de Conversa</h2>
        {fluxos.map((f) => (
          <div key={f.nome} className="glass-card flex items-center justify-between rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{f.nome}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{f.msgs}</p>
                <p className="text-[10px] text-muted-foreground">Msgs enviadas</p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                f.status === "Ativo"
                  ? "bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]"
                  : "bg-secondary text-muted-foreground"
              }`}>
                {f.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI behavior */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Comportamento da IA</h3>
        </div>
        <ul className="space-y-2 text-xs text-muted-foreground">
          <li>• Adapta linguagem conforme o perfil do eleitor</li>
          <li>• Simula conversa humana com respostas naturais</li>
          <li>• Atualiza status do eleitor automaticamente após resposta</li>
          <li>• Envia alertas para a equipe em casos de alta prioridade</li>
        </ul>
      </div>
    </div>
  </AppLayout>
);

export default IaWhatsapp;
