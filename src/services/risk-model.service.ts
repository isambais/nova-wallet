// ─── Finansal Sağlık Skoru — Deterministik Risk Modeli ───────────
// Gerçek LLM çağrısı yok. Kural tabanlı, deterministik hesaplama.

export type RiskLevel = 'excellent' | 'good' | 'fair' | 'poor';

export type RiskCategory = {
  key: string;
  label: string;
  score: number;   // 0-100
  weight: number;  // ağırlık katsayısı
  tip: string;
};

export type RiskReport = {
  totalScore: number;         // 0-100
  level: RiskLevel;
  levelLabel: string;
  levelColor: string;
  levelEmoji: string;
  summary: string;
  categories: RiskCategory[];
  topSuggestions: string[];
  nextCheckDate: string;
};

export type SpendingInput = {
  income: number;             // aylık tahmini gelir
  totalSpent: number;         // bu ay toplam harcama
  categories: {
    food: number;
    shopping: number;
    transport: number;
    entertainment: number;
    bills: number;
    health: number;
    education: number;
    other: number;
  };
  savingsAmount: number;      // bu ay biriktirilen
  subscriptionCount: number;  // aktif abonelik sayısı
  latePayments: number;       // gecikmeli ödeme sayısı (bu ay)
};

// ── Skor seviyeleri ───────────────────────────────────────────────
const LEVELS: Record<RiskLevel, { label: string; color: string; emoji: string }> = {
  excellent: { label: 'Mükemmel',  color: '#10B981', emoji: '🏆' },
  good:      { label: 'İyi',       color: '#6366F1', emoji: '👍' },
  fair:      { label: 'Orta',      color: '#F59E0B', emoji: '⚠️'  },
  poor:      { label: 'Zayıf',     color: '#EF4444', emoji: '🔴' },
};

function levelFromScore(score: number): RiskLevel {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

// ── Ana hesaplama ─────────────────────────────────────────────────
export function calculateRiskScore(input: SpendingInput): RiskReport {
  const {
    income, totalSpent, categories,
    savingsAmount, subscriptionCount, latePayments,
  } = input;

  const safeIncome = income > 0 ? income : totalSpent * 1.2;

  // 1. Harcama / Gelir oranı (ağırlık: 30)
  const spendRatio = totalSpent / safeIncome;
  const spendScore = clamp(100 - spendRatio * 100);
  const spendTip = spendRatio > 0.9
    ? 'Gelirinizin %90\'ından fazlasını harcıyorsunuz.'
    : spendRatio > 0.7
    ? 'Harcama/gelir oranınız biraz yüksek, bütçe sıkılaştırın.'
    : 'Harcama/gelir oranınız sağlıklı seviyede.';

  // 2. Tasarruf oranı (ağırlık: 25)
  const savingsRatio = savingsAmount / safeIncome;
  const savingsScore = clamp(savingsRatio * 500); // %20 tasarruf = 100 puan
  const savingsTip = savingsRatio < 0.05
    ? 'Aylık gelirinizin en az %10\'unu biriktirmeyi hedefleyin.'
    : savingsRatio < 0.15
    ? 'Tasarruf oranınızı artırabilirsiniz. Küçük kesintiler büyük fark yaratır.'
    : 'Tasarruf alışkanlığınız çok iyi!';

  // 3. Yemek harcaması oranı (ağırlık: 15)
  const foodRatio = categories.food / safeIncome;
  const foodScore = clamp(100 - foodRatio * 300); // %33 = 0
  const foodTip = foodRatio > 0.25
    ? 'Yemek harcamaları gelirinizin çok büyük bölümünü alıyor.'
    : foodRatio > 0.15
    ? 'Yemek siparişlerini azaltmak aylık ciddi tasarruf sağlar.'
    : 'Yemek harcamalarınız makul seviyede.';

  // 4. Abonelik yükü (ağırlık: 15)
  const subScore = clamp(100 - subscriptionCount * 10);
  const subTip = subscriptionCount > 7
    ? `${subscriptionCount} aktif aboneliğiniz var. Kullanmadıklarını iptal edin.`
    : subscriptionCount > 4
    ? 'Aboneliklerinizi gözden geçirin, gereksiz olanları kaldırın.'
    : 'Abonelik sayınız kontrol altında.';

  // 5. Gecikmeli ödeme (ağırlık: 15)
  const lateScore = clamp(100 - latePayments * 30);
  const lateTip = latePayments > 2
    ? 'Gecikmeli ödemeler kredi notunuzu olumsuz etkiler. Otomatik ödeme kurun.'
    : latePayments > 0
    ? 'Gecikmeli ödemeyi önlemek için takvim hatırlatıcısı ekleyin.'
    : 'Tüm ödemeleriniz zamanında — harika!';

  // Ağırlıklı toplam
  const totalScore = clamp(Math.round(
    spendScore   * 0.30 +
    savingsScore * 0.25 +
    foodScore    * 0.15 +
    subScore     * 0.15 +
    lateScore    * 0.15
  ));

  const level = levelFromScore(totalScore);
  const { label: levelLabel, color: levelColor, emoji: levelEmoji } = LEVELS[level];

  const riskCategories: RiskCategory[] = [
    { key: 'spend',    label: 'Harcama/Gelir',    score: spendScore,   weight: 30, tip: spendTip   },
    { key: 'savings',  label: 'Tasarruf Oranı',   score: savingsScore, weight: 25, tip: savingsTip },
    { key: 'food',     label: 'Yemek Harcaması',  score: foodScore,    weight: 15, tip: foodTip    },
    { key: 'subs',     label: 'Abonelik Yükü',    score: subScore,     weight: 15, tip: subTip     },
    { key: 'late',     label: 'Ödeme Düzeni',     score: lateScore,    weight: 15, tip: lateTip    },
  ];

  // En düşük skorlu 3 kategori öneri olarak
  const sorted = [...riskCategories].sort((a, b) => a.score - b.score);
  const topSuggestions = sorted.slice(0, 3).map(c => c.tip);

  const summaries: Record<RiskLevel, string> = {
    excellent: 'Finansal sağlığınız mükemmel. Böyle devam edin!',
    good:      'Genel tablonuz iyi, küçük iyileştirmelerle daha da güçlenebilirsiniz.',
    fair:      'Bazı alanlarda dikkat gerekiyor. Önerileri uygulayın.',
    poor:      'Finansal sağlığınız risk altında. Acil aksiyon almanızı öneririz.',
  };

  return {
    totalScore,
    level,
    levelLabel,
    levelColor,
    levelEmoji,
    summary: summaries[level],
    categories: riskCategories,
    topSuggestions,
    nextCheckDate: 'Ekim 2026',
  };
}

// ── Demo input (mock kullanıcı verisi) ────────────────────────────
export const DEMO_RISK_INPUT: SpendingInput = {
  income: 18000,
  totalSpent: 4820,
  categories: {
    food: 1240,
    shopping: 890,
    transport: 480,
    entertainment: 620,
    bills: 475,
    health: 280,
    education: 220,
    other: 615,
  },
  savingsAmount: 1200,
  subscriptionCount: 6,
  latePayments: 0,
};

export const DEMO_RISK_REPORT: RiskReport = calculateRiskScore(DEMO_RISK_INPUT);
