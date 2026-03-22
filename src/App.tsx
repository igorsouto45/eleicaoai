import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "./pages/Dashboard";
import Eleitores from "./pages/Eleitores";
import Captura from "./pages/Captura";
import CadastroPublico from "./pages/CadastroPublico";
import Login from "./pages/Login";
import Liderancas from "./pages/Liderancas";
import Reconquista from "./pages/Reconquista";
import Alertas from "./pages/Alertas";
import Prioridades from "./pages/Prioridades";
import MapaEstrategico from "./pages/MapaEstrategico";
import IaWhatsapp from "./pages/IaWhatsapp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/eleitores" element={<Eleitores />} />
          <Route path="/captura" element={<Captura />} />
          <Route path="/cadastro/:codigo" element={<CadastroPublico />} />
          <Route path="/login" element={<Login />} />
          <Route path="/liderancas" element={<Liderancas />} />
          <Route path="/reconquista" element={<Reconquista />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/prioridades" element={<Prioridades />} />
          <Route path="/mapa" element={<MapaEstrategico />} />
          <Route path="/ia-whatsapp" element={<IaWhatsapp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
