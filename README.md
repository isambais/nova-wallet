Bu bağlantı bende “Page not found” olarak açılıyor; muhtemelen Claude hesabına özel veya paylaşımı kapalı.

README’yi aynı tasarımla hazırlamam için bana şunlardan birini gönder:

README’nin tam ekran görüntülerini, veya
Claude’daki kodu/Markdown içeriğini buraya kopyala.

Bir de projenin GitHub linkini gönderirsen içerikleri projene göre profesyonel şekilde düzenleyip sana doğrudan yapıştırabileceğin eksiksiz README.md vereyim.

Pasted markdown(1).md
File

Hazır. README’yi profesyonel ve tamamen GitHub uyumlu hâle getirdim:

README.md dosyasını aç / indir

GitHub’daki mevcut 
README.md içeriğini silip bu dosyanın tamamını yapıştırabilirsin.

Ekran görüntülerinin görünmesi için şu dosyaları eklemelisin:

docs/screenshots/auth.png
docs/screenshots/wallet.png
docs/screenshots/simulator.png

Mermaid diyagramları, rozetler, tablolar, kurulum kodları ve tüm bağlantılar GitHub’da düzgün çalışacak şekilde düzenlendi.

README.md
Document
diyagram cizilmesini istiyorum ve emojiler istemiyorum ve daha profesyonel ve yailara dikkat et ve herseye dikkat et

README tamamen güncellendi:

Tüm emojiler kaldırıldı.
Metinler profesyonel Türkçeyle yeniden düzenlendi.
Teknik terimler tutarlı hâle getirildi.
GitHub’da görsel olarak çizilecek 6 Mermaid diyagramı eklendi:
Katmanlı sistem mimarisi
Kimlik doğrulama akışı
Zustand durum yönetimi
Harcama simülasyonu
Uygulama navigasyonu
Veritabanı ilişkileri

Güncel dosya: 
README.md

Dosyanın tamamını GitHub’daki 
README.md içine yapıştırdığında diyagramlar otomatik olarak çizilecektir.

README.md
Document

Library
/
README.md

<div align="center">

NOVA Wallet
Yapay zekâ destekli, çok dilli kişisel finans asistanı

Harcamadan önce bütçe etkisini analiz eden, ortak finans yönetimini kolaylaştıran ve kişiselleştirilmiş içgörüler sunan React Native MVP prototipi.














Genel Bakış |
Özellikler |
Mimari |
Teknolojiler |
Kurulum |
Güvenlik

</div>

Genel Bakış

NOVA Wallet, geleneksel bankacılık uygulamalarındaki pasif işlem takibinin ötesine geçerek kullanıcının harcamadan önce düşünmesini sağlayan bir kişisel finans asistanıdır.

Proje üç temel fikir üzerine kurulmuştur:

Bir satın alma gerçekleşmeden önce bütçeye etkisini simüle etmek
Ortak bütçeleri birden fazla kullanıcıyla birlikte yönetmek
Harcama alışkanlıkları hakkında yapay zekâ destekli, bağlamsal içgörüler sunmak

Uygulama; karmaşık bankacılık arayüzleri olmadan bilinçli finansal kontrol isteyen genç profesyonelleri ve öğrencileri hedefler. Türkçe, İngilizce ve Arapça dillerini destekler; Arapça için tam RTL düzeni sunar.

[!IMPORTANT]
NOVA Wallet bir demo prototipidir. Gerçek para işlemi veya KYC doğrulaması yapmaz, gerçek kart çıkarmaz ve herhangi bir finansal mevzuata tabi değildir. İşlemler ile yapay zekâ çıktıları demo verileri kullanır.

Ekran Görüntüleri

<div align="center">

Kimlik Doğrulama	Cüzdan	Harcama Simülatörü
<img src="docs/screenshots/auth.png" width="240" alt="NOVA Wallet kimlik doğrulama ekranı" />	<img src="docs/screenshots/wallet.png" width="240" alt="NOVA Wallet cüzdan ekranı" />	<img src="docs/screenshots/simulator.png" width="240" alt="NOVA Wallet harcama simülatörü" />

</div>

Ekran görüntülerinin gösterilmesi için görselleri docs/screenshots/ klasörüne auth.png, wallet.png ve simulator.png adlarıyla ekleyin.

Özellikler
Kimlik Doğrulama
Telefon numarasıyla demo giriş akışı
Altı haneli OTP doğrulaması
Dört haneli PIN oluşturma ve giriş
expo-secure-store ile güvenli yerel saklama
Giriş, kayıt ve şifremi unuttum akışları
Oturum durumuna göre otomatik rota koruması
Akıllı Cüzdan
TRY, USD ve EUR bakiyelerini görüntüleme
Bakiyeyi gizleme ve gösterme
Hesaplar arasında hızlı döviz geçişi
Gönder, al, takas ve diğer hızlı işlemler
Öğrenci, Tatil, Sıkı Tasarruf ve Gece Çıkışı harcama modları
Animasyonlu segmentler ve geçişli arayüzler
What If Simülatörü

NOVA Wallet'ın temel ayrıştırıcısı olan simülatör, planlanan bir harcamanın etkisini işlem gerçekleşmeden önce analiz eder.

Girdi	Üretilen sonuç
Harcama tutarı	İşlem sonrası kalan bakiye
Harcama kategorisi	Kullanılan bütçe yüzdesi
Aktif harcama modu	Düşük, orta veya yüksek risk seviyesi
Güncel finansal durum	Bağlamsal kısa açıklama
Sosyal Finans
Katılımcı bazlı grup cüzdanları
Ortak hedef ve katkı takibi
Kişisel tasarruf hedefleri
Yapay zekâ destekli haftalık katkı stratejisi
Tekrarlayan ödeme ve abonelik tespiti
Analitik
Kategori bazlı aylık harcama özeti
Para akışı takvimi
Yaş grubuna göre anonim harcama karşılaştırması
Bütçe uyumu, tasarruf tutarlılığı ve abonelik yüküne dayalı finansal sağlık skoru
Yüksek ve düşük harcama günlerinin görselleştirilmesi
Yapay Zekâ Katmanı
Finansal sorular için doğal dil copilotu
Bütçe aşımı ve risk tahmini
Olağan dışı işlem tespiti
İş yeri bilgilerinin otomatik kategorilendirilmesi
Demo fiş tarama ve sesli asistan arayüzü
Arka uç servisine erişilemediğinde otomatik örnek veri desteği
Sanal Kartlar
Standart, tek kullanımlık, tekrarlayan ve iş yerine kilitli kartlar
Kategori bazlı harcama limitleri
Kart dondurma ve yeniden etkinleştirme
Maskelenmiş kart numarası gösterimi
Sistem Mimarisi

NOVA Wallet, kullanıcı arayüzünü, uygulama durumunu, yerel servisleri ve yapay zekâ servislerini birbirinden ayıran katmanlı bir mimari kullanır. Bu yapı; özelliklerin bağımsız geliştirilmesini, test edilmesini ve gerektiğinde değiştirilmesini kolaylaştırır.

Katmanlı Mimari
flowchart TB
    subgraph PRESENTATION[Sunum Katmanı]
        AUTH_UI[Kimlik Doğrulama]
        WALLET_UI[Cüzdan]
        ANALYTICS_UI[Analitik]
        SOCIAL_UI[Sosyal Finans]
        AI_UI[Yapay Zekâ Copilotu]
    end

    subgraph APPLICATION[Uygulama Katmanı]
        ROUTER[Expo Router]
        AUTH_STORE[useAuthStore]
        ACCOUNT_STORE[useAccountStore]
        MODE_STORE[useModeStore]
        FORM_LAYER[React Hook Form ve Zod]
    end

    subgraph LOCAL[İstemci Servisleri]
        SECURE_STORE[SecureStore]
        ASYNC_STORE[AsyncStorage]
        I18N[i18next ve RTL]
        MOCK_DATA[Örnek Veri Katmanı]
    end

    subgraph SERVER[Arka Uç]
        API[Express API]
        RATE_LIMIT[İstek Sınırlama]
        AI_PROXY[LLM Proxy Servisi]
    end

    PRESENTATION --> APPLICATION
    APPLICATION --> LOCAL
    APPLICATION --> API
    API --> RATE_LIMIT
    RATE_LIMIT --> AI_PROXY
    API -. Servis kullanılamıyor .-> MOCK_DATA
Kimlik Doğrulama Akışı
flowchart TD
    START([Uygulama açılışı]) --> SESSION{Geçerli oturum var mı?}
    SESSION -- Evet --> PIN_REQUIRED{PIN doğrulaması gerekli mi?}
    SESSION -- Hayır --> PHONE[Telefon numarası girişi]
    PHONE --> VALIDATE{Numara geçerli mi?}
    VALIDATE -- Hayır --> PHONE
    VALIDATE -- Evet --> OTP[OTP doğrulaması]
    OTP --> OTP_VALID{Kod doğru mu?}
    OTP_VALID -- Hayır --> OTP
    OTP_VALID -- Evet --> PIN_EXISTS{PIN kayıtlı mı?}
    PIN_EXISTS -- Hayır --> CREATE_PIN[PIN oluştur]
    PIN_EXISTS -- Evet --> ENTER_PIN[PIN gir]
    PIN_REQUIRED -- Evet --> ENTER_PIN
    PIN_REQUIRED -- Hayır --> HOME[Ana uygulama]
    CREATE_PIN --> SECURE[PIN bilgisini güvenli sakla]
    SECURE --> HOME
    ENTER_PIN --> PIN_VALID{PIN doğru mu?}
    PIN_VALID -- Evet --> HOME
    PIN_VALID -- Hayır --> ENTER_PIN
    ENTER_PIN -- PIN unutuldu --> RESET[OTP ile PIN sıfırla]
    RESET --> CREATE_PIN
Ana Ekran ve Durum Yönetimi
flowchart TB
    subgraph STORES[Zustand Durum Katmanı]
        AUTH[useAuthStore]
        ACCOUNT[useAccountStore]
        MODE[useModeStore]
    end

    subgraph HOME[Ana Ekran]
        HEADER[Başlık ve kullanıcı bilgisi]
        SEGMENTS[Hesap segmentleri]
        BALANCE[Bakiye kartı]
        ACTIONS[Hızlı işlemler]
        MODE_BANNER[Aktif harcama modu]
        RECENT[Son işlemler ve döviz bilgileri]
    end

    subgraph INTERACTIONS[Etkileşim Katmanı]
        MENU[Menü alt paneli]
        MODE_MODAL[Harcama modu seçimi]
        MORE_MODAL[Diğer işlemler]
        ANIMATION[Animated API]
    end

    AUTH --> HEADER
    AUTH --> BALANCE
    ACCOUNT --> SEGMENTS
    ACCOUNT --> BALANCE
    MODE --> MODE_BANNER
    HEADER --> MENU
    SEGMENTS --> ANIMATION
    ACTIONS --> MODE_MODAL
    ACTIONS --> MORE_MODAL
    MODE_MODAL --> MODE
Harcama Simülasyonu
sequenceDiagram
    actor User as Kullanıcı
    participant UI as Simülatör Arayüzü
    participant Form as Form Doğrulama
    participant Mode as Harcama Modu
    participant Engine as Risk Motoru

    User->>UI: Tutar ve kategori girer
    UI->>Form: Girdileri doğrular
    alt Girdiler geçersiz
        Form-->>UI: Alan bazlı hata döndürür
        UI-->>User: Düzeltme mesajı gösterir
    else Girdiler geçerli
        Form->>Mode: Aktif risk eşiklerini ister
        Mode-->>Engine: Mod ve bütçe sınırlarını gönderir
        Engine->>Engine: Kalan bakiyeyi ve kullanım oranını hesaplar
        Engine-->>UI: Risk seviyesi ve açıklama döndürür
        UI-->>User: Simülasyon sonucunu gösterir
    end
Uygulama Navigasyonu
flowchart TB
    ROOT[Ana Sekmeler] --> WALLET[Cüzdan]
    ROOT --> ANALYTICS[Analitik]
    ROOT --> SOCIAL[Sosyal Finans]
    ROOT --> COPILOT[Yapay Zekâ Copilotu]
    ROOT --> CARDS[Kartlar]

    WALLET --> SIMULATOR[Harcama Simülatörü]
    WALLET --> MODES[Harcama Modları]
    ANALYTICS --> SUMMARY[Aylık Özet]
    ANALYTICS --> SCORE[Finansal Sağlık Skoru]
    SOCIAL --> GROUPS[Grup Cüzdanları]
    SOCIAL --> GOALS[Tasarruf Hedefleri]
    SOCIAL --> SUBSCRIPTIONS[Abonelikler]
    COPILOT --> RISK[Bütçe Risk Tahmini]
    COPILOT --> ANOMALY[Anomali Tespiti]
    CARDS --> VIRTUAL[Sanal Kart Yönetimi]
    CARDS --> LIMITS[Harcama Limitleri]
Veri Modeli
erDiagram
    USER ||--o{ ACCOUNT : owns
    USER ||--o{ GROUP_MEMBER : participates
    USER ||--o{ SUBSCRIPTION : tracks
    USER ||--o{ SAVINGS_GOAL : creates
    ACCOUNT ||--o{ TRANSACTION : contains
    GROUP_WALLET ||--o{ GROUP_MEMBER : includes
    GROUP_WALLET ||--o{ TRANSACTION : records

    USER {
        string id PK
        string name
        string phone
        string language
        string preferredCurrency
    }

    ACCOUNT {
        string id PK
        string userId FK
        string currency
        number balance
    }

    TRANSACTION {
        string id PK
        string accountId FK
        string groupWalletId FK
        string merchant
        number amount
        string currency
        string category
        datetime createdAt
    }

    GROUP_WALLET {
        string id PK
        string title
        number targetAmount
        string currency
    }

    GROUP_MEMBER {
        string id PK
        string userId FK
        string groupWalletId FK
        number contribution
    }

    SUBSCRIPTION {
        string id PK
        string userId FK
        string title
        number amount
        string billingCycle
    }

    SAVINGS_GOAL {
        string id PK
        string userId FK
        string title
        number targetAmount
        number savedAmount
        date deadline
    }
Teknoloji Yığını
Katman	Teknoloji	Açıklama
Dil	TypeScript	Strict mode ve güçlü tip güvenliği
Mobil uygulama çatısı	React Native + Expo	iOS ve Android için ortak kod tabanı
Routing	Expo Router	Dosya tabanlı, tip güvenli yönlendirme
Stil	NativeWind v4	React Native için Tailwind CSS yaklaşımı
Durum Yönetimi	Zustand	Özellik alanlarına ayrılmış hafif durum depoları
Çoklu Dil	i18next + react-i18next	Türkçe, İngilizce ve Arapça
RTL	React Native I18nManager	Arapça için otomatik sağdan sola düzen
Grafikler	react-native-gifted-charts	Çizgi, çubuk ve pasta grafikler
Animasyon	Reanimated + Animated API	Akıcı ekran ve bileşen geçişleri
Form	React Hook Form + Zod	Şema tabanlı form doğrulaması
Güvenli Depolama	expo-secure-store	PIN ve kimlik doğrulama verileri
Yerel Depolama	AsyncStorage	Hassas olmayan kalıcı state
Arka Uç	Node.js + Express	Yapay zekâ isteklerini yöneten proxy servisi
Güvenlik	express-rate-limit	IP tabanlı istek sınırlaması
Test	Jest + React Native Testing Library	Birim ve bileşen testleri
Proje Yapısı
nova-wallet/
├── app/
│   ├── (auth)/              # Telefon, OTP ve PIN ekranları
│   │   └── _layout.tsx      # Auth stack navigasyonu
│   ├── (tabs)/              # Ana sekme ekranları
│   └── index.tsx            # Kök yönlendirme mantığı
├── backend/
│   └── src/
│       ├── middleware/      # Hız sınırlama ve hata yönetimi
│       ├── routes/          # Yapay zekâ endpoint'leri
│       └── services/        # LLM API entegrasyonu
├── src/
│   ├── components/          # Paylaşılan UI bileşenleri
│   ├── hooks/               # Özel React hook'ları
│   ├── data/                # Demo verileri ve test girdileri
│   ├── i18n/                # Çeviriler: tr, en, ar
│   ├── services/            # API servis katmanı
│   ├── store/               # Zustand store tanımları
│   ├── types/               # Paylaşılan TypeScript tipleri
│   └── utils/               # Yardımcı fonksiyonlar
└── docs/
    ├── screenshots/         # Uygulama ekran görüntüleri
    └── implementation_plan.md
Kurulum
Gereksinimler
Node.js 18 veya üzeri
npm ya da yarn
Expo Go veya iOS/Android simülatörü
Mobil Uygulama
git clone https://github.com/isambais/nova-wallet.git
cd nova-wallet
npm install
npx expo start
Arka Uç Servisi — İsteğe Bağlı

Canlı yapay zekâ özelliklerini kullanmak için arka uç servisini başlatın:

cd backend
npm install
cp .env.example .env
npm run dev

.env dosyanıza LLM servis anahtarını ekleyin:

LLM_API_KEY=your_api_key_here

Arka uç servisi çalışmadığında uygulama kullanılmaya devam eder ve yapay zekâ ekranları otomatik olarak demo yanıtları gösterir.

Demo Giriş Bilgileri
Alan	Değer
Telefon numarası	Herhangi bir geçerli numara
SMS doğrulama kodu	123456
PIN	1234
Güvenlik
API anahtarı izolasyonu: LLM anahtarı yalnızca arka uç sunucusunda tutulur; mobil istemci anahtara doğrudan erişemez.
Hız sınırlaması: Yapay zekâ endpoint'leri IP başına dakikada beş istekle sınırlandırılır.
Güvenli yerel depolama: PIN ve kimlik doğrulama token'ları iOS Keychain veya Android Keystore üzerinden expo-secure-store ile saklanır.
Veri minimizasyonu: Gerçek finansal veri toplanmaz, iletilmez veya depolanmaz.
Yapay zekâ uyarısı: Üretilen yanıtlar yalnızca bilgilendirme ve demo amaçlıdır; yatırım tavsiyesi değildir.
Yol Haritası

20 iş günlük MVP geliştirme kapsamı

Faz	Kapsam
Faz 0 — Kurulum	Expo, NativeWind, dizin yapısı ve tema sistemi
Faz 1 — Kimlik doğrulama ve yerelleştirme	RTL, telefon/OTP/PIN akışı ve dil seçimi
Faz 2 — Cüzdan	Bakiye, işlemler, harcama modları ve simülatör
Faz 3 — Sosyal Finans	Hedefler, grup cüzdanları ve abonelik dedektörü
Faz 4 — Yapay zekâ	Copilot, finansal skor, arka uç servisi ve kartlar
Faz 5 — Test ve teslim	Kalite kontrolleri, testler, dokümantasyon ve ekran görüntüleri

Detaylı plan için docs/implementation_plan.md dosyasını inceleyebilirsiniz.

Finansal Teknoloji Kapsamı

Bu prototip aşağıdaki işlevleri içermez:

Hesaplar arasında gerçek para transferi
Fiziksel veya gerçek sanal kart çıkarımı
Gerçek SMS teslimatı veya operatör düzeyinde telefon doğrulaması
KYC kimlik doğrulaması
Ödeme geçidi veya kart ağı entegrasyonu
PCI-DSS uyumluluğu
MASAK raporlama yükümlülükleri
TCMB elektronik para kuruluşu lisansı

Gerçek ödeme özelliklerinin kullanıma alınması, lisanslı bir banka veya elektronik para kuruluşuyla aktif ortaklık gerektirir.

Geliştirici

<div align="center">

Isam

Yapay Zekâ Mühendisliği · Mobil Uygulama Geliştirme · FinTech




Bu proje, 20 iş günlük staj geliştirme süreci kapsamında hazırlanmıştır.

</div>

Lisans

Bu proje MIT Lisansı kapsamında sunulmaktadır.

<div align="center">

<sub>NOVA Wallet · Daha bilinçli finansal kararlar için geliştirildi.</sub>

</div>
