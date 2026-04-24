import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export interface Liderado {
  id: string;
  nome: string;
  telefone: string;
  bairro: string;
  status: 'apoiador' | 'indeciso' | 'rejeicao';
  origemId: string;
  origemNome: string;
  data: string;
  sincronizado: boolean;
  probabilidadeReconquista?: number;
  historicoReconquista?: string[];
}

export interface Notificacao {
  id: string;
  tipo: 'cadastro' | 'status' | 'transferencia';
  mensagem: string;
  data: string;
  liderNome: string;
  lideradoNome: string;
}

interface LideradosState {
  liderados: Liderado[];
  notificacoes: Notificacao[];
  addLiderado: (liderado: Omit<Liderado, 'id' | 'sincronizado'>) => void;
  syncLiderados: () => void;
  transferLiderado: (id: string, novoLiderId: string, novoLiderNome: string) => void;
  updateStatus: (id: string, novoStatus: Liderado['status']) => void;
  addNotificacao: (notificacao: Omit<Notificacao, 'id' | 'data'>) => void;
  limparNotificacoes: () => void;
}

export const useLideradosStore = create<LideradosState>()(
  persist(
    (set, get) => ({
      liderados: [
        { id: '1', nome: "Maria Silva", telefone: "(11) 99999-1234", bairro: "Centro", status: "apoiador", origemId: "2", origemNome: "João Líder", data: "2024-03-15", sincronizado: true, probabilidadeReconquista: 95 },
        { id: '2', nome: "Carlos Santos", telefone: "(11) 99888-5678", bairro: "Jardim América", status: "indeciso", origemId: "3", origemNome: "Ana Líder", data: "2024-03-14", sincronizado: true, probabilidadeReconquista: 65, historicoReconquista: ["Tentativa 1: WhatsApp enviado em 20/04"] },
      ],
      notificacoes: [],
      addLiderado: (data) => {
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
      addNotificacao: (n) => set((state) => ({
        notificacoes: [{ ...n, id: Math.random().toString(36).substr(2, 9), data: new Date().toISOString() }, ...state.notificacoes]
      })),
      limparNotificacoes: () => set({ notificacoes: [] }),
    }),
    {
      name: 'liderados-storage',
    }
  )
);