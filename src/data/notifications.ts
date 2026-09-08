export type NotifCategory = 'odeme' | 'analiz' | 'guvenlik' | 'hedef' | 'sistem';

export type Notification = {
  id: string;
  category: NotifCategory;
  title: string;
  body: string;
  time: string;       // "2 saat önce" etc.
  read: boolean;
  icon: string;       // emoji
  actionLabel?: string;
  actionRoute?: string;
};

export const NOTIFICATIONS: Notification[] = [
  // ── Bugün ──────────────────────────────────────────────────────
  {
    id: 'n1',
    category: 'odeme',
    title: 'Abonelik yenilendi',
    body: 'Netflix aylık aboneliğin ₺149 olarak tahsil edildi.',
    time: '14 dak önce',
    read: false,
    icon: '🎬',
    actionLabel: 'Görüntüle',
    actionRoute: '/screens/takvim',
  },
  {
    id: 'n2',
    category: 'analiz',
    title: 'Aylık rapor hazır',
    body: 'Eylül 2026 harcama raporun hazır. Geçen aya göre ₺340 tasarruf ettin!',
    time: '2 saat önce',
    read: false,
    icon: '📊',
    actionLabel: 'Hikayeni gör',
    actionRoute: '/screens/harcama-hikayesi',
  },
  {
    id: 'n3',
    category: 'guvenlik',
    title: 'Yeni giriş tespit edildi',
    body: 'Hesabına İstanbul, TR konumundan yeni bir giriş yapıldı.',
    time: '3 saat önce',
    read: false,
    icon: '🔐',
  },
  {
    id: 'n4',
    category: 'odeme',
    title: 'Fatura ödeme hatırlatması',
    body: 'Elektrik faturanın son ödeme tarihi 5 gün sonra. Tutar: ₺287.',
    time: '6 saat önce',
    read: false,
    icon: '⚡',
    actionLabel: 'Takvimde gör',
    actionRoute: '/screens/takvim',
  },

  // ── Dün ──────────────────────────────────────────────────────
  {
    id: 'n5',
    category: 'hedef',
    title: 'Tasarruf hedefine ulaştın 🎉',
    body: 'Bu ay için belirlediğin ₺500 tasarruf hedefine ulaştın. Tebrikler!',
    time: 'Dün 18:30',
    read: true,
    icon: '🏆',
  },
  {
    id: 'n6',
    category: 'analiz',
    title: 'Yemek harcaması uyarısı',
    body: 'Bu ay yemek bütçenin %85\'ini kullandın. Aylık limitin ₺1.500.',
    time: 'Dün 12:15',
    read: true,
    icon: '🍕',
    actionLabel: 'Para haritası',
    actionRoute: '/screens/para-haritasi',
  },
  {
    id: 'n7',
    category: 'odeme',
    title: 'Spotify ödendi',
    body: 'Spotify Premium aboneliğin ₺69 olarak yenilendi.',
    time: 'Dün 09:00',
    read: true,
    icon: '🎵',
  },

  // ── Bu hafta ─────────────────────────────────────────────────
  {
    id: 'n8',
    category: 'analiz',
    title: 'Haftalık özet',
    body: 'Bu hafta 47 işlem gerçekleştirdin. En yüksek harcama kategorin Yemek.',
    time: '3 gün önce',
    read: true,
    icon: '📈',
    actionLabel: 'Karşılaştır',
    actionRoute: '/screens/karsilastirma',
  },
  {
    id: 'n9',
    category: 'guvenlik',
    title: 'İki faktörlü doğrulama',
    body: 'Güvenliğin için iki faktörlü kimlik doğrulamayı etkinleştirmeni öneririz.',
    time: '4 gün önce',
    read: true,
    icon: '🛡️',
  },
  {
    id: 'n10',
    category: 'sistem',
    title: 'Nova Wallet güncellendi',
    body: 'v2.4.0 sürümüne güncellendi. Yeni özellikler: Para Haritası, Harcama Takvimi.',
    time: '5 gün önce',
    read: true,
    icon: '🚀',
  },
];

export const CATEGORY_LABELS: Record<NotifCategory, string> = {
  odeme:    'Ödeme',
  analiz:   'Analiz',
  guvenlik: 'Güvenlik',
  hedef:    'Hedef',
  sistem:   'Sistem',
};

export const CATEGORY_COLORS: Record<NotifCategory, string> = {
  odeme:    '#6366F1',
  analiz:   '#10B981',
  guvenlik: '#EF4444',
  hedef:    '#F59E0B',
  sistem:   '#6B7280',
};
