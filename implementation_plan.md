# Implementation Plan — NOVA Wallet

**Çok Dilli, Sosyal ve Akıllı Finans Asistanı Mobil Uygulaması**

| Alan | Bilgi |
|---|---|
| Proje Adı | NOVA Wallet |
| Geliştirici | Isam |
| Süre | 20 iş günü |
| Alan | FinTech / Mobile App / Personal Finance / AI |
| Stack | TypeScript, React Native, Expo, Expo Router, Node.js, LLM API |
| Doküman Sürümü | v2.0 |
| Doküman Türü | Implementation Plan / Single Source of Truth |

---

## İçindekiler

1. [Yönetici Özeti](#1-yönetici-özeti)
2. [Problem Tanımı ve Hedefler](#2-problem-tanımı-ve-hedefler)
3. [Kapsam](#3-kapsam)
4. [Teknoloji Yığını](#4-teknoloji-yığını)
5. [Proje Dizin Yapısı](#5-proje-dizin-yapısı)
6. [Ürün Konumlandırması ve Temel Fark](#6-ürün-konumlandırması-ve-temel-fark)
7. [Kullanıcı Akışı](#7-kullanıcı-akışı)
8. [Sistem Mimarisi ve Modüller](#8-sistem-mimarisi-ve-modüller)
9. [Çok Dilli Destek ve RTL Stratejisi](#9-çok-dilli-destek-ve-rtl-stratejisi)
10. [Giriş, SMS Doğrulama ve Güvenlik](#10-giriş-sms-doğrulama-ve-güvenlik)
11. [Ana Özellikler](#11-ana-özellikler)
12. [Demo Veri Modeli](#12-demo-veri-modeli)
13. [UI/UX Tasarım Standartları](#13-uiux-tasarım-standartları)
14. [Kodlama Standartları](#14-kodlama-standartları)
15. [Test Stratejisi](#15-test-stratejisi)
16. [Dokümantasyon Yapısı](#16-dokümantasyon-yapısı)
17. [20 İş Günlük Yol Haritası](#17-20-iş-günlük-yol-haritası)
18. [Haftalık Sprint Özeti](#18-haftalık-sprint-özeti)
19. [Git Workflow ve PR Süreci](#19-git-workflow-ve-pr-süreci)
20. [GitHub Projects ve Issue Yönetimi](#20-github-projects-ve-issue-yönetimi)
21. [Daily Standup](#21-daily-standup)
22. [Risk Yönetimi](#22-risk-yönetimi)
23. [Definition of Done](#23-definition-of-done)
24. [Teslim Edilecekler](#24-teslim-edilecekler)
25. [Gerçek Dünya ve Satılabilirlik](#25-gerçek-dünya-ve-satılabilirlik)

---

## 1. Yönetici Özeti

NOVA Wallet, genç kullanıcılar ve genç profesyoneller için tasarlanan çok dilli bir sosyal finans asistanıdır. Uygulamanın amacı sadece para gönderme veya kart kullanma hissi vermek değildir; kullanıcının haftalık para akışını anlamasını, hedeflerine para ayırmasını, arkadaşlarıyla ortak bütçe yönetmesini, aboneliklerini temizlemesini ve harcama kararlarını daha bilinçli almasını sağlamaktır.

Papara ve benzeri ürünler işlem tabanlıdır. NOVA Wallet karar destek tabanlıdır:

- Kullanıcı harcama yapmadan önce "Alırsam Ne Olur?" simülatörüyle bütçe etkisini görür.
- Ortak tatil, ev arkadaşı masrafları veya etkinlik için grup cüzdanı oluşturur.
- Türkçe, İngilizce ve Arapça kullanabilir; Arapça için RTL arayüz desteği bulunur.
- TRY, USD ve EUR para birimlerini destekler.
- SMS doğrulamalı giriş ve PIN akışıyla gerçek fintech hissi oluşturulur.
- AI Intelligence Layer; LLM tabanlı finans copilot, bütçe tahmini, anormal harcama algılama, otomatik kategorilendirme, fiş okuma, sesli asistan, finans skoru ve hedef planlama özelliklerini tek katmanda toplar.
- Para Akışı Takvimi, Harcama Karşılaştırması ve Bildirim Merkezi karar destek deneyimini tamamlar.

Hedef çıktı: Expo tabanlı, TypeScript ile yazılmış, mock verilerle çalışan, çok dilli, görsel olarak güçlü ve sunulabilir bir React Native MVP prototipidir.

---

## 2. Problem Tanımı ve Hedefler

### 2.1 Çözülen Problem

Genç kullanıcılar parasını çoğu zaman sadece "bakiye" olarak görür. Harcamanın ay sonuna etkisini, aboneliklerin toplam yükünü, arkadaşlarla ortak masrafların durumunu veya bir hedefe ne kadar yaklaştığını net takip edemez.

Bu proje, finans uygulamasını işlem merkezli yapıdan karar destek merkezli yapıya taşır:

- Bu harcamayı yaparsam ay sonu durumum ne olur?
- Bu hafta güvenli harcama limitim ne kadar?
- Hangi abonelikler gereksiz para götürüyor?
- Arkadaş grubunda kim ne kadar ödedi?
- Harcama alışkanlıklarım benzer kullanıcılara göre nasıl?

### 2.2 Başarı Kriterleri

- React Native + Expo projesi hatasız çalışacak.
- Splash, dil seçimi, telefon girişi, SMS doğrulama, PIN oluşturma ve ana uygulama akışı tamamlanacak.
- Türkçe, İngilizce ve Arapça çeviri altyapısı çalışacak; RTL desteği uygulanacak.
- TRY, USD ve EUR formatlanarak gösterilecek; dil/para birimi tercihi ayarlardan değiştirilebilecek.
- 22 özelliğin tamamı demo seviyesinde uygulanacak.
- AI Intelligence Layer LLM açıkken ve mock fallback modunda çalışacak.
- Para Akışı Takvimi, Harcama Karşılaştırması ve Bildirim Merkezi mock verilerle çalışacak.
- UI tüm ekran boyutlarında taşmadan çalışacak.
- README, ekran görüntüleri ve pitch metni hazırlanacak.
- Proje GitHub Projects, branch ve PR akışıyla yönetilecek.

---

## 3. Kapsam

### 3.1 Kapsam İçi

- Expo + React Native + TypeScript mobil uygulama
- Splash screen, dil seçimi, RTL layout desteği
- Telefon numarasıyla giriş, SMS doğrulama (demo kodu: `123456`), PIN oluşturma
- Ana uygulama navigasyonu: tab bar + nested screens
- TRY, USD ve EUR para birimi desteği
- Ana cüzdan ekranı, gizli bakiye modu, haftalık para akışı
- Harcama modları, "Alırsam Ne Olur?" simülatörü
- Grup cüzdanı, hedef kartları, abonelik dedektifi
- Harcama hikayesi, para haritası
- Para Akışı Takvimi
- Harcama Karşılaştırması
- Bildirim Merkezi
- Kartlar, akıllı limitler, güvenli sanal kartlar
- AI Finans Copilot, bütçe risk tahmini, anormal harcama algılama
- Akıllı abonelik yorumu, otomatik kategorilendirme, finans sağlığı skoru
- AI hedef planlayıcı, akıllı bütçe otomasyonu
- Fiş/makbuz okuma demo akışı, sesli finans asistanı demo akışı
- Node.js backend/proxy (CORS + rate limiting)
- Profil ve ayarlar ekranı, tema seçimi
- Mock data mimarisi, README ve pitch dokümanı

### 3.2 Kapsam Dışı

Gerçek para transferi, kart basımı, banka hesabı açma, gerçek SMS/KYC, ödeme kuruluşu entegrasyonu, üretim backend'i, sıfırdan LLM eğitimi, PCI-DSS/MASAK/TCMB lisans süreçleri.

---

## 4. Teknoloji Yığını

| Katman | Teknoloji | Gerekçe |
|---|---|---|
| Dil | TypeScript (strict mode) | Tip güvenliği ve sürdürülebilirlik |
| Mobil Framework | React Native | iOS ve Android için tek kod tabanı |
| Geliştirme Platformu | Expo | Hızlı kurulum, kolay demo |
| Routing | Expo Router | File-based routing |
| Stil | NativeWind v4 | Tailwind uyumlu, Expo destekli |
| State Management | Zustand | Sade global state yönetimi |
| Çeviri | i18next + react-i18next | React Native uyumlu i18n |
| RTL | React Native I18nManager | Arapça RTL için resmi mekanizma |
| Güvenli Depolama | expo-secure-store | PIN/auth token için |
| Basit Depolama | AsyncStorage | Dil, tema, onboarding durumu |
| Form Yönetimi | React Hook Form | Formlar için |
| Validasyon | Zod | Merkezi form kuralları |
| Animasyon | React Native Reanimated | Kartlar ve geçişler |
| İkonlar | lucide-react-native | Tutarlı ikon sistemi |
| Grafikler | react-native-gifted-charts | Expo uyumlu, hafif |
| Backend | Node.js + Express | LLM proxy |
| Rate Limiting | express-rate-limit | 5 istek/dakika, kota koruması |
| LLM | Hazır LLM API | Sıfırdan eğitim yok |
| Test | Jest + React Native Testing Library | Component ve unit testler |
| Versiyon Kontrol | Git + GitHub | Branch ve PR yönetimi |
| Proje Yönetimi | GitHub Projects | 20 günlük sprint takibi |

---

## 5. Proje Dizin Yapısı
nova-wallet/
├── app/
│ ├── _layout.tsx
│ ├── index.tsx
│ ├── (auth)/
│ │ ├── language.tsx
│ │ ├── phone.tsx
│ │ ├── verify-sms.tsx
│ │ └── create-pin.tsx
│ ├── (tabs)/
│ │ ├── _layout.tsx
│ │ ├── home.tsx
│ │ ├── wallet.tsx
│ │ ├── cards.tsx
│ │ ├── insights.tsx
│ │ └── profile.tsx
│ └── screens/
│ ├── simulator.tsx
│ ├── group-wallet.tsx
│ ├── goals.tsx
│ ├── subscriptions.tsx
│ ├── spending-story.tsx
│ ├── money-map.tsx
│ ├── calendar.tsx
│ ├── spending-comparison.tsx
│ ├── notifications.tsx
│ ├── smart-limits.tsx
│ ├── secure-cards.tsx
│ ├── ai-coach.tsx
│ ├── anomaly-alerts.tsx
│ ├── financial-score.tsx
│ ├── goal-planner.tsx
│ ├── receipt-scanner.tsx
│ └── voice-assistant.tsx
├── backend/
│ └── src/
│ ├── index.ts
│ ├── middleware/
│ │ ├── rateLimit.ts
│ │ └── cors.ts
│ ├── routes/
│ │ └── ai.routes.ts
│ ├── services/
│ │ ├── llm.service.ts
│ │ ├── prompt.service.ts
│ │ └── safety.service.ts
│ └── data/
│ └── finance-context.ts
├── src/
│ ├── components/
│ │ ├── ui/
│ │ ├── cards/
│ │ ├── charts/
│ │ └── forms/
│ ├── constants/
│ │ ├── colors.ts
│ │ ├── spacing.ts
│ │ └── typography.ts
│ ├── data/
│ │ ├── transactions.ts
│ │ ├── goals.ts
│ │ ├── groups.ts
│ │ ├── subscriptions.ts
│ │ ├── cards.ts
│ │ ├── insights.ts
│ │ ├── notifications.ts
│ │ ├── benchmarks.ts
│ │ ├── receipts.ts
│ │ └── ai-scenarios/
│ │ ├── copilot-scenarios.ts
│ │ ├── anomaly-scenarios.ts
│ │ └── score-scenarios.ts
│ ├── hooks/
│ │ ├── useBalance.ts
│ │ ├── useTransactions.ts
│ │ ├── useLanguage.ts
│ │ └── useCurrency.ts
│ ├── i18n/
│ │ ├── index.ts
│ │ └── locales/
│ │ ├── tr.json
│ │ ├── en.json
│ │ └── ar.json
│ ├── services/
│ │ ├── auth.service.ts
│ │ ├── simulator.service.ts
│ │ ├── insights.service.ts
│ │ ├── ai.service.ts
│ │ ├── risk-model.service.ts
│ │ ├── anomaly.service.ts
│ │ ├── categorization.service.ts
│ │ ├── receipt.service.ts
│ │ ├── voice.service.ts
│ │ └── storage.service.ts
│ ├── store/
│ │ ├── auth.store.ts
│ │ ├── settings.store.ts
│ │ └── finance.store.ts
│ ├── types/
│ │ ├── auth.ts
│ │ ├── finance.ts
│ │ ├── ai.ts
│ │ └── i18n.ts
│ └── utils/
│ ├── currency.ts
│ ├── date.ts
│ ├── rtl.ts
│ └── validation.ts
├── assets/
├── docs/
│ ├── product/feature-spec.md
│ ├── design/design-system.md
│ ├── legal/fintech-boundaries.md
│ ├── ai/
│ │ ├── ai-architecture.md
│ │ └── prompt-guardrails.md
│ └── pitch/pitch-notes.md
├── tests/
├── README.md
├── app.json
├── package.json
└── implementation_plan.md


> `src/navigation/` kaldırıldı. Expo Router file-based routing kullandığı için ayrı navigation klasörüne gerek yoktur. Navigation tipleri `src/types/` altında tutulur.

---

## 6. Ürün Konumlandırması ve Temel Fark

NOVA Wallet, "Gen Z ve genç profesyoneller için sosyal, akıllı ve çok dilli finans asistanı" olarak konumlandırılır.

Ana vaadi: *Paranı sadece tutma; haftanı, hedeflerini, arkadaş gruplarını ve alışkanlıklarını birlikte yönet.*

| Papara (işlem tabanlı) | NOVA Wallet (karar destek tabanlı) |
|---|---|
| Para gönder | Harcamadan önce etkisini gör |
| Kart kullan | Grup içinde ortak finans yönet |
| Bakiye gör | Abonelikleri analiz et ve temizle |
| İşlem geçmişi | AI ile alışkanlıkları yorumla |
| — | Benzer kullanıcılarla karşılaştır |
| — | TRY/USD/EUR küresel erişim |

---

## 7. Kullanıcı Akışı

**İlk Giriş:**
Splash → Dil Seçimi → Telefon Girişi → SMS Doğrulama → PIN Oluşturma → Ana Cüzdan


**Sonraki Giriş:**
Splash → PIN / Biyometrik Demo Kilit → Ana Cüzdan


**Ana Navigasyon:**

- **Ana Sayfa:** Haftalık Para Akışı, Gizli Bakiye, Son İşlemler, Hızlı Eylemler, Bildirim Merkezi
- **Cüzdan:** Hedef Kartları, Grup Cüzdanı, Harcama Modları
- **Kartlar:** Sanal Kartlar, Akıllı Limitler, Güvenli Kartlar
- **Analiz:** Simülatör, Harcama Hikayesi, Para Haritası, Takvim, Karşılaştırma, Abonelik Dedektifi, Anomali Uyarıları, Finans Skoru, Fiş Okuma, Sesli Asistan
- **Profil:** Dil, Para Birimi, Tema, Güvenlik, AI Copilot

---

## 8. Sistem Mimarisi ve Modüller

**Auth Modülü:** Telefon numarası girişi, SMS simülasyonu (demo kodu: `123456`), PIN oluşturma ve saklama, ilk/sonraki giriş ayrımı.

**Settings Modülü:** Dil seçimi, para birimi tercihi (TRY/USD/EUR), tema seçimi, RTL durumu, gizli bakiye tercihi.

**Finance Modülü:** Mock bakiye (çoklu para birimi), işlem listesi, kategori hesaplama, haftalık para akışı, hedef/grup/abonelik verileri.

**Simulator Modülü:** Tutar, kategori ve para birimi alır; ay sonu etkisini hesaplar; risk seviyesi üretir: düşük / orta / yüksek.

**Insights Modülü:** En pahalı gün, en çok harcanan kategori, geçen aya fark, abonelik toplamı, harcama modu tavsiyesi, takvim verisi, benchmark karşılaştırmaları.

**Notification Modülü:** Mock bildirimler üretir — abonelik yenileme uyarısı, limit yaklaşımı, hedef ilerlemesi, AI önerisi, anomali uyarısı.

**AI Intelligence Layer:** LLM proxy üzerinden Finans Copilot, deterministic servislerden bütçe riski / anomali / skor / kategorilendirme, mock fallback sistemi. Backend'de `express-rate-limit` (5 istek/dakika) ve CORS konfigürasyonu bulunur. API anahtarı asla mobil tarafta tutulmaz.

---

## 9. Çok Dilli Destek ve RTL Stratejisi

| Dil | Kod | Yön |
|---|---|---|
| Türkçe | `tr` | LTR |
| English | `en` | LTR |
| العربية | `ar` | RTL |

- Tüm UI metinleri translation key ile kullanılacak; hardcoded text yazılmayacak.
- Para birimi, tarih ve sayı formatları dile göre formatlanacak.
- RTL'de `I18nManager` kullanılacak; `marginLeft`, `left` gibi yön bağımlı stiller minimize edilecek.
- Bunun yerine `start`, `end` ve merkezi `rtl.ts` helper'ı kullanılacak.
- RTL değişikliği için yeniden başlatma gerekliyse kullanıcıya sade şekilde gösterilecek.

---

## 10. Giriş, SMS Doğrulama ve Güvenlik

Demo doğrulama kodu: `123456`. Gerçek SMS gönderilmez.

Gerçek üründe: Firebase Auth Phone Login, Twilio Verify veya yerel SMS sağlayıcıları kullanılabilir.

PIN 4 haneli; `expo-secure-store` ile saklanır. Güvenlik hissi veren demo detayları: gizli bakiye modu, kart numarası maskeleme, sanal kart dondurma/açma, tek kullanımlık kart, oturum kilidi ekranı.

---

## 11. Ana Özellikler

### 11.1 Alırsam Ne Olur? Simülatörü
Kullanıcı tutar, kategori ve para birimi (TRY/USD/EUR) girer. Haftalık/aylık bütçeye etkisi ve risk seviyesi hesaplanır. Görsel bütçe etkisi gösterilir.

### 11.2 Grup Cüzdanı
Tatil, ev arkadaşlığı, hediye için grup bütçesi. Üyeler ve katkılar (çoklu para birimi), kalan tutar, hesabı bölüş demo akışı.

### 11.3 Harcama Modları
Öğrenci, Tatil, Sıkı Tasarruf, Gece Dışarı modları. Mod seçildiğinde günlük limit ve uyarı metni değişir.

### 11.4 Abonelik Dedektifi
Tekrar eden ödemeler, aylık toplam maliyet (TRY/USD/EUR), gereksiz/az kullanılan abonelik önerisi.

### 11.5 Gizli Bakiye Modu
Tek dokunuşla bakiye bulanık/maskeli. Göster/gizle. AsyncStorage'a kaydedilir.

### 11.6 AI Finans Copilot
Chat ekranında finansal farkındalık soruları. Backend/proxy üzerinden LLM cevabı. LLM yoksa mock fallback. Yatırım tavsiyesi verilmez.

### 11.7 Hedef Kartları
TRY/USD/EUR'da hedef tutarı ve biriken tutar, ilerleme barı, para ekleme simülasyonu.

### 11.8 Harcama Hikayesi
Aylık özet story formatında. En pahalı gün, en çok harcanan kategori, geçen aya fark.

### 11.9 Akıllı Limitler
Kategori bazlı limitler: Yemek, Ulaşım, Eğlence, Oyun, Online Alışveriş. Slider ile değiştirilebilir.

### 11.10 Güvenli Sanal Kartlar
Standart, tek kullanımlık, süreli, mağaza kilitli kart türleri. Kart numarası maskeleme, dondur/aç.

### 11.11 Akıllı Bütçe Otomasyonu
AI, gelir + abonelik + hedef + geçmiş harcamaya göre haftalık bütçe planı önerir.

### 11.12 Ay Sonu Bütçe Tahmini
Mevcut harcama hızına göre ay sonu bütçe aşımı tahmini. Düşük/orta/yüksek risk.

### 11.13 Anormal Harcama Algılama
Alışılmadık tutar, saat veya kategori işaretlenir. "Normal görünüyor" veya "incele" aksiyonu sunulur.

### 11.14 Akıllı Abonelik Yorumu
Toplam abonelik yükü açıklaması, az kullanılan abonelikler öne çıkarılır.

### 11.15 Otomatik Kategorilendirme
Merchant ismine göre kategori tahmini. Kullanıcı kategoriyi değiştirebilir.

### 11.16 Finans Sağlığı Skoru
0-100 arası skor. Girdiler: bütçe aşımı, birikim oranı, abonelik yükü, hedef ilerlemesi, anomali sayısı, kategori uyumu.

### 11.17 AI Hedef Planlayıcı
Hedef adı, tutar (TRY/USD/EUR) ve süre girilir. Haftalık/aylık plan çıkarılır.

### 11.18 Fiş/Makbuz Okuma
Kamera veya galeri seçimi. Demo fiş sonucu: mağaza, tutar, ürün listesi, kategori, AI özeti.

### 11.19 Sesli Finans Asistanı
Mikrofon ekranı ve kayıt animasyonu. Demo transcript AI Copilot ekranına iletilir.

### 11.20 Para Akışı Takvimi
Takvim görünümünde her günün harcaması. Yoğunluğa göre renklendirme. Abonelik günleri işaretlenir. Güne tıklanınca işlem detayı açılır. Mock veriyle çalışır.

### 11.21 Harcama Karşılaştırması
Yaş grubu ortalamasıyla kategori bazlı mock benchmark karşılaştırması. Örnek: "Bu ay yemekte ortalamanın %23 üzerindeydin."

### 11.22 Bildirim Merkezi
Uygulama içi mock bildirim listesi. Bildirim türleri: abonelik yenileme, limit uyarısı, hedef ilerlemesi, AI önerisi, anomali. Okundu/okunmadı durumu.

---

## 12. Demo Veri Modeli

### Para Birimi Tipi
```ts
type Currency = 'TRY' | 'USD' | 'EUR';
```

### Tarih Tipi
```ts
// Tüm tarihler ISO 8601 formatında tutulur: "2024-03-15T14:32:00Z"
type ISODateString = string;
```

### Kullanıcı
```ts
type User = {
  id: string;
  name: string;
  phone: string;
  language: 'tr' | 'en' | 'ar';
  currency: Currency;
  balance: number;
};
```

### İşlem
```ts
type Transaction = {
  id: string;
  title: string;
  merchant: string;
  amount: number;
  currency: Currency;
  category: 'food' | 'transport' | 'entertainment' | 'shopping' | 'bills' | 'subscriptions';
  date: ISODateString;
  location?: string;
};
```

### Hedef
```ts
type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  currency: Currency;
  imageKey: string;
  deadline?: ISODateString;
};
```

### Grup Cüzdanı
```ts
type GroupWallet = {
  id: string;
  title: string;
  targetAmount: number;
  currency: Currency;
  members: { id: string; name: string; paidAmount: number; }[];
};
```

### Abonelik
```ts
type Subscription = {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  billingCycle: 'monthly' | 'yearly';
  lastUsedDaysAgo: number;
  recommendation: 'keep' | 'review' | 'cancel';
};
```

### AI İçgörüsü
```ts
type AiInsight = {
  id: string;
  type: 'budget_risk' | 'anomaly' | 'subscription' | 'goal_plan' | 'financial_score';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  relatedTransactionIds?: string[];
};
```

### Finans Sağlığı Skoru
```ts
type FinancialScore = {
  score: number;
  level: 'weak' | 'average' | 'good' | 'excellent';
  positiveFactors: string[];
  negativeFactors: string[];
};
```

### Fiş/Makbuz
```ts
type Receipt = {
  id: string;
  merchant: string;
  totalAmount: number;
  currency: Currency;
  date: ISODateString;
  items: { name: string; amount: number; category: Transaction['category']; }[];
  aiSummary: string;
};
```

### AI Mesajı
```ts
type AiMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: ISODateString;
  source: 'llm' | 'mock';
};
```

### Bildirim
```ts
type AppNotification = {
  id: string;
  type: 'subscription' | 'limit' | 'goal' | 'ai_insight' | 'anomaly';
  title: string;
  body: string;
  createdAt: ISODateString;
  isRead: boolean;
  relatedId?: string;
};
```

### Takvim Günü
```ts
type CalendarDay = {
  date: ISODateString;
  totalSpent: number;
  currency: Currency;
  transactionIds: string[];
  hasScheduledPayment: boolean;
};
```

### Harcama Karşılaştırması
```ts
type SpendingBenchmark = {
  category: Transaction['category'];
  userAmount: number;
  averageAmount: number;
  currency: Currency;
  percentageDiff: number; // pozitif = ortalamanın üstünde
  label: string;
};
```

---

## 13. UI/UX Tasarım Standartları

- İlk ekran pazarlama sayfası değil; kullanıcı doğrudan ürün akışına girer.
- Finans uygulaması hissi: güvenli, net, hızlı.
- Kartlar ~8px radius; modern ama aşırı yuvarlak değil.
- Butonlarda ikon + kısa metin.
- Sadece dekorasyon için anlamsız gradient kullanılmaz.
- Tüm metinler mobil ekranlarda taşmadan çalışır.
- RTL'de hizalama, ikon yönü ve yatay akış ayrıca kontrol edilir.
- Tab bar en fazla 5 sekme.
- Bildirim sayacı tab bar'da ana sayfa ikonunda gösterilir.
- NativeWind v4 sınıfları tutarlı kullanılır; inline style minimumda.

---

## 14. Kodlama Standartları

- TypeScript strict mode.
- Component isimleri `PascalCase`, fonksiyon/değişken isimleri `camelCase`.
- Ortak UI parçaları `src/components/ui/` altında.
- Custom hook'lar `src/hooks/` altında; logic ekrana gömülmez.
- Translation key olmadan UI metni yazılmaz.
- Mock data ekrana gömülmez, `src/data/` katmanından gelir.
- Para formatları `currency.ts` üzerinden; TRY/USD/EUR locale-aware formatlanır.
- Tarihler ISO 8601, `date.ts` üzerinden formatlanır.
- RTL mantığı `rtl.ts` üzerinden yönetilir.
- LLM API key hiçbir zaman mobil tarafta olmaz.
- AI prompt şablonları backend tarafında tutulur.
- AI cevaplarında yatırım/kredi tavsiyesi yapılmaz.
- LLM başarısız olursa mock fallback cevabı gösterilir.
- `eslint` ve `prettier` kullanılır.

---

## 15. Test Stratejisi

### Birim Testleri
Para formatlama (TRY/USD/EUR), tarih formatlama, simülatör risk hesaplama, abonelik maliyet toplamı, grup cüzdanı borç/katkı hesaplama, finans sağlığı skoru, anormal harcama algılama, otomatik kategori tahmini, AI hedef planlayıcı hesaplama, takvim günü harcama, benchmark yüzde fark.

### Component Testleri
Bakiye gizleme/gösterme, SMS kod input, dil seçimi, hedef kartı, sanal kart, AI chat mesaj, finans skoru, fiş sonuç, sesli asistan kayıt ekranı, bildirim öğesi, takvim hücresi, karşılaştırma kartı.

### Manuel QA
Türkçe, İngilizce, Arapça akış. Küçük/büyük ekran. Koyu/açık tema. İlk ve tekrar giriş. TRY/USD/EUR geçişleri. LLM açık/kapalı AI senaryoları. Yatırım tavsiyesi üretilmemesi. Kamera izni verilmediğinde fiş ekranı. Bildirimler okundu/okunmadı. Takvim ve karşılaştırma ekranları.

---

## 16. Dokümantasyon Yapısı
docs/
├── product/feature-spec.md
├── design/design-system.md
├── legal/fintech-boundaries.md
├── ai/
│ ├── ai-architecture.md
│ └── prompt-guardrails.md
└── pitch/pitch-notes.md


- **feature-spec.md** — Her özelliğin amacı, ekranları, kullanıcı akışı ve demo davranışı.
- **design-system.md** — Renkler, typography, spacing, NativeWind token kullanımı.
- **fintech-boundaries.md** — Gerçek para işlemediği, lisans gerektiren özelliklerin kapsam dışı olduğu açıklanır.
- **ai-architecture.md** — LLM proxy yapısı, deterministic servisler, mock fallback, rate limiting.
- **prompt-guardrails.md** — AI cevaplarının yatırım tavsiyesi vermediği, gerçek kullanıcı verisi işlemediği açıklanır.
- **pitch-notes.md** — Ürün farkı, hedef kitle, satılabilirlik, gerçek dünya yol haritası.

---

## 17. 20 İş Günlük Yol Haritası

Her gün en az 1 anlamlı commit zorunludur.

### Faz 0 — Kurulum ve Ürün Temeli (Gün 1-3)

**Gün 1:** GitHub repo ve Projects board. Expo + TypeScript projesi. Dizin yapısı. Expo Router kurulumu, tab/auth route grupları. NativeWind v4 ve react-native-gifted-charts kurulumu. İlk `implementation_plan.md` commit'i.

**Gün 2:** UI temel componentleri: Button, Input, Screen, Card, Header, IconButton, SectionTitle, ProgressBar. `src/hooks/` dizini ve iskelet hook'lar: `useBalance`, `useTransactions`, `useLanguage`, `useCurrency`.

**Gün 3:** Renk paleti, typography, app icon/splash yönü. Mock kullanıcı profili ve demo veri stratejisi. TRY/USD/EUR formatlaması `currency.ts`'e yazılır. ISO 8601 tarih standardı ve `date.ts` hazırlanır.

### Faz 1 — Çok Dilli Altyapı ve Auth Akışı (Gün 4-7)

**Gün 4:** `i18next` + `react-i18next` kurulumu. `tr`, `en`, `ar` locale dosyaları. Para birimi anahtarları locale dosyalarına eklenir.

**Gün 5:** Arapça RTL — `I18nManager` stratejisi. Dil seçimi ekranı. Dil ve para birimi tercihi AsyncStorage'a kaydedilir.

**Gün 6:** Telefon numarası giriş ekranı, ülke kodu seçimi, form validasyonu (Zod + React Hook Form).

**Gün 7:** SMS doğrulama ekranı (demo: `123456`), PIN oluşturma, auth state akışı. İlk/tekrar giriş ayrımı.

### Faz 2 — Ana Cüzdan ve Finans Temeli (Gün 8-11)

**Gün 8:** Ana cüzdan ekranı: bakiye kartı (TRY/USD/EUR), gizli bakiye modu, haftalık durum, hızlı eylemler. Bildirim sayacı tab bar'a eklenir.

**Gün 9:** Son işlemler, kategori rozetleri, çoklu para birimi formatlaması, mock transaction verileri.

**Gün 10:** Harcama modları (öğrenci, tatil, sıkı tasarruf, gece dışarı). Moda göre limit ve uyarı metni.

**Gün 11:** "Alırsam Ne Olur?" simülatörü. Tutar, kategori, para birimi inputu. Risk seviyesi ve bütçe etkisi.

### Faz 3 — Sosyal Finans ve Hedefler (Gün 12-14)

**Gün 12:** Hedef kartları. TRY/USD/EUR hedef tutarı, ilerleme barı, para ekleme simülasyonu.

**Gün 13:** Grup cüzdanı. Üyeler, katkılar (çoklu para birimi), kalan tutar, hesabı bölüş demo akışı.

**Gün 14:** Abonelik dedektifi. TRY/USD/EUR abonelik tutarları, aylık toplam, iptal/inceleme önerileri.

### Faz 4 — Analiz, Yeni Özellikler ve AI Intelligence Layer (Gün 15-18)

**Gün 15:** Harcama hikayesi + Para haritası + Para Akışı Takvimi + Harcama Karşılaştırması + Bildirim Merkezi. `src/data/notifications.ts` ve `src/data/benchmarks.ts` oluşturulur.

**Gün 16:** Deterministic AI servisleri: `risk-model.service.ts`, `anomaly.service.ts`, `categorization.service.ts`. `src/data/ai-scenarios/` dizini: `copilot-scenarios.ts`, `anomaly-scenarios.ts`, `score-scenarios.ts`.

**Gün 17:** Finans sağlığı skoru + AI hedef planlayıcı. Kartlar, akıllı limitler, güvenli sanal kartlar. Akıllı bütçe otomasyonu.

**Gün 18:** Backend/proxy: `express-rate-limit` (5 istek/dakika), CORS, LLM servis bağlantısı, mock fallback sistemi. LLM Finans Copilot chat ekranı. Akıllı abonelik yorumu. Fiş/makbuz okuma demo. Sesli finans asistanı demo.

### Faz 5 — Test, Polish ve Teslim (Gün 19-20)

**Gün 19:** Türkçe/İngilizce/Arapça tam manuel QA. RTL, küçük ekran, tema, navigasyon, AI fallback, LLM güvenlik sınırları, UI taşmaları, para birimi geçişleri, takvim, karşılaştırma, bildirim merkezi kontrol edilir. Hatalar düzeltilir. Unit/component testleri tamamlanır.

**Gün 20:** README, ekran görüntüleri, pitch notları, fintech sınırları dokümanı, AI guardrails dokümanı, final teslim paketi.

---

## 18. Haftalık Sprint Özeti

| Hafta | Günler | Hedef | Çıktı |
|---|---|---|---|
| 1 | 1-5 | Kurulum, UI sistemi, i18n başlangıcı | Çalışan Expo projesi + hooks/ + tema + çeviri altyapısı |
| 2 | 6-10 | RTL, auth akışı, ana cüzdan | Dil/para birimi seçimi + SMS/PIN giriş + bakiye/işlem ekranları |
| 3 | 11-15 | Simülatör, sosyal finans, 3 yeni özellik | Simülatör + modlar + hedefler + grup + abonelik + takvim + karşılaştırma + bildirimler |
| 4 | 16-20 | AI servisleri, kartlar, backend, test, teslim | AI layer + LLM copilot + fiş/ses demo + backend + final sunum paketi |

---

## 19. Git Workflow ve PR Süreci

Doğrudan `main` dalına push yapılmaz. Her özellik için ayrı branch açılır.

**Branch isimleri:**
- `feature/i18n-setup`
- `feature/auth-flow`
- `feature/home-wallet`
- `feature/spending-simulator`
- `feature/group-wallet`
- `feature/secure-cards`
- `feature/calendar-view`
- `feature/spending-comparison`
- `feature/notifications`
- `feature/ai-intelligence-layer`
- `feature/backend-proxy`
- `feature/receipt-scanner`
- `feature/voice-assistant`

**Commit mesaj standardı:**
feat(auth): sms verification flow added
feat(i18n): add TRY USD EUR currency formatting
feat(wallet): add hidden balance mode
feat(calendar): add money flow calendar screen
feat(comparison): add spending benchmark screen
feat(notifications): add in-app notification center
fix(rtl): correct card alignment in Arabic layout
feat(backend): add rate limiting and CORS middleware


Her PR'da: ne yapıldı, hangi ekranlar etkilendi, hangi testler yapıldı, ekran görüntüsü veya kısa video var mı.

---

## 20. GitHub Projects ve Issue Yönetimi

Kanban sütunları: Backlog, To Do, In Progress, Review, Done.

Her gün için en az bir issue açılır. Örnek issue'lar:

- `Day 01 - Expo setup, NativeWind + Gifted Charts config`
- `Day 03 - TRY/USD/EUR currency formatting`
- `Day 05 - RTL support and language selection`
- `Day 07 - Complete SMS and PIN auth flow`
- `Day 11 - Build spending impact simulator`
- `Day 13 - Build group wallet`
- `Day 15 - Calendar + Comparison + Notification Center`
- `Day 16 - Deterministic AI services`
- `Day 18 - Backend proxy + LLM copilot`
- `Day 19 - Full QA pass + bug fixes`

---

## 21. Daily Standup

Her iş günü kısa not:

1. Dün ne yaptım?
2. Bugün hangi issue üzerinde çalışacağım?
3. Beni engelleyen bir durum var mı?

---

## 22. Risk Yönetimi

| Risk | Olasılık | Etki | Önlem |
|---|---|---|---|
| Gün yüklerinin birikmesi | Orta | Yüksek | AI servisleri 3 güne yayıldı; Gün 19 tam QA gününe ayrıldı. |
| Arapça RTL layout problemleri | Orta | Yüksek | RTL Gün 5'te kurulur; final haftasına bırakılmaz. |
| Çoklu para birimi tutarsızlığı | Orta | Orta | `currency.ts` tek kaynak; tüm ekranlar buradan formatlar. |
| UI'nin kopya gibi görünmesi | Orta | Orta | Takvim ve karşılaştırma ekranları özgün konumlandırmayı güçlendirir. |
| Mock verinin gerçekçi durmaması | Orta | Orta | Gün 3'te demo veri stratejisi netleşir. |
| AI Copilot yatırım tavsiyesi üretmesi | Orta | Yüksek | Prompt guardrails backend'de; kritik hesaplamalar deterministic servisten. |
| LLM halüsinasyonu | Orta | Yüksek | Prompt şablonları + sabit demo veri + mock fallback. |
| LLM API kota/maliyet sorunu | Orta | Orta | Rate limiting (5 istek/dakika) + mock fallback her zaman hazır. |
| Backend kurulumunun gecikmesi | Orta | Orta | Backend Gün 18'e alındı; AI servisleri 16-17'de hazır. |
| Tasarımın mobilde taşması | Orta | Yüksek | Gün 19 tam QA; NativeWind responsive yardımcıları. |

---

## 23. Definition of Done

Bir işin tamamlanmış sayılması için:

- Kod TypeScript hatası vermiyor.
- Ekran navigasyon üzerinden erişilebilir.
- UI Türkçe, İngilizce ve Arapça key'lerle çalışıyor.
- Arapça görünümde belirgin hizalama problemi yok.
- Küçük ekranlarda metin taşmıyor.
- TRY/USD/EUR formatlaması ekranda doğru görünüyor.
- Mock data ekrana gömülü değil, `src/data/` katmanından geliyor.
- Custom hook'lar service mantığını doğru kapsıyor.
- İlgili yardımcı fonksiyonlar test edildi.
- AI ekranları LLM açıkken ve mock fallback modunda çalışıyor.
- AI cevapları yatırım tavsiyesi vermiyor.
- Branch push edildi, PR açıldı ve açıklaması yazıldı.
- GitHub Projects kartı Done sütununa taşındı.

---

## 24. Teslim Edilecekler

1. Kaynak Kod — Expo + React Native + TypeScript çalışan mobil uygulama
2. Implementation Plan — Bu dokümanın güncel hali (v2.0)
3. README — Kurulum, çalıştırma, demo giriş bilgileri, özellik açıklamaları
4. Mock Data — Kullanıcı, işlem (TRY/USD/EUR), hedef, grup, abonelik, kart, bildirim, takvim, benchmark
5. Çeviri Dosyaları — Türkçe, İngilizce, Arapça locale dosyaları
6. AI Intelligence Layer — Tüm AI ekranları ve servisler; deterministic + LLM + fallback
7. AI Backend/Proxy — Rate limiting + CORS + LLM çağrısı + mock fallback
8. Ekran Görüntüleri — Auth, cüzdan, simülatör, grup, kartlar, AI copilot, finans skoru, takvim, karşılaştırma, bildirimler, fiş, sesli asistan
9. Pitch Notları — Ürün farkı, hedef kitle, satılabilirlik, gerçek dünya yol haritası
10. FinTech Boundaries Dokümanı — Demo/MVP sınırları
11. AI Guardrails Dokümanı — Yatırım tavsiyesi vermeme, mock veri politikası

---

## 25. Gerçek Dünya ve Satılabilirlik

### 25.1 Prototip Olarak Satılabilirlik
Portfolyo projesi, startup MVP demosu, FinTech UX/UI konsepti, B2B modül fikri, yatırımcı sunumu.

### 25.2 B2B Modül Potansiyeli
Şu özellikler tek başına bankalara/fintechlere satılabilir modüllere dönüşebilir: Alırsam Ne Olur? simülatörü, abonelik dedektifi, grup cüzdanı, LLM finans copilot, anormal harcama algılama, otomatik kategorilendirme, finans sağlığı skoru, AI hedef planlayıcı, harcama hikayesi, para akışı takvimi, harcama karşılaştırması, akıllı limitler.

### 25.3 Gerçek Ürün İçin Gerekenler
Lisanslı banka/elektronik para kuruluşu partnerliği, KYC, MASAK, TCMB, PCI-DSS, üretim backend, gerçek SMS, güvenli LLM gateway, AI güvenlik/gizlilik/loglama politikaları, gerçek OCR/ses tanıma, müşteri destek ve risk operasyonları.

### 25.4 En Gerçekçi İlk Ticari Yol
Para tutmayan kişisel finans asistanı olarak başla. Mock yerine manuel harcama takibi veya banka ekstresi importu ekle. B2B demo ile fintech/banka görüşmeleri yap. Lisanslı partner üzerinden kart/ödeme özelliklerini sonradan ekle. TRY/USD/EUR desteğiyle Türkiye, MENA ve Avrupa pazarına aynı anda hitap et.

---

*Doküman Sürümü v2.0 — TRY/USD/EUR çoklu para birimi, NativeWind v4, Gifted Charts, express-rate-limit, src/hooks/, ai-scenarios/ dizini, Para Akışı Takvimi, Harcama Karşılaştırması, Bildirim Merkezi eklendi. Gün yükleri redistribüsyonu uygulandı.*