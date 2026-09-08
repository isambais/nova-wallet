// ─── Otomatik Kategorizasyon — Keyword Eşleştirme ────────────────
// Gerçek ML yok. Merchant adı / açıklaması → kategori.

export type Category =
  | 'food'
  | 'shopping'
  | 'transport'
  | 'entertainment'
  | 'bills'
  | 'health'
  | 'education'
  | 'subscription'
  | 'travel'
  | 'other';

export type CategoryMeta = {
  key: Category;
  label: string;
  labelEN: string;
  color: string;
  icon: string;
};

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  food:          { key: 'food',          label: 'Yemek & İçecek',  labelEN: 'Food & Drink',     color: '#F59E0B', icon: '🍕' },
  shopping:      { key: 'shopping',      label: 'Alışveriş',       labelEN: 'Shopping',          color: '#EC4899', icon: '🛍️' },
  transport:     { key: 'transport',     label: 'Ulaşım',          labelEN: 'Transport',         color: '#10B981', icon: '🚗' },
  entertainment: { key: 'entertainment', label: 'Eğlence',         labelEN: 'Entertainment',     color: '#8B5CF6', icon: '🎮' },
  bills:         { key: 'bills',         label: 'Faturalar',       labelEN: 'Bills & Utilities', color: '#6366F1', icon: '⚡' },
  health:        { key: 'health',        label: 'Sağlık',          labelEN: 'Health',            color: '#EF4444', icon: '❤️' },
  education:     { key: 'education',     label: 'Eğitim',          labelEN: 'Education',         color: '#0EA5E9', icon: '📚' },
  subscription:  { key: 'subscription',  label: 'Abonelik',        labelEN: 'Subscriptions',     color: '#7C3AED', icon: '🔄' },
  travel:        { key: 'travel',        label: 'Seyahat',         labelEN: 'Travel',            color: '#F97316', icon: '✈️' },
  other:         { key: 'other',         label: 'Diğer',           labelEN: 'Other',             color: '#6B7280', icon: '📦' },
};

// ── Keyword haritası ──────────────────────────────────────────────
type KeywordRule = { keywords: string[]; category: Category };

const KEYWORD_RULES: KeywordRule[] = [
  // Yemek
  { keywords: ['getir', 'yemeksepeti', 'trendyol yemek', 'migros yemek', 'starbucks', 'mcdonald', 'burger king', 'kfc', 'domino', 'pizza', 'cafe', 'kafeterya', 'restoran', 'lokanta', 'sushi', 'döner', 'pastane', 'fırın', 'kahve', 'tea', 'çay', 'pide'], category: 'food' },

  // Alışveriş
  { keywords: ['migros', 'bim', 'a101', 'şok', 'carrefour', 'metro market', 'file', 'trendyol', 'hepsiburada', 'n11', 'amazon', 'zara', 'h&m', 'lcw', 'koton', 'mango', 'defacto', 'boyner', 'ikea', 'teknosa', 'mediamarkt', 'vatan', 'çiçeksepeti'], category: 'shopping' },

  // Ulaşım
  { keywords: ['bolt', 'uber', 'bitaksi', 'otogar', 'thyao', 'türk hava', 'pegasus', 'sunexpress', 'moov', 'metro', 'metrobüs', 'istanbulkart', 'akbil', 'benzin', 'shell', 'opet', 'bp', 'petrol', 'otopark', 'park'], category: 'transport' },

  // Eğlence
  { keywords: ['steam', 'playstation', 'xbox', 'nintendo', 'sinema', 'cinemaximum', 'cgv', 'biletix', 'konser', 'theater', 'tiyatro', 'bowling', 'lazer'], category: 'entertainment' },

  // Abonelikler
  { keywords: ['netflix', 'spotify', 'youtube premium', 'apple', 'google one', 'disney', 'blutv', 'gain', 'puhu', 'tod', 'exxen', 'amazon prime', 'canva', 'dropbox', 'notion', 'chatgpt', 'openai', 'microsoft 365', 'adobe'], category: 'subscription' },

  // Faturalar
  { keywords: ['elektrik', 'ayedaş', 'başkent doğalgaz', 'igdaş', 'su idaresi', 'iski', 'doğalgaz', 'turkcell', 'vodafone', 'türk telekom', 'superonline', 'internet', 'fatura', 'dask', 'sigorta', 'konut'], category: 'bills' },

  // Sağlık
  { keywords: ['eczane', 'pharmacy', 'hastane', 'hospital', 'klinik', 'doktor', 'diş', 'optik', 'gözlük', 'medikal', 'acıbadem', 'memorial', 'medical park', 'liv'], category: 'health' },

  // Eğitim
  { keywords: ['udemy', 'coursera', 'duolingo', 'bein sport', 'kitap', 'kitabevi', 'd&r', 'idefix', 'okul', 'üniversite', 'kurs', 'dershane', 'sınav', 'ödev', 'özel ders'], category: 'education' },

  // Seyahat
  { keywords: ['otel', 'hotel', 'hostel', 'airbnb', 'booking', 'tatil', 'tur', 'resort', 'tatilsepeti', 'trivago', 'expedia', 'obilet'], category: 'travel' },
];

// ── Kategorize etme fonksiyonu ────────────────────────────────────
export function categorize(merchantOrDescription: string): Category {
  const lower = merchantOrDescription.toLowerCase().trim();

  for (const rule of KEYWORD_RULES) {
    if (rule.keywords.some(kw => lower.includes(kw))) {
      return rule.category;
    }
  }

  return 'other';
}

export function categorizeBatch(
  items: Array<{ id: string; description: string }>
): Array<{ id: string; category: Category; meta: CategoryMeta }> {
  return items.map(item => {
    const category = categorize(item.description);
    return { id: item.id, category, meta: CATEGORY_META[category] };
  });
}

// ── Demo kullanım ─────────────────────────────────────────────────
export const DEMO_CATEGORIZATION = categorizeBatch([
  { id: '1', description: 'Getir Yemek' },
  { id: '2', description: 'Netflix' },
  { id: '3', description: 'Migros' },
  { id: '4', description: 'Bolt' },
  { id: '5', description: 'Eczane Güven' },
  { id: '6', description: 'Udemy kurs' },
  { id: '7', description: 'Türk Telekom fatura' },
  { id: '8', description: 'Booking.com' },
]);
