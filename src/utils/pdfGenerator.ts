import jsPDF from "jspdf";

export const gerarFichaPDF = (dados?: any) => {
  const doc = new jsPDF();
  const margin = 20;
  let yPos = 30;

  // Cabeçalho
  doc.setFontSize(22);
  doc.setTextColor(108, 43, 217); // Roxo #6C2BD9
  doc.text("COMANDO ELEITORAL AI", margin, yPos);
  
  yPos += 10;
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text("FICHA DE CADASTRO OFICIAL", margin, yPos);
  
  yPos += 15;
  doc.setDrawColor(200);
  doc.line(margin, yPos, 190, yPos);
  
  yPos += 15;
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("DADOS DO ELEITOR", margin, yPos);

  const drawField = (label: string, value: string, x: number, y: number, width: number = 80) => {
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text(label.toUpperCase(), x, y);
    
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(value || "___________________________", x, y + 7);
    
    doc.setDrawColor(230);
    doc.line(x, y + 9, x + width, y + 9);
  };

  yPos += 15;
  drawField("Nome Completo", dados?.nome || "", margin, yPos, 170);
  
  yPos += 20;
  drawField("CPF", dados?.cpf || "", margin, yPos, 80);
  drawField("Data de Nascimento", dados?.dataNascimento || "", margin + 90, yPos, 80);
  
  yPos += 20;
  drawField("Nome da Mãe", dados?.nomeMae || "", margin, yPos, 170);
  
  yPos += 20;
  drawField("Título de Eleitor", dados?.tituloEleitoral || "", margin, yPos, 60);
  drawField("Zona", dados?.zona || "", margin + 70, yPos, 45);
  drawField("Seção", dados?.secao || "", margin + 125, yPos, 45);
  
  yPos += 20;
  drawField("WhatsApp / Telefone", dados?.telefone || "", margin, yPos, 80);
  drawField("Bairro", dados?.bairro || "", margin + 90, yPos, 80);
  
  yPos += 20;
  drawField("Município", dados?.municipio || "", margin, yPos, 80);
  drawField("UF", dados?.uf || "", margin + 90, yPos, 20);
  drawField("Biometria", dados?.temBiometria ? "SIM" : (dados ? "NÃO" : ""), margin + 120, yPos, 50);
  
  yPos += 20;
  drawField("Endereço Completo", dados?.endereco || "", margin, yPos, 170);

  yPos += 30;
  doc.setFontSize(10);
  doc.text("Assinatura do Eleitor: __________________________________________________", margin, yPos);

  // Rodapé
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("Gerado por Comando Eleitoral AI - Sistema de Gestão Estratégica", margin, 285);

  doc.save(`ficha_${dados?.nome || "modelo"}.pdf`);
};