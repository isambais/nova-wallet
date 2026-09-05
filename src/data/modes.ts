// ─── HARCAMA MODLARI ─────────────────────────────────────────────
export type SpendingMode = {
  id: string;
  name: string;
  emoji: string;
  dailyLimit: number;   // TRY cinsinden günlük limit
  warningText: string;
  color: string;
  bgColor: string;
};

export const SPENDING_MODES: SpendingMode[] = [
  {
    id:         'student',
    name:       'Öğrenci',
    emoji:      '🎓',
    dailyLimit: 300,
    warningText:'Günlük ₺300 — ders kitabı önce!',
    color:      '#3B82F6',
    bgColor:    '#3B82F618',
  },
  {
    id:         'vacation',
    name:       'Tatil',
    emoji:      '🏖️',
    dailyLimit: 2000,
    warningText:'Keyif yap, ama ₺2.000 günlük limitini aşma.',
    color:      '#F59E0B',
    bgColor:    '#F59E0B18',
  },
  {
    id:         'saving',
    name:       'Sıkı Tasarruf',
    emoji:      '🐷',
    dailyLimit: 150,
    warningText:'Sadece zorunlu harcama — ₺150 günlük limit!',
    color:      '#10B981',
    bgColor:    '#10B98118',
  },
  {
    id:         'night-out',
    name:       'Gece Dışarı',
    emoji:      '🌙',
    dailyLimit: 1000,
    warningText:'Eğlen ama ₺1.000 limitini aşma!',
    color:      '#A855F7',
    bgColor:    '#A855F718',
  },
];
