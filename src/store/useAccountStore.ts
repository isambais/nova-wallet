import { create } from 'zustand';
import type { Currency } from '../utils/currency';

type AccountStore = {
  activeCurrency: Currency;
  setActiveCurrency: (c: Currency) => void;
};

export const useAccountStore = create<AccountStore>((set) => ({
  activeCurrency: 'TRY',
  setActiveCurrency: (c) => set({ activeCurrency: c }),
}));
