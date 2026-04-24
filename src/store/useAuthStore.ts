import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserType = 'admin' | 'lider';

interface User {
  id: string;
  nome: string;
  email: string;
  tipo: UserType;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);