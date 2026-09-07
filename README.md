[NOVA Wallet
Çok dilli, yapay zeka destekli kişisel finans asistanı


Genel Bakış
NOVA Wallet, geleneksel bankacılık uygulamalarından farklı olarak kullanıcının harcamadan önce düşünmesini sağlayan bir kişisel finans asistanıdır. Pasif işlem takibi yerine üç temel fikir üzerine kurulmuştur: satın almadan önce bütçeye etkisini simüle etmek, ortak bütçeleri birlikte yönetmek ve harcama alışkanlıkları hakkında yapay zeka destekli bağlamsal içgörüler sunmak.

Uygulama, karmaşık bankacılık arayüzleri olmadan bilinçli finansal kontrol isteyen genç profesyonelleri ve öğrencileri hedeflemektedir. Türkçe, İngilizce ve Arapça (tam RTL düzeni dahil) desteklenmekte olup her özellik katmanı — kimlik doğrulama, cüzdan, sosyal finans, yapay zeka — bağımsız olarak geliştirilebilecek ve test edilebilecek modüler bir mimariyle inşa edilmiştir.

Bu bir demo prototipidir. Gerçek para işlemi yapmaz, gerçek kart çıkarmaz, gerçek KYC doğrulaması yapmaz ve hiçbir finansal mevzuata tabi değildir. Tüm işlemler ve yapay zeka çıktıları sahte veri kullanır.](https://claude.ai/code/artifact/ea521ff8-d4f2-474b-82f8-947b3827f8e8

bu readme bana yaz yapistiyim githubta ayni tasarim olacak profesyonel 

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

Library
/
README.md

<div align="center">

NOVA Wallet
Yapay zekâ destekli, çok dilli kişisel finans asistanı

Harcamadan önce bütçe etkisini analiz eden, ortak finans yönetimini kolaylaştıran ve kişiselleştirilmiş içgörüler sunan React Native MVP prototipi.














Genel Bakış •
Özellikler •
Mimari •
Kurulum •
Güvenlik •
Yol Haritası

</div>

📌 Genel Bakış

NOVA Wallet, geleneksel bankacılık uygulamalarındaki pasif işlem takibinin ötesine geçerek kullanıcının harcamadan önce düşünmesini sağlayan bir kişisel finans asistanıdır.

Proje üç temel fikir üzerine kurulmuştur:

Bir satın alma gerçekleşmeden önce bütçeye etkisini simüle etmek
Ortak bütçeleri birden fazla kullanıcıyla birlikte yönetmek
Harcama alışkanlıkları hakkında yapay zekâ destekli, bağlamsal içgörüler sunmak

Uygulama; karmaşık bankacılık arayüzleri olmadan bilinçli finansal kontrol isteyen genç profesyonelleri ve öğrencileri hedefler. Türkçe, İngilizce ve Arapça dillerini destekler; Arapça için tam RTL düzeni sunar.

[!IMPORTANT]
NOVA Wallet bir demo prototipidir. Gerçek para işlemi veya KYC doğrulaması yapmaz, gerçek kart çıkarmaz ve herhangi bir finansal mevzuata tabi değildir. İşlemler ile yapay zekâ çıktıları demo verileri kullanır.

📱 Ekran Görüntüleri

<div align="center">

Kimlik Doğrulama	Cüzdan	Harcama Simülatörü
<img src="docs/screenshots/auth.png" width="240" alt="NOVA Wallet kimlik doğrulama ekranı" />	<img src="docs/screenshots/wallet.png" width="240" alt="NOVA Wallet cüzdan ekranı" />	<img src="docs/screenshots/simulator.png" width="240" alt="NOVA Wallet harcama simülatörü" />

</div>

Ekran görüntülerinin gösterilmesi için görselleri docs/screenshots/ klasörüne auth.png, wallet.png ve simulator.png adlarıyla ekleyin.

✨ Özellikler
🔐 Kimlik Doğrulama
Telefon numarasıyla demo giriş akışı
Altı haneli OTP doğrulaması
Dört haneli PIN oluşturma ve giriş
expo-secure-store ile güvenli yerel saklama
Giriş, kayıt ve şifremi unuttum akışları
Oturum durumuna göre otomatik rota koruması
💳 Akıllı Cüzdan
TRY, USD ve EUR bakiyelerini görüntüleme
Bakiyeyi gizleme ve gösterme
Hesaplar arasında hızlı döviz geçişi
Gönder, al, takas ve diğer hızlı işlemler
Öğrenci, Tatil, Sıkı Tasarruf ve Gece Çıkışı harcama modları
Animasyonlu segmentler ve geçişli arayüzler
🔮 What If Simülatörü

NOVA Wallet'ın temel ayrıştırıcısı olan simülatör, planlanan bir harcamanın etkisini işlem gerçekleşmeden önce analiz eder.

Girdi	Üretilen sonuç
Harcama tutarı	İşlem sonrası kalan bakiye
Harcama kategorisi	Kullanılan bütçe yüzdesi
Aktif harcama modu	Düşük, orta veya yüksek risk seviyesi
Güncel finansal durum	Bağlamsal kısa açıklama
👥 Sosyal Finans
Katılımcı bazlı grup cüzdanları
Ortak hedef ve katkı takibi
Kişisel tasarruf hedefleri
Yapay zekâ destekli haftalık katkı stratejisi
Tekrarlayan ödeme ve abonelik tespiti
📊 Analitik
Kategori bazlı aylık harcama özeti
Para akışı takvimi
Yaş grubuna göre anonim harcama karşılaştırması
Bütçe uyumu, tasarruf tutarlılığı ve abonelik yüküne dayalı finansal sağlık skoru
Yüksek ve düşük harcama günlerinin görselleştirilmesi
🤖 Yapay Zekâ Katmanı
Finansal sorular için doğal dil copilotu
Bütçe aşımı ve risk tahmini
Olağan dışı işlem tespiti
Otomatik merchant kategorilendirme
Demo fiş tarama ve sesli asistan arayüzü
Backend erişilemediğinde otomatik mock veri desteği
💳 Sanal Kartlar
Standart, tek kullanımlık, tekrarlayan ve merchant-kilitli kartlar
Kategori bazlı harcama limitleri
Kart dondurma ve yeniden etkinleştirme
Maskelenmiş kart numarası gösterimi
🧱 Mimari

Her özellik katmanı bağımsız geliştirilebilecek ve test edilebilecek şekilde modüler olarak tasarlanmıştır.

Kimlik Doğrulama Akışı
flowchart TD
    A[Telefon ile Karşılama] --> B[Telefon Numarası ve Zod]
    B --> C[OTP Doğrulama]
    C --> D{OTP doğru mu?}
    D -- Hayır --> C
    D -- Evet --> E{PIN kayıtlı mı?}
    E -- Hayır --> F[PIN Oluştur]
    E -- Evet --> G[PIN Gir]
    F --> HOME[Ana Sekmeler]
    G --> HOME
    G -- Şifremi Unuttum --> H[PIN Sıfırlama]
    H --> I[OTP Doğrulama]
    I --> F
Ana Ekran State Akışı
flowchart LR
    AUTH[useAuthStore] --> WALLET[Bakiye Kartı]
    ACCOUNT[useAccountStore] --> WALLET
    MODE[useModeStore] --> BANNER[Harcama Modu]
    TABS[Segment Tabs] --> ANIM[Animated API]
    ACTIONS[Hızlı İşlemler] --> MODALS[İşlem Modalları]
    WALLET --> SWAP[Para Birimi Geçişi]
Uygulama Akışı
flowchart TD
    A([Uygulama Açılışı]) --> B{Aktif oturum var mı?}
    B -- Hayır --> C[Telefon Girişi]
    C --> D[OTP Doğrulama]
    D --> E[PIN Oluştur veya Gir]
    B -- Evet --> F[Ana Sekmeler]
    E --> F
    F --> G[Cüzdan]
    F --> H[Analitik]
    F --> I[Sosyal Finans]
    F --> J[AI Copilot]
    F --> K[Kartlar]
    G --> L[What If Simülatörü]
    H --> M[Finansal Sağlık Skoru]
    I --> N[Grup Cüzdanları]
    J --> O[Risk ve Anomali Analizi]
    K --> P[Sanal Kart Yönetimi]
Veri Modeli
erDiagram
    USER ||--o{ GROUP_WALLET : joins
    USER ||--o{ SUBSCRIPTION : owns
    USER ||--o{ GOAL : creates
    GROUP_WALLET ||--o{ TRANSACTION : contains

    USER {
        string id PK
        string name
        string phone
        string language
        string currency
        number balance
    }

    GROUP_WALLET {
        string id PK
        string title
        number targetAmount
        string currency
    }

    TRANSACTION {
        string id PK
        string title
        string merchant
        number amount
        string currency
        string category
        string date
    }

    SUBSCRIPTION {
        string id PK
        string title
        number amount
        string currency
        string cycle
    }

    GOAL {
        string id PK
        string title
        number targetAmount
        number savedAmount
        string currency
        string deadline
    }
🛠️ Teknoloji Yığını
Katman	Teknoloji	Açıklama
Dil	TypeScript	Strict mode ve güçlü tip güvenliği
Mobil Framework	React Native + Expo	iOS ve Android için ortak kod tabanı
Routing	Expo Router	Dosya tabanlı, tip güvenli yönlendirme
Stil	NativeWind v4	React Native için Tailwind CSS yaklaşımı
State Yönetimi	Zustand	Alana özgü, hafif store yapısı
Çoklu Dil	i18next + react-i18next	Türkçe, İngilizce ve Arapça
RTL	React Native I18nManager	Arapça için otomatik sağdan sola düzen
Grafikler	react-native-gifted-charts	Çizgi, çubuk ve pasta grafikler
Animasyon	Reanimated + Animated API	Akıcı ekran ve bileşen geçişleri
Form	React Hook Form + Zod	Şema tabanlı form doğrulaması
Güvenli Depolama	expo-secure-store	PIN ve kimlik doğrulama verileri
Yerel Depolama	AsyncStorage	Hassas olmayan kalıcı state
Backend	Node.js + Express	Yapay zekâ proxy servisi
Güvenlik	express-rate-limit	IP tabanlı istek sınırlaması
Test	Jest + React Native Testing Library	Birim ve bileşen testleri
📁 Proje Yapısı
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
│   ├── data/                # Demo verileri ve fixture'lar
│   ├── i18n/                # Çeviriler: tr, en, ar
│   ├── services/            # API servis katmanı
│   ├── store/               # Zustand store tanımları
│   ├── types/               # Paylaşılan TypeScript tipleri
│   └── utils/               # Yardımcı fonksiyonlar
└── docs/
    ├── screenshots/         # Uygulama ekran görüntüleri
    └── implementation_plan.md
🚀 Kurulum
Gereksinimler
Node.js 18 veya üzeri
npm ya da yarn
Expo Go veya iOS/Android simülatörü
Mobil Uygulama
git clone https://github.com/isambais/nova-wallet.git
cd nova-wallet
npm install
npx expo start
Backend — Opsiyonel

Canlı yapay zekâ özellikleri için backend servisini başlatın:

cd backend
npm install
cp .env.example .env
npm run dev

.env dosyanıza LLM servis anahtarını ekleyin:

LLM_API_KEY=your_api_key_here

Backend çalışmadığında uygulama kullanılmaya devam eder ve yapay zekâ ekranları otomatik olarak demo yanıtları gösterir.

Demo Giriş Bilgileri
Alan	Değer
Telefon numarası	Herhangi bir geçerli numara
SMS doğrulama kodu	123456
PIN	1234
🔒 Güvenlik
API anahtarı izolasyonu: LLM anahtarı yalnızca backend sunucusunda tutulur; mobil istemci anahtara doğrudan erişemez.
Hız sınırlaması: Yapay zekâ endpoint'leri IP başına dakikada beş istekle sınırlandırılır.
Güvenli yerel depolama: PIN ve kimlik doğrulama token'ları iOS Keychain veya Android Keystore üzerinden expo-secure-store ile saklanır.
Veri minimizasyonu: Gerçek finansal veri toplanmaz, iletilmez veya depolanmaz.
Yapay zekâ uyarısı: Üretilen yanıtlar yalnızca bilgilendirme ve demo amaçlıdır; yatırım tavsiyesi değildir.
🗺️ Yol Haritası

20 iş günlük MVP geliştirme kapsamı

Faz	Kapsam
Faz 0 — Kurulum	Expo, NativeWind, dizin yapısı ve tema sistemi
Faz 1 — Auth ve i18n	RTL, telefon/OTP/PIN akışı ve dil seçimi
Faz 2 — Cüzdan	Bakiye, işlemler, harcama modları ve simülatör
Faz 3 — Sosyal Finans	Hedefler, grup cüzdanları ve abonelik dedektörü
Faz 4 — Yapay Zekâ	Copilot, finansal skor, backend ve kartlar
Faz 5 — Test ve Teslim	QA, testler, dokümantasyon ve ekran görüntüleri

Detaylı plan için docs/implementation_plan.md dosyasını inceleyebilirsiniz.

⚖️ FinTech Kapsam Sınırları

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

👨‍💻 Geliştirici

<div align="center">

Isam

Yapay Zekâ Mühendisliği · Mobil Uygulama Geliştirme · FinTech




Bu proje, 20 iş günlük staj geliştirme süreci kapsamında hazırlanmıştır.

</div>

📄 Lisans

Bu proje MIT Lisansı kapsamında sunulmaktadır.

<div align="center">

<sub>NOVA Wallet · Daha bilinçli finansal kararlar için geliştirildi.</sub>

</div>)


Ekran Görüntüleri
<img width="351" height="649" alt="image" src="https://github.com/user-attachments/assets/d9fb1cd6-2399-4d85-86c4-a268d34bcbb4" />
<img width="354" height="647" alt="image" src="https://github.com/user-attachments/assets/5644b064-a7fb-485d-9cc5-3d524ffaa282" />
<img width="341" height="586" alt="image" src="https://github.com/user-attachments/assets/f4a3e213-4130-4cdf-a6ed-adb9a28b1e6b" />
<img width="340" height="604" alt="image" src="https://github.com/user-attachments/assets/868bc5da-d836-4d7f-94ce-5e8f10f04c90" />
<img width="373" height="735" alt="image" src="https://github.com/user-attachments/assets/8fff525e-ac87-42f6-9ba0-fddb2352df37" />

Mimari Diyagramlar
Kimlik Doğrulama Akışı
Auth ekranları arası yönlendirme akışı ve useAuthStore yapısı.

flowchart TD

    subgraph ANA["Ana Giriş Akışı"]

        A[phone.tsx\nKarşılama] --> B[phone-input.tsx\nTelefon + Zod]

        B --> C[otp.tsx\nDemo: 123456]

        C --> D{OTP doğru mu?}

        D -- Hayır --> C

        D -- Evet --> E{PIN kayıtlı mı?}

        E -- Hayır --> F[pin.tsx\ncreate modu]

        E -- Evet --> G[pin.tsx\nenter modu]

        F --> HOME[/tabs/home]

        G --> HOME

    end

    subgraph FORGOT["Şifremi Unuttum Akışı"]

        G -- Şifremi Unuttum --> H[forgot-pin.tsx]

        H --> I[otp.tsx\nforgot-pin modu]

        I --> J[pin.tsx\ncreate modu]

        J --> HOME

    end

    subgraph STORE["useAuthStore · Zustand"]

        S1[user: User or null]

        S2[pin: string]

        S3[setUser: void]

        S4[setPin: void]

        S5[logout: void]

        S6[generateMockIban]

    end


Ana Ekran Mimarisi ve State Akışı
Bileşen katmanları, Zustand store yapısı ve Animated API kullanımı.

flowchart LR

    subgraph STORES["Zustand Stores"]

        AUTH["useAuthStore\nuser: User or null\npin: string\nsetUser / logout"]

        ACCOUNT["useAccountStore\nactiveCurrency: string\nsetActiveCurrency\nTRY · USD · EUR"]

        MODE["useModeStore\nactiveMode: SpendingMode\nsetMode\n4 harcama modu"]

    end

    subgraph UI["HomeScreen UI Katmanları"]

        direction TB

        U1["Header\nMenu → bottom sheet · Avatar user.name"]

        U2["Segment Tabs x4\nHesabım · Yatırım · Kıymetli Maden · Birikim\nAnimated pill: pillX + pillW"]

        U3["Bakiye Kartı\nLinearGradient · Eye toggle\nArrowLeftRight → handleSwap · IBAN satırı"]

        U4["Hızlı İşlemler x5\nGönder · Al · Takas · Modlar · Daha"]

        U5["Mode Banner\nactiveMode && koşullu render"]

        U6["Döviz + Son İşlemler\nEXCHANGE_RATES · getRecentTransactions"]

        U7["FAB — Floating AI\nLinearGradient + Bot ikonu"]

    end

    subgraph MODALS["Modals ve Animated API"]

        M1["Animated API\npillX · pillW · cardOpacity\nAnimated.parallel → pill\nuseNativeDriver: false"]

        M2["Mod Seçim Modali\nSPENDING_MODES 4 grid\n2x2 kart düzeni\nisActive + check badge"]

        M3["Daha Fazla Modali\nMORE_ACTIONS 4x2 grid\nsim + screens/simulator"]

        M4["Menü Bottom Sheet\nMENU_GROUPS 3 grup\nicon + label + sub\nrouter.push route"]

        M5["fmtNative\namount.toLocaleString\nminFrac:0 maxFrac:0"]

        M6["handleSwap\naccountIdx+1 mod 3\nsetActiveCurrency next"]

    end

    AUTH -- state --> U3

    ACCOUNT -- state --> U3

    MODE -- state --> U5

    U1 -- opens --> M4

    U2 -- anim --> M1

    U4 -- opens --> M2

    U4 -- opens --> M3

    U6 -- calls --> M5

    U3 -- calls --> M6


Veri Modeli
TypeScript tip ilişkileri — Demo veri modeli.

erDiagram

    User {

        string id PK

        string name

        string phone

        string language

        Currency currency

        number balance

    }

    GroupWallet {

        string id PK

        string title

        number targetAmount

        Currency currency

        Member[] members

    }

    Transaction {

        string id PK

        string title

        string merchant

        number amount

        Currency currency

        Category category

        string date

    }

    Subscription {

        string id PK

        string title

        number amount

        Currency currency

        string cycle

    }

    Goal {

        string id PK

        string title

        number targetAmount

        number savedAmount

        Currency currency

        string deadline

    }

    User ||--o{ GroupWallet : "1-N"

    User ||--o{ Subscription : "1-N"

    User ||--o{ Goal : "1-N"

    GroupWallet ||--o{ Transaction : "1-N"


Uygulama Akışı
flowchart TD

    A([Uygulama Açılışı]) --> B{Oturum var mı?}

    B -- Evet --> C[Ana Sekme]

    B -- Hayır --> D[Telefon Girişi]

    D --> E[OTP Doğrulama\n6 haneli kod: 123456]

    E --> F{OTP doğru mu?}

    F -- Hayır --> E

    F -- Evet --> G{PIN kayıtlı mı?}

    G -- Hayır --> H[PIN Oluştur]

    G -- Evet --> I[PIN Gir]

    H --> C

    I --> C

    C --> J[Cüzdan]

    C --> K[Analitik]

    C --> L[Sosyal]

    C --> M[Yapay Zeka Copilot]

    C --> N[Kartlar]

    J --> J1[Bakiye Görüntüleme\nGizle / Göster]

    J --> J2[Harcama Modları\nÖğrenci · Tatil · Sıkı · Gece Çıkışı]

    J --> J3[What If Simülatörü\nBütçe Etkisi + Risk Seviyesi]

    K --> K1[Aylık Özet]

    K --> K2[Kategori Haritası]

    K --> K3[Yaş Grubu Karşılaştırması]

    K --> K4[Finansal Sağlık Skoru 0-100]

    L --> L1[Grup Cüzdanları\nTatil · Ev Arkadaşı · Etkinlik]

    L --> L2[Tasarruf Hedefi Takibi]

    L --> L3[Abonelik Dedektörü]

    M --> M1[Doğal Dil Sorgusu]

    M --> M2[Bütçe Risk Tahmini]

    M --> M3[Anomali Tespiti]

    M --> M4[Fiş Tarama — Demo]

    N --> N1[Sanal Kart Türleri\nStandart · Tek Kullanım · Tekrarlayan · Merchant-Kilitli]

    N --> N2[Kategori Bazlı Harcama Limitleri]

    N --> N3[Dondur / Çöz · Numara Maskeleme]


Özellikler
Kimlik Doğrulama
Kimlik doğrulama akışı MVP için sade tutulmuştur. Kullanıcı telefon numarası girer, sahte OTP alır (herhangi bir numara kabul edilir, kod 123456) ve dört haneli PIN (1234) belirler. PIN, expo-secure-store aracılığıyla yerel olarak şifrelenerek saklanır.

Kök index üzerindeki rota koruması, kimliği doğrulanmış oturumları ana sekmeye, kimliği doğrulanmamışları telefon girişi ekranına yönlendirir. OTP ekranı üç modu destekler: login, register ve forgot-pin. Şifremi unuttum akışında kullanıcı, PIN ekranına yönlendirilmeden önce OTP doğrulamasından geçer. useAuthStore; kullanıcı verisi, PIN durumu, setUser, setPin, logout ve sahte IBAN üretimi (generateMockIban) metodlarını barındırır.
Cüzdan
Ana cüzdan ekranı bakiyeyi üç döviz cinsinden (TRY, USD, EUR) görüntüler. handleSwap fonksiyonu ile dövizler arasında geçiş yapılır; bakiye gizleme/gösterme özelliği kamuya açık ortamlarda gizlilik sağlar. Segment tabs animasyonu pillX ve pillW Animated değerleriyle, renk geçişi LinearGradient ile uygulanmaktadır.

Dört harcama modu mevcuttur: Öğrenci, Tatil, Sıkı Tasarruf ve Gece Çıkışı. useModeStore üzerinden yönetilen aktif mod, simülatör ve yapay zeka katmanında kullanılan bütçe risk eşiklerini belirler. Hızlı işlemler satırı beş eylemi barındırır: Gönder, Al, Takas, Modlar ve Daha Fazlası.

What If Simülatörü, uygulamanın temel ayrıştırıcısıdır. Kullanıcı bir tutar ve kategori girer; simülatör kalan bakiyeyi, bütçenin ne kadarının tüketildiğini hesaplar ve kısa bir açıklamayla birlikte düşük, orta veya yüksek risk seviyesi döndürür.
Sosyal Finans
Grup cüzdanları birden fazla katılımcının ortak bir bütçeye katkıda bulunmasına ve takip etmesine olanak tanır. Her grup cüzdanının hedef tutarı, bireysel katkıları ve anlık kalan bakiyesi bulunur.

Tasarruf hedefi kartları, kullanıcıların bakiyelerinin belirli bir bölümünü belirli hedeflere ayırmasını sağlar. İsteğe bağlı olarak yapay zeka tarafından oluşturulan haftalık katkı stratejisiyle ilişkilendirilebilir.

Abonelik dedektörü, işlem geçmişini tarayarak tekrarlayan ödemeleri tespit eder ve birleştirilmiş bir liste halinde sunar.
Analitik
Aylık özet toplam harcamayı kategoriye göre yüzde paylarıyla döker. Kategori haritası paranın nereye gittiğini görsel olarak dağıtır. Para akışı takvimi ay boyunca yüksek ve düşük harcama günlerini işaretler. Yaşıt karşılaştırma, kullanıcının harcamalarını aynı yaş grubundan anonimleştirilmiş toplu verilerle kıyaslar. Finansal sağlık skoru (0–100); bütçeye uyum, tasarruf tutarlılığı ve abonelik yükünü bir araya getiren bileşik bir metriktir.
Yapay Zeka Katmanı
Tüm yapay zeka özellikleri, LLM API anahtarını mobil istemciden uzak tutmak için bir backend proxy üzerinden yönlendirilir. Backend mevcut olmadığında tüm yapay zeka ekranları sahte veriye geri döner; uygulama yapay zeka servisine erişim olmadan da tam olarak kullanılabilir kalır.

Finans copilotu doğal dil sorgularını kabul eder ve mevcut sahte işlem verilerine dayalı bağlamsal yanıtlar döndürür. Bütçe risk tahmini, mevcut harcama temposuna bakarak kullanıcının ay sonundan önce bütçesini aşıp aşmayacağını tahmin eder. Anomali tespiti, kullanıcının tarihsel kalıplarından önemli ölçüde sapan işlemleri işaretler. Otomatik merchant kategorilendirme, her işleme manuel giriş olmaksızın bir harcama kategorisi atar. Fiş tarama ve sesli asistan demo modundadır; kullanıcı arayüzü tamamdır ancak işleme sahte sonuçlar döndürür.
Kartlar
Dört sanal kart türü desteklenir: standart, tek kullanımlık, tekrarlayan ve merchant-kilitli. Her karta kategori bazlı harcama limiti atanabilir. Güvenlik kontrolleri arasında kart dondurma/çözme ve maskelenmiş kart numarası görüntüleme yer alır.


Teknoloji Yığını
Katman
Teknoloji
Açıklama
Dil
TypeScript (strict mode)
Tam tip kapsamı, örtük any yok
Framework
React Native + Expo
SDK 51
Routing
Expo Router
Dosya tabanlı yönlendirme, tiplenmiş rotalar
Stil
NativeWind v4
React Native için Tailwind CSS
State Yönetimi
Zustand
Alana özgü store'lar
Çoklu Dil
i18next + react-i18next
Türkçe, İngilizce, Arapça
RTL Desteği
React Native I18nManager
Arapça lokalinde otomatik uygulanır
Grafikler
react-native-gifted-charts
Çizgi, çubuk ve pasta grafikler
Animasyon
React Native Reanimated
Hareket tabanlı geçişler
Form
React Hook Form + Zod
Tüm girdilerde şema doğrulaması
Güvenli Depolama
expo-secure-store
PIN ve kimlik doğrulama token'ları
Async Depolama
AsyncStorage
Hassas olmayan kalıcı state
Backend
Node.js + Express
Yapay zeka proxy servisi
Hız Sınırlama
express-rate-limit
IP başına dakikada 5 istek
LLM
Ready LLM API
Yalnızca backend proxy üzerinden erişilir
Test
Jest + React Native Testing Library
Birim ve bileşen testleri



Proje Yapısı
nova-wallet/

├── app/

│   ├── (auth)/               # Telefon, OTP, PIN ekranları

│   │   └── _layout.tsx       # Auth stack navigasyonu

│   ├── (tabs)/               # Ana sekme ekranları

│   └── index.tsx             # Kök yönlendirme mantığı

├── backend/

│   └── src/

│       ├── middleware/        # Hız sınırlama, hata yönetimi

│       ├── routes/            # Yapay zeka endpoint tanımları

│       └── services/          # LLM API entegrasyonu

├── src/

│   ├── components/            # Paylaşılan UI bileşenleri

│   ├── hooks/                 # Özel React hook'ları

│   ├── data/                  # Sahte veri ve fixture'lar

│   ├── i18n/                  # Çeviri dosyaları (tr · en · ar)

│   ├── services/              # API servis katmanı

│   ├── store/                 # Zustand store tanımları

│   ├── types/                 # Paylaşılan TypeScript tipleri

│   └── utils/                 # Yardımcı fonksiyonlar

└── docs/

    ├── screenshots/           # Uygulama ekran görüntüleri

    └── implementation_plan.md


Kurulum
Gereksinimler: Node.js 18+ · npm veya yarn · Expo Go uygulaması veya iOS/Android simülatörü

git clone https://github.com/isambais/nova-wallet.git

cd nova-wallet

npm install

npx expo start

Backend kurulumu (opsiyonel — canlı yapay zeka özellikleri için gerekli):

cd backend

npm install

cp .env.example .env

# .env dosyasına LLM_API_KEY ekleyin

# Boş bırakırsanız sahte yanıt modu devreye girer

npm run dev

Mobil uygulama backend olmadan da çalışır. Tüm yapay zeka ekranları, backend erişilemediğinde sahte veri döndürür.

Demo giriş bilgileri:

Alan
Değer
Telefon numarası
Herhangi bir numara
SMS kodu
123456
PIN
1234



Güvenlik
API anahtarı izolasyonu. LLM API anahtarı yalnızca backend sunucusunda saklanır. Mobil istemci anahtara doğrudan erişemez; yalnızca proxy endpoint ile iletişim kurar.

Hız sınırlama. Backend, kötüye kullanımı önlemek amacıyla IP başına dakikada 5 yapay zeka isteğiyle sınırlıdır.

Yerel şifreleme. Kullanıcının PIN'i ve kimlik doğrulama token'ları expo-secure-store kullanılarak depolanır; iOS'ta Keychain, Android'de Keystore sistemini kullanır. Hassas veriler asla AsyncStorage'a yazılmaz.

Veri kapsamı. Tüm kullanıcı verisi yerel olarak üretilmiş sahte veridir. Gerçek finansal bilgi toplanmaz, iletilmez veya depolanmaz.

Yapay zeka çıktı uyarısı. Tüm yapay zeka çıktıları yalnızca bilgilendirme ve demo amaçlıdır. Hiçbir yanıt yatırım tavsiyesi, kredi rehberliği veya finansal öneri niteliği taşımaz.


Sprint Durumu
Aktif Geliştirme — Gün 12 / 20

Faz
Durum
Kapsam
Faz 0: Kurulum
Tamamlandı
Expo, NativeWind, dizin yapısı, tema sistemi
Faz 1: Kimlik Doğrulama ve i18n
Tamamlandı
RTL düzeni, telefon/OTP/PIN akışı, dil seçimi
Faz 2: Cüzdan
Tamamlandı
Bakiye görüntüleme, işlemler, harcama modları, simülatör
Faz 3: Sosyal Finans
Devam ediyor
Hedefler, grup cüzdanları, abonelik dedektörü
Faz 4: Yapay Zeka Katmanı
Beklemede
Copilot, finansal skor, backend entegrasyonu, kartlar
Faz 5: Test ve Teslim
Beklemede
QA, dokümantasyon, ekran görüntüleri


Detaylı uygulama planı: docs/implementation_plan.md


FinTech Kapsam Sınırları
Bu prototip aşağıdakileri içermez:

Hesaplar arasında gerçek para hareketi veya transfer
Bir ödeme ağı üzerinden fiziksel veya sanal kart çıkarımı
Gerçek SMS teslimatı veya operatör düzeyinde telefon numarası doğrulaması
KYC kimlik doğrulaması
Herhangi bir ödeme geçidi veya kart şeması entegrasyonu
PCI-DSS uyumluluğu
MASAK raporlama yükümlülükleri
TCMB e-para kurumu lisansı

Gerçek ödeme özelliklerinin hayata geçirilmesi, lisanslı bir banka veya e-para kurumuyla aktif ortaklık gerektirir.


Lisans
MIT

