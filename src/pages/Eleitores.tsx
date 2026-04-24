import { useState } from "react";
import { Search, Filter, Download, Eye, Plus, UserPlus, QrCode, FileText } from "lucide-react";
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
  DialogDescription
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import ScannerFicha from "@/components/ScannerFicha";

const formSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  telefone: z.string().min(10, "Telefone inválido"),
  bairro: z.string().min(2, "Bairro é obrigatório"),
  status: z.string(),
});

const mockEleitores = [
  { id: 1, nome: "Maria Silva", telefone: "(11) 99999-1234", bairro: "Centro", status: "apoiador", origem: "João (Líder)", data: "2024-03-15" },
  { id: 2, nome: "Carlos Santos", telefone: "(11) 99888-5678", bairro: "Jardim América", status: "indeciso", origem: "Ana (Líder)", data: "2024-03-14" },
  { id: 3, nome: "Fernanda Oliveira", telefone: "(11) 97777-9012", bairro: "Vila Nova", status: "rejeicao", origem: "Pedro (Operador)", data: "2024-03-14" },
  { id: 4, nome: "Roberto Lima", telefone: "(11) 96666-3456", bairro: "Boa Vista", status: "apoiador", origem: "João (Líder)", data: "2024-03-13" },
  { id: 5, nome: "Ana Costa", telefone: "(11) 95555-7890", bairro: "São José", status: "indeciso", origem: "Maria (Operador)", data: "2024-03-13" },
  { id: 6, nome: "Paulo Mendes", telefone: "(11) 94444-2345", bairro: "Centro", status: "apoiador", origem: "Ana (Líder)", data: "2024-03-12" },
  { id: 7, nome: "Lucia Ferreira", telefone: "(11) 93333-6789", bairro: "Jardim América", status: "apoiador", origem: "João (Líder)", data: "2024-03-12" },
  { id: 8, nome: "Marcos Souza", telefone: "(11) 92222-0123", bairro: "Vila Nova", status: "indeciso", origem: "Pedro (Operador)", data: "2024-03-11" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  apoiador: { label: "Apoiador", className: "bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))] border-[hsl(var(--success)/0.3)]" },
  indeciso: { label: "Indeciso", className: "bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))] border-[hsl(var(--warning)/0.3)]" },
  rejeicao: { label: "Rejeição", className: "bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))] border-[hsl(var(--destructive)/0.3)]" },
};

import { useAuthStore } from "@/store/useAuthStore";

const Eleitores = () => {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"manual" | "scan">("manual");

  const isAdmin = user?.tipo === "admin";

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
    console.log(values);
    toast.success("Eleitor cadastrado com sucesso!");
    setIsModalOpen(false);
    form.reset();
  }

  // Se for líder, filtra apenas os seus (mock logic)
  const filtered = mockEleitores.filter((e) => {
    const matchSearch = e.nome.toLowerCase().includes(search.toLowerCase()) || e.bairro.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filterStatus || e.status === filterStatus;
    const matchOwner = isAdmin || e.origem.includes(user?.nome || "");
    return matchSearch && matchFilter && matchOwner;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isAdmin ? "Eleitores" : "Meus Liderados"}
            </h1>
            <p className="text-sm text-muted-foreground">{filtered.length} pessoas encontradas</p>
          </div>
          
          <div className="flex gap-2">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-primary-foreground shadow-primary">
                  <Plus className="mr-2 h-4 w-4" /> Novo Liderado
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card border-border sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Liderado</DialogTitle>
                  <DialogDescription>
                    Escolha o método de cadastro para a nova base.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex gap-2 p-1 bg-muted/50 rounded-lg mb-4">
                  <button 
                    onClick={() => setActiveTab("manual")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-all ${activeTab === 'manual' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <UserPlus className="h-3.5 w-3.5" /> Manual
                  </button>
                  <button 
                    onClick={() => setActiveTab("scan")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-all ${activeTab === 'scan' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <FileText className="h-3.5 w-3.5" /> Escanear Ficha
                  </button>
                </div>

                {activeTab === "manual" ? (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Nome Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Maria Silva" {...field} className="bg-muted/30 border-border" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="telefone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">WhatsApp / Celular</FormLabel>
                              <FormControl>
                                <Input placeholder="(00) 00000-0000" {...field} className="bg-muted/30 border-border" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="bairro"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Bairro</FormLabel>
                              <FormControl>
                                <Input placeholder="Ex: Centro" {...field} className="bg-muted/30 border-border" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Classificação Inicial</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-muted/30 border-border">
                                  <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-card border-border">
                                <SelectItem value="apoiador">Apoiador</SelectItem>
                                <SelectItem value="indeciso">Indeciso</SelectItem>
                                <SelectItem value="rejeicao">Rejeição</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
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
            
            <Button variant="outline" className="border-border hover:bg-muted">
              <Download className="mr-2 h-4 w-4" /> Exportar
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou bairro..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>
          <div className="flex gap-2">
            {[null, "apoiador", "indeciso", "rejeicao"].map((s) => (
              <button
                key={s ?? "all"}
                onClick={() => setFilterStatus(s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  filterStatus === s
                    ? "gradient-primary text-primary-foreground shadow-primary"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {s ? statusConfig[s].label : "Todos"}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden rounded-xl">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nome</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Telefone</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bairro</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Origem</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Data</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3.5 text-sm font-medium text-foreground">{e.nome}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{e.telefone}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{e.bairro}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${statusConfig[e.status].className}`}>
                      {statusConfig[e.status].label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{e.origem}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{e.data}</td>
                  <td className="px-5 py-3.5">
                    <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default Eleitores;
