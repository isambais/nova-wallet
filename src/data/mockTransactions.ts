export type Transaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;       // negatif = gider, pozitif = gelir
  date: string;
  icon: string;
  category: 'income' | 'shopping' | 'food' | 'entertainment' | 'transport' | 'bill';
};

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Maaş',
    subtitle: 'Gelir',
    amount: 15000,
    date: 'Bugün',
    icon: '💼',
    category: 'income',
  },
  {
    id: '2',
    title: 'Netflix',
    subtitle: 'Eğlence',
    amount: -89.99,
    date: 'Bugün',
    icon: '🎬',
    category: 'entertainment',
  },
  {
    id: '3',
    title: 'Migros',
    subtitle: 'Market',
    amount: -234.50,
    date: 'Dün',
    icon: '🛒',
    category: 'shopping',
  },
  {
    id: '4',
    title: 'Starbucks',
    subtitle: 'Yemek & İçecek',
    amount: -67.00,
    date: 'Dün',
    icon: '☕',
    category: 'food',
  },
  {
    id: '5',
    title: 'İstanbul Kart',
    subtitle: 'Ulaşım',
    amount: -150.00,
    date: '2 gün önce',
    icon: '🚌',
    category: 'transport',
  },
  {
    id: '6',
    title: 'Spotify',
    subtitle: 'Eğlence',
    amount: -39.99,
    date: '3 gün önce',
    icon: '🎵',
    category: 'entertainment',
  },
  {
    id: '7',
    title: 'Fatura',
    subtitle: 'Elektrik',
    amount: -312.80,
    date: '4 gün önce',
    icon: '⚡',
    category: 'bill',
  },
  {
    id: '8',
    title: 'Trendyol',
    subtitle: 'Alışveriş',
    amount: -549.00,
    date: '5 gün önce',
    icon: '📦',
    category: 'shopping',
  },
];

export function formatAmount(amount: number, currency = 'TRY'): string {
  const abs = Math.abs(amount).toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const symbol = currency === 'TRY' ? '₺' : currency === 'USD' ? '$' : '€';
  return `${amount >= 0 ? '+' : '-'}${symbol}${abs}`;
}
