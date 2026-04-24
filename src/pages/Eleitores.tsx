import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Filter, Download, Eye, Plus, UserPlus, QrCode, FileText, ArrowLeftRight, MoreHorizontal, User, Fingerprint, MapPin, Printer } from "lucide-react";
import { gerarFichaPDF } from "@/utils/pdfGenerator";
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
  cpf: z.string().min(11, "CPF inválido"),
  dataNascimento: z.string().min(10, "Data inválida"),
  nomeMae: z.string().min(2, "Nome da mãe é obrigatório"),
  tituloEleitoral: z.string().min(2, "Título é obrigatório"),
  secao: z.string().min(1, "Seção é obrigatória"),
  zona: z.string().min(1, "Zona é obrigatória"),
  temBiometria: z.boolean(),
  municipio: z.string().min(2, "Município é obrigatório"),
  uf: z.string().length(2, "UF deve ter 2 caracteres"),
  endereco: z.string().min(5, "Endereço é obrigatório"),
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
  { id: "1", nome: "Igor Souto" },
];

const Eleitores = () => {
  const { user } = useAuthStore();
  const { liderados, addLiderado, transferLiderado, syncLiderados } = useLideradosStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isCrmOpen, setIsCrmOpen] = useState(false);
  const [selectedLiderado, setSelectedLiderado] = useState<any>(null);
  const [novoLiderId, setNovoLiderId] = useState("");
  const [activeTab, setActiveTab] = useState<"manual" | "scan">("manual");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Novos filtros
  const [filterBiometria, setFilterBiometria] = useState<string>("todos");
  const [filterBairroManual, setFilterBairroManual] = useState<string>("todos");

  const isAdmin = user?.tipo === "admin";
  
  const bairrosDisponiveis = useMemo(() => {
    return Array.from(new Set(liderados.map(l => l.bairro))).sort();
  }, [liderados]);

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
      cpf: "",
      dataNascimento: "",
      nomeMae: "",
      tituloEleitoral: "",
      secao: "",
      zona: "",
      temBiometria: false,
      municipio: "Rio de Janeiro",
      uf: "RJ",
      endereco: "",
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
    const todosLideres = Array.from(new Set(liderados.map(l => ({ id: l.origemId, nome: l.origemNome }))));
    const uniqueLideres = Array.from(new Map([...lideres, ...todosLideres].map(item => [item.id, item])).values());
    const lider = uniqueLideres.find(l => l.id === novoLiderId);
    if (lider && selectedLiderado) {
      transferLiderado(selectedLiderado.id, lider.id, (lider as any).nome);
      toast.success(`Transferência realizada para ${(lider as any).nome}`);
      setIsTransferOpen(false);
    }
  };

  const filtered = liderados.filter((e) => {
    const searchLower = search.toLowerCase();
    const matchSearch = 
      e.nome.toLowerCase().includes(searchLower) || 
      e.bairro.toLowerCase().includes(searchLower) ||
      (e.cpf && e.cpf.replace(/\D/g, "").includes(searchLower.replace(/\D/g, ""))) ||
      e.telefone.replace(/\D/g, "").includes(searchLower.replace(/\D/g, ""));

    const matchFilter = !filterStatus || e.status === filterStatus;
    const matchBiometria = filterBiometria === "todos" ? true : (filterBiometria === "sim" ? e.temBiometria : !e.temBiometria);
    const matchBairro = filterBairroManual === "todos" ? true : e.bairro === filterBairroManual;
    const matchOwner = isAdmin || e.origemId === user?.id;
    
    return matchSearch && matchFilter && matchBiometria && matchBairro && matchOwner;
  });

  const canEdit = useCallback((liderado: any) => {
    return isAdmin || liderado.origemId === user?.id;
  }, [isAdmin, user?.id]);

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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                      <FormField control={form.control} name="nome" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Nome Completo</FormLabel>
                          <FormControl><Input placeholder="Ex: Maria Silva" {...field} className="bg-muted/30 border-border" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="cpf" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">CPF</FormLabel>
                            <FormControl><Input placeholder="000.000.000-00" {...field} className="bg-muted/30 border-border" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="dataNascimento" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Data de Nascimento</FormLabel>
                            <FormControl><Input type="date" {...field} className="bg-muted/30 border-border" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <FormField control={form.control} name="nomeMae" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Nome da Mãe</FormLabel>
                          <FormControl><Input placeholder="Nome completo da mãe" {...field} className="bg-muted/30 border-border" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <div className="grid grid-cols-3 gap-4">
                        <FormField control={form.control} name="tituloEleitoral" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Título</FormLabel>
                            <FormControl><Input placeholder="Nº do Título" {...field} className="bg-muted/30 border-border" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="secao" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Seção</FormLabel>
                            <FormControl><Input placeholder="000" {...field} className="bg-muted/30 border-border" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="zona" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Zona</FormLabel>
                            <FormControl><Input placeholder="000" {...field} className="bg-muted/30 border-border" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="municipio" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Município</FormLabel>
                            <FormControl><Input placeholder="Ex: Rio de Janeiro" {...field} className="bg-muted/30 border-border" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="uf" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">UF</FormLabel>
                            <FormControl><Input placeholder="RJ" {...field} maxLength={2} className="bg-muted/30 border-border" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <FormField control={form.control} name="endereco" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Endereço Completo</FormLabel>
                          <FormControl><Input placeholder="Rua, número, complemento" {...field} className="bg-muted/30 border-border" /></FormControl>
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

                      <div className="grid grid-cols-2 gap-4">
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
                        <FormField control={form.control} name="temBiometria" render={({ field }) => (
                          <FormItem className="flex flex-col justify-end pb-2">
                            <FormLabel className="text-xs mb-2">Tem Biometria?</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Button 
                                  type="button" 
                                  variant={field.value ? "default" : "outline"} 
                                  className="h-8 flex-1 text-xs" 
                                  onClick={() => field.onChange(true)}
                                >Sim</Button>
                                <Button 
                                  type="button" 
                                  variant={!field.value ? "default" : "outline"} 
                                  className="h-8 flex-1 text-xs" 
                                  onClick={() => field.onChange(false)}
                                >Não</Button>
                              </div>
                            </FormControl>
                          </FormItem>
                        )} />
                      </div>
                      
                      <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
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
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Buscar por nome, bairro, CPF ou WhatsApp..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-card border-border h-10 shadow-sm" />
          </div>
          
          <div className="flex gap-2 bg-muted/30 p-1 rounded-lg border border-border">
            {[null, "apoiador", "indeciso", "rejeicao"].map((s) => (
              <button key={s ?? "all"} onClick={() => setFilterStatus(s)} className={`rounded-md px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${filterStatus === s ? "gradient-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {s ? statusConfig[s].label : "Todos"}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Fingerprint className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <select 
                value={filterBiometria} 
                onChange={(e) => setFilterBiometria(e.target.value)}
                className="pl-8 pr-4 h-9 text-xs bg-card border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary appearance-none min-w-[120px]"
              >
                <option value="todos">Biometria: Todas</option>
                <option value="sim">Com Biometria</option>
                <option value="nao">Sem Biometria</option>
              </select>
            </div>

            <div className="relative">
              <MapPin className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <select 
                value={filterBairroManual} 
                onChange={(e) => setFilterBairroManual(e.target.value)}
                className="pl-8 pr-4 h-9 text-xs bg-card border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary appearance-none min-w-[120px]"
              >
                <option value="todos">Todos Bairros</option>
                {bairrosDisponiveis.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((e) => (
            <div key={e.id} className="glass-card p-5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors" />
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                    {e.nome.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground leading-none mb-1">{e.nome}</h3>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{e.bairro}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-tighter ${statusConfig[e.status].className}`}>
                    {statusConfig[e.status].label}
                  </span>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-white/10"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card border-border shadow-2xl">
                      <DropdownMenuLabel className="text-xs">Ações</DropdownMenuLabel>
                      <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => { setSelectedLiderado(e); setIsCrmOpen(true); }}>
                        <Eye className="mr-2 h-3 w-3" /> Ver Perfil Completo
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => gerarFichaPDF(e)}>
                        <Printer className="mr-2 h-3 w-3" /> Imprimir Ficha
                      </DropdownMenuItem>
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
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold mb-0.5">CPF</p>
                    <p className="text-xs text-foreground font-medium">{e.cpf || "---"}</p>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold mb-0.5">WhatsApp</p>
                    <p className="text-xs text-foreground font-medium">{e.telefone}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold mb-0.5">Título</p>
                    <p className="text-xs text-foreground font-medium truncate">{e.tituloEleitoral || "---"}</p>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5 text-center">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold mb-0.5">Zona</p>
                    <p className="text-xs text-foreground font-medium">{e.zona || "---"}</p>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg border border-white/5 text-center">
                    <p className="text-[9px] text-muted-foreground uppercase font-bold mb-0.5">Seção</p>
                    <p className="text-xs text-foreground font-medium">{e.secao || "---"}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">
                    {e.origemNome.charAt(0)}
                  </div>
                  <span className="text-[10px] text-muted-foreground italic truncate max-w-[100px]">
                    Cadastrado por {isAdmin ? e.origemNome : "você"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {e.temBiometria ? (
                    <Badge variant="outline" className="h-4 px-1.5 text-[8px] bg-success/10 text-success border-success/20 uppercase">Biometria OK</Badge>
                  ) : (
                    <Badge variant="outline" className="h-4 px-1.5 text-[8px] bg-muted text-muted-foreground uppercase">Sem Biometria</Badge>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full py-20 text-center glass-card rounded-2xl border-dashed border-2 border-white/10">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground">Nenhum liderado encontrado.</p>
            </div>
          )}
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
                  {(() => {
                    const todosLideres = Array.from(new Set(liderados.map(l => ({ id: l.origemId, nome: l.origemNome }))));
                    const uniqueLideres = Array.from(new Map([...lideres, ...todosLideres].map(item => [item.id, item])).values());
                    return uniqueLideres.map(l => (
                      <SelectItem key={l.id} value={l.id}>{l.nome}</SelectItem>
                    ));
                  })()}
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

      {/* CRM Profile Dialog */}
      <Dialog open={isCrmOpen} onOpenChange={setIsCrmOpen}>
        <DialogContent className="glass-card border-border sm:max-w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Perfil do Liderado: {selectedLiderado?.nome}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Informação Básica</p>
                <p className="text-sm"><strong>CPF:</strong> {selectedLiderado?.cpf}</p>
                <p className="text-sm"><strong>Nascimento:</strong> {selectedLiderado?.dataNascimento}</p>
                <p className="text-sm"><strong>Mãe:</strong> {selectedLiderado?.nomeMae}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Localização</p>
                <p className="text-sm"><strong>Bairro:</strong> {selectedLiderado?.bairro}</p>
                <p className="text-sm"><strong>Município:</strong> {selectedLiderado?.municipio} / {selectedLiderado?.uf}</p>
                <p className="text-sm text-muted-foreground truncate" title={selectedLiderado?.endereco}>{selectedLiderado?.endereco}</p>
              </div>
            </div>

            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-[10px] text-primary uppercase font-bold mb-2">Situação Eleitoral</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold">{selectedLiderado?.tituloEleitoral || "---"}</p>
                  <p className="text-[9px] text-muted-foreground uppercase">Título</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{selectedLiderado?.zona || "---"}</p>
                  <p className="text-[9px] text-muted-foreground uppercase">Zona</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{selectedLiderado?.secao || "---"}</p>
                  <p className="text-[9px] text-muted-foreground uppercase">Seção</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Histórico e Interações</p>
              <div className="space-y-2">
                <div className="p-3 bg-muted/30 rounded-lg border border-border flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-success mt-1.5" />
                  <div>
                    <p className="text-xs font-medium">Cadastro realizado via {selectedLiderado?.origemNome}</p>
                    <p className="text-[10px] text-muted-foreground">Em {selectedLiderado?.data}</p>
                  </div>
                </div>
                {selectedLiderado?.historicoReconquista?.map((h: string, i: number) => (
                  <div key={i} className="p-3 bg-muted/30 rounded-lg border border-border flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                    <p className="text-xs">{h}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => gerarFichaPDF(selectedLiderado)}>
              <Printer className="h-4 w-4 mr-2" /> Imprimir Ficha
            </Button>
            <Button className="gradient-primary" onClick={() => setIsCrmOpen(false)}>Fechar Perfil</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};
export default Eleitores;