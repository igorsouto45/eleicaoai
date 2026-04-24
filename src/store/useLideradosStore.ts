import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
}

interface LideradosState {
  liderados: Liderado[];
  addLiderado: (liderado: Omit<Liderado, 'id' | 'sincronizado'>) => void;
  syncLiderados: () => void;
  transferLiderado: (id: string, novoLiderId: string, novoLiderNome: string) => void;
}

export const useLideradosStore = create<LideradosState>()(
  persist(
    (set, get) => ({
      liderados: [
        { id: '1', nome: "Maria Silva", telefone: "(11) 99999-1234", bairro: "Centro", status: "apoiador", origemId: "2", origemNome: "João Líder", data: "2024-03-15", sincronizado: true },
        { id: '2', nome: "Carlos Santos", telefone: "(11) 99888-5678", bairro: "Jardim América", status: "indeciso", origemId: "3", origemNome: "Ana Líder", data: "2024-03-14", sincronizado: true },
      ],
      addLiderado: (data) => {
        const newLiderado: Liderado = {
          ...data,
          id: Math.random().toString(36).substr(2, 9),
          sincronizado: navigator.onLine,
        };
        set((state) => ({ liderados: [newLiderado, ...state.liderados] }));
        
        if (navigator.onLine) {
          console.log("Enviando notificação para Admin: Novo cadastro de", data.nome);
        }
      },
      syncLiderados: () => {
        const { liderados } = get();
        const unsynced = liderados.filter(l => !l.sincronizado);
        if (unsynced.length > 0) {
          console.log("Sincronizando", unsynced.length, "liderados...");
          set((state) => ({
            liderados: state.liderados.map(l => ({ ...l, sincronizado: true }))
          }));
        }
      },
      transferLiderado: (id, novoLiderId, novoLiderNome) => {
        set((state) => ({
          liderados: state.liderados.map(l => 
            l.id === id ? { ...l, origemId: novoLiderId, origemNome: novoLiderNome } : l
          )
        }));
      }
    }),
    {
      name: 'liderados-storage',
    }
  )
);