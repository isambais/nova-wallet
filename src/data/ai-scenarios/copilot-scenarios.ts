// ─── LLM Finans Copilot Senaryoları ──────────────────────────────
// Mock fallback yanıtları — backend/proxy erişilemediğinde kullanılır.

export type CopilotMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

export type QuickPrompt = {
  id: string;
  label: string;
  query: string;
};

// ─── Hızlı Soru Chipleri ─────────────────────────────────────────
export const QUICK_PROMPTS: QuickPrompt[] = [
  { id: 'q1', label: 'Harcamalarım nasıl?',  query: 'Bu ay harcamalarım nasıl görünüyor?' },
  { id: 'q2', label: 'Birikim önerisi',       query: 'Birikim için önerin var mı?' },
  { id: 'q3', label: 'Bu ay durumum?',        query: 'Bu ayki finansal durumum nasıl?' },
  { id: 'q4', label: 'Aboneliklerim',         query: 'Aboneliklerimde tasarruf edebilir miyim?' },
  { id: 'q5', label: 'Tatil hedefim',         query: 'Tatil hedefime ne zaman ulaşırım?' },
];

// ─── Mock Yanıtlar (anahtar: tam sorgu metni) ─────────────────────
export const MOCK_RESPONSES: Record<string, string> = {
  'Bu ay harcamalarım nasıl görünüyor?':
    'Bu ay toplam ₺8.240 harcadınız. Geçen aya göre %12 artış var.\n\nEn yüksek kategoriler:\n· Yemek & İçecek: ₺2.100\n· Ulaşım: ₺1.400\n· Eğlence: ₺980\n\nYemek harcamaları bütçenizin %25\'ini oluşturuyor — hafif kısmanızı öneririm.',

  'Birikim için önerin var mı?':
    'Mevcut tasarruf oranınız %14 — bu iyi bir seviye!\n\nÖnerilerim:\n1. Otomatik birikim talimatı verin (maaş günü, otomatik transfer)\n2. Kullanmadığınız 3 aboneliği iptal ederek aylık ₺360 tasarruf edebilirsiniz\n3. Yemek harcamalarını ₺200 kısarak tatil hedefinize 2 ay erken ulaşabilirsiniz',

  'Bu ayki finansal durumum nasıl?':
    'Finansal Sağlık Skoru: 72 / 100 — İyi\n\nGelir: ₺12.000\nGider: ₺8.240 (%68)\nBirikim: ₺1.200 (%10)\n\nOlumlu: Tüm ödemeler zamanında yapılmış.\nGeliştirme: Yemek ve eğlence bütçesi biraz yüksek.',

  'Aboneliklerimde tasarruf edebilir miyim?':
    'Tespit ettiğim aktif abonelikler:\n\n· Netflix: ₺120/ay\n· Spotify: ₺65/ay\n· Spor salonu: ₺290/ay (son 45 gündür gidilmemiş)\n· Bulut depolama: ₺85/ay\n\nSpor salonunu duraklatırsanız ₺290/ay tasarruf edersiniz. Yıllık ₺3.480 eder.',

  'Tatil hedefime ne zaman ulaşırım?':
    'Tatil Fonu hedefi: ₺5.000\nMevcut birikim: ₺2.400 (%48)\nAylık katkı: ₺1.200\n\nMevcut hızla → 2 ay 18 gün\nAylık ₺200 eklerseniz → 2 ay 4 gün\nAylık ₺500 eklerseniz → 1 ay 28 gün\n\nHedefe bu yaz rahatlıkla ulaşabilirsiniz.',
};

// ─── Genel Fallback Yanıtlar ──────────────────────────────────────
export const FALLBACK_RESPONSES: string[] = [
  'Finansal verilerinizi analiz etmek için daha fazla bilgiye ihtiyacım var. Şunu söyleyebilirim: tutarlı bir birikim alışkanlığı sürdürmeniz çok değerli — bu konuda iyi gidiyorsunuz.',
  'Güzel bir soru! Genel bir öneri: acil durum fonu oluşturmak her zaman öncelikli olmalı. 3 aylık giderinizi bir kenara ayırmanız uzun vadede büyük fark yaratır.',
  'Bu konuda kesin bir tahmin veremem, ancak harcama kategorilerinizi haftalık bazda takip etmeniz, bütçe kontrolünü önemli ölçüde artırır.',
  'Finansal hedeflerinize ulaşmak için en kritik adım düzenli takip ve küçük alışkanlık değişiklikleridir. Sabit giderlerinizi gözden geçirelim mi?',
];

// ─── Karşılama Mesajı ─────────────────────────────────────────────
export const GREETING_MESSAGE =
  'Merhaba! Ben Nova AI Copilot.\n\nFinansal sorularınızı yanıtlamak, harcama alışkanlıklarınızı analiz etmek ve birikim hedeflerinize ulaşmanıza yardımcı olmak için buradayım.\n\nNasıl yardımcı olabilirim?';

// ─── Not: Yatırım tavsiyesi verilmez ─────────────────────────────
export const DISCLAIMER =
  'Bu uygulama finansal farkındalık amaçlıdır. Yatırım tavsiyesi niteliği taşımaz.';
