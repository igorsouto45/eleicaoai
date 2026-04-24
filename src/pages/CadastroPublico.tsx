import { useState, useEffect } from "react";
import { CheckCircle, Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

const bairros = ["Centro", "Jardim América", "Vila Nova", "Boa Vista", "São José", "Liberdade", "Santa Cruz", "Bela Vista"];

const CadastroPublico = () => {
  const { codigo } = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nome: "", telefone: "", bairro: "", intencao: "" });
  const [bairroSuggestions, setBairroSuggestions] = useState<string[]>([]);

  const handleBairroChange = (val: string) => {
    setForm({ ...form, bairro: val });
    if (val.length > 0) {
      setBairroSuggestions(bairros.filter((b) => b.toLowerCase().includes(val.toLowerCase())));
    } else {
      setBairroSuggestions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.telefone || !form.bairro || !form.intencao) {
      toast.error("Preencha todos os campos");
      return;
    }
    
    setLoading(true);
    // Simular registro com o código do líder
    console.log("Cadastrando eleitor via líder:", codigo, form);
    
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success(`Cadastro vinculado ao líder: ${codigo}`);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full gradient-primary shadow-primary">
            <CheckCircle className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Cadastro Realizado!</h1>
          <p className="text-muted-foreground">Obrigado por participar. Sua opinião é muito importante para nós.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary shadow-primary">
              <Brain className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Cadastro Eleitoral</h1>
            <p className="mt-1 text-sm text-muted-foreground">Participe e faça sua voz ser ouvida</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Nome Completo</label>
              <Input
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Seu nome"
                className="bg-secondary border-border"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Telefone</label>
              <Input
                value={form.telefone}
                onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                placeholder="(00) 00000-0000"
                className="bg-secondary border-border"
              />
            </div>

            <div className="relative">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Bairro</label>
              <Input
                value={form.bairro}
                onChange={(e) => handleBairroChange(e.target.value)}
                placeholder="Digite seu bairro"
                className="bg-secondary border-border"
              />
              {bairroSuggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
                  {bairroSuggestions.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => { setForm({ ...form, bairro: b }); setBairroSuggestions([]); }}
                      className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium text-muted-foreground">
                Você pretende votar no candidato?
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "sim", label: "✅ Sim", activeClass: "border-[hsl(var(--success))] bg-[hsl(var(--success)/0.1)]" },
                  { value: "nao", label: "❌ Não", activeClass: "border-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.1)]" },
                  { value: "indeciso", label: "🤔 Não sei", activeClass: "border-[hsl(var(--warning))] bg-[hsl(var(--warning)/0.1)]" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, intencao: opt.value })}
                    className={`rounded-lg border p-3 text-center text-sm font-medium transition-all ${
                      form.intencao === opt.value
                        ? opt.activeClass
                        : "border-border bg-secondary text-muted-foreground hover:border-border/80"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full gradient-primary text-primary-foreground shadow-primary mt-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {loading ? "Processando..." : "Enviar Cadastro"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroPublico;
