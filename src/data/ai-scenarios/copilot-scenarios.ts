// ─── LLM Copilot Senaryoları — Keyword Match ─────────────────────
// Day 18'deki chat ekranında kullanılır.
// Gerçek LLM çağrısı yokken bu sabit yanıtlar döner.

export type CopilotIntent =
  | 'budget_status'
  | 'savings_advice'
  | 'subscription_review'
  | 'spending_breakdown'
  | 'anomaly_question'
  | 'investment_hint'
  | 'goal_advice'
  | 'compare_months'
  | 'bill_reminder'
  | 'category_question'
  | 'greeting'
  | 'fallback';

export type CopilotScenario = {
  intent: CopilotIntent;
  triggers: string[];       // bu kelimeleri içeriyorsa bu yanıt döner
  question: string;         // örnek soru (UI'da gösterilebilir)
  answer: string;
  followUp?: string;        // opsiyonel takip sorusu
  chips?: string[];         // hızlı yanıt butonları
};

export const COPILOT_SCENARIOS: CopilotScenario[] = [
  {
    intent: 'greeting',
    triggers: ['merhaba', 'selam', 'hey', 'nasılsın', 'günaydın', 'iyi günler'],
    question: 'Merhaba!',
    answer: 'Merhaba! 👋 Ben Nova finansal asistanınım. Bu ay harcamalarınız, tasarruf önerileriniz veya bütçeniz hakkında sorularınızı yanıtlayabilirim.',
    chips: ['Bu ayki durumum nasıl?', 'Tasarruf önerisi ver', 'Aboneliklerimi gözden geçir'],
  },
  {
    intent: 'budget_status',
    triggers: ['bütçe', 'durum', 'bu ay ne kadar', 'harcadım', 'toplam', 'nasıl gidiyor'],
    question: 'Bu ay bütçem nasıl?',
    answer: `Eylül 2026 için bir güncelleme:\n\n💰 Toplam harcama: ₺4.820\n📊 Geçen aya göre: ₺340 daha az harcadın 🎉\n\nEn yüksek harcaman Yemek kategorisinde (₺1.240, toplam %26). Alışveriş ise ₺890 ile ikinci sırada.\n\nFinansal Sağlık Skorun bu ay 72/100 — "İyi" seviyede.`,
    followUp: 'Hangi kategoride tasarruf yapmak istersin?',
    chips: ['Yemek harcamalarım', 'Aboneliklerim', 'Tasarruf önerisi'],
  },
  {
    intent: 'savings_advice',
    triggers: ['tasarruf', 'birikim', 'para biriktir', 'nasıl biriktirebilirim', 'önerir misin'],
    question: 'Tasarruf önerisi verir misin?',
    answer: `Senin için 3 hızlı tasarruf fırsatı buldum:\n\n1. 🍕 Yemek siparişi — Bu ay 34 sipariş vermişsin. Haftada 2 siparişi evde pişirerek yaklaşık ₺400 tasarruf edebilirsin.\n\n2. 📺 Abonelikler — 6 aktif aboneliğin var. Disney+ ve BluTV'yi iptal edersen aylık ₺180 kalır cebinde.\n\n3. 🚗 Ulaşım — Taksi yerine metro kullanımını artırırsan aylık ₺120 tasarruf edebilirsin.\n\nToplam potansiyel tasarruf: ~₺700/ay 🎯`,
    chips: ['Aboneliklerimi göster', 'Daha fazla öneri', 'Hedef oluştur'],
  },
  {
    intent: 'subscription_review',
    triggers: ['abonelik', 'netflix', 'spotify', 'iptal', 'aboneliklerim', 'aylık ödemeler'],
    question: 'Aboneliklerimi gözden geçirir misin?',
    answer: `6 aktif aboneliğin var, aylık toplam: ₺475\n\n🎬 Netflix — ₺219 (fiyat arttı! Önceki: ₺182)\n🎵 Spotify — ₺99 (fiyat arttı! Önceki: ₺69)\n📺 Disney+ — ₺79\n📡 BluTV — ₺49\n☁️ Google One — ₺19\n🎮 Xbox Game Pass — ₺10\n\n💡 Öneri: Netflix ve Spotify fiyatları bu ay arttı. Disney+ ve BluTV kullanım sıklığın düşük — ikisini iptal edersen ₺128/ay kazanırsın.`,
    chips: ['İptal önerileri', 'Fiyat artışları', 'Abonelik takvimi'],
  },
  {
    intent: 'spending_breakdown',
    triggers: ['dağılım', 'kategori', 'nereye harcıyorum', 'en çok', 'breakdown', 'analiz'],
    question: 'Harcamalarım nereye gidiyor?',
    answer: `Eylül harcama dağılımın:\n\n🍕 Yemek: ₺1.240 (%26)\n🛍️ Alışveriş: ₺890 (%18)\n🎮 Eğlence: ₺620 (%13)\n📦 Diğer: ₺615 (%13)\n🚗 Ulaşım: ₺480 (%10)\n⚡ Faturalar: ₺475 (%10)\n❤️ Sağlık: ₺280 (%6)\n📚 Eğitim: ₺220 (%4)\n\nYaş grubun ortalamasıyla kıyaslandığında alışverişte iyi performans gösteriyorsun!`,
    chips: ['Para haritasını aç', 'Karşılaştır', 'Tasarruf önerisi'],
  },
  {
    intent: 'anomaly_question',
    triggers: ['şüpheli', 'anormal', 'anomali', 'çift', 'hata', 'fark ettim', 'garip işlem'],
    question: 'Şüpheli işlem var mı?',
    answer: `Bu ay 2 yüksek riskli anomali tespit ettim:\n\n⚠️ Çift tahsilat — Starbucks 8 Eyl. ₺78 (aynı tutar 2 kez)\n🔺 Alışılmadık tutar — Trendyol 3 Eyl. ₺1.840 (ortalamanın 2,5 katı)\n\nEğer bu işlemleri siz yapmadıysanız bankayı hemen aramanızı öneririm. Starbucks işlemi için itiraz hakkınız bulunuyor.`,
    chips: ['Tüm anomalileri gör', 'Nasıl itiraz ederim?'],
  },
  {
    intent: 'compare_months',
    triggers: ['geçen ay', 'ağustos', 'karşılaştır', 'fark', 'değişim', 'önceki ay'],
    question: 'Geçen ayla karşılaştırabilir misin?',
    answer: `Eylül vs Ağustos karşılaştırması:\n\n📉 Toplam: ₺4.820 vs ₺5.160 → ₺340 tasarruf (%6,6)\n\nİyileşen kategoriler:\n✅ Alışveriş: ₺340 azaldı\n✅ Ulaşım: ₺60 azaldı\n\nKötüleşen kategoriler:\n❌ Yemek: ₺180 arttı\n❌ Eğlence: ₺90 arttı\n\nGenel trend olumlu! Yemek kategorisini kontrol altına alırsan gelecek ay daha iyi olur.`,
    chips: ['Yemek harcamalarım', 'Takvimi aç'],
  },
  {
    intent: 'category_question',
    triggers: ['yemek', 'alışveriş', 'ulaşım', 'eğlence', 'fatura', 'sağlık', 'eğitim'],
    question: 'Bu kategoride ne kadar harcadım?',
    answer: 'Hangi kategori hakkında bilgi almak istersin? Yemek, Alışveriş, Ulaşım, Eğlence, Faturalar, Sağlık veya Eğitim kategorilerinden birini seçebilirsin.',
    chips: ['Yemek', 'Alışveriş', 'Ulaşım', 'Eğlence'],
  },
  {
    intent: 'goal_advice',
    triggers: ['hedef', 'tatil', 'araba', 'telefon', 'birikim hedefi', 'ne zaman'],
    question: 'Hedef oluşturmama yardım eder misin?',
    answer: `Mevcut tasarruf hızına göre bazı ulaşılabilir hedefler:\n\n🏖️ Tatil fonu (₺5.000): ~4 ay\n📱 Yeni telefon (₺25.000): ~21 ay\n🚗 Araç peşinatı (₺50.000): ~42 ay\n\nHer ay ₺1.200 biriktiriyorsun. Aylık 200₺ daha eklersen tatil fonuna 3 ayda ulaşırsın! Hedef oluşturmak ister misin?`,
    chips: ['Hedef oluştur', 'Mevcut hedeflerim'],
  },
  {
    intent: 'bill_reminder',
    triggers: ['fatura', 'ödeme', 'son gün', 'hatırlatma', 'ne zaman ödemem'],
    question: 'Yaklaşan ödemelerim neler?',
    answer: `Önümüzdeki 7 gün içindeki ödemeler:\n\n⚡ Elektrik faturası — 13 Eylül — ₺287\n🌊 Su faturası — 15 Eylül — ₺64\n📱 Turkcell — 18 Eylül — ₺299\n\nToplam: ₺650\n\n💡 Otomatik ödeme talimatı vererek gecikme riskini ortadan kaldırabilirsin.`,
    chips: ['Takvimi aç', 'Otomatik ödeme'],
  },
  {
    intent: 'investment_hint',
    triggers: ['yatırım', 'hisse', 'kripto', 'altın', 'döviz', 'nereye yatırım'],
    question: 'Yatırım hakkında ne düşünüyorsun?',
    answer: `⚠️ Yatırım tavsiyesi veremem — bu yasal bir kısıtlama.\n\nAnca sana şunları söyleyebilirim:\n\n📊 Mevcut varlık dağılımın:\n• Hisse Senedi: %40 (₺4.980)\n• Kripto: %30 (₺3.735)\n• Altın/Gümüş: %20 (₺2.490)\n• Nakit: %10 (₺1.245)\n\nAyrıntılı yatırım kararları için lisanslı bir finansal danışmana başvurmanı öneririm.`,
    chips: ['Varlıklarımı gör', 'Finansal skor'],
  },
  {
    intent: 'fallback',
    triggers: [],
    question: '',
    answer: 'Bunu tam anlayamadım 🤔 Sana şu konularda yardımcı olabilirim:\n\n• Bu ayki bütçe durumun\n• Tasarruf önerileri\n• Abonelik incelemesi\n• Anomali ve şüpheli işlemler\n• Geçen ayla karşılaştırma\n\nHangisi hakkında konuşmak istersin?',
    chips: ['Bütçe durumum', 'Tasarruf önerisi', 'Anomaliler'],
  },
];

// ── Intent eşleştirme ─────────────────────────────────────────────
export function matchIntent(userMessage: string): CopilotScenario {
  const lower = userMessage.toLowerCase();

  for (const scenario of COPILOT_SCENARIOS) {
    if (scenario.intent === 'fallback') continue;
    if (scenario.triggers.some(t => lower.includes(t))) {
      return scenario;
    }
  }

  // Fallback
  return COPILOT_SCENARIOS.find(s => s.intent === 'fallback')!;
}

// ── Önerilen başlangıç soruları ───────────────────────────────────
export const SUGGESTED_QUESTIONS: string[] = [
  'Bu ay bütçem nasıl?',
  'Tasarruf önerisi ver',
  'Aboneliklerimi gözden geçir',
  'Şüpheli işlem var mı?',
  'Geçen ayla karşılaştır',
  'Yaklaşan ödemelerim neler?',
];
