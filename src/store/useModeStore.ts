import { create } from 'zustand';
import type { SpendingMode } from '../data/modes';

type ModeStore = {
  activeMode: SpendingMode | null;
  setMode: (mode: SpendingMode | null) => void;
};

export const useModeStore = create<ModeStore>((set) => ({
  activeMode: null,
  setMode: (mode) => set({ activeMode: mode }),
}));
