import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Animated, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Menu, Eye, EyeOff,
  ArrowUp, ArrowDown, RefreshCcw, LayoutGrid,
  TrendingUp, TrendingDown, Bot,
  ChevronRight, Copy,
} from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { useAuthStore, generateMockIban } from '../../src/store/useAuthStore';

// ─── MOCK DATA ────────────────────────────────────────────────────
const SEGMENTS = ['Hesabım', 'Yatırım', 'Kıymetli Maden', 'Birikim'];

const SEGMENT_CONFIG = [
  {
    gradient: ['#3B1FA0', '#7C3AED', '#A855F7'] as [string, string, string],
    balance: '₺ 12.450,00',
    change:  '+₺ 280,50 (%2,30) bugün',
    changeUp: true,
  },
  {
    gradient: ['#0C4A6E', '#0369A1', '#38BDF8'] as [string, string, string],
    balance: '₺ 6.820,00',
    change:  '+₺ 145,00 (%2,17) bugün',
    changeUp: true,
  },
  {
    gradient: ['#78350F', '#B45309', '#FCD34D'] as [string, string, string],
    balance: '₺ 2.180,00',
    change:  '+₺ 67,50 (%3,20) bugün',
    changeUp: true,
  },
  {
    gradient: ['#064E3B', '#059669', '#34D399'] as [string, string, string],
    balance: '₺ 3.450,00',
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
  const cardOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const layout = tabLayouts[activeSegment];
    if (!layout) return;

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

    Animated.sequence([
      Animated.timing(cardOpacity, { toValue: 0, duration: 80,  useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [activeSegment, tabLayouts]);

  const seg = SEGMENT_CONFIG[activeSegment];

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

          {/* IBAN — sadece Hesabım segment'inde göster */}
          {activeSegment === 0 && user?.iban && (
            <>
              <View style={s.balanceDivider} />
              <View style={s.ibanRow}>
                <Text style={s.ibanLabel}>IBAN</Text>
                <Text style={s.ibanValue} numberOfLines={1}>
                  {balanceVisible ? user.iban : 'TR•• •••• •••• •••• •••• ••'}
                </Text>
                <TouchableOpacity style={s.ibanCopy}>
                  <Copy size={13} color="rgba(255,255,255,0.5)" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </LinearGradient>
        </Animated.View>

        {/* ── HIZLI İŞLEMLER ── */}
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

        {/* ── SON İŞLEMLER ── */}
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
              <View style={[
                s.txIcon,
                { backgroundColor: tx.type === 'in' ? colors.success + '22' : colors.error + '22' }
              ]}>
                {tx.type === 'in'
                  ? <ArrowDown size={16} color={colors.success} />
                  : <ArrowUp size={16} color={colors.error} />
                }
              </View>

              <View style={s.txInfo}>
                <Text style={s.txTitle}>{tx.title}</Text>
                <Text style={s.txSubtitle}>{tx.subtitle} · {tx.date}</Text>
              </View>

              <Text style={[
                s.txAmount,
                { color: tx.type === 'in' ? colors.success : colors.error }
              ]}>
                {tx.amount}
              </Text>
            </View>
          ))}
        </View>

        {/* Alt boşluk */}
        <View style={{ height: 100 }} />

      </ScrollView>

      {/* ── FLOATING AI BUTTON ── */}
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
