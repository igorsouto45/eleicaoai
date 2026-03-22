import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Map,
  Trophy,
  AlertTriangle,
  Bell,
  Brain,
  Target,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Painel de Guerra", icon: LayoutDashboard, path: "/" },
  { label: "Eleitores", icon: Users, path: "/eleitores" },
  { label: "Captura", icon: UserPlus, path: "/captura" },
  { label: "Reconquista", icon: Target, path: "/reconquista" },
  { label: "Mapa Estratégico", icon: Map, path: "/mapa" },
  { label: "Lideranças", icon: Trophy, path: "/liderancas" },
  { label: "Prioridades", icon: AlertTriangle, path: "/prioridades" },
  { label: "Alertas", icon: Bell, path: "/alertas" },
  { label: "IA WhatsApp", icon: Brain, path: "/ia-whatsapp" },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary shadow-primary">
          <Brain className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-foreground">Comando</h1>
          <p className="text-xs font-medium text-gradient">Eleitoral AI</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "gradient-primary text-primary-foreground shadow-primary"
                  : "text-sidebar-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3 space-y-1">
        <Link
          to="/configuracoes"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <Settings className="h-4 w-4" />
          Configurações
        </Link>
        <Link
          to="/login"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Link>
      </div>
    </aside>
  );
};

export default AppSidebar;
