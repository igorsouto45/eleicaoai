import { useState, useEffect } from "react";
import { Search, Filter, Download, Eye, Plus, UserPlus, QrCode, FileText, ArrowLeftRight, MoreHorizontal, User } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import ScannerFicha from "@/components/ScannerFicha";
import { useAuthStore } from "@/store/useAuthStore";
import { useLideradosStore } from "@/store/useLideradosStore";

const formSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  telefone: z.string().min(10, "Telefone inválido"),
  bairro: z.string().min(2, "Bairro é obrigatório"),
  status: z.enum(["apoiador", "indeciso", "rejeicao"]),
});

const statusConfig: Record<string, { label: string; className: string }> = {
  apoiador: { label: "Apoiador", className: "bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))] border-[hsl(var(--success)/0.3)]" },
  indeciso: { label: "Indeciso", className: "bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.3)]" },
  rejeicao: { label: "Rejeição", className: "bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))] border-[hsl(var(--destructive)/0.3)]" },
};

const lideres = [
  { id: "2", nome: "João Líder" },
  { id: "3", nome: "Ana Líder" },
];

const Eleitores = () => {
  const { user } = useAuthStore();
  const { liderados, addLiderado, transferLiderado, syncLiderados } = useLideradosStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [selectedLiderado, setSelectedLiderado] = useState<any>(null);
  const [novoLiderId, setNovoLiderId] = useState("");
  const [activeTab, setActiveTab] = useState<"manual" | "scan">("manual");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const isAdmin = user?.tipo === "admin";

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncLiderados();
      toast.success("Conexão restabelecida! Dados sincronizados.");
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      telefone: "",
      bairro: "",
      status: "indeciso",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addLiderado({
      ...values,
      origemId: user?.id || "unknown",
      origemNome: user?.nome || "Sistema",
      data: new Date().toISOString().split('T')[0],
    });
    
    toast.success(`${isAdmin ? "Eleitor" : "Liderado"} cadastrado com sucesso!`);
    setIsModalOpen(false);
    form.reset();
  }

  const handleTransfer = () => {
    const lider = lideres.find(l => l.id === novoLiderId);
    if (lider && selectedLiderado) {
      transferLiderado(selectedLiderado.id, lider.id, lider.nome);
      toast.success(`Transferência realizada para ${lider.nome}`);
      setIsTransferOpen(false);
    }
  };

  const filtered = liderados.filter((e) => {
    const matchSearch = e.nome.toLowerCase().includes(search.toLowerCase()) || e.bairro.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filterStatus || e.status === filterStatus;
    const matchOwner = isAdmin || e.origemId === user?.id;
    return matchSearch && matchFilter && matchOwner;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {!isOnline && (
          <div className="bg-warning/10 border border-warning/20 p-3 rounded-lg flex items-center gap-3 animate-pulse">
            <div className="h-2 w-2 rounded-full bg-warning animate-ping" />
            <p className="text-xs text-warning-foreground font-medium">Modo Offline: Seus cadastros serão salvos e sincronizados assim que a internet voltar.</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isAdmin ? "Eleitores" : "Meus Liderados"}
            </h1>
            <p className="text-sm text-muted-foreground">{filtered.length} pessoas encontradas</p>
          </div>
          
          <div className="flex gap-2">
            {!isAdmin && (
              <Button variant="outline" className="border-border hover:bg-muted" onClick={() => {
                toast.success("Gerando PDF com sua lista de liderados e QR Codes...");
                // Simulação de geração de PDF
              }}>
                <Download className="mr-2 h-4 w-4" /> Baixar Minha Lista (PDF)
              </Button>
            )}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-primary-foreground shadow-primary">
                  <Plus className="mr-2 h-4 w-4" /> Novo Liderado
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-border sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Liderado</DialogTitle>
                  <DialogDescription>Escolha o método de cadastro para a nova base.</DialogDescription>
                </DialogHeader>
                
                <div className="flex gap-2 p-1 bg-muted/50 rounded-lg mb-4">
                  <button onClick={() => setActiveTab("manual")} className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-all ${activeTab === 'manual' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                    <UserPlus className="h-3.5 w-3.5" /> Manual
                  </button>
                  <button onClick={() => setActiveTab("scan")} className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-all ${activeTab === 'scan' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                    <FileText className="h-3.5 w-3.5" /> Escanear Ficha
                  </button>
                </div>

                {activeTab === "manual" ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField control={form.control} name="nome" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Nome Completo</FormLabel>
                          <FormControl><Input placeholder="Ex: Maria Silva" {...field} className="bg-muted/30 border-border" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="telefone" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">WhatsApp / Celular</FormLabel>
                            <FormControl><Input placeholder="(00) 00000-0000" {...field} className="bg-muted/30 border-border" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="bairro" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Bairro</FormLabel>
                            <FormControl><Input placeholder="Ex: Centro" {...field} className="bg-muted/30 border-border" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="status" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Classificação Inicial</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-muted/30 border-border"><SelectValue placeholder="Selecione" /></SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-card border-border">
                              <SelectItem value="apoiador">Apoiador</SelectItem>
                              <SelectItem value="indeciso">Indeciso</SelectItem>
                              <SelectItem value="rejeicao">Rejeição</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" className="gradient-primary">Salvar Liderado</Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  <ScannerFicha />
                )}
              </DialogContent>
            </Dialog>
            <Button variant="outline" className="border-border hover:bg-muted"><Download className="mr-2 h-4 w-4" /> Exportar</Button>
          </div>
        </div>

        {/* List filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nome ou bairro..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-card border-border" />
          </div>
          <div className="flex gap-2">
            {[null, "apoiador", "indeciso", "rejeicao"].map((s) => (
              <button key={s ?? "all"} onClick={() => setFilterStatus(s)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${filterStatus === s ? "gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                {s ? statusConfig[s].label : "Todos"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase font-bold text-muted-foreground">
                <th className="px-5 py-3 text-left">Nome</th>
                <th className="px-5 py-3 text-left">Contato</th>
                <th className="px-5 py-3 text-left">Bairro</th>
                <th className="px-5 py-3 text-left">Status</th>
                {isAdmin && <th className="px-5 py-3 text-left text-primary">Responsável</th>}
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3.5 font-medium">{e.nome}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{e.telefone}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{e.bairro}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusConfig[e.status].className}`}>
                      {statusConfig[e.status].label}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                          {e.origemNome[0]}
                        </div>
                        <span className="text-xs">{e.origemNome}</span>
                      </div>
                    </td>
                  )}
                  <td className="px-5 py-3.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-card border-border">
                        <DropdownMenuLabel className="text-xs">Ações</DropdownMenuLabel>
                        <DropdownMenuItem className="text-xs cursor-pointer"><Eye className="mr-2 h-3 w-3" /> Ver Perfil</DropdownMenuItem>
                        {isAdmin && (
                          <>
                            <DropdownMenuSeparator className="bg-border" />
                            <DropdownMenuItem 
                              className="text-xs cursor-pointer text-primary"
                              onClick={() => { setSelectedLiderado(e); setIsTransferOpen(true); }}
                            >
                              <ArrowLeftRight className="mr-2 h-3 w-3" /> Transferir Líder
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Dialog */}
      <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
        <DialogContent className="glass-card border-border sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Transferir Liderado</DialogTitle>
            <DialogDescription>O liderado deixará de pertencer a <strong>{selectedLiderado?.origemNome}</strong>.</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-3 bg-muted/50 rounded-lg border border-border">
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Liderado Selecionado</p>
              <p className="text-sm font-medium">{selectedLiderado?.nome}</p>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium">Selecione o Novo Responsável</label>
              <Select onValueChange={setNovoLiderId}>
                <SelectTrigger className="bg-card border-border"><SelectValue placeholder="Escolha um líder" /></SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {lideres.map(l => (
                    <SelectItem key={l.id} value={l.id}>{l.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsTransferOpen(false)}>Cancelar</Button>
            <Button className="gradient-primary" onClick={handleTransfer} disabled={!novoLiderId}>Confirmar Transferência</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default Eleitores;