Implementation Plan — NOVA Wallet
Çok Dilli, Sosyal ve Akıllı Finans Asistanı Mobil Uygulaması

Proje Adı: NOVA Wallet
Geliştirici: Isam
Süre: 20 iş günü (4 hafta)
Alan: FinTech / Mobile App / Personal Finance / Artificial Intelligence
Dil/Framework: TypeScript, React Native, Expo, Expo Router, Node.js API, LLM API
Doküman Sürümü: v2.0
Doküman Türü: Implementation Plan / Tek Doğruluk Kaynağı (Single Source of Truth)

İçindekiler
Yönetici Özeti
Problem Tanımı ve Hedefler
Kapsam
Teknoloji Yığını
Proje Dizin Yapısı
Ürün Konumlandırması ve Temel Fark
Kullanıcı Akışı
Sistem Mimarisi ve Modüller
Çok Dilli Destek ve RTL Stratejisi
Giriş, SMS Doğrulama ve Güvenlik Stratejisi
Ana Özellikler
Demo Veri Modeli
UI/UX Tasarım Standartları
Kodlama Standartları ve Optimizasyon
Test Stratejisi
Dokümantasyon Yapısı
20 İş Günlük Yol Haritası
Haftalık Sprint Özeti
Git Workflow ve PR Süreci
GitHub Projects Board ve Issue Yönetimi
Daily Standup
Risk Yönetimi
Definition of Done
Teslim Edilecekler
Gerçek Dünya ve Satılabilirlik Yol Haritası
1. Yönetici Özeti

NOVA Wallet, genç kullanıcılar ve genç profesyoneller için tasarlanan çok dilli bir sosyal finans asistanıdır. Uygulamanın amacı sadece para gönderme veya kart kullanma hissi vermek değildir; kullanıcının haftalık para akışını anlamasını, hedeflerine para ayırmasını, arkadaşlarıyla ortak bütçe yönetmesini, aboneliklerini temizlemesini ve harcama kararlarını daha bilinçli almasını sağlamaktır.

Papara gibi uygulamalar kart, para transferi, cashback, fatura ödeme ve bütçe takibi gibi güçlü temel finans özellikleri sunar. NOVA Wallet'ın farkı, bu klasik finans deneyimini daha kişisel, sosyal ve akıllı bir katmana taşımasıdır:

Kullanıcı harcama yapmadan önce "Alırsam Ne Olur?" simülatörüyle bütçe etkisini görür.
Ortak tatil, ev arkadaşı masrafları, hediye veya etkinlik için grup cüzdanı oluşturur.
Türkçe, İngilizce ve Arapça kullanabilir; Arapça için RTL arayüz desteği bulunur.
TRY, USD ve EUR para birimlerini destekler.
SMS doğrulamalı giriş ve PIN akışıyla gerçek fintech hissi oluşturulur.
AI Intelligence Layer; LLM tabanlı finans copilot, bütçe tahmini, anormal harcama algılama, otomatik kategorilendirme, fiş okuma, sesli asistan, finans skoru ve hedef planlama özelliklerini tek bir akıllı katmanda toplar.
Para Akışı Takvimi, Harcama Karşılaştırması ve Bildirim Merkezi ile karar destek deneyimi tamamlanır.

20 gün sonunda hedeflenen çıktı: Expo tabanlı, TypeScript ile yazılmış, mock verilerle çalışan, çok dilli, görsel olarak güçlü ve sunulabilir bir React Native mobil uygulama MVP'sidir.

2. Problem Tanımı ve Hedefler
2.1 Çözülen Problem

Genç kullanıcılar çoğu zaman parasını sadece "bakiye" olarak görür. Harcamanın ay sonuna etkisini, aboneliklerin toplam yükünü, arkadaşlarla ortak masrafların durumunu veya bir hedefe ne kadar yaklaştığını net takip edemez. Klasik finans uygulamaları genellikle işlem odaklıdır.

Bu proje, finans uygulamasını işlem merkezli yapıdan karar destek merkezli yapıya taşır. Kullanıcıya şu soruların cevabını verir: Bu harcamayı yaparsam ay sonu durumum ne olur? Bu hafta güvenli harcama limitim ne kadar? Hangi abonelikler gereksiz para götürüyor? Arkadaş grubunda kim ne kadar ödedi? Harcama alışkanlıklarım benzer kullanıcılara göre nasıl?

2.2 Başarı Kriterleri
React Native + Expo projesi hatasız çalışacak.
Splash, dil seçimi, telefon girişi, SMS doğrulama, PIN oluşturma ve ana uygulama akışı tamamlanacak.
Türkçe, İngilizce ve Arapça çeviri altyapısı çalışacak; RTL desteği uygulanacak.
TRY, USD ve EUR para birimleri formatlanarak gösterilecek; dil/para birimi tercihi ayarlardan değiştirilebilecek.
Ana cüzdan ekranı bakiye, gizli bakiye modu, haftalık para akışı ve son işlemleri gösterecek.
22 özelliğin tamamı demo seviyesinde uygulanacak.
AI Intelligence Layer eksiksiz çalışacak; LLM açıkken ve mock fallback modunda her AI ekranı işlevsel olacak.
Para Akışı Takvimi, Harcama Karşılaştırması ve Bildirim Merkezi mock verilerle çalışacak.
Mock veriler gerçekçi olacak; uygulama "boş demo" gibi görünmeyecek.
UI tüm ekran boyutlarında taşmadan çalışacak.
README, ekran görüntüleri ve pitch metni hazırlanacak.
Proje GitHub Projects, branch ve PR akışıyla yönetilecek.
3. Kapsam
3.1 Kapsam İçi
Expo + React Native + TypeScript mobil uygulama.
Splash screen, dil seçimi, RTL layout desteği.
Telefon numarasıyla giriş, SMS doğrulama (demo kodu: 123456), PIN oluşturma.
Ana uygulama navigasyonu: tab bar + nested screens.
TRY, USD ve EUR para birimi desteği; dile göre para formatlaması.
Ana cüzdan ekranı, gizli bakiye modu, haftalık para akışı.
Harcama modları, "Alırsam Ne Olur?" simülatörü.
Grup cüzdanı, hedef kartları, abonelik dedektifi.
Harcama hikayesi, para haritası.
Para Akışı Takvimi (yeni).
Harcama Karşılaştırması (yeni).
Bildirim Merkezi (yeni).
Kartlar, akıllı limitler, güvenli sanal kartlar.
LLM tabanlı AI Finans Copilot, bütçe risk tahmini, anormal harcama algılama.
Akıllı abonelik yorumu, otomatik kategorilendirme, finans sağlığı skoru.
AI hedef planlayıcı, akıllı bütçe otomasyonu.
Fiş/makbuz okuma demo akışı, sesli finans asistanı demo akışı.
Node.js backend/proxy (CORS + rate limiting dahil).
Profil ve ayarlar ekranı, tema seçimi.
Mock data mimarisi, README ve pitch dokümanı.
3.2 Kapsam Dışı

Gerçek para transferi, kart basımı, banka hesabı açma, gerçek SMS/KYC, ödeme kuruluşu entegrasyonu, üretim backend'i, sıfırdan LLM eğitimi, PCI-DSS/MASAK/TCMB lisans süreçleri.

4. Teknoloji Yığını
Katman	Teknoloji	Gerekçe
Dil	TypeScript (strict mode)	Tip güvenliği ve sürdürülebilirlik.
Mobil Framework	React Native	iOS ve Android için tek kod tabanı.
Geliştirme Platformu	Expo	Hızlı kurulum, kolay demo, native config yönetimi.
Routing	Expo Router	File-based routing ile hızlı ekran yapısı.
Stil	NativeWind v4	Tailwind alışkanlığıyla hızlı, tutarlı stil; Expo uyumlu.
State Management	Zustand	Sade global state yönetimi.
Çeviri	i18next + react-i18next	React Native uyumlu i18n altyapısı.
RTL	React Native I18nManager	Arapça RTL için resmi RN mekanizması.
Güvenli Depolama	expo-secure-store	PIN/auth token için.
Basit Depolama	AsyncStorage	Dil, tema, onboarding durumu için.
Form Yönetimi	React Hook Form	Telefon, SMS, PIN ve ayar formları için.
Validasyon	Zod	Form kurallarını merkezi yönetmek için.
Animasyon	React Native Reanimated	Finansal kartlar, geçişler, mikro animasyonlar için.
İkonlar	lucide-react-native	Modern ve tutarlı ikon sistemi.
Grafikler	react-native-gifted-charts	Expo uyumlu, hafif, harcama analizi grafikleri için.
Backend / AI Proxy	Node.js + Express	LLM API anahtarını saklamak ve AI isteklerini güvenli yönetmek için.
Rate Limiting	express-rate-limit	Demo sırasında kaza ile kota tüketimi önlemek için (5 istek/dakika).
LLM	Hazır LLM API	AI Finans Copilot; model sıfırdan eğitilmeyecek.
Prompt Guardrails	Backend prompt şablonları	Yatırım tavsiyesi vermemek için.
OCR Demo	Expo Image Picker + mock OCR parser	Fiş okuma akışını göstermek için.
Sesli Asistan Demo	Expo AV + mock transcript	Sesli soru deneyimini prototip seviyesinde göstermek için.
Test	Jest + React Native Testing Library	Component ve yardımcı fonksiyon testleri.
Versiyon Kontrol	Git + GitHub	Branch, PR ve proje yönetimi.
Proje Yönetimi	GitHub Projects	20 günlük sprint takibi, Kanban.
5. Proje Dizin Yapısı
nova-wallet/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (auth)/
│   │   ├── language.tsx
│   │   ├── phone.tsx
│   │   ├── verify-sms.tsx
│   │   └── create-pin.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── home.tsx
│   │   ├── wallet.tsx
│   │   ├── cards.tsx
│   │   ├── insights.tsx
│   │   └── profile.tsx
│   └── screens/
│       ├── simulator.tsx
│       ├── group-wallet.tsx
│       ├── goals.tsx
│       ├── subscriptions.tsx
│       ├── spending-story.tsx
│       ├── money-map.tsx
│       ├── calendar.tsx            ← yeni
│       ├── spending-comparison.tsx ← yeni
│       ├── notifications.tsx       ← yeni
│       ├── smart-limits.tsx
│       ├── secure-cards.tsx
│       ├── ai-coach.tsx
│       ├── anomaly-alerts.tsx
│       ├── financial-score.tsx
│       ├── goal-planner.tsx
│       ├── receipt-scanner.tsx
│       └── voice-assistant.tsx
├── backend/
│   ├── src/
│   │   ├── index.ts
│   │   ├── middleware/
│   │   │   ├── rateLimit.ts        ← yeni
│   │   │   └── cors.ts             ← yeni
│   │   ├── routes/
│   │   │   └── ai.routes.ts
│   │   ├── services/
│   │   │   ├── llm.service.ts
│   │   │   ├── prompt.service.ts
│   │   │   └── safety.service.ts
│   │   └── data/
│   │       └── finance-context.ts
│   └── package.json
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── cards/
│   │   ├── charts/
│   │   └── forms/
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   └── typography.ts
│   ├── data/
│   │   ├── transactions.ts
│   │   ├── goals.ts
│   │   ├── groups.ts
│   │   ├── subscriptions.ts
│   │   ├── cards.ts
│   │   ├── insights.ts
│   │   ├── notifications.ts        ← yeni
│   │   ├── benchmarks.ts           ← yeni
│   │   ├── receipts.ts
│   │   └── ai-scenarios/           ← dizine dönüştürüldü
│   │       ├── copilot-scenarios.ts
│   │       ├── anomaly-scenarios.ts
│   │       └── score-scenarios.ts
│   ├── hooks/                      ← yeni
│   │   ├── useBalance.ts
│   │   ├── useTransactions.ts
│   │   ├── useLanguage.ts
│   │   └── useCurrency.ts
│   ├── i18n/
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── tr.json
│   │       ├── en.json
│   │       └── ar.json
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── simulator.service.ts
│   │   ├── insights.service.ts
│   │   ├── ai.service.ts
│   │   ├── risk-model.service.ts
│   │   ├── anomaly.service.ts
│   │   ├── categorization.service.ts
│   │   ├── receipt.service.ts
│   │   ├── voice.service.ts
│   │   └── storage.service.ts
│   ├── store/
│   │   ├── auth.store.ts
│   │   ├── settings.store.ts
│   │   └── finance.store.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── finance.ts
│   │   ├── ai.ts
│   │   └── i18n.ts
│   └── utils/
│       ├── currency.ts
│       ├── date.ts
│       ├── rtl.ts
│       └── validation.ts
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── docs/
│   ├── product/feature-spec.md
│   ├── design/design-system.md
│   ├── legal/fintech-boundaries.md
│   ├── ai/
│   │   ├── ai-architecture.md
│   │   └── prompt-guardrails.md
│   └── pitch/pitch-notes.md
├── tests/
│   ├── components/
│   ├── services/
│   └── utils/
├── README.md
├── app.json
├── package.json
└── implementation_plan.md

Not — src/navigation/ kaldırıldı: Expo Router file-based routing kullandığı için ayrı bir navigation klasörüne gerek yoktur. Navigation tipleri src/types/ altında tutulur.

6. Ürün Konumlandırması ve Temel Fark

NOVA Wallet, "Gen Z ve genç profesyoneller için sosyal, akıllı ve çok dilli finans asistanı" olarak konumlandırılır.

Ana vaadi: Paranı sadece tutma; haftanı, hedeflerini, arkadaş gruplarını ve alışkanlıklarını birlikte yönet.

Papara işlem tabanlıdır: para gönder, kart kullan, bakiye gör. NOVA Wallet karar destek tabanlıdır: harcamadan önce etkisini gör, grup içinde ortak finans yönet, abonelikleri temizle, AI ile alışkanlıkları yorumla, benzer kullanıcılarla karşılaştır, TRY/USD/EUR üzerinden küresel erişim sağla.

7. Kullanıcı Akışı

İlk Giriş: Splash → Dil Seçimi → Telefon Girişi → SMS Doğrulama → PIN Oluşturma → Ana Cüzdan

Sonraki Giriş: Splash → PIN / Biyometrik Demo Kilit → Ana Cüzdan

Ana Navigasyon:

Ana Sayfa: Haftalık Para Akışı, Gizli Bakiye, Son İşlemler, Hızlı Eylemler, Bildirim Merkezi
Cüzdan: Hedef Kartları, Grup Cüzdanı, Harcama Modları
Kartlar: Sanal Kartlar, Akıllı Limitler, Güvenli Kartlar
Analiz: Alırsam Ne Olur?, Harcama Hikayesi, Para Haritası, Para Akışı Takvimi, Harcama Karşılaştırması, Abonelik Dedektifi, Anomali Uyarıları, Finans Skoru, Fiş Okuma, Sesli Asistan
Profil: Dil, Para Birimi, Tema, Güvenlik, AI Finans Copilot
8. Sistem Mimarisi ve Modüller

Auth Modülü: Telefon numarası girişi, SMS simülasyonu, demo kodu 123456, PIN oluşturma ve saklama, ilk/sonraki giriş ayrımı.

Settings Modülü: Dil seçimi, para birimi tercihi (TRY/USD/EUR), tema seçimi, RTL durumu, gizli bakiye tercihi.

Finance Modülü: Mock bakiye (çoklu para birimi), işlem listesi, kategori hesaplama, haftalık para akışı, hedef/grup/abonelik verileri.

Simulator Modülü: Tutar, kategori ve para birimi alır; ay sonu etkisini hesaplar; risk seviyesi üretir (düşük/orta/yüksek).

Insights Modülü: En pahalı gün, en çok harcanan kategori, geçen aya fark, abonelik toplamı, harcama modu tavsiyesi, para haritası içgörüleri, takvim verisi, karşılaştırma benchmark'ları.

Notification Modülü: Mock bildirimler üretir: abonelik yenileme uyarısı, limit yaklaşımı, hedef ilerlemesi, AI önerisi, anomali uyarısı.

AI Intelligence Layer: LLM proxy üzerinden Finans Copilot, deterministic servislerden bütçe riski/anomali/skor/kategorilendirme, mock fallback sistemi. Backend'de express-rate-limit (5 istek/dakika) ve CORS konfigürasyonu bulunur. API anahtarı asla mobil tarafta tutulmaz.

9. Çok Dilli Destek ve RTL Stratejisi
Dil	Kod	Yön
Türkçe	tr	LTR
English	en	LTR
العربية	ar	RTL

Tüm UI metinleri translation key ile kullanılacak; hardcoded text yazılmayacak. Para birimi, tarih ve sayı formatları dile göre formatlanacak. RTL'de I18nManager kullanılacak; yön bağımlı stiller (marginLeft, left vb.) minimize edilecek, yerine start/end ve merkezi rtl.ts helper'ı kullanılacak. RTL değişikliği için yeniden başlatma gerekliyse kullanıcıya sade şekilde gösterilecek.

10. Giriş, SMS Doğrulama ve Güvenlik Stratejisi

Demo doğrulama kodu: 123456. Gerçek SMS gönderilmez.

Gerçek üründe: Firebase Auth Phone Login, Twilio Verify veya yerel SMS sağlayıcıları kullanılabilir.

PIN 4 haneli; expo-secure-store ile saklanır. Güvenlik hissi veren demo detayları: gizli bakiye modu, kart numarası maskeleme, sanal kart dondurma/açma, tek kullanımlık kart, oturum kilidi ekranı.

11. Ana Özellikler
11.1 Alırsam Ne Olur? Simülatörü

Kullanıcı tutar, kategori ve para birimi (TRY/USD/EUR) girer. Haftalık/aylık bütçeye etkisi ve risk seviyesi hesaplanır. Görsel bütçe etkisi gösterilir.

11.2 Grup Cüzdanı

Tatil, ev arkadaşlığı, hediye için grup bütçesi. Üyeler ve katkılar (çoklu para birimi), kalan tutar, hesabı bölüş demo akışı.

11.3 Harcama Modları

Öğrenci, Tatil, Sıkı Tasarruf, Gece Dışarı modları. Mod seçildiğinde ana ekranda aktif mod, günlük limit ve uyarı metni moda göre değişir.

11.4 Abonelik Dedektifi

Mock işlemlerden tekrar eden ödemeler. Aylık toplam maliyet (TRY/USD/EUR), gereksiz/az kullanılan abonelik önerisi.

11.5 Gizli Bakiye Modu

Tek dokunuşla bakiye bulanık/maskeli. Göster/gizle butonu. Ayar olarak AsyncStorage'a kaydedilir.

11.6 LLM Tabanlı AI Finans Copilot

Chat ekranında finansal farkındalık soruları. Önerilen sorular, serbest yazma, backend/proxy üzerinden LLM cevabı. LLM yoksa mock fallback. Cevaplar bütçe farkındalığıyla sınırlı; yatırım tavsiyesi verilmez.

11.7 Hedef Kartları

Telefon, tatil, konser, laptop hedefleri. TRY/USD/EUR'da hedef tutarı ve biriken tutar, ilerleme barı, para ekleme simülasyonu.

11.8 Harcama Hikayesi

Aylık özet story formatında. En pahalı gün, en çok harcanan kategori, geçen aya fark, story kartları arası geçiş.

11.9 Akıllı Limitler

Kategori bazlı kart limitleri: Yemek, Ulaşım, Eğlence, Oyun, Online Alışveriş. Slider/input ile değiştirilebilir limit, harcama oranı grafiği.

11.10 Güvenli Sanal Kartlar

Standart sanal kart, tek kullanımlık kart, süreli kart, mağaza kilitli kart. Kart numarası maskeleme, dondur/aç.

11.11 Akıllı Bütçe Otomasyonu

AI, gelir + abonelik + hedef + geçmiş harcamaya göre haftalık bütçe planı önerir. Kullanıcı mevcut bütçeyle AI önerisini karşılaştırır.

11.12 Ay Sonu Bütçe Tahmini

Mevcut harcama hızına göre ay sonu bütçe aşımı tahmini. Düşük/orta/yüksek risk, tahmini bakiye farkı, kategori bazlı risk açıklaması.

11.13 Anormal Harcama Algılama

Normal davranıştan sapan işlemler işaretlenir (yüksek tutar, alışılmadık saat, alışılmadık kategori). "Normal görünüyor" veya "incele" aksiyonu, anomali nedeni kısa açıklama.

11.14 Akıllı Abonelik Yorumu

Toplam abonelik yükü açıklaması, az kullanılan abonelikler öne çıkarılır, AI hangi aboneliği önce incelemeli gerekçesiyle söyler.

11.15 Otomatik Harcama Kategorilendirme

Merchant ismine göre kategori tahmini. Kullanıcı kategoriyi değiştirebilir; değişiklik demo state'te saklanır.

11.16 Kişisel Finans Sağlığı Skoru

0-100 arası skor. Girdiler: bütçe aşımı, birikim oranı, abonelik yükü, hedef ilerlemesi, anomali sayısı, kategori limitlerine uyum. Görsel gösterge, pozitif/negatif faktörler, AI kısa yorum.

11.17 AI Hedef Planlayıcı

Hedef adı, tutar (TRY/USD/EUR) ve süre. Haftalık/aylık ayrılması gereken tutar, hangi kategorilerden azaltma yapılabileceği önerisi.

11.18 Fiş/Makbuz Okuma

Kamera veya galeri seçimi. Demo fiş sonucu: mağaza, toplam tutar, ürün listesi, kategori, bütçe etkisi AI özeti.

11.19 Sesli Finans Asistanı

Mikrofon ekranı ve kayıt animasyonu. Demo transcript, AI Copilot ekranına soru olarak iletilir, cevap metin olarak gösterilir.

11.20 Para Akışı Takvimi (YENİ)

Takvim görünümünde her günün harcama tutarı gösterilir. Geçmiş işlemler harcama yoğunluğuna göre renklenir. Gelecekte tekrar eden ödemeler (abonelikler) farklı renkte işaretlenir. Güne tıklandığında o günün işlemleri listelenir. Mock veriyle çalışır; yeni servis gerektirmez.

Başarı kriteri: Takvim görünümü çalışır. Günler harcama yoğunluğuna göre renklenir. Abonelik günleri işaretlenir. Güne tıklayınca işlem detayı açılır.

11.21 Harcama Karşılaştırması (YENİ)

"Bu ay yemekte yaş grubunun ortalamasının %23 üzerindeydin" tarzında mock benchmark karşılaştırması. Kategori bazlı ortalama vs. kullanıcı harcaması. Tamamen mock data; gerçek kullanıcı verisi yok. "Karar destek" konumlandırmasını güçlendirir, AI-driven hissi verir.

Başarı kriteri: Kategori bazlı karşılaştırma kartları gösterilir. Kullanıcı ortalamanın üstünde/altında mı görünür. Yüzde fark ve kısa yorum gösterilir.

11.22 Bildirim Merkezi (YENİ)

Uygulama içi mock bildirim listesi. Gerçek push notification yok, sadece in-app liste. Bildirim türleri: abonelik yenileme yaklaşıyor, kategori limitine yaklaşıldı, hedef ilerlemesi, AI önerisi geldi, anormal harcama tespit edildi. Her bildirim okundu/okunmadı durumu taşır.

Başarı kriteri: Bildirim listesi görünür. Bildirim türleri ikonlarla ayrışır. Okundu olarak işaretleme çalışır.

12. Demo Veri Modeli
12.1 Para Birimi Tipi
ts
type Currency = 'TRY' | 'USD' | 'EUR';
12.2 Tarih Tipi
ts
// Tüm tarihler ISO 8601 string olarak tutulur: "2024-03-15T14:32:00Z"
type ISODateString = string;
12.3 Kullanıcı
ts
type User = {
  id: string;
  name: string;
  phone: string;
  language: 'tr' | 'en' | 'ar';
  currency: Currency;
  balance: number;
};
12.4 İşlem
ts
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
12.5 Hedef
ts
type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  currency: Currency;
  imageKey: string;
  deadline?: ISODateString;
};
12.6 Grup Cüzdanı
ts
type GroupWallet = {
  id: string;
  title: string;
  targetAmount: number;
  currency: Currency;
  members: {
    id: string;
    name: string;
    paidAmount: number;
  }[];
};
12.7 Abonelik
ts
type Subscription = {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  billingCycle: 'monthly' | 'yearly';
  lastUsedDaysAgo: number;
  recommendation: 'keep' | 'review' | 'cancel';
};
12.8 AI Finans İçgörüsü
ts
type AiInsight = {
  id: string;
  type: 'budget_risk' | 'anomaly' | 'subscription' | 'goal_plan' | 'financial_score';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  relatedTransactionIds?: string[];
};
12.9 Finans Sağlığı Skoru
ts
type FinancialScore = {
  score: number;
  level: 'weak' | 'average' | 'good' | 'excellent';
  positiveFactors: string[];
  negativeFactors: string[];
};
12.10 Fiş/Makbuz
ts
type Receipt = {
  id: string;
  merchant: string;
  totalAmount: number;
  currency: Currency;
  date: ISODateString;
  items: {
    name: string;
    amount: number;
    category: Transaction['category'];
  }[];
  aiSummary: string;
};
12.11 AI Mesajı
ts
type AiMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: ISODateString;
  source: 'llm' | 'mock';
};
12.12 Bildirim (YENİ)
ts
type AppNotification = {
  id: string;
  type: 'subscription' | 'limit' | 'goal' | 'ai_insight' | 'anomaly';
  title: string;
  body: string;
  createdAt: ISODateString;
  isRead: boolean;
  relatedId?: string;
};
12.13 Takvim Günü (YENİ)
ts
type CalendarDay = {
  date: ISODateString;
  totalSpent: number;
  currency: Currency;
  transactionIds: string[];
  hasScheduledPayment: boolean;
};
12.14 Harcama Karşılaştırması (YENİ)
ts
type SpendingBenchmark = {
  category: Transaction['category'];
  userAmount: number;
  averageAmount: number;
  currency: Currency;
  percentageDiff: number; // pozitif = ortalamanın üstünde
  label: string;
};
13. UI/UX Tasarım Standartları
İlk ekran pazarlama landing page değil; kullanıcı doğrudan ürün akışına girer.
Finans uygulaması hissi: güvenli, net, hızlı.
Genç hedef kitle için kontrollü mikro animasyonlar, vurgu renkleri.
Kartlar ~8px radius; modern ama aşırı yuvarlak değil.
Butonlarda ikon + kısa metin.
Sadece dekorasyon için anlamsız gradient/orb kullanılmaz.
Tüm metinler mobil ekranlarda taşmadan çalışır.
RTL'de hizalama, ikon yönü ve yatay akış ayrıca kontrol edilir.
Tab bar en fazla 5 ana sekme.
Bildirim sayacı tab bar'da ana sayfa ikonunda gösterilir.
NativeWind v4 sınıfları tutarlı şekilde kullanılır; inline style minimumda tutulur.
14. Kodlama Standartları ve Optimizasyon
TypeScript strict mode.
Component isimleri PascalCase, fonksiyon/değişken isimleri camelCase.
Ortak UI parçaları src/components/ui/ altında.
Custom hook'lar src/hooks/ altında; logic ekrana gömülmez.
Ekrana özel logic mümkün olduğunca service/store/hook katmanına ayrılır.
Translation key olmadan doğrudan UI metni yazılmaz.
Mock data tek yerde tutulur; ekrana gömülmez.
Para formatları merkezi currency.ts helper'ı üzerinden; TRY/USD/EUR her biri locale-aware formatlanır.
Tarihler ISO 8601 olarak saklanır; date.ts helper'ı üzerinden formatlanır.
RTL yön mantığı merkezi rtl.ts helper'ı üzerinden.
LLM API key hiçbir zaman mobil tarafta olmaz.
AI prompt şablonları backend tarafında tutulur.
AI cevaplarında yatırım/kredi tavsiyesi yapılmaz.
LLM başarısız olursa mock fallback cevabı gösterilir.
eslint ve prettier kullanılır.
Gereksiz büyük bağımlılıklar eklenmez; her yeni bağımlılık PR'da gerekçelendirilir.
15. Test Stratejisi
15.1 Birim Testleri

Para formatlama (TRY/USD/EUR), tarih formatlama, harcama simülatörü risk hesaplama, abonelik toplam maliyet, grup cüzdanı borç/katkı hesaplama, finans sağlığı skoru hesaplama, anormal harcama algılama, otomatik kategori tahmini, AI hedef planlayıcı hesaplama, takvim günü harcama hesaplama, benchmark yüzde fark hesaplama.

15.2 Component Testleri

Bakiye gizleme/gösterme, SMS kod input, dil seçimi, hedef kartı, sanal kart, AI chat mesaj, finans skoru, fiş okuma sonuç, sesli asistan kayıt ekranı, bildirim listesi öğesi, takvim gün hücresi, karşılaştırma kartı.

15.3 Manuel QA

Türkçe, İngilizce ve Arapça ekran akışı. Küçük/büyük ekran kontrolü. Koyu/açık tema. İlk ve tekrar giriş. TRY/USD/EUR para birimi geçişleri. LLM açık/kapalı AI senaryoları. Yatırım tavsiyesi üretilmemesi. Kamera/galeri izni verilmediğinde fiş ekranı. Bildirimler okundu/okunmadı. Takvim doğru günleri ve abonelik işaretlerini gösteriyor mu.

16. Dokümantasyon Yapısı
docs/
├── product/feature-spec.md
├── design/design-system.md
├── legal/fintech-boundaries.md
├── ai/
│   ├── ai-architecture.md
│   └── prompt-guardrails.md
└── pitch/pitch-notes.md
Feature Spec: Her özelliğin amacı, ekranları, kullanıcı akışı ve demo davranışı.
Design System: Renkler, typography, spacing, NativeWind token kullanımı, component kuralları.
FinTech Boundaries: Gerçek para işlemediği, lisans gerektiren özelliklerin kapsam dışı olduğu açıklanır.
AI Architecture: LLM proxy yapısı, deterministic servisler, mock fallback stratejisi, rate limiting, ai-scenarios/ dizini yapısı.
Prompt Guardrails: AI cevaplarının yatırım tavsiyesi vermediği, gerçek kullanıcı verisi işlemediği açıklanır.
Pitch Notes: Ürün farkı, hedef kitlesi, satılabilirliği, gerçek dünya yol haritası.
17. 20 İş Günlük Yol Haritası

Her gün en az 1 anlamlı commit zorunludur.

Faz 0 — Ürün Temeli, Kurulum ve Tasarım Yönü (Gün 1-3)

Gün 1: GitHub repo ve Projects board kurulur. Expo + TypeScript projesi başlatılır. Dizin yapısı oluşturulur. Expo Router kurulumu, tab/auth route grupları hazırlanır. NativeWind v4 ve react-native-gifted-charts kurulup konfigüre edilir. İlk implementation_plan.md commit'i atılır.

Gün 2: UI temel componentleri hazırlanır: Button, Input, Screen, Card, Header, IconButton, SectionTitle, ProgressBar. src/hooks/ dizini açılır, temel hook'lar iskelet olarak oluşturulur: useBalance, useTransactions, useLanguage, useCurrency.

Gün 3: Marka yönü netleştirilir: renk paleti, typography, app icon/splash yönü. Mock kullanıcı profili ve demo veri stratejisi. TRY/USD/EUR para birimi formatlaması currency.ts'e yazılır. ISO 8601 tarih tipi standardı ve date.ts helper'ı hazırlanır.

Faz 1 — Çok Dilli Altyapı ve Auth Akışı (Gün 4-7)

Gün 4: i18next + react-i18next kurulumu. tr, en, ar locale dosyaları oluşturulur. Çeviri hook'u app içinde kullanılır. Para birimi anahtarları locale dosyalarına eklenir.

Gün 5: Arapça RTL desteği için I18nManager stratejisi uygulanır. Dil seçimi ekranı tamamlanır. Dil ve para birimi tercihi AsyncStorage'a kaydedilir.

Gün 6: Telefon numarası giriş ekranı, ülke kodu seçimi ve form validasyonu (Zod + React Hook Form) hazırlanır.

Gün 7: SMS doğrulama ekranı (demo: 123456), PIN oluşturma ekranı ve auth state akışı tamamlanır. İlk/tekrar giriş ayrımı yapılır.

Faz 2 — Ana Cüzdan ve Finans Temeli (Gün 8-11)

Gün 8: Ana cüzdan ekranı: bakiye kartı (TRY/USD/EUR gösterimi), gizli bakiye modu, haftalık durum, hızlı eylemler. Bildirim sayacı tab bar'a eklenir.

Gün 9: Son işlemler listesi, kategori rozetleri, çoklu para birimi formatlaması, mock transaction verileri entegre edilir.

Gün 10: Harcama modları eklenir (öğrenci, tatil, sıkı tasarruf, gece dışarı). Moda göre limit ve uyarı metni değişir. Aktif mod ana ekranda görünür.

Gün 11: "Alırsam Ne Olur?" simülatörü yapılır. Tutar, kategori ve para birimi inputu. Risk seviyesi ve bütçe etkisi hesaplanır, görsel olarak gösterilir.

Faz 3 — Sosyal Finans ve Hedefler (Gün 12-14)

Gün 12: Hedef kartları ekranı. TRY/USD/EUR'da hedef tutarı, biriken tutar, ilerleme barı, para ekleme simülasyonu.

Gün 13: Grup cüzdanı ekranı. Üyeler, katkılar (çoklu para birimi), kalan tutar, hesabı bölüş demo akışı.

Gün 14: Abonelik dedektifi. TRY/USD/EUR abonelik tutarları, aylık toplam, iptal/inceleme önerileri.

Faz 4 — Analiz, Yeni Özellikler ve AI Intelligence Layer (Gün 15-18)

Gün 15: Harcama hikayesi + Para haritası + Para Akışı Takvimi + Harcama Karşılaştırması + Bildirim Merkezi yapılır. Beş ekranın tamamı mock veriyle çalışır. src/data/notifications.ts, src/data/benchmarks.ts oluşturulur.

Gün 16: Deterministic AI servisleri yazılır: bütçe risk tahmini (risk-model.service.ts), anormal harcama algılama (anomaly.service.ts), otomatik kategorilendirme (categorization.service.ts). src/data/ai-scenarios/ dizini oluşturulur: copilot-scenarios.ts, anomaly-scenarios.ts, score-scenarios.ts.

Gün 17: Finans sağlığı skoru + AI hedef planlayıcı ekranları tamamlanır. Kartlar, akıllı limitler ve güvenli sanal kartlar yapılır. Akıllı bütçe otomasyonu entegre edilir.

Gün 18: Backend/proxy kurulumu: express-rate-limit (5 istek/dakika), CORS konfigürasyonu, LLM servis bağlantısı, mock fallback sistemi. LLM Finans Copilot chat ekranı tamamlanır. Akıllı abonelik yorumu, fiş/makbuz okuma demo akışı ve sesli finans asistanı demo akışı tamamlanır.

Faz 5 — Test, Polish, Dokümantasyon ve Teslim (Gün 19-20)

Gün 19: Türkçe/İngilizce/Arapça tam manuel QA. RTL, küçük ekran, tema, navigasyon, AI fallback, LLM güvenlik sınırları, UI taşmaları, para birimi geçişleri, takvim ve karşılaştırma ekranları, bildirim merkezi kontrol edilir. Tespit edilen hatalar düzeltilir. Unit/component testleri tamamlanır.

Gün 20: README, ekran görüntüleri (tüm ana ekranlar), pitch notları, fintech sınırları dokümanı, AI guardrails dokümanı ve final teslim paketi hazırlanır.

18. Haftalık Sprint Özeti
Hafta	Günler	Hedef	Çıktı
1	1-5	Kurulum, ürün temeli, UI sistemi, NativeWind + Gifted Charts, i18n başlangıcı	Çalışan Expo projesi + hooks/ + tema + çeviri altyapısı
2	6-10	RTL, auth akışı, ana cüzdan	Dil/para birimi seçimi + SMS/PIN giriş + bakiye/işlem ekranları
3	11-15	Simülatör, sosyal finans, 3 yeni özellik	Simülatör + modlar + hedefler + grup + abonelik + takvim + karşılaştırma + bildirimler
4	16-20	AI servisleri, kartlar, backend, test, teslim	AI layer + LLM copilot + fiş/ses demo + backend + final sunum paketi
19. Git Workflow ve PR Süreci

Doğrudan main dalına push yapılmaz. Her özellik için ayrı branch.

Örnek branch isimleri: feature/i18n-setup, feature/auth-flow, feature/home-wallet, feature/spending-simulator, feature/group-wallet, feature/secure-cards, feature/calendar-view, feature/spending-comparison, feature/notifications, feature/ai-intelligence-layer, feature/backend-proxy, feature/receipt-scanner, feature/voice-assistant

Commit mesaj standardı:

feat(auth): sms verification flow added
feat(i18n): add TRY USD EUR currency formatting
feat(wallet): add hidden balance mode
feat(calendar): add money flow calendar screen
feat(comparison): add spending benchmark screen
feat(notifications): add in-app notification center
fix(rtl): correct card alignment in Arabic layout
feat(backend): add rate limiting and CORS middleware

Her PR'da: ne yapıldı, hangi ekranlar etkilendi, hangi testler yapıldı, ekran görüntüsü veya kısa video var mı.

20. GitHub Projects Board ve Issue Yönetimi

Kanban sütunları: Backlog, To Do, In Progress, Review, Done.

Her gün için en az bir issue. Örnek issue'lar:

Day 01 - Expo setup, NativeWind + Gifted Charts config
Day 03 - TRY/USD/EUR currency formatting
Day 05 - RTL support and language selection
Day 07 - Complete SMS and PIN auth flow
Day 11 - Build spending impact simulator
Day 13 - Build group wallet
Day 15 - Calendar + Comparison + Notification Center
Day 16 - Deterministic AI services
Day 18 - Backend proxy + LLM copilot
Day 19 - Full QA pass + bug fixes
21. Daily Standup

Her iş günü kısa not:

Dün ne yaptım?
Bugün hangi issue üzerinde çalışacağım?
Beni engelleyen bir durum var mı?
22. Risk Yönetimi
Risk	Olasılık	Etki	Önlem
Gün yüklerinin birikmesi	Orta	Yüksek	Faz 4'te AI servisleri 3 güne yayıldı; Gün 15'te 5 yeni/mevcut ekran paralel; Gün 19 tam QA gününe ayrıldı.
Arapça RTL layout problemleri	Orta	Yüksek	RTL Gün 5'te kurulur; final haftasına bırakılmaz.
Çoklu para birimi formatlaması tutarsızlığı	Orta	Orta	currency.ts tek kaynak; tüm ekranlar bu helper üzerinden TRY/USD/EUR formatlar.
UI'nin Papara klonu gibi görünmesi	Orta	Orta	Sosyal finans, takvim ve karşılaştırma ekranları özgün konumlandırmayı güçlendirir.
Mock verinin gerçekçi durmaması	Orta	Orta	Gün 3'te demo veri stratejisi netleşir; her özellik gerçekçi sample data ile beslenir.
AI Copilot yatırım tavsiyesi üretmesi	Orta	Yüksek	Prompt guardrails backend'de tutulur; kritik hesaplamalar deterministic servisten gelir.
LLM halüsinasyonu	Orta	Yüksek	Prompt şablonları + sabit demo veri + mock fallback sistemi.
LLM API kota/maliyet sorunu	Orta	Orta	express-rate-limit (5 istek/dakika) demo sırasında kaza tüketimini önler; mock fallback her zaman hazır.
Backend kurulumunun gecikmesi	Orta	Orta	Backend Gün 18'e alındı; önce tüm deterministic AI servisleri Gün 16-17'de biter.
OCR/ses asistanının yarım kalması	Orta	Orta	Demo akışı ve mock çıktı; üretim seviyesinde değil.
Tasarımın mobilde taşması	Orta	Yüksek	Gün 19 tam QA; NativeWind responsive yardımcıları.
23. Definition of Done

Bir işin tamamlanmış sayılması için:

Kod TypeScript hatası vermiyor.
Ekran navigasyon üzerinden erişilebilir.
UI Türkçe, İngilizce ve Arapça key'lerle çalışıyor.
Arapça görünümde belirgin hizalama problemi yok.
Küçük ekranlarda metin taşmıyor.
TRY/USD/EUR formatlaması ekranda doğru görünüyor.
Mock data ekrana gömülü değil, data/service katmanından geliyor.
Custom hook'lar service mantığını doğru kapslıyor.
İlgili yardımcı fonksiyonlar test edildi.
AI ekranları LLM açıkken ve mock fallback modunda çalışıyor.
AI cevapları yatırım tavsiyesi vermiyor.
AI hesaplamalarında kritik sayısal sonuçlar service/helper fonksiyonlarından geliyor.
Branch push edildi, PR açıldı ve açıklaması yazıldı.
GitHub Projects kartı Done sütununa taşındı.
24. Teslim Edilecekler
Kaynak Kod: Expo + React Native + TypeScript çalışan mobil uygulama.
Implementation Plan: Bu dokümanın güncel hali (v2.0).
README: Kurulum, çalıştırma, demo giriş bilgileri, özellik açıklamaları.
Mock Data: Kullanıcı, işlem (TRY/USD/EUR), hedef, grup, abonelik, kart, bildirim, takvim, benchmark verileri.
Çeviri Dosyaları: Türkçe, İngilizce, Arapça locale dosyaları.
AI Intelligence Layer: Tüm AI ekranları ve servisler; deterministic + LLM + fallback.
AI Backend/Proxy: Rate limiting + CORS + LLM çağrısı + mock fallback iskeleti.
Ekran Görüntüleri: Auth, ana cüzdan, simülatör, grup, kartlar, AI copilot, finans skoru, takvim, karşılaştırma, bildirimler, fiş okuma, sesli asistan.
Pitch Notları: Ürün farkı, hedef kitle, satılabilirlik, gerçek dünya yol haritası.
FinTech Boundaries Dokümanı: Demo/MVP sınırları.
AI Guardrails Dokümanı: Yatırım tavsiyesi vermeme, mock veri politikası.
25. Gerçek Dünya ve Satılabilirlik Yol Haritası
25.1 Prototip Olarak Satılabilirlik

Portfolyo projesi, startup MVP demosu, FinTech UX/UI konsepti, B2B modül fikri, yatırımcı sunumu olarak kullanılabilir.

25.2 B2B Modül Potansiyeli

Şu özellikler tek başına bankalara/fintechlere satılabilir modüllere dönüşebilir: Alırsam Ne Olur? simülatörü, abonelik dedektifi, grup cüzdanı, LLM finans copilot, anormal harcama algılama, otomatik kategorilendirme, finans sağlığı skoru, AI hedef planlayıcı, harcama hikayesi, para akışı takvimi, harcama karşılaştırması, akıllı limitler.

25.3 Gerçek Ürün İçin Gerekenler

Lisanslı banka/elektronik para kuruluşu partnerliği, KYC, MASAK, TCMB, PCI-DSS, üretim backend, gerçek SMS, güvenli LLM gateway, AI güvenlik/gizlilik/loglama politikaları, gerçek OCR/ses tanıma, müşteri destek ve risk operasyonları.

25.4 En Gerçekçi İlk Ticari Yol

Para tutmayan kişisel finans asistanı olarak başla. Mock yerine manuel harcama takibi veya banka ekstresi importu ekle. B2B demo ile fintech/banka görüşmeleri yap. Lisanslı partner üzerinden kart/ödeme özelliklerini sonradan ekle. TRY/USD/EUR desteğiyle Türkiye, MENA ve Avrupa pazarına aynı anda hitap et.

Doküman Sürümü v2.0 — Değişiklik Özeti:

TRY/USD/EUR çoklu para birimi desteği tüm veri modeli ve ekranlara yansıtıldı.
NativeWind v4 ve react-native-gifted-charts tech stack'e eklendi.
Backend'e express-rate-limit ve CORS middleware eklendi.
src/hooks/ dizini ve temel hook'lar eklendi.
src/navigation/ kaldırıldı; Expo Router file-based routing kullanılıyor.
src/data/ai-scenarios.ts → src/data/ai-scenarios/ dizinine dönüştürüldü.
3 yeni özellik eklendi: Para Akışı Takvimi, Harcama Karşılaştırması, Bildirim Merkezi.
3 yeni veri tipi eklendi: AppNotification, CalendarDay, SpendingBenchmark.
Transaction.date tipi ISO 8601 string olarak netleştirildi.
Gün yükleri redistribüsyonu: Faz 0 → 3 güne sıkıştırıldı; Faz 4 → 4 güne yayıldı (AI servisleri 2 güne bölündü); QA için Gün 19 tam güne ayrıldı.