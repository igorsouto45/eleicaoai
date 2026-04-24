import { useState, useEffect } from "react";
import { CheckCircle, Brain, Loader2, MapPin, User, Fingerprint, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useLideradosStore } from "@/store/useLideradosStore";

const bairros = ["Centro", "Jardim América", "Vila Nova", "Boa Vista", "São José", "Liberdade", "Santa Cruz", "Bela Vista"];

const CadastroPublico = () => {
  const { codigo } = useParams();
  const { addLiderado } = useLideradosStore();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({ 
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
    intencao: "" 
  });
  
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
    
    // Validação básica dos campos obrigatórios
    if (!form.nome || !form.cpf || !form.telefone || !form.bairro || !form.intencao || !form.nomeMae || !form.endereco) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    
    setLoading(true);
    
    // Mapear intenção para o status do CRM
    const statusMap: Record<string, 'apoiador' | 'indeciso' | 'rejeicao'> = {
      'sim': 'apoiador',
      'nao': 'rejeicao',
      'indeciso': 'indeciso'
    };

    // Simular nome do líder baseado no código
    const liderNome = codigo === "joao-lider" ? "João Líder" : (codigo === "ana-lider" ? "Ana Líder" : "Líder via QR");

    setTimeout(() => {
      addLiderado({
        nome: form.nome,
        cpf: form.cpf,
        dataNascimento: form.dataNascimento,
        nomeMae: form.nomeMae,
        tituloEleitoral: form.tituloEleitoral,
        secao: form.secao,
        zona: form.zona,
        temBiometria: form.temBiometria,
        municipio: form.municipio,
        uf: form.uf,
        endereco: form.endereco,
        telefone: form.telefone,
        bairro: form.bairro,
        status: statusMap[form.intencao],
        origemId: codigo || "qr-public",
        origemNome: liderNome,
        data: new Date().toISOString().split('T')[0],
      });

      setLoading(false);
      setSubmitted(true);
      toast.success(`Cadastro enviado com sucesso!`);
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

          <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
            {/* Seção: Identificação */}
            <div className="space-y-4">
              <p className="text-[10px] uppercase font-bold text-primary tracking-widest flex items-center gap-2">
                <User className="h-3 w-3" /> Identificação Pessoal
              </p>
              
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground uppercase">Nome Completo *</label>
                <Input
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  placeholder="Seu nome completo"
                  className="bg-secondary/50 border-border focus:ring-primary/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground uppercase">CPF *</label>
                  <Input
                    value={form.cpf}
                    onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                    className="bg-secondary/50 border-border"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground uppercase">Data de Nascimento *</label>
                  <Input
                    type="date"
                    value={form.dataNascimento}
                    onChange={(e) => setForm({ ...form, dataNascimento: e.target.value })}
                    className="bg-secondary/50 border-border"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground uppercase">Nome da Mãe *</label>
                <Input
                  value={form.nomeMae}
                  onChange={(e) => setForm({ ...form, nomeMae: e.target.value })}
                  placeholder="Nome completo da sua mãe"
                  className="bg-secondary/50 border-border"
                  required
                />
              </div>
            </div>

            {/* Seção: Eleitoral */}
            <div className="space-y-4 pt-2 border-t border-border/50">
              <p className="text-[10px] uppercase font-bold text-primary tracking-widest flex items-center gap-2">
                <FileText className="h-3 w-3" /> Informações Eleitorais
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground uppercase">Título de Eleitor</label>
                  <Input
                    value={form.tituloEleitoral}
                    onChange={(e) => setForm({ ...form, tituloEleitoral: e.target.value })}
                    placeholder="Nº do Título"
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground uppercase">Zona</label>
                  <Input
                    value={form.zona}
                    onChange={(e) => setForm({ ...form, zona: e.target.value })}
                    placeholder="000"
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground uppercase">Seção</label>
                  <Input
                    value={form.secao}
                    onChange={(e) => setForm({ ...form, secao: e.target.value })}
                    placeholder="000"
                    className="bg-secondary/50 border-border"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold text-muted-foreground uppercase">Tem Biometria Cadastrada?</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, temBiometria: true })}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${form.temBiometria ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-secondary/50 border-border text-muted-foreground hover:bg-muted'}`}
                  >
                    Sim
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, temBiometria: false })}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${!form.temBiometria ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-secondary/50 border-border text-muted-foreground hover:bg-muted'}`}
                  >
                    Não
                  </button>
                </div>
              </div>
            </div>

            {/* Seção: Localização */}
            <div className="space-y-4 pt-2 border-t border-border/50">
              <p className="text-[10px] uppercase font-bold text-primary tracking-widest flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Endereço e Contato
              </p>
              
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground uppercase">Endereço Completo *</label>
                <Input
                  value={form.endereco}
                  onChange={(e) => setForm({ ...form, endereco: e.target.value })}
                  placeholder="Rua, número, complemento"
                  className="bg-secondary/50 border-border"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground uppercase">Bairro *</label>
                  <Input
                    value={form.bairro}
                    onChange={(e) => handleBairroChange(e.target.value)}
                    placeholder="Ex: Centro"
                    className="bg-secondary/50 border-border"
                    required
                  />
                  {bairroSuggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-lg max-h-40 overflow-y-auto">
                      {bairroSuggestions.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => { setForm({ ...form, bairro: b }); setBairroSuggestions([]); }}
                          className="w-full px-4 py-2 text-left text-xs text-foreground hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg border-b border-border/50 last:border-0"
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground uppercase">WhatsApp *</label>
                  <Input
                    value={form.telefone}
                    onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="bg-secondary/50 border-border"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Intenção de Voto */}
            <div className="pt-2 border-t border-border/50">
              <label className="mb-3 block text-[11px] font-bold text-primary uppercase text-center tracking-widest">
                Pesquisa de Intenção de Voto
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { value: "sim", label: "✅ Sim, pretendo votar", activeClass: "border-[hsl(var(--success))] bg-[hsl(var(--success)/0.15)] text-[hsl(var(--success))]" },
                  { value: "nao", label: "❌ Não pretendo votar", activeClass: "border-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))]" },
                  { value: "indeciso", label: "🤔 Ainda estou avaliando", activeClass: "border-[hsl(var(--warning))] bg-[hsl(var(--warning)/0.15)] text-[hsl(var(--warning))]" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, intencao: opt.value })}
                    className={`rounded-xl border p-3 text-left text-xs font-bold transition-all flex items-center justify-between ${
                      form.intencao === opt.value
                        ? opt.activeClass
                        : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {opt.label}
                    {form.intencao === opt.value && <CheckCircle className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 text-sm font-bold gradient-primary text-primary-foreground shadow-xl shadow-primary/20 mt-4 rounded-xl"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
              {loading ? "PROCESSANDO..." : "CONCLUIR MEU CADASTRO"}
            </Button>
            
            <p className="text-[10px] text-center text-muted-foreground italic px-4">
              Ao clicar em concluir, você concorda em compartilhar seus dados para fins de mobilização da campanha.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroPublico;
