import { useState } from "react";
import { Brain, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuthStore } from "@/store/useAuthStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    // Mock login logic based on email
    if (email === "igor.souto@agencialapiscriativo.com.br" && password === "Ju45098601#") {
      setUser({ id: "1", nome: "Igor Souto", email, tipo: "admin" });
      toast.success("Bem-vindo, Administrador!");
      navigate("/");
    } else if (email === "admin@comando.ai") {
      setUser({ id: "1", nome: "Administrador", email, tipo: "admin" });
      toast.success("Bem-vindo, Administrador!");
      navigate("/");
    } else if (email === "lider@comando.ai") {
      setUser({ id: "2", nome: "João Líder", email, tipo: "lider" });
      toast.success("Bem-vindo, Líder!");
      navigate("/eleitores");
    } else {
      toast.error("Credenciais inválidas");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="glass-card rounded-2xl p-8">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-primary">
              <Brain className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Comando Eleitoral</h1>
            <p className="mt-1 text-sm text-gradient font-semibold">AI</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">E-mail</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="bg-secondary border-border"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Senha</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-secondary border-border pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground shadow-primary">
              Entrar
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Sistema de uso exclusivo da campanha
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
