import { useState } from "react";
import { Search, Filter, Download, Eye } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

const Eleitores = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filtered = mockEleitores.filter((e) => {
    const matchSearch = e.nome.toLowerCase().includes(search.toLowerCase()) || e.bairro.toLowerCase().includes(search.toLowerCase());
    const matchFilter = !filterStatus || e.status === filterStatus;
    return matchSearch && matchFilter;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Eleitores</h1>
            <p className="text-sm text-muted-foreground">{mockEleitores.length} eleitores cadastrados</p>
          </div>
          <Button className="gradient-primary text-primary-foreground shadow-primary">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
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
