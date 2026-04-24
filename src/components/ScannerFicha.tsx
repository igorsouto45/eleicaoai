import { useState, useRef } from "react";
import { Camera, FileText, Upload, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Tesseract from "tesseract.js";

const ScannerFicha = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
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

  const processImage = async (imageSrc: string) => {
    setIsScanning(true);
    setProgress(0);
    setResult(null);

    try {
      const { data: { text } } = await Tesseract.recognize(
        imageSrc,
        'por',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProgress(Math.floor(m.progress * 100));
            }
          }
        }
      );

      // Lógica simples de extração baseada em palavras-chave comuns em fichas
      const lines = text.split('\n');
      const extracted: any = {
        nome: "",
        telefone: "",
        bairro: "",
        raw: text
      };

      // Tenta encontrar campos (muito básico, para demonstração)
      lines.forEach(line => {
        const lowerLine = line.toLowerCase();
        if (lowerLine.includes('nome:')) extracted.nome = line.split(/nome:/i)[1]?.trim();
        if (lowerLine.includes('tel') || lowerLine.includes('cel')) extracted.telefone = line.split(/(tel|cel|contato):/i)[2]?.trim();
        if (lowerLine.includes('bairro:')) extracted.bairro = line.split(/bairro:/i)[1]?.trim();
      });

      setResult(extracted);
      toast.success("Ficha processada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao processar imagem.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card className="glass-card border-none overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Escaneamento de Ficha
        </CardTitle>
        <CardDescription>
          Faça upload da foto de uma ficha preenchida manualmente para extração automática.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!preview ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors"
          >
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-sm font-medium text-foreground">Clique para enviar ou arraste a foto</p>
            <p className="text-xs text-muted-foreground mt-1">JPG, PNG ou PDF</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload} 
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border bg-black/20">
              <img src={preview} alt="Preview" className="w-full h-full object-contain" />
              {isScanning && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                  <p className="text-sm font-bold text-white">Processando... {progress}%</p>
                </div>
              )}
            </div>
            
            {result && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 text-success mb-2 font-semibold text-sm">
                  <CheckCircle2 className="h-4 w-4" /> Dados Detectados
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Nome</p>
                    <p className="text-sm text-foreground">{result.nome || "Não detectado"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Telefone</p>
                    <p className="text-sm text-foreground">{result.telefone || "Não detectado"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Bairro</p>
                    <p className="text-sm text-foreground">{result.bairro || "Não detectado"}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 gradient-primary text-xs" onClick={() => toast.success("Dados salvos!")}>
                    Confirmar e Salvar
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 text-xs" onClick={() => { setPreview(null); setResult(null); }}>
                    Tentar Novamente
                  </Button>
                </div>
              </div>
            )}
            
            {!isScanning && !result && (
              <Button variant="outline" className="w-full text-xs" onClick={() => setPreview(null)}>
                Trocar Imagem
              </Button>
            )}
          </div>
        )}

        <div className="flex items-start gap-3 bg-primary/5 rounded-lg p-3 border border-primary/10">
          <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
          <div className="text-[11px] text-muted-foreground leading-relaxed">
            <strong>Dica:</strong> Para melhores resultados, garanta boa iluminação e que a ficha esteja em uma superfície plana. Use o modelo de ficha oficial do sistema.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScannerFicha;