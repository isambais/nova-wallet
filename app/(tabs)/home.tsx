import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Animated, Dimensions, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Menu, Eye, EyeOff,
  ArrowUp, ArrowDown, RefreshCcw, LayoutGrid,
  TrendingUp, TrendingDown, Bot, CreditCard,
  ChevronRight, Copy,
} from 'lucide-react-native';
import { PieChart } from 'react-native-gifted-charts';
import { colors, gradients } from '../../src/theme/colors';
import { useAuthStore, generateMockIban } from '../../src/store/useAuthStore';

const { width: SW } = Dimensions.get('window');

// ─── MOCK DATA ────────────────────────────────────────────────────
const SEGMENTS = ['Hesabım', 'Yatırım', 'Kıymetli Maden', 'Birikim'];

// Her segment için farklı gradient renk + bakiye verisi
// activeSegment index'i ile bu array'den doğru objeyi seçeceğiz
const SEGMENT_CONFIG = [
  {
    gradient: ['#3B1FA0', '#7C3AED', '#A855F7'] as [string, string, string],
    balance: '₺ 12.450,00',
    income:  '₺ 8.200,00',
    expense: '₺ 3.750,00',
    change:  '+₺ 280,50 (%2,30) bugün',
    changeUp: true,
  },
  {
    gradient: ['#0C4A6E', '#0369A1', '#38BDF8'] as [string, string, string],
    balance: '₺ 6.820,00',
    income:  '₺ 1.450,00',
    expense: '₺ 1.200,00',
    change:  '+₺ 145,00 (%2,17) bugün',
    changeUp: true,
  },
  {
    gradient: ['#78350F', '#B45309', '#FCD34D'] as [string, string, string],
    balance: '₺ 2.180,00',
    income:  '₺ 680,00',
    expense: '₺ 0,00',
    change:  '+₺ 67,50 (%3,20) bugün',
    changeUp: true,
  },
  {
    gradient: ['#064E3B', '#059669', '#34D399'] as [string, string, string],
    balance: '₺ 3.450,00',
    income:  '₺ 500,00',
    expense: '₺ 0,00',
    change:  '+₺ 12,80 (%0,37) bugün',
    changeUp: true,
  },
];

const QUICK_ACTIONS = [
  { Icon: ArrowUp,     label: 'Gönder',      color: '#7C3AED' },
  { Icon: ArrowDown,   label: 'Al',           color: '#10B981' },
  { Icon: RefreshCcw,  label: 'Takas',        color: '#F59E0B' },
  { Icon: LayoutGrid,  label: 'Daha Fazla',   color: '#7A8BA8' },
];

const EXCHANGE_RATES = [
  { pair: 'USD / TRY', rate: '32,45', change: '+0,12%', up: true },
  { pair: 'EUR / TRY', rate: '35,10', change: '-0,05%', up: false },
  { pair: 'XAU / TRY', rate: '2.180', change: '+0,31%', up: true },
];

const PIE_DATA = [
  { value: 40, color: colors.purple,      label: 'Hisse Senedi' },
  { value: 30, color: colors.success,     label: 'Kripto Para' },
  { value: 20, color: colors.warning,     label: 'Kıymetli Maden' },
  { value: 10, color: colors.text3,       label: 'Nakit' },
];

const CARDS = [
  { id: '1', last4: '4242', type: 'Visa',       balance: '₺ 4.200,00', gradient: gradients.card },
  { id: '2', last4: '8810', type: 'Mastercard', balance: '₺ 8.250,00', gradient: ['#1A1040', '#2D1C6E', '#4C1D95'] as [string, string, string] },
];

const TX_FILTERS = ['Tümü', 'Gelir', 'Gider'];

const TRANSACTIONS = [
  { id: '1', title: 'Maaş Ödemesi',    subtitle: 'Şirket Transferi', amount: '+₺ 8.200,00', date: '28 Haz',  type: 'in'  },
  { id: '2', title: 'Market Alışverişi',subtitle: 'Migros',          amount: '-₺ 320,50',   date: '27 Haz',  type: 'out' },
  { id: '3', title: 'Kira Ödemesi',    subtitle: 'Otomatik Ödeme',   amount: '-₺ 2.800,00', date: '25 Haz',  type: 'out' },
  { id: '4', title: 'Temettü Geliri',  subtitle: 'Hisse Senedi',     amount: '+₺ 450,00',   date: '22 Haz',  type: 'in'  },
  { id: '5', title: 'Elektrik Faturası',subtitle: 'Otomatik Ödeme',  amount: '-₺ 185,00',   date: '20 Haz',  type: 'out' },
];

// ─── ANA EKRAN ────────────────────────────────────────────────────
export default function HomeScreen() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeSegment, setActiveSegment]   = useState(0);
  const [activeTxFilter, setActiveTxFilter] = useState(0);
  const [tabLayouts, setTabLayouts]         = useState<{ x: number; width: number }[]>([]);
  const user    = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  // Migration: eski kullanıcının iban'ı yoksa üret ve kaydet
  useEffect(() => {
    if (user && !user.iban) {
      setUser({ ...user, iban: generateMockIban() });
    }
  }, [user?.id]);

  // Pill animation (segment tabs)
  const pillX = useRef(new Animated.Value(0)).current;
  const pillW = useRef(new Animated.Value(80)).current;

  // Bakiye kartı fade animasyonu
  // useNativeDriver:true → opacity GPU'da çalışır, hiç takılmaz
  const cardOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const layout = tabLayouts[activeSegment];
    if (!layout) return;

    // Pill: spring yerine timing — daha keskin ve öngörülebilir
    Animated.parallel([
      Animated.timing(pillX, {
        toValue: layout.x,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(pillW, {
        toValue: layout.width,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();

    // Kart fade: hızlıca 0'a in → renk değişti → geri 1'e çık
    Animated.sequence([
      Animated.timing(cardOpacity, { toValue: 0, duration: 80,  useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [activeSegment, tabLayouts]);

  // Aktif segment'in konfigürasyonu — bakiye kartı bunu kullanacak
  const seg = SEGMENT_CONFIG[activeSegment];

  // TX filter — gelir/gider'e göre filtrele
  const filteredTx = TRANSACTIONS.filter(tx =>
    activeTxFilter === 0 ? true :
    activeTxFilter === 1 ? tx.type === 'in' :
    tx.type === 'out'
  );

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      {/* ─── SCROLL ─── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ── HEADER ── */}
        <View style={s.header}>
          <TouchableOpacity style={s.iconBox}>
            <Menu size={20} color={colors.text1} strokeWidth={1.8} />
          </TouchableOpacity>
          <Text style={s.logo}>
            NOVA <Text style={s.logoDot}>•</Text>
          </Text>
          <View style={s.avatarBox}>
            <Text style={s.avatarLetter}>
              {(user?.name ?? 'N').charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* ── SEGMENT TABS ── */}
        {/*
          Burada ilginç bir teknik kullanıyoruz:
          Animated.View ile "pill" (mor arka plan) tab'ların arkasında
          position:absolute olarak duruyor. Her tab tıklandığında
          Animated.spring ile kaydırıyoruz. useNativeDriver:false çünkü
          width animasyonu JS thread'de çalışmak zorunda.
        */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.segScroll}
        >
          <View style={s.segContainer}>
            <Animated.View style={[s.pill, { transform: [{ translateX: pillX }], width: pillW }]} />

            {SEGMENTS.map((seg, i) => (
              <TouchableOpacity
                key={seg}
                onPress={() => setActiveSegment(i)}
                onLayout={({ nativeEvent: { layout } }) => {
                  setTabLayouts(prev => {
                    const next = [...prev];
                    next[i] = { x: layout.x, width: layout.width };
                    return next;
                  });
                }}
                style={s.segTab}
              >
                <Text style={[s.segLabel, i === activeSegment && s.segLabelActive]}>
                  {seg}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* ── BAKİYE KARTI ── */}
        {/*
          LinearGradient — expo-linear-gradient paketi.
          colors prop array alır: başlangıç → bitiş rengi.
          start/end ile gradient'in yönünü belirleyebilirsin.
          Burada sol-üstten sağ-alta doğru mor gradient.
        */}
        {/*
          Animated.View opacity ile sarıyoruz → fade efekti
          key prop YOK → React kartı unmount etmez, sadece opacity değişir
          Bu çok daha hızlı çünkü native thread'de çalışıyor
        */}
        <Animated.View style={{ opacity: cardOpacity }}>
        <LinearGradient
          colors={seg.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.balanceCard}
        >
          {/* Üst satır */}
          <View style={s.balanceTop}>
            <Text style={s.balanceTitle}>Toplam Varlık</Text>
            <TouchableOpacity onPress={() => setBalanceVisible(v => !v)}>
              {balanceVisible
                ? <Eye size={18} color="rgba(255,255,255,0.7)" />
                : <EyeOff size={18} color="rgba(255,255,255,0.7)" />
              }
            </TouchableOpacity>
          </View>

          {/* Bakiye tutarı */}
          <Text style={s.balanceAmount}>
            {balanceVisible ? seg.balance : '₺ ••••••'}
          </Text>

          {/* Günlük değişim */}
          <View style={s.balanceChangeRow}>
            <TrendingUp size={14} color="#86EFAC" strokeWidth={2} />
            <Text style={s.balanceChange}>{seg.change}</Text>
          </View>

          {/* Ayırıcı çizgi */}
          <View style={s.balanceDivider} />

          {/* IBAN — sadece Hesabım segment'inde göster, user'dan alır */}
          {activeSegment === 0 && user?.iban && (
            <View style={s.ibanRow}>
              <Text style={s.ibanLabel}>IBAN</Text>
              <Text style={s.ibanValue} numberOfLines={1}>
                {balanceVisible ? user.iban : 'TR•• •••• •••• •••• •••• ••'}
              </Text>
              <TouchableOpacity style={s.ibanCopy}>
                <Copy size={13} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
            </View>
          )}

          {/* Gelir / Gider */}
          <View style={s.balanceStats}>
            <View style={s.balanceStat}>
              <View style={s.statIconBox}>
                <ArrowDown size={14} color="#86EFAC" />
              </View>
              <View>
                <Text style={s.statLabel}>Gelir</Text>
                <Text style={s.statValue}>
                  {balanceVisible ? seg.income : '••••••'}
                </Text>
              </View>
            </View>
            <View style={s.balanceStat}>
              <View style={[s.statIconBox, { backgroundColor: 'rgba(244,63,94,0.2)' }]}>
                <ArrowUp size={14} color="#FDA4AF" />
              </View>
              <View>
                <Text style={s.statLabel}>Gider</Text>
                <Text style={s.statValue}>
                  {balanceVisible ? seg.expense : '••••••'}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        </Animated.View>

        {/* ── HIZLI İŞLEMLER ── */}
        {/*
          Dört buton: Gönder, Al, Takas, Daha Fazla.
          Her birinin arka planı biraz farklı renk (o ikona özel).
          İkon rengini IconBox'ta görüyorsun.
        */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Hızlı İşlemler</Text>
        </View>
        <View style={s.actionsRow}>
          {QUICK_ACTIONS.map(({ Icon, label, color }) => (
            <TouchableOpacity key={label} style={s.actionItem}>
              <View style={[s.actionIconBox, { backgroundColor: color + '22' }]}>
                <Icon size={22} color={color} strokeWidth={1.8} />
              </View>
              <Text style={s.actionLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── DÖVİZ KURLARI ── */}
        <View style={[s.sectionRow, { marginTop: 24 }]}>
          <Text style={s.sectionTitle}>Döviz Kurları</Text>
          <TouchableOpacity style={s.seeAll}>
            <Text style={s.seeAllText}>Tümü</Text>
            <ChevronRight size={14} color={colors.purpleLight} />
          </TouchableOpacity>
        </View>
        <View style={s.ratesCard}>
          {EXCHANGE_RATES.map((r, i) => (
            <View key={r.pair} style={[s.rateRow, i < EXCHANGE_RATES.length - 1 && s.rateRowBorder]}>
              <Text style={s.ratePair}>{r.pair}</Text>
              <View style={s.rateRight}>
                <Text style={s.rateValue}>₺ {r.rate}</Text>
                <View style={[s.rateBadge, { backgroundColor: r.up ? colors.success + '22' : colors.error + '22' }]}>
                  {r.up
                    ? <TrendingUp size={11} color={colors.success} />
                    : <TrendingDown size={11} color={colors.error} />
                  }
                  <Text style={[s.rateChange, { color: r.up ? colors.success : colors.error }]}>
                    {r.change}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ── VARLIK DAĞILIMI ── */}
        {/*
          react-native-gifted-charts'tan PieChart kullanıyoruz.
          donut prop'u ile ortası boş halkaya dönüşür.
          radius, innerRadius ile boyutu ayarlarsın.
          centerLabelComponent ile ortaya istediğin component'i koyarsın.
        */}
        <View style={[s.sectionRow, { marginTop: 24 }]}>
          <Text style={s.sectionTitle}>Varlık Dağılımı</Text>
        </View>
        <View style={s.pieCard}>
          <PieChart
            donut
            data={PIE_DATA}
            radius={90}
            innerRadius={60}
            innerCircleColor={colors.surface1}
            centerLabelComponent={() => (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: colors.text2, fontSize: 11 }}>Toplam</Text>
                <Text style={{ color: colors.text1, fontSize: 15, fontWeight: '700' }}>
                  ₺ 12.450
                </Text>
              </View>
            )}
          />
          {/* Legend */}
          <View style={s.pieLegend}>
            {PIE_DATA.map(d => (
              <View key={d.label} style={s.legendRow}>
                <View style={[s.legendDot, { backgroundColor: d.color }]} />
                <Text style={s.legendLabel}>{d.label}</Text>
                <Text style={s.legendValue}>{d.value}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── KARTLARIM ── */}
        {/*
          Yatay ScrollView içinde kartlar.
          Kart genişliği (SW - 60) → sol padding hesaba katılarak
          neredeyse tam ekran genişliğinde, bir sonraki kart hafif görünüyor.
        */}
        <View style={[s.sectionRow, { marginTop: 24 }]}>
          <Text style={s.sectionTitle}>Kartlarım</Text>
          <TouchableOpacity style={s.seeAll}>
            <Text style={s.seeAllText}>Tümü</Text>
            <ChevronRight size={14} color={colors.purpleLight} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.cardsScroll}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {CARDS.map(card => (
            <LinearGradient
              key={card.id}
              colors={card.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.creditCard}
            >
              <View style={s.cardTop}>
                <CreditCard size={22} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />
                <Text style={s.cardType}>{card.type}</Text>
              </View>
              <Text style={s.cardNumber}>•••• •••• •••• {card.last4}</Text>
              <View style={s.cardBottom}>
                <View>
                  <Text style={s.cardLabel}>Kart Bakiyesi</Text>
                  <Text style={s.cardBalance}>{card.balance}</Text>
                </View>
              </View>
            </LinearGradient>
          ))}
        </ScrollView>

        {/* ── SON İŞLEMLER ── */}
        {/*
          Filter tabs — activeTxFilter state'i ile filteredTx array'ini değiştiriyoruz.
          Bu sefer pill animasyonu yok, sadece renk değişimi — daha basit seçtik.
        */}
        <View style={[s.sectionRow, { marginTop: 24 }]}>
          <Text style={s.sectionTitle}>Son İşlemler</Text>
          <TouchableOpacity style={s.seeAll}>
            <Text style={s.seeAllText}>Tümü</Text>
            <ChevronRight size={14} color={colors.purpleLight} />
          </TouchableOpacity>
        </View>

        {/* TX Filter tabs */}
        <View style={s.txFilters}>
          {TX_FILTERS.map((f, i) => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveTxFilter(i)}
              style={[s.txFilterBtn, i === activeTxFilter && s.txFilterBtnActive]}
            >
              <Text style={[s.txFilterLabel, i === activeTxFilter && s.txFilterLabelActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* TX List */}
        <View style={s.txCard}>
          {filteredTx.map((tx, i) => (
            <View
              key={tx.id}
              style={[s.txRow, i < filteredTx.length - 1 && s.txRowBorder]}
            >
              {/* Sol ikon */}
              <View style={[
                s.txIcon,
                { backgroundColor: tx.type === 'in' ? colors.success + '22' : colors.error + '22' }
              ]}>
                {tx.type === 'in'
                  ? <ArrowDown size={16} color={colors.success} />
                  : <ArrowUp size={16} color={colors.error} />
                }
              </View>

              {/* Başlık + alt yazı */}
              <View style={s.txInfo}>
                <Text style={s.txTitle}>{tx.title}</Text>
                <Text style={s.txSubtitle}>{tx.subtitle} · {tx.date}</Text>
              </View>

              {/* Tutar */}
              <Text style={[
                s.txAmount,
                { color: tx.type === 'in' ? colors.success : colors.error }
              ]}>
                {tx.amount}
              </Text>
            </View>
          ))}
        </View>

        {/* Alt boşluk — floating button için */}
        <View style={{ height: 100 }} />

      </ScrollView>

      {/* ── FLOATING AI BUTTON ── */}
      {/*
        ScrollView dışında, SafeAreaView içinde ve position:absolute.
        Bu sayede scroll ederken buton sabit kalır (floating).
        Bottom değerini platform safe area'ya göre ayarlıyoruz.
      */}
      <TouchableOpacity style={s.fab}>
        <LinearGradient
          colors={['#7C3AED', '#A855F7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={s.fabGradient}
        >
          <Bot size={24} color="#fff" strokeWidth={1.8} />
        </LinearGradient>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.bg },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 20 },

  // Header
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, paddingBottom: 16 },
  iconBox:      { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  logo:         { fontSize: 20, fontWeight: '800', color: colors.text1, letterSpacing: 2 },
  logoDot:      { color: colors.purple },
  avatarBox:    { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' },
  avatarLetter: { color: '#fff', fontSize: 18, fontWeight: '700' },

  // Segment tabs
  segScroll:    { marginBottom: 20 },
  segContainer: { flexDirection: 'row', position: 'relative' },
  pill:         { position: 'absolute', top: 0, bottom: 0, borderRadius: 20, backgroundColor: colors.purple },
  segTab:       { paddingHorizontal: 16, paddingVertical: 8 },
  segLabel:     { color: colors.text2, fontSize: 14, fontWeight: '500' },
  segLabelActive:{ color: '#fff', fontWeight: '700' },

  // Balance card
  balanceCard:      { borderRadius: 20, padding: 20, marginBottom: 24 },
  balanceTop:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  balanceTitle:     { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500' },
  balanceAmount:    { color: '#fff', fontSize: 32, fontWeight: '800', letterSpacing: 0.5, marginBottom: 6 },
  balanceChangeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  balanceChange:    { color: '#86EFAC', fontSize: 13, fontWeight: '500' },
  balanceDivider:   { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: 16 },
  balanceStats:     { flexDirection: 'row', gap: 32 },
  balanceStat:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statIconBox:      { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(134,239,172,0.2)', alignItems: 'center', justifyContent: 'center' },
  statLabel:        { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  statValue:        { color: '#fff', fontSize: 15, fontWeight: '700' },

  // Section header
  sectionRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: colors.text1, fontSize: 16, fontWeight: '700' },
  seeAll:       { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText:   { color: colors.purpleLight, fontSize: 13, fontWeight: '500' },

  // Quick actions
  actionsRow:    { flexDirection: 'row', justifyContent: 'space-between' },
  actionItem:    { alignItems: 'center', gap: 8 },
  actionIconBox: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  actionLabel:   { color: colors.text2, fontSize: 12, fontWeight: '500' },

  // Exchange rates
  ratesCard:     { backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  rateRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  rateRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  ratePair:      { color: colors.text1, fontSize: 14, fontWeight: '600' },
  rateRight:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rateValue:     { color: colors.text1, fontSize: 14, fontWeight: '600' },
  rateBadge:     { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  rateChange:    { fontSize: 12, fontWeight: '600' },

  // Pie chart
  pieCard:    { backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 20, alignItems: 'center' },
  pieLegend:  { marginTop: 20, width: '100%', gap: 10 },
  legendRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot:  { width: 10, height: 10, borderRadius: 5 },
  legendLabel:{ flex: 1, color: colors.text2, fontSize: 13 },
  legendValue:{ color: colors.text1, fontSize: 13, fontWeight: '600' },

  // Cards
  cardsScroll: { marginHorizontal: -20, paddingLeft: 20 },
  creditCard:  { width: SW - 60, borderRadius: 20, padding: 22, marginRight: 14, height: 160 },
  cardTop:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  cardType:    { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600' },
  cardNumber:  { color: 'rgba(255,255,255,0.9)', fontSize: 16, letterSpacing: 2, fontWeight: '600', marginBottom: 16 },
  cardBottom:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardLabel:   { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 2 },
  cardBalance: { color: '#fff', fontSize: 18, fontWeight: '800' },

  // Transactions
  txFilters:        { flexDirection: 'row', gap: 8, marginBottom: 12 },
  txFilterBtn:      { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: colors.surface1, borderWidth: 1, borderColor: colors.border },
  txFilterBtnActive:{ backgroundColor: colors.purple, borderColor: colors.purple },
  txFilterLabel:    { color: colors.text2, fontSize: 13, fontWeight: '500' },
  txFilterLabelActive:{ color: '#fff', fontWeight: '700' },
  txCard:       { backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  txRow:        { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  txRowBorder:  { borderBottomWidth: 1, borderBottomColor: colors.border },
  txIcon:       { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txInfo:       { flex: 1 },
  txTitle:      { color: colors.text1, fontSize: 14, fontWeight: '600', marginBottom: 2 },
  txSubtitle:   { color: colors.text2, fontSize: 12 },
  txAmount:     { fontSize: 14, fontWeight: '700' },

  // IBAN
  ibanRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  ibanLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600' },
  ibanValue: { flex: 1, color: '#fff', fontSize: 13, letterSpacing: 1 },
  ibanCopy:  { padding: 4 },

  // FAB
  fab:         { position: 'absolute', bottom: 24, right: 24, borderRadius: 30, elevation: 8, shadowColor: colors.purple, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12 },
  fabGradient: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
});
