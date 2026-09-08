import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Currency = 'TRY' | 'USD' | 'EUR';

type User = {
  id: string;
  name: string;
  phone: string;
  language: 'tr' | 'en' | 'ar';
  currency: Currency;
  balance: number;
  iban: string;   // ← eklendi: her kullanıcıya unique, register'da üretilir
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  pin: string | null;
  setUser: (user: User) => void;
  setPin: (pin: string) => void;
  logout: () => void;
};

// Mock IBAN üretici — gerçekte backend verir
// TR + 2 kontrol + 24 rakam = 26 karakter
export function generateMockIban(): string {
  const digits = Array.from({ length: 22 }, () => Math.floor(Math.random() * 10)).join('');
  const raw = `TR00 0001 0017 ${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 12)} ${digits.slice(12, 14)}`;
  return raw;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      pin: null,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setPin: (pin) => set({ pin }),
      logout: () => set({ user: null, isAuthenticated: false, pin: null }),
    }),
    {
      name: 'nova-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
