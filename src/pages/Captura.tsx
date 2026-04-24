import { useState } from "react";
import { Copy, QrCode, Link as LinkIcon, UserPlus, Download, Printer } from "lucide-react";
import QRCode from "react-qr-code";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

const mockLinks = [
  { id: "1", usuario: "Administrador", codigo: "admin", cadastros: 0, conversoes: 0 },
  { id: "2", usuario: "João Líder", codigo: "joao-lider", cadastros: 142, conversoes: 98 },
  { id: "3", usuario: "Ana Líder", codigo: "ana-lider", cadastros: 89, conversoes: 61 },
];

const Captura = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.tipo === "admin";
  
  // Se for líder, ele só vê o seu próprio link
  const initialLink = isAdmin ? mockLinks[1].codigo : (user?.id === "2" ? "joao-lider" : "ana-lider");
  const [selectedLink, setSelectedLink] = useState(initialLink);
  const baseUrl = window.location.origin;

  const copyLink = (codigo: string) => {
    navigator.clipboard.writeText(`${baseUrl}/cadastro/${codigo}`);
    toast.success("Link copiado!");
  };

  const downloadQR = () => {
    toast.success("Baixando QR Code oficial...");
    // Simulação de download
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Captura de Eleitores</h1>
          <p className="text-sm text-muted-foreground">Links exclusivos e QR Codes para cada membro da equipe</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* QR Code preview */}
          <div className="glass-card flex flex-col items-center rounded-xl p-6 border-primary/20 border">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-primary">
              <QrCode className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-foreground">
              {isAdmin ? "QR Code Selecionado" : "Meu QR Code Exclusivo"}
            </h3>
            <p className="mb-4 text-xs text-muted-foreground">/cadastro/{selectedLink}</p>
            <div className="rounded-xl bg-white p-4 shadow-xl">
              <QRCode value={`${baseUrl}/cadastro/${selectedLink}`} size={180} />
            </div>
            <div className="grid grid-cols-2 gap-2 w-full mt-4">
              <Button
                onClick={() => copyLink(selectedLink)}
                className="gradient-primary text-primary-foreground shadow-primary text-xs"
              >
                <Copy className="mr-2 h-3.5 w-3.5" /> Link
              </Button>
              <Button
                onClick={downloadQR}
                variant="outline"
                className="border-border text-xs"
              >
                <Download className="mr-2 h-3.5 w-3.5" /> Salvar
              </Button>
            </div>
            {!isAdmin && (
              <p className="mt-4 text-[10px] text-center text-muted-foreground leading-relaxed">
                Mostre este QR Code para o eleitor ou envie o link. <br/> 
                Todos os cadastros serão vinculados a você automaticamente.
              </p>
            )}
          </div>

          {/* Links table */}
          {isAdmin && (
            <div className="glass-card col-span-2 rounded-xl p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Links da Equipe</h3>
                <Button size="sm" className="gradient-primary text-primary-foreground shadow-primary">
                  <UserPlus className="mr-2 h-3 w-3" /> Novo Link
                </Button>
              </div>
              <div className="space-y-3">
                {mockLinks.map((link) => (
                  <div
                    key={link.id}
                    onClick={() => setSelectedLink(link.codigo)}
                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all ${
                      selectedLink === link.codigo
                        ? "border-primary/50 gradient-glow"
                        : "border-border hover:border-border/80 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{link.usuario}</p>
                        <p className="text-xs text-muted-foreground">/cadastro/{link.codigo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-right">
                      <div>
                        <p className="text-sm font-bold text-foreground">{link.cadastros}</p>
                        <p className="text-[10px] text-muted-foreground">Liderados</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); copyLink(link.codigo); }}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Captura;
