import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Animated, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Menu, Eye, EyeOff,
  ArrowUp, ArrowDown, RefreshCcw, LayoutGrid,
  TrendingUp, TrendingDown, Bot, ChevronRight, Copy,
  ArrowLeftRight,
} from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { useAuthStore } from '../../src/store/useAuthStore';
import { getRecentTransactions } from '../../src/data/transactions';
import { TransactionItem } from '../../src/components/ui/TransactionItem';
import { CURRENCY_SYMBOL, type Currency } from '../../src/utils/currency';

// ─── HESAPLAR (her para birimi ayrı bakiye + IBAN) ────────────────
type Account = {
  currency: Currency;
  amount: number;           // native tutar
  iban: string;
  changePct: string;
  changeUp: boolean;
};

const ACCOUNTS: Account[] = [
  {
    currency:  'TRY',
    amount:    12450,
    iban:      'TR12 0001 2345 6789 0123 4567 89',
    changePct: '+%2,30 bugün',
    changeUp:  true,
  },
  {
    currency:  'USD',
    amount:    2840,
    iban:      'TR34 0004 5678 9012 3456 7890 12',
    changePct: '+%1,85 bugün',
    changeUp:  true,
  },
  {
    currency:  'EUR',
    amount:    1420,
    iban:      'TR56 0007 8901 2345 6789 0123 45',
    changePct: '+%1,42 bugün',
    changeUp:  true,
  },
];

/** Native tutarı sembol + locale formatıyla gösterir (kur çevirmeden). */
function fmtNative(amount: number, currency: Currency): string {
  const sym    = CURRENCY_SYMBOL[currency];
  const locale = currency === 'USD' ? 'en-US' : currency === 'EUR' ? 'de-DE' : 'tr-TR';
  const str    = amount.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  return `${sym} ${str}`;
}

// ─── MOCK DATA ────────────────────────────────────────────────────
const SEGMENTS = ['Hesabım', 'Yatırım', 'Kıymetli Maden', 'Birikim'];

const SEGMENT_CONFIG = [
  { gradient: ['#3B1FA0', '#7C3AED', '#A855F7'] as [string, string, string] },
  { gradient: ['#0C4A6E', '#0369A1', '#38BDF8'] as [string, string, string] },
  { gradient: ['#78350F', '#B45309', '#FCD34D'] as [string, string, string] },
  { gradient: ['#064E3B', '#059669', '#34D399'] as [string, string, string] },
];

const QUICK_ACTIONS = [
  { Icon: ArrowUp,    label: 'Gönder',     color: '#7C3AED' },
  { Icon: ArrowDown,  label: 'Al',         color: '#10B981' },
  { Icon: RefreshCcw, label: 'Takas',      color: '#F59E0B' },
  { Icon: LayoutGrid, label: 'Daha Fazla', color: '#7A8BA8' },
];

const EXCHANGE_RATES = [
  { pair: 'USD / TRY', rate: '32,45', change: '+0,12%', up: true  },
  { pair: 'EUR / TRY', rate: '35,10', change: '-0,05%', up: false },
  { pair: 'XAU / TRY', rate: '2.180', change: '+0,31%', up: true  },
];

// ─── ANA EKRAN ────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeSegment, setActiveSegment]   = useState(0);
  const [accountIdx, setAccountIdx]         = useState(0);
  const [tabLayouts, setTabLayouts]         = useState<{ x: number; width: number }[]>([]);
  const user = useAuthStore((s) => s.user);

  const account = ACCOUNTS[accountIdx];

  const handleSwap = () => setAccountIdx(i => (i + 1) % ACCOUNTS.length);

  const balanceStr = balanceVisible
    ? fmtNative(account.amount, account.currency)
    : '••••••';

  const pillX = useRef(new Animated.Value(0)).current;
  const pillW = useRef(new Animated.Value(80)).current;
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

  // Son 3 işlem — tümü için navigasyon kullanılıyor
  const recentTx = getRecentTransactions(3);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

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
            {/* Üst satır: başlık | göz + hesap değiştir */}
            <View style={s.balanceTop}>
              <Text style={s.balanceTitle}>Toplam Varlık</Text>
              <View style={s.topRight}>
                <TouchableOpacity onPress={() => setBalanceVisible(v => !v)}>
                  {balanceVisible
                    ? <Eye size={18} color="rgba(255,255,255,0.7)" />
                    : <EyeOff size={18} color="rgba(255,255,255,0.7)" />
                  }
                </TouchableOpacity>
                <TouchableOpacity style={s.swapBtn} onPress={handleSwap}>
                  <ArrowLeftRight size={13} color="rgba(255,255,255,0.9)" strokeWidth={2.2} />
                  <Text style={s.swapLabel}>{account.currency}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bakiye */}
            <Text style={s.balanceAmount}>{balanceStr}</Text>

            {/* Değişim */}
            <View style={s.balanceChangeRow}>
              {account.changeUp
                ? <TrendingUp  size={14} color="#86EFAC" strokeWidth={2} />
                : <TrendingDown size={14} color="#F87171" strokeWidth={2} />
              }
              <Text style={[s.balanceChange, { color: account.changeUp ? '#86EFAC' : '#F87171' }]}>
                {account.changePct}
              </Text>
            </View>

            {/* IBAN — sadece Hesabım segmentinde */}
            {activeSegment === 0 && (
              <>
                <View style={s.balanceDivider} />
                <View style={s.ibanRow}>
                  <Text style={s.ibanLabel}>IBAN</Text>
                  <Text style={s.ibanValue} numberOfLines={1}>
                    {balanceVisible ? account.iban : 'TR•• •••• •••• •••• •••• ••'}
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
                    ? <TrendingUp  size={11} color={colors.success} />
                    : <TrendingDown size={11} color={colors.error}   />
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
          <TouchableOpacity style={s.seeAll} onPress={() => router.push('/screens/transactions')}>
            <Text style={s.seeAllText}>Tümü</Text>
            <ChevronRight size={14} color={colors.purpleLight} />
          </TouchableOpacity>
        </View>

        {/* İşlem listesi — son 3 */}
        <View style={s.txCard}>
          {recentTx.map((tx, i) => (
            <TransactionItem
              key={tx.id}
              tx={tx}
              showBorder={i < recentTx.length - 1}
            />
          ))}
        </View>

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

  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, paddingBottom: 16 },
  iconBox:      { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  logo:         { fontSize: 20, fontWeight: '800', color: colors.text1, letterSpacing: 2 },
  logoDot:      { color: colors.purple },
  avatarBox:    { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' },
  avatarLetter: { color: '#fff', fontSize: 18, fontWeight: '700' },

  segScroll:     { marginBottom: 20 },
  segContainer:  { flexDirection: 'row', position: 'relative' },
  pill:          { position: 'absolute', top: 0, bottom: 0, borderRadius: 20, backgroundColor: colors.purple },
  segTab:        { paddingHorizontal: 16, paddingVertical: 8 },
  segLabel:      { color: colors.text2, fontSize: 14, fontWeight: '500' },
  segLabelActive:{ color: '#fff', fontWeight: '700' },

  // Bakiye kartı
  balanceCard:    { borderRadius: 20, padding: 20, marginBottom: 24 },
  balanceTop:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  balanceTitle:   { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500' },

  topRight:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  swapBtn:   { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  swapLabel: { color: '#fff', fontSize: 12, fontWeight: '700' },

  balanceAmount:    { color: '#fff', fontSize: 32, fontWeight: '800', letterSpacing: 0.5, marginBottom: 6 },
  balanceChangeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  balanceChange:    { fontSize: 13, fontWeight: '500' },
  balanceDivider:   { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: 16 },
  ibanRow:          { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  ibanLabel:        { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600' },
  ibanValue:        { flex: 1, color: '#fff', fontSize: 13, letterSpacing: 1 },
  ibanCopy:         { padding: 4 },

  sectionRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: colors.text1, fontSize: 16, fontWeight: '700' },
  seeAll:       { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText:   { color: colors.purpleLight, fontSize: 13, fontWeight: '500' },

  actionsRow:    { flexDirection: 'row', justifyContent: 'space-between' },
  actionItem:    { alignItems: 'center', gap: 8 },
  actionIconBox: { width: 56, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  actionLabel:   { color: colors.text2, fontSize: 12, fontWeight: '500' },

  ratesCard:     { backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  rateRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  rateRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  ratePair:      { color: colors.text1, fontSize: 14, fontWeight: '600' },
  rateRight:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rateValue:     { color: colors.text1, fontSize: 14, fontWeight: '600' },
  rateBadge:     { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  rateChange:    { fontSize: 12, fontWeight: '600' },

  txCard:      { backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },

  // FAB
  fab:         { position: 'absolute', bottom: 24, right: 24, borderRadius: 30, elevation: 8, shadowColor: colors.purple, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12 },
  fabGradient: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
});
