// ─── Finansal Sağlık Skoru Senaryoları ───────────────────────────
// UI'da "AI yorumu" olarak gösterilir.

export type ScoreBand = 'excellent' | 'good' | 'fair' | 'poor';

export type ScoreScenario = {
  band: ScoreBand;
  minScore: number;
  maxScore: number;
  headline: string;
  summary: string;
  emoji: string;
  color: string;
  strengths: string[];
  improvements: string[];
  monthlyGoal: string;
  aiComment: string;
};

export const SCORE_SCENARIOS: ScoreScenario[] = [
  {
    band: 'excellent',
    minScore: 80,
    maxScore: 100,
    headline: 'Finansal sağlığınız mükemmel!',
    summary: 'Harcama alışkanlıklarınız çok dengeli. Tasarruf oranınız hedefin üzerinde ve borç yükümlülüğünüz düşük.',
    emoji: '🏆',
    color: '#10B981',
    strengths: [
      'Gelirinizin %15\'inden fazlasını biriktiriyorsunuz',
      'Tüm ödemelerinizi zamanında yapıyorsunuz',
      'Harcama/gelir oranınız ideal seviyede',
    ],
    improvements: [
      'Acil durum fonunuzu 6 aylık gideri karşılayacak düzeye çıkarın',
      'Yatırım çeşitlendirmesini değerlendirin',
    ],
    monthlyGoal: 'Bu ayki hedef: Yatırım portföyünüze katkı yapın',
    aiComment: 'Geçen 3 aya kıyasla skorunuz 7 puan arttı. En büyük katkı tasarruf oranındaki artıştan geliyor.',
  },
  {
    band: 'good',
    minScore: 60,
    maxScore: 79,
    headline: 'İyi bir finansal tablo',
    summary: 'Genel durumunuz olumlu. Birkaç küçük düzeltmeyle mükemmel seviyeye çıkabilirsiniz.',
    emoji: '👍',
    color: '#6366F1',
    strengths: [
      'Temel faturalarınızı düzenli ödüyorsunuz',
      'Tasarruf alışkanlığı mevcut',
    ],
    improvements: [
      'Yemek ve eğlence harcamalarını hafif kısın',
      'Kullanmadığınız abonelikleri iptal edin',
      'Aylık tasarruf hedefi belirleyin',
    ],
    monthlyGoal: 'Bu ayki hedef: Yemek harcamalarını ₺200 azalt',
    aiComment: 'Alışveriş kategorisinde bu ay ortalamadan %18 fazla harcadınız. Bütçe limiti koymanızı öneririm.',
  },
  {
    band: 'fair',
    minScore: 40,
    maxScore: 59,
    headline: 'Dikkat gerektiren noktalar var',
    summary: 'Finansal tablonuzda bazı riskler görünüyor. Önerileri uygulamaya başlamak için iyi bir zaman.',
    emoji: '⚠️',
    color: '#F59E0B',
    strengths: [
      'Temel giderlerinizi karşılıyorsunuz',
    ],
    improvements: [
      'Harcama/gelir oranınız çok yüksek — zorunlu olmayan harcamaları kısın',
      'Acil durum fonu oluşturun (en az 3 aylık gider)',
      'Aboneliklerinizi gözden geçirin',
      'Otomatik birikim talimatı verin',
    ],
    monthlyGoal: 'Bu ayki hedef: Gelirinizin %5\'ini birikim hesabına aktar',
    aiComment: 'Son 2 aydır harcamalarınız gelire oranla artış gösteriyor. Bütçe planı oluşturmanızı öneririm.',
  },
  {
    band: 'poor',
    minScore: 0,
    maxScore: 39,
    headline: 'Acil finansal aksiyon gerekiyor',
    summary: 'Finansal sağlığınız risk altında. Hemen harekete geçmenizi ve bir plan yapmanızı öneriyoruz.',
    emoji: '🔴',
    color: '#EF4444',
    strengths: [],
    improvements: [
      'Zorunlu olmayan tüm harcamaları durdurun',
      'Tüm abonelikleri geçici olarak iptal edin',
      'Harcama takibi için haftalık bütçe yapın',
      'Borçlarınız varsa önce yüksek faizlileri kapatın',
      'Bir finansal danışmanla görüşmeyi değerlendirin',
    ],
    monthlyGoal: 'Bu ayki hedef: Harcamaları gelirin %70\'inin altına indirin',
    aiComment: 'Gelirinizin tamamını harcıyorsunuz ve tasarruf bulunmuyor. En kritik adım: sabit bir birikim planı oluşturmak.',
  },
];

export function getScoreScenario(score: number): ScoreScenario {
  return (
    SCORE_SCENARIOS.find(s => score >= s.minScore && score <= s.maxScore) ??
    SCORE_SCENARIOS[SCORE_SCENARIOS.length - 1]
  );
}
