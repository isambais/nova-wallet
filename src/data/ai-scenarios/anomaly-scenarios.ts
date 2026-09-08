// ─── Anomali Senaryoları — Hazır Örnek Veri ──────────────────────
// detectAnomalies() çıktısı yerine doğrudan UI'da gösterilebilecek
// zenginleştirilmiş örnek anomali seti.

export type AnomalyScenario = {
  id: string;
  icon: string;
  title: string;
  merchant: string;
  amount: string;
  date: string;
  severity: 'high' | 'medium' | 'low';
  severityLabel: string;
  severityColor: string;
  description: string;
  suggestion: string;
  resolved: boolean;
};

export const ANOMALY_SCENARIOS: AnomalyScenario[] = [
  {
    id: 'a1',
    icon: '⚠️',
    title: 'Olası çift tahsilat',
    merchant: 'Starbucks',
    amount: '₺78',
    date: '8 Eylül',
    severity: 'high',
    severityLabel: 'Yüksek Risk',
    severityColor: '#EF4444',
    description: 'Aynı gün, aynı saat, aynı tutarda iki ayrı Starbucks işlemi tespit ettik. Bu bir çift tahsilat olabilir.',
    suggestion: 'Hesap ekstrenizi kontrol edin. Eğer çift ödeme varsa bankayı arayarak itiraz süreci başlatın.',
    resolved: false,
  },
  {
    id: 'a2',
    icon: '🔺',
    title: 'Alışılmadık yüksek tutar',
    merchant: 'Trendyol',
    amount: '₺1.840',
    date: '3 Eylül',
    severity: 'high',
    severityLabel: 'Yüksek Risk',
    severityColor: '#EF4444',
    description: 'Bu Trendyol işlemi, alışveriş kategorisi ortalamanızın 2,5 katı üzerinde.',
    suggestion: 'Bu alışverişi siz yaptıysanız sorun yok. Yapmadıysanız hemen kartınızı kapatın.',
    resolved: false,
  },
  {
    id: 'a3',
    icon: '📈',
    title: 'Netflix ücreti arttı',
    merchant: 'Netflix',
    amount: '₺219',
    date: '2 Eylül',
    severity: 'medium',
    severityLabel: 'Orta Risk',
    severityColor: '#F59E0B',
    description: 'Netflix aylık abonelik ücretiniz ₺182\'den ₺219\'a yükseldi. Bu %20\'lik bir artış.',
    suggestion: 'Yeni fiyatı onaylamak istemiyorsanız aboneliği iptal edip daha uygun bir plana geçebilirsiniz.',
    resolved: false,
  },
  {
    id: 'a4',
    icon: '📈',
    title: 'Spotify ücreti arttı',
    merchant: 'Spotify',
    amount: '₺99',
    date: '9 Eylül',
    severity: 'medium',
    severityLabel: 'Orta Risk',
    severityColor: '#F59E0B',
    description: 'Spotify Premium ücretiniz ₺69\'dan ₺99\'a çıktı. Yıllık bazda ₺360 ek maliyet demek.',
    suggestion: 'Öğrenci indirimi veya aile planına geçiş yaparak tasarruf edebilirsiniz.',
    resolved: false,
  },
  {
    id: 'a5',
    icon: '🌙',
    title: 'Gece 3\'te Bolt işlemi',
    merchant: 'Bolt',
    amount: '₺62',
    date: '4 Eylül',
    severity: 'medium',
    severityLabel: 'Orta Risk',
    severityColor: '#F59E0B',
    description: 'Gece saat 03:00\'de taksi işlemi gerçekleşti. Gece hareketleri bazen yetkisiz kullanımın işareti olabilir.',
    suggestion: 'Kartınızın gece kullanımı için SMS bildirimi açık tutun.',
    resolved: true,
  },
  {
    id: 'a6',
    icon: '🆕',
    title: 'Yeni merchant — Zara',
    merchant: 'Zara',
    amount: '₺340',
    date: '6 Eylül',
    severity: 'low',
    severityLabel: 'Düşük Risk',
    severityColor: '#6366F1',
    description: 'Zara\'dan ilk kez alışveriş yaptınız. Yeni bir merchant her zaman dikkat edilmesi gereken bir durum.',
    suggestion: 'Siz yaptıysanız sorun yok. İlk kez alışveriş yaptığınız yerleri takip edin.',
    resolved: true,
  },
  {
    id: 'a7',
    icon: '💱',
    title: 'Dolar cinsinden işlem',
    merchant: 'Amazon',
    amount: '₺89',
    date: '7 Eylül',
    severity: 'low',
    severityLabel: 'Düşük Risk',
    severityColor: '#6366F1',
    description: 'Amazon\'dan USD cinsinden işlem gerçekleşti. Kur farkı ve komisyon yansıtılmış olabilir.',
    suggestion: 'Yurt dışı alışverişlerde TL ile ödeme seçeneği sunan kartlar daha avantajlı olabilir.',
    resolved: true,
  },
  {
    id: 'a8',
    icon: '🌙',
    title: 'Gece 23\'te Getir siparişi',
    merchant: 'Getir',
    amount: '₺145',
    date: '5 Eylül',
    severity: 'low',
    severityLabel: 'Düşük Risk',
    severityColor: '#6366F1',
    description: 'Gece 23:00\'de yemek siparişi verildi. Gece siparişleri genellikle daha pahalı olur.',
    suggestion: 'Gece geç saatlerde sipariş vermek yerine önceden hazırlık yaparsanız tasarruf edebilirsiniz.',
    resolved: true,
  },
];

export const UNRESOLVED_ANOMALIES = ANOMALY_SCENARIOS.filter(a => !a.resolved);
export const RESOLVED_ANOMALIES   = ANOMALY_SCENARIOS.filter(a =>  a.resolved);
