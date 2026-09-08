// ─── Anomali Dedektifi — Deterministik Kural Motoru ──────────────
// Gerçek ML yok. Kural tabanlı, işlem listesini tarar.

export type AnomalyType =
  | 'unusual_amount'     // alışılmadık yüksek tutar
  | 'late_night'         // gece geç saatte işlem
  | 'duplicate'          // aynı gün aynı tutarda tekrar
  | 'subscription_spike' // abonelik ücreti artışı
  | 'new_merchant'       // hiç kullanılmamış merchant
  | 'foreign_currency'   // yabancı para birimi
  | 'rapid_spending';    // kısa sürede çok harcama

export type AnomalySeverity = 'low' | 'medium' | 'high';

export type Transaction = {
  id: string;
  merchant: string;
  category: string;
  amount: number;       // TRY
  date: string;         // 'YYYY-MM-DD'
  hour?: number;        // 0-23
  isSubscription?: boolean;
  prevAmount?: number;  // önceki dönem tutarı (abonelikler için)
  isNewMerchant?: boolean;
  currency?: string;
};

export type Anomaly = {
  id: string;
  transactionId: string;
  merchant: string;
  amount: number;
  date: string;
  type: AnomalyType;
  severity: AnomalySeverity;
  title: string;
  description: string;
  suggestion: string;
  icon: string;
};

// ── Kural tanımları ───────────────────────────────────────────────
const RULES: Array<{
  type: AnomalyType;
  check: (tx: Transaction, all: Transaction[]) => boolean;
  severity: AnomalySeverity;
  title: (tx: Transaction) => string;
  description: (tx: Transaction) => string;
  suggestion: string;
  icon: string;
}> = [
  {
    type: 'unusual_amount',
    check: (tx, all) => {
      const same = all.filter(t => t.category === tx.category && t.id !== tx.id);
      if (same.length === 0) return false;
      const avg = same.reduce((s, t) => s + t.amount, 0) / same.length;
      return tx.amount > avg * 2.5 && tx.amount > 500;
    },
    severity: 'high',
    title: tx => `Alışılmadık yüksek tutar — ${tx.merchant}`,
    description: tx => `₺${tx.amount.toLocaleString('tr-TR')} tutarındaki bu işlem, kategori ortalamanızın 2,5 katı üzerinde.`,
    suggestion: 'İşlemi siz onayladıysanız sorun yok. Onaylamadıysanız hemen bankayı arayın.',
    icon: '🔺',
  },
  {
    type: 'late_night',
    check: tx => (tx.hour ?? 12) >= 1 && (tx.hour ?? 12) <= 5,
    severity: 'medium',
    title: tx => `Gece işlemi — ${tx.merchant}`,
    description: tx => `Gece ${tx.hour}:00'de ₺${tx.amount.toLocaleString('tr-TR')} tutarında işlem gerçekleşti.`,
    suggestion: 'Gece saatlerindeki işlemleri takip edin. Kartınızın gece kullanımını kısıtlayabilirsiniz.',
    icon: '🌙',
  },
  {
    type: 'duplicate',
    check: (tx, all) =>
      all.some(t =>
        t.id !== tx.id &&
        t.date === tx.date &&
        Math.abs(t.amount - tx.amount) < 1 &&
        t.merchant === tx.merchant
      ),
    severity: 'high',
    title: tx => `Olası çift işlem — ${tx.merchant}`,
    description: tx => `Aynı gün, aynı tutarda (₺${tx.amount.toLocaleString('tr-TR')}) aynı yerden iki işlem var.`,
    suggestion: 'Çift tahsilat olabilir. Hesap ekstrenizi kontrol edin ve gerekirse itiraz açın.',
    icon: '⚠️',
  },
  {
    type: 'subscription_spike',
    check: tx => !!tx.isSubscription && !!tx.prevAmount && tx.amount > tx.prevAmount * 1.2,
    severity: 'medium',
    title: tx => `Abonelik ücreti arttı — ${tx.merchant}`,
    description: tx => `${tx.merchant} abonelik ücreti ₺${tx.prevAmount?.toLocaleString('tr-TR')}'den ₺${tx.amount.toLocaleString('tr-TR')}'ye yükseldi.`,
    suggestion: 'Yeni fiyatı kabul etmiyorsanız aboneliği iptal edip yeniden değerlendirin.',
    icon: '📈',
  },
  {
    type: 'new_merchant',
    check: tx => !!tx.isNewMerchant && tx.amount > 300,
    severity: 'low',
    title: tx => `Yeni merchant — ${tx.merchant}`,
    description: tx => `${tx.merchant}'den ilk kez ₺${tx.amount.toLocaleString('tr-TR')} tutarında alışveriş yapıldı.`,
    suggestion: 'İlk kez kullandığınız bir yer. İşlemi siz başlattıysanız sorun yok.',
    icon: '🆕',
  },
  {
    type: 'foreign_currency',
    check: tx => !!tx.currency && tx.currency !== 'TRY',
    severity: 'low',
    title: tx => `Yabancı para işlemi — ${tx.merchant}`,
    description: tx => `${tx.currency} cinsinden işlem gerçekleşti. Döviz kuru farkı uygulanmış olabilir.`,
    suggestion: 'Yurt dışı alışverişlerde kur farkı ve komisyon ücretlerine dikkat edin.',
    icon: '💱',
  },
];

// ── Ana fonksiyon ─────────────────────────────────────────────────
export function detectAnomalies(transactions: Transaction[]): Anomaly[] {
  const anomalies: Anomaly[] = [];

  transactions.forEach(tx => {
    RULES.forEach(rule => {
      if (rule.check(tx, transactions)) {
        // Aynı tx + type kombinasyonu eklenmesini önle
        const exists = anomalies.some(
          a => a.transactionId === tx.id && a.type === rule.type
        );
        if (!exists) {
          anomalies.push({
            id: `${tx.id}-${rule.type}`,
            transactionId: tx.id,
            merchant: tx.merchant,
            amount: tx.amount,
            date: tx.date,
            type: rule.type,
            severity: rule.severity,
            title: rule.title(tx),
            description: rule.description(tx),
            suggestion: rule.suggestion,
            icon: rule.icon,
          });
        }
      }
    });
  });

  // Önce high, sonra medium, sonra low
  const order: AnomalySeverity[] = ['high', 'medium', 'low'];
  return anomalies.sort((a, b) => order.indexOf(a.severity) - order.indexOf(b.severity));
}

// ── Demo işlemler ─────────────────────────────────────────────────
export const DEMO_TRANSACTIONS: Transaction[] = [
  { id: 't1',  merchant: 'Migros',      category: 'shopping',      amount: 187,  date: '2026-09-01', hour: 14 },
  { id: 't2',  merchant: 'Netflix',     category: 'subscription',  amount: 219,  date: '2026-09-02', hour: 9,  isSubscription: true, prevAmount: 182 },
  { id: 't3',  merchant: 'Trendyol',    category: 'shopping',      amount: 1840, date: '2026-09-03', hour: 20 },
  { id: 't4',  merchant: 'Bolt',        category: 'transport',     amount: 62,   date: '2026-09-04', hour: 3  },
  { id: 't5',  merchant: 'Getir',       category: 'food',          amount: 145,  date: '2026-09-05', hour: 23 },
  { id: 't6',  merchant: 'Zara',        category: 'shopping',      amount: 340,  date: '2026-09-06', hour: 16, isNewMerchant: true },
  { id: 't7',  merchant: 'Amazon',      category: 'shopping',      amount: 89,   date: '2026-09-07', hour: 11, currency: 'USD' },
  { id: 't8',  merchant: 'Starbucks',   category: 'food',          amount: 78,   date: '2026-09-08', hour: 8  },
  { id: 't9',  merchant: 'Starbucks',   category: 'food',          amount: 78,   date: '2026-09-08', hour: 8  }, // duplicate
  { id: 't10', merchant: 'Spotify',     category: 'subscription',  amount: 99,   date: '2026-09-09', hour: 10, isSubscription: true, prevAmount: 69 },
  { id: 't11', merchant: 'Migros',      category: 'shopping',      amount: 203,  date: '2026-09-10', hour: 15 },
  { id: 't12', merchant: 'Yemeksepeti', category: 'food',          amount: 124,  date: '2026-09-11', hour: 21 },
];

export const DEMO_ANOMALIES: Anomaly[] = detectAnomalies(DEMO_TRANSACTIONS);
