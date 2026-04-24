import { useState, useRef } from "react";
import { Camera, FileText, Upload, CheckCircle2, Loader2, AlertCircle, History, XCircle, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Tesseract from "tesseract.js";
import { Badge } from "@/components/ui/badge";
import { useLideradosStore } from "@/store/useLideradosStore";
import { useAuthStore } from "@/store/useAuthStore";

interface ScanResult {
  id: string;
  nome: string;
  telefone: string;
  bairro: string;
  status: 'processando' | 'concluido' | 'falhou';
  data: string;
  originalImage?: string;
}

const ScannerFicha = () => {
  const { user } = useAuthStore();
  const { liderados, addLiderado } = useLideradosStore();
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<Partial<ScanResult> | null>(null);
  const [history, setHistory] = useState<ScanResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        processImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 11;
  };

  const processImage = async (imageSrc: string) => {
    setIsScanning(true);
    setProgress(0);
    setResult(null);

    const scanId = Math.random().toString(36).substr(2, 9);
    const newEntry: ScanResult = {
      id: scanId,
      nome: "Processando...",
      telefone: "",
      bairro: "",
      status: 'processando',
      data: new Date().toLocaleTimeString(),
      originalImage: imageSrc
    };
    
    setHistory(prev => [newEntry, ...prev]);

    try {
      const { data: { text } } = await Tesseract.recognize(
        imageSrc,
        'por',
        {
          logger: m => {
            if (m.status === 'recognizing text') setProgress(Math.floor(m.progress * 100));
          }
        }
      );

      const lines = text.split('\n');
      const extracted: Partial<ScanResult> = {
        nome: "",
        telefone: "",
        bairro: "",
      };

      // Regras de extração aprimoradas
      lines.forEach(line => {
        const cleanLine = line.trim();
        if (/nome/i.test(cleanLine)) extracted.nome = cleanLine.split(/[:\-_]/)[1]?.trim() || cleanLine.replace(/nome/i, "").trim();
        if (/(tel|cel|contato|fone)/i.test(cleanLine)) {
          const found = cleanLine.match(/(\(?\d{2}\)?\s?\d{4,5}-?\d{4})/);
          if (found) extracted.telefone = found[0];
        }
        if (/bairro/i.test(cleanLine)) extracted.bairro = cleanLine.split(/[:\-_]/)[1]?.trim() || cleanLine.replace(/bairro/i, "").trim();
      });

      setResult(extracted);
      setHistory(prev => prev.map(h => h.id === scanId ? { ...h, ...extracted as ScanResult, status: 'concluido' } : h));
      toast.success("Ficha processada!");
    } catch (error) {
      console.error(error);
      setHistory(prev => prev.map(h => h.id === scanId ? { ...h, status: 'falhou', nome: "Erro na leitura" } : h));
      toast.error("Erro ao processar imagem.");
    } finally {
      setIsScanning(false);
    }
  };

  const saveToCRM = (data: Partial<ScanResult>) => {
    if (!data.nome || !data.telefone) {
      toast.error("Nome e telefone são obrigatórios.");
      return;
    }

    addLiderado({
      nome: data.nome || "",
      telefone: data.telefone || "",
      bairro: data.bairro || "",
      status: "indeciso",
      origemId: user?.id || "unknown",
      origemNome: user?.nome || "Scanner",
      data: new Date().toISOString().split('T')[0],
    });

    setPreview(null);
    setResult(null);
  };

  const downloadTemplate = () => {
    // Simular download do modelo oficial
    toast.info("Baixando modelo oficial de ficha...");
    window.open("https://placehold.co/600x800/262626/white?text=MODELO+OFICIAL+COMANDO+ELEITORAL\n\nNOME:____________________\n\nCONTATO:_________________\n\nBAIRRO:__________________", "_blank");
  };

  return (
    <div className="space-y-4">
      <Card className="glass-card border-none overflow-hidden">
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Escaneamento de Ficha
            </CardTitle>
            <CardDescription>Extração inteligente de dados via OCR.</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="text-[10px] h-8" onClick={downloadTemplate}>
            <Printer className="h-3 w-3 mr-1" /> Modelo PDF
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {!preview ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors"
            >
              <Upload className="h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-xs font-medium text-foreground">Clique para enviar ficha</p>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-black/20">
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                {isScanning && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                    <p className="text-sm font-bold text-white">{progress}%</p>
                  </div>
                )}
              </div>
              
              {result && (
                <div className="bg-muted/50 rounded-lg p-3 space-y-3 animate-in fade-in slide-in-from-top-2 border border-border/50">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Nome</p>
                      <input 
                        className="w-full bg-transparent text-sm font-medium focus:outline-none border-b border-primary/20" 
                        value={result.nome} 
                        onChange={e => setResult({...result, nome: e.target.value})}
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Telefone</p>
                      <input 
                        className={`w-full bg-transparent text-sm focus:outline-none border-b ${validatePhone(result.telefone || "") ? 'border-primary/20' : 'border-destructive'}`}
                        value={result.telefone} 
                        onChange={e => setResult({...result, telefone: e.target.value})}
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">Bairro</p>
                      <input 
                        className="w-full bg-transparent text-sm focus:outline-none border-b border-primary/20" 
                        value={result.bairro} 
                        onChange={e => setResult({...result, bairro: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button size="sm" className="w-full gradient-primary text-xs" onClick={() => saveToCRM(result)}>
                    Confirmar e Salvar no CRM
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card className="glass-card border-none">
          <CardHeader className="py-3">
            <CardTitle className="text-xs flex items-center gap-2 text-muted-foreground">
              <History className="h-3.5 w-3.5" /> Histórico Recente
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 space-y-2">
            {history.map(item => (
              <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/30">
                <div className="flex flex-col">
                  <span className="text-xs font-medium truncate max-w-[120px]">{item.nome}</span>
                  <span className="text-[10px] text-muted-foreground">{item.data} • {item.bairro || 'Sem bairro'}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.status === 'processando' && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
                  {item.status === 'concluido' && <CheckCircle2 className="h-3 w-3 text-success" />}
                  {item.status === 'falhou' && <XCircle className="h-3 w-3 text-destructive" />}
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 uppercase">
                    {item.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScannerFicha;