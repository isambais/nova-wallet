import type { Currency } from '../utils/currency';

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
  amount: number;            // TRY cinsinden; görüntüleme sırasında hesap para birimine çevrilir
  category: TransactionCategory;
  date: string;              // ISO 8601
  location?: string;
  accountCurrency: Currency; // bu işlemin ait olduğu hesap
};

// ─── MOCK DATA ─────────────────────────────────────────────────────

// ── TL Hesabı işlemleri ──────────────────────────────────────────
const tryTransactions: Transaction[] = [
  {
    id: 'try-1',
    title: 'Maaş Ödemesi',
    merchant: 'Şirket Transferi',
    amount: 28000,
    category: 'income',
    date: '2026-09-01T09:00:00Z',
    location: 'İstanbul',
    accountCurrency: 'TRY',
  },
  {
    id: 'try-2',
    title: 'Migros',
    merchant: 'Migros Market',
    amount: -320.50,
    category: 'shopping',
    date: '2026-09-02T14:23:00Z',
    location: 'İstanbul',
    accountCurrency: 'TRY',
  },
  {
    id: 'try-3',
    title: 'Netflix',
    merchant: 'Netflix Inc.',
    amount: -89.99,
    category: 'subscriptions',
    date: '2026-09-02T08:00:00Z',
    accountCurrency: 'TRY',
  },
  {
    id: 'try-4',
    title: 'Starbucks',
    merchant: 'Starbucks Coffee',
    amount: -67.00,
    category: 'food',
    date: '2026-09-02T11:15:00Z',
    location: 'Kadıköy',
    accountCurrency: 'TRY',
  },
  {
    id: 'try-5',
    title: 'İstanbulkart',
    merchant: 'İETT',
    amount: -150.00,
    category: 'transport',
    date: '2026-09-01T07:45:00Z',
    location: 'İstanbul',
    accountCurrency: 'TRY',
  },
  {
    id: 'try-6',
    title: 'Spotify',
    merchant: 'Spotify AB',
    amount: -39.99,
    category: 'subscriptions',
    date: '2026-08-31T08:00:00Z',
    accountCurrency: 'TRY',
  },
  {
    id: 'try-7',
    title: 'Elektrik Faturası',
    merchant: 'İSKİ',
    amount: -312.80,
    category: 'bills',
    date: '2026-08-30T10:00:00Z',
    accountCurrency: 'TRY',
  },
  {
    id: 'try-8',
    title: 'Trendyol',
    merchant: 'Trendyol.com',
    amount: -549.00,
    category: 'shopping',
    date: '2026-08-29T16:42:00Z',
    accountCurrency: 'TRY',
  },
  {
    id: 'try-9',
    title: 'Döner Ustası',
    merchant: 'Döner Ustası',
    amount: -85.00,
    category: 'food',
    date: '2026-08-29T13:30:00Z',
    location: 'Beşiktaş',
    accountCurrency: 'TRY',
  },
  {
    id: 'try-10',
    title: 'Temettü Geliri',
    merchant: 'Borsa İstanbul',
    amount: 450.00,
    category: 'income',
    date: '2026-08-28T09:00:00Z',
    accountCurrency: 'TRY',
  },
  {
    id: 'try-11',
    title: 'Uber',
    merchant: 'Uber B.V.',
    amount: -124.00,
    category: 'transport',
    date: '2026-08-28T22:15:00Z',
    location: 'İstanbul',
    accountCurrency: 'TRY',
  },
  {
    id: 'try-12',
    title: 'YouTube Premium',
    merchant: 'Google LLC',
    amount: -49.99,
    category: 'subscriptions',
    date: '2026-08-27T08:00:00Z',
    accountCurrency: 'TRY',
  },
  {
    id: 'try-13',
    title: 'Sinema',
    merchant: 'CinemaXX',
    amount: -180.00,
    category: 'entertainment',
    date: '2026-08-26T19:00:00Z',
    location: 'Cevahir AVM',
    accountCurrency: 'TRY',
  },
  {
    id: 'try-14',
    title: 'Doğalgaz',
    merchant: 'İGDAŞ',
    amount: -220.40,
    category: 'bills',
    date: '2026-08-25T10:00:00Z',
    accountCurrency: 'TRY',
  },
  {
    id: 'try-15',
    title: 'Zara',
    merchant: 'Zara Turkey',
    amount: -899.00,
    category: 'shopping',
    date: '2026-08-24T15:30:00Z',
    location: 'Metrocity AVM',
    accountCurrency: 'TRY',
  },
];

// ── USD Hesabı işlemleri (TRY karşılıkları) ──────────────────────
const usdTransactions: Transaction[] = [
  {
    id: 'usd-1',
    title: 'Freelance Gelir',
    merchant: 'PayPal Transfer',
    amount: 91920,            // ~2840 USD × 32.40
    category: 'income',
    date: '2026-09-01T15:00:00Z',
    accountCurrency: 'USD',
  },
  {
    id: 'usd-2',
    title: 'Amazon',
    merchant: 'Amazon.com',
    amount: -971.25,          // ~$29.95 × 32.45
    category: 'shopping',
    date: '2026-09-02T10:30:00Z',
    accountCurrency: 'USD',
  },
  {
    id: 'usd-3',
    title: 'Udemy Kurs',
    merchant: 'Udemy Inc.',
    amount: -323.75,          // ~$9.99 × 32.40
    category: 'entertainment',
    date: '2026-09-01T18:00:00Z',
    accountCurrency: 'USD',
  },
  {
    id: 'usd-4',
    title: 'GitHub Copilot',
    merchant: 'GitHub Inc.',
    amount: -323.75,          // ~$9.99
    category: 'subscriptions',
    date: '2026-08-31T08:00:00Z',
    accountCurrency: 'USD',
  },
  {
    id: 'usd-5',
    title: 'DigitalOcean',
    merchant: 'DigitalOcean LLC',
    amount: -648.00,          // ~$20 × 32.40
    category: 'bills',
    date: '2026-08-30T09:00:00Z',
    accountCurrency: 'USD',
  },
  {
    id: 'usd-6',
    title: 'Upwork Gelir',
    merchant: 'Upwork Global',
    amount: 32400,            // ~$1000
    category: 'income',
    date: '2026-08-28T12:00:00Z',
    accountCurrency: 'USD',
  },
  {
    id: 'usd-7',
    title: 'ChatGPT Plus',
    merchant: 'OpenAI',
    amount: -647.00,          // ~$19.99
    category: 'subscriptions',
    date: '2026-08-27T08:00:00Z',
    accountCurrency: 'USD',
  },
  {
    id: 'usd-8',
    title: 'Figma',
    merchant: 'Figma Inc.',
    amount: -486.00,          // ~$15
    category: 'subscriptions',
    date: '2026-08-25T08:00:00Z',
    accountCurrency: 'USD',
  },
];

// ── EUR Hesabı işlemleri (TRY karşılıkları) ──────────────────────
const eurTransactions: Transaction[] = [
  {
    id: 'eur-1',
    title: 'AB Proje Ödemesi',
    merchant: 'EU Grant Transfer',
    amount: 49840,            // ~€1420 × 35.10
    category: 'income',
    date: '2026-09-01T10:00:00Z',
    accountCurrency: 'EUR',
  },
  {
    id: 'eur-2',
    title: 'Booking.com',
    merchant: 'Booking Holdings',
    amount: -3510,            // ~€100 × 35.10
    category: 'entertainment',
    date: '2026-09-02T12:00:00Z',
    accountCurrency: 'EUR',
  },
  {
    id: 'eur-3',
    title: 'Spotify Premium',
    merchant: 'Spotify AB',
    amount: -351,             // ~€10
    category: 'subscriptions',
    date: '2026-09-01T08:00:00Z',
    accountCurrency: 'EUR',
  },
  {
    id: 'eur-4',
    title: 'Steam',
    merchant: 'Valve Corporation',
    amount: -877.50,          // ~€25
    category: 'entertainment',
    date: '2026-08-30T16:00:00Z',
    accountCurrency: 'EUR',
  },
  {
    id: 'eur-5',
    title: 'AliExpress',
    merchant: 'Alibaba Group',
    amount: -1755,            // ~€50
    category: 'shopping',
    date: '2026-08-29T14:00:00Z',
    accountCurrency: 'EUR',
  },
  {
    id: 'eur-6',
    title: 'Freelance Ödeme',
    merchant: 'Wise Transfer',
    amount: 17550,            // ~€500
    category: 'income',
    date: '2026-08-27T11:00:00Z',
    accountCurrency: 'EUR',
  },
  {
    id: 'eur-7',
    title: 'iCloud+ 200GB',
    merchant: 'Apple Inc.',
    amount: -105.30,          // ~€3
    category: 'subscriptions',
    date: '2026-08-26T08:00:00Z',
    accountCurrency: 'EUR',
  },
];

// ─── TÜM İŞLEMLER ────────────────────────────────────────────────
export const mockTransactions: Transaction[] = [
  ...tryTransactions,
  ...usdTransactions,
  ...eurTransactions,
];

// ─── YARDIMCI ────────────────────────────────────────────────────
/** Son N işlemi döndürür (hesap para birimine göre filtreli) */
export function getRecentTransactions(count = 5, currency: Currency = 'TRY'): Transaction[] {
  return [...mockTransactions]
    .filter(tx => tx.accountCurrency === currency)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

/** Kategoriye göre filtrele */
export function getTransactionsByCategory(category: TransactionCategory, currency: Currency = 'TRY'): Transaction[] {
  return mockTransactions.filter(tx => tx.category === category && tx.accountCurrency === currency);
}

/** Toplam gelir */
export function getTotalIncome(currency: Currency = 'TRY'): number {
  return mockTransactions
    .filter(tx => tx.amount > 0 && tx.accountCurrency === currency)
    .reduce((sum, tx) => sum + tx.amount, 0);
}

/** Toplam gider */
export function getTotalExpense(currency: Currency = 'TRY'): number {
  return mockTransactions
    .filter(tx => tx.amount < 0 && tx.accountCurrency === currency)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
}
