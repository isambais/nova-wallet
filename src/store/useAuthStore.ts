import { create } from 'zustand';

type Currency = 'TRY' | 'USD' | 'EUR';

type User = {
  id: string;
  name: string;
  phone: string;
  language: 'tr' | 'en' | 'ar';
  currency: Currency;
  balance: number;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  pin: string | null;
  setUser: (user: User) => void;
  setPin: (pin: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  pin: null,
  setUser: (user) => set({ user, isAuthenticated: true }),
  setPin: (pin) => set({ pin }),
  logout: () => set({ user: null, isAuthenticated: false, pin: null }),
}));

