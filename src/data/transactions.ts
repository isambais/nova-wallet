// ─── TİPLER ──────────────────────────────────────────────────────
export type TransactionCategory =
  | 'income'
  | 'food'
  | 'transport'
  | 'entertainment'
  | 'shopping'
  | 'bills'
  | 'subscriptions';

export type Transaction = {
  id: string;
  title: string;
  merchant: string;
  amount: number;          // pozitif = gelir, negatif = gider (TRY)
  category: TransactionCategory;
  date: string;            // ISO 8601
  location?: string;
};

// ─── MOCK DATA ────────────────────────────────────────────────────
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Maaş Ödemesi',
    merchant: 'Şirket Transferi',
    amount: 28000,
    category: 'income',
    date: '2026-09-01T09:00:00Z',
    location: 'İstanbul',
  },
  {
    id: '2',
    title: 'Migros',
    merchant: 'Migros Market',
    amount: -320.50,
    category: 'shopping',
    date: '2026-09-02T14:23:00Z',
    location: 'İstanbul',
  },
  {
    id: '3',
    title: 'Netflix',
    merchant: 'Netflix Inc.',
    amount: -89.99,
    category: 'subscriptions',
    date: '2026-09-02T08:00:00Z',
  },
  {
    id: '4',
    title: 'Starbucks',
    merchant: 'Starbucks Coffee',
    amount: -67.00,
    category: 'food',
    date: '2026-09-02T11:15:00Z',
    location: 'Kadıköy',
  },
  {
    id: '5',
    title: 'İstanbulkart',
    merchant: 'İETT',
    amount: -150.00,
    category: 'transport',
    date: '2026-09-01T07:45:00Z',
    location: 'İstanbul',
  },
  {
    id: '6',
    title: 'Spotify',
    merchant: 'Spotify AB',
    amount: -39.99,
    category: 'subscriptions',
    date: '2026-08-31T08:00:00Z',
  },
  {
    id: '7',
    title: 'Elektrik Faturası',
    merchant: 'İSKİ',
    amount: -312.80,
    category: 'bills',
    date: '2026-08-30T10:00:00Z',
  },
  {
    id: '8',
    title: 'Trendyol',
    merchant: 'Trendyol.com',
    amount: -549.00,
    category: 'shopping',
    date: '2026-08-29T16:42:00Z',
  },
  {
    id: '9',
    title: 'Döner Ustası',
    merchant: 'Döner Ustası',
    amount: -85.00,
    category: 'food',
    date: '2026-08-29T13:30:00Z',
    location: 'Beşiktaş',
  },
  {
    id: '10',
    title: 'Temettü Geliri',
    merchant: 'Borsa İstanbul',
    amount: 450.00,
    category: 'income',
    date: '2026-08-28T09:00:00Z',
  },
  {
    id: '11',
    title: 'Uber',
    merchant: 'Uber B.V.',
    amount: -124.00,
    category: 'transport',
    date: '2026-08-28T22:15:00Z',
    location: 'İstanbul',
  },
  {
    id: '12',
    title: 'YouTube Premium',
    merchant: 'Google LLC',
    amount: -49.99,
    category: 'subscriptions',
    date: '2026-08-27T08:00:00Z',
  },
  {
    id: '13',
    title: 'Sinema',
    merchant: 'CinemaXX',
    amount: -180.00,
    category: 'entertainment',
    date: '2026-08-26T19:00:00Z',
    location: 'Cevahir AVM',
  },
  {
    id: '14',
    title: 'Doğalgaz',
    merchant: 'İGDAŞ',
    amount: -220.40,
    category: 'bills',
    date: '2026-08-25T10:00:00Z',
  },
  {
    id: '15',
    title: 'Zara',
    merchant: 'Zara Turkey',
    amount: -899.00,
    category: 'shopping',
    date: '2026-08-24T15:30:00Z',
    location: 'Metrocity AVM',
  },
];

// ─── YARDIMCI ────────────────────────────────────────────────────
/** Son N işlemi döndürür */
export function getRecentTransactions(count = 5): Transaction[] {
  return [...mockTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

/** Kategoriye göre filtrele */
export function getTransactionsByCategory(category: TransactionCategory): Transaction[] {
  return mockTransactions.filter(tx => tx.category === category);
}

/** Toplam gelir */
export function getTotalIncome(): number {
  return mockTransactions
    .filter(tx => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);
}

/** Toplam gider */
export function getTotalExpense(): number {
  return mockTransactions
    .filter(tx => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
}
