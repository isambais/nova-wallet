// ─── Fiş Okuyucu Demo Senaryoları ────────────────────────────────
// AI fiş analizi için mock veri

export type ItemCategory = 'market' | 'yemek' | 'kafe' | 'elektronik' | 'ulaşım' | 'diğer';

export type ReceiptItem = {
  name: string;
  qty: number;
  amount: number;
  category: ItemCategory;
};

export type CategorySummary = {
  category: ItemCategory;
  label: string;
  total: number;
  color: string;
};

export type MockReceipt = {
  id: string;
  label: string;         // Kart etiketi (demo seçiminde)
  store: string;
  storeType: string;     // Market, Restoran, vb.
  date: string;
  items: ReceiptItem[];
  aiSummary: string;
  aiTip: string;
};

// ─── Renk Haritası ────────────────────────────────────────────────
export const CATEGORY_META: Record<ItemCategory, { label: string; color: string }> = {
  market:     { label: 'Market',      color: '#10B981' },
  yemek:      { label: 'Yemek',       color: '#F59E0B' },
  kafe:       { label: 'Kafe',        color: '#8B5CF6' },
  elektronik: { label: 'Elektronik',  color: '#3B82F6' },
  ulaşım:     { label: 'Ulaşım',      color: '#EC4899' },
  diğer:      { label: 'Diğer',       color: '#6B7280' },
};

// ─── Demo Fişler ──────────────────────────────────────────────────
export const MOCK_RECEIPTS: MockReceipt[] = [
  {
    id: 'r1',
    label: 'Market Fişi',
    store: 'BİM Market',
    storeType: 'Market',
    date: '08 Eyl 2026, 14:22',
    items: [
      { name: 'Ekmek 400g',        qty: 2,  amount: 28,   category: 'market' },
      { name: 'Süt 1L',            qty: 3,  amount: 75,   category: 'market' },
      { name: 'Makarna 500g',       qty: 2,  amount: 44,   category: 'market' },
      { name: 'Yoğurt 1kg',         qty: 1,  amount: 62,   category: 'market' },
      { name: 'Zeytinyağı 1L',      qty: 1,  amount: 185,  category: 'market' },
      { name: 'Domates 1kg',        qty: 1,  amount: 32,   category: 'market' },
      { name: 'Şampuan',            qty: 1,  amount: 89,   category: 'diğer'  },
    ],
    aiSummary: 'Dengeli bir market alışverişi. Temel gıda ürünleri ağırlıklı.',
    aiTip: 'Bu harcama bütçenizin %3.5\'ine karşılık geliyor. Market alışverişleriniz ortalama seviyede.',
  },
  {
    id: 'r2',
    label: 'Restoran Fişi',
    store: 'Urfa Sofrası',
    storeType: 'Restoran',
    date: '07 Eyl 2026, 20:45',
    items: [
      { name: 'Adana Kebap',        qty: 2,  amount: 580,  category: 'yemek' },
      { name: 'Mercimek Çorbası',   qty: 2,  amount: 120,  category: 'yemek' },
      { name: 'Ayran',              qty: 2,  amount: 60,   category: 'yemek' },
      { name: 'Tatlı',              qty: 1,  amount: 110,  category: 'yemek' },
      { name: 'Servis',             qty: 1,  amount: 50,   category: 'yemek' },
    ],
    aiSummary: 'Dışarıda yemek harcaması. Bu ay 4. restoran ziyaretiniz.',
    aiTip: 'Bu ay restoran harcamalarınız toplamı ₺3.240. Aylık bütçenizin %27\'si — hedef %20\'nin altı.',
  },
  {
    id: 'r3',
    label: 'Kafe & Elektronik',
    store: 'MediaMarkt + Starbucks',
    storeType: 'Karma',
    date: '06 Eyl 2026, 11:30',
    items: [
      { name: 'USB-C Kablo 2m',     qty: 1,  amount: 349,  category: 'elektronik' },
      { name: 'Bluetooth Kulaklık', qty: 1,  amount: 1249, category: 'elektronik' },
      { name: 'Caramel Latte L',    qty: 2,  amount: 310,  category: 'kafe' },
      { name: 'Muffin',             qty: 1,  amount: 95,   category: 'kafe' },
    ],
    aiSummary: 'Elektronik ve kafe harcaması. Kulaklık bütçe dışı harcama.',
    aiTip: 'Kulaklık bütçede planlanmamış bir harcama. Tatil fonunuz ₺200 daha geç dolacak.',
  },
];

// ─── Kategorileri hesapla ─────────────────────────────────────────
export function calcCategories(receipt: MockReceipt): CategorySummary[] {
  const map: Partial<Record<ItemCategory, number>> = {};
  for (const item of receipt.items) {
    map[item.category] = (map[item.category] ?? 0) + item.amount;
  }
  return (Object.entries(map) as [ItemCategory, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([cat, total]) => ({
      category: cat,
      label: CATEGORY_META[cat].label,
      total,
      color: CATEGORY_META[cat].color,
    }));
}

export function calcTotal(receipt: MockReceipt): number {
  return receipt.items.reduce((s, i) => s + i.amount, 0);
}
