import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export interface Liderado {
  id: string;
  nome: string;
  cpf: string;
  dataNascimento: string;
  nomeMae: string;
  tituloEleitoral: string;
  secao: string;
  zona: string;
  temBiometria: boolean;
  municipio: string;
  uf: string;
  endereco: string;
  telefone: string;
  bairro: string;
  status: 'apoiador' | 'indeciso' | 'rejeicao';
  origemId: string;
  origemNome: string;
  data: string;
  sincronizado: boolean;
  probabilidadeReconquista?: number;
  historicoReconquista?: string[];
  proximoContato?: string;
}

export interface Notificacao {
  id: string;
  tipo: 'cadastro' | 'status' | 'transferencia' | 'combustivel';
  mensagem: string;
  data: string;
  liderNome: string;
  lideradoNome: string;
}

export interface RegistroCombustivel {
  id: string;
  liderId: string;
  liderNome: string;
  valor: number;
  kmAtual: number;
  kmAnterior: number;
  kmRodados: number;
  data: string;
}

interface LideradosState {
  liderados: Liderado[];
  notificacoes: Notificacao[];
  registrosCombustivel: RegistroCombustivel[];
  addLiderado: (liderado: Omit<Liderado, 'id' | 'sincronizado'>) => void;
  syncLiderados: () => void;
  transferLiderado: (id: string, novoLiderId: string, novoLiderNome: string) => void;
  updateStatus: (id: string, novoStatus: Liderado['status']) => void;
  agendarContato: (id: string, data: string) => void;
  addNotificacao: (notificacao: Omit<Notificacao, 'id' | 'data'>) => void;
  limparNotificacoes: () => void;
  registrarCombustivel: (liderId: string, liderNome: string, valor: number, kmAtual: number) => void;
}

export const useLideradosStore = create<LideradosState>()(
  persist(
    (set, get) => ({
      liderados: [
        { 
          id: '1', nome: "Maria Silva", cpf: "123.456.789-00", dataNascimento: "1985-05-20", nomeMae: "Lucia Silva", 
          tituloEleitoral: "1234567890", secao: "001", zona: "002", temBiometria: true, municipio: "Rio de Janeiro", 
          uf: "RJ", endereco: "Rua das Flores, 123", telefone: "(21) 99999-1234", bairro: "Centro", 
          status: "apoiador", origemId: "2", origemNome: "João Líder", data: "2024-03-15", sincronizado: true, probabilidadeReconquista: 95 
        },
        { 
          id: '2', nome: "Carlos Santos", cpf: "987.654.321-11", dataNascimento: "1990-10-10", nomeMae: "Ana Santos", 
          tituloEleitoral: "0987654321", secao: "010", zona: "005", temBiometria: false, municipio: "Rio de Janeiro", 
          uf: "RJ", endereco: "Av. Principal, 456", telefone: "(21) 99888-5678", bairro: "Jardim América", 
          status: "indeciso", origemId: "3", origemNome: "Ana Líder", data: "2024-03-14", sincronizado: true, probabilidadeReconquista: 65, 
          historicoReconquista: ["Tentativa 1: WhatsApp enviado em 20/04"] 
        },
      ],
      notificacoes: [],
      registrosCombustivel: [],
      addLiderado: (data) => {
        const { liderados } = get();
        
        // Deduplicação por telefone (limpa caracteres não numéricos)
        const phoneDigits = data.telefone.replace(/\D/g, "");
        const duplicate = liderados.find(l => l.telefone.replace(/\D/g, "") === phoneDigits);
        
        if (duplicate) {
          toast.error(`Eleitor já cadastrado: ${duplicate.nome} (${duplicate.origemNome})`);
          return;
        }

        const newId = Math.random().toString(36).substr(2, 9);
        const newLiderado: Liderado = {
          ...data,
          id: newId,
          sincronizado: navigator.onLine,
          probabilidadeReconquista: data.status === 'indeciso' ? 50 : (data.status === 'rejeicao' ? 20 : 100),
        };
        
        set((state) => ({ 
          liderados: [newLiderado, ...state.liderados],
          notificacoes: [
            {
              id: Math.random().toString(36).substr(2, 9),
              tipo: 'cadastro',
              mensagem: `Novo liderado ${data.nome} cadastrado.`,
              data: new Date().toISOString(),
              liderNome: data.origemNome,
              lideradoNome: data.nome
            },
            ...state.notificacoes
          ]
        }));
      },
      syncLiderados: () => {
        const { liderados } = get();
        const unsynced = liderados.filter(l => !l.sincronizado);
        if (unsynced.length > 0) {
          set((state) => ({
            liderados: state.liderados.map(l => ({ ...l, sincronizado: true }))
          }));
          toast.success(`${unsynced.length} cadastros sincronizados com sucesso!`);
        }
      },
      transferLiderado: (id, novoLiderId, novoLiderNome) => {
        const liderado = get().liderados.find(l => l.id === id);
        set((state) => ({
          liderados: state.liderados.map(l => 
            l.id === id ? { ...l, origemId: novoLiderId, origemNome: novoLiderNome } : l
          ),
          notificacoes: [
            {
              id: Math.random().toString(36).substr(2, 9),
              tipo: 'transferencia',
              mensagem: `${liderado?.nome} transferido para ${novoLiderNome}.`,
              data: new Date().toISOString(),
              liderNome: "Sistema",
              lideradoNome: liderado?.nome || ""
            },
            ...state.notificacoes
          ]
        }));
      },
      updateStatus: (id, novoStatus) => {
        const liderado = get().liderados.find(l => l.id === id);
        set((state) => ({
          liderados: state.liderados.map(l => 
            l.id === id ? { ...l, status: novoStatus } : l
          ),
          notificacoes: [
            {
              id: Math.random().toString(36).substr(2, 9),
              tipo: 'status',
              mensagem: `Status de ${liderado?.nome} alterado para ${novoStatus}.`,
              data: new Date().toISOString(),
              liderNome: liderado?.origemNome || "Sistema",
              lideradoNome: liderado?.nome || ""
            },
            ...state.notificacoes
          ]
        }));
      },
      agendarContato: (id, proximaData) => {
        set((state) => ({
          liderados: state.liderados.map(l => 
            l.id === id ? { ...l, proximoContato: proximaData } : l
          )
        }));
        toast.success("Abordagem agendada com sucesso!");
      },
      addNotificacao: (n) => set((state) => ({
        notificacoes: [{ ...n, id: Math.random().toString(36).substr(2, 9), data: new Date().toISOString() }, ...state.notificacoes]
      })),
      limparNotificacoes: () => set({ notificacoes: [] }),
      registrarCombustivel: (liderId, liderNome, valor, kmAtual) => {
        const { registrosCombustivel } = get();
        const ultimoRegistro = [...registrosCombustivel]
          .filter(r => r.liderId === liderId)
          .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];
        
        const kmAnterior = ultimoRegistro ? ultimoRegistro.kmAtual : kmAtual;
        const kmRodados = kmAtual - kmAnterior;

        const novoRegistro: RegistroCombustivel = {
          id: Math.random().toString(36).substr(2, 9),
          liderId,
          liderNome,
          valor,
          kmAtual,
          kmAnterior,
          kmRodados: kmRodados > 0 ? kmRodados : 0,
          data: new Date().toISOString(),
        };

        set((state) => ({
          registrosCombustivel: [novoRegistro, ...state.registrosCombustivel],
          notificacoes: [
            {
              id: Math.random().toString(36).substr(2, 9),
              tipo: 'combustivel',
              mensagem: `Ajuda de custo registrada para ${liderNome}: R$ ${valor}`,
              data: new Date().toISOString(),
              liderNome,
              lideradoNome: "N/A"
            },
            ...state.notificacoes
          ]
        }));
        toast.success("Ajuda de combustível registrada!");
      }
    }),
    {
      name: 'liderados-storage',
    }
  )
);