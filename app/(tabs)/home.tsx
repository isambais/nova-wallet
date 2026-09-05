import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Animated, Easing,
  Modal, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Menu, Eye, EyeOff,
  ArrowUp, ArrowDown, RefreshCcw, LayoutGrid,
  TrendingUp, TrendingDown, Bot, ChevronRight, Copy,
  ArrowLeftRight, SlidersHorizontal, Check, X,
  FileText, ArrowDownLeft, Upload, Gem, Target, Snowflake, Flag,
  Heart, Users,
} from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useAccountStore } from '../../src/store/useAccountStore';
import { useModeStore } from '../../src/store/useModeStore';
import { getRecentTransactions } from '../../src/data/transactions';
import { SPENDING_MODES, type SpendingMode } from '../../src/data/modes';
import { TransactionItem } from '../../src/components/ui/TransactionItem';
import { CURRENCY_SYMBOL, type Currency } from '../../src/utils/currency';

// ─── HESAPLAR ────────────────────────────────────────────────────
type Account = {
  currency: Currency;
  amount: number;
  iban: string;
  changePct: string;
  changeUp: boolean;
};

const ACCOUNTS: Account[] = [
  { currency: 'TRY', amount: 12450, iban: 'TR12 0001 2345 6789 0123 4567 89', changePct: '+%2,30 bugün', changeUp: true  },
  { currency: 'USD', amount: 2840,  iban: 'TR34 0004 5678 9012 3456 7890 12', changePct: '+%1,85 bugün', changeUp: true  },
  { currency: 'EUR', amount: 1420,  iban: 'TR56 0007 8901 2345 6789 0123 45', changePct: '+%1,42 bugün', changeUp: true  },
];

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
  { id: 'send',  Icon: ArrowUp,          label: 'Gönder',     color: '#7C3AED' },
  { id: 'recv',  Icon: ArrowDown,        label: 'Al',         color: '#10B981' },
  { id: 'swap',  Icon: RefreshCcw,       label: 'Takas',      color: '#F59E0B' },
  { id: 'modes', Icon: SlidersHorizontal,label: 'Modlar',     color: '#EC4899' },
  { id: 'more',  Icon: LayoutGrid,       label: 'Daha Fazla', color: '#7A8BA8' },
];

// ─── DAHA FAZLA EKLENTİLERİ ────────────────────────────────────────
const MORE_ACTIONS = [
  { id: 'fatura',  Icon: FileText,       label: 'Fatura Öde',     color: '#7C3AED', destructive: false },
  { id: 'iste',    Icon: ArrowDownLeft,  label: 'Para İste',      color: '#10B981', destructive: false },
  { id: 'yukle',   Icon: Upload,         label: 'Yükle',          color: '#F59E0B', destructive: false },
  { id: 'sim',     Icon: Target,         label: 'Simülatör',      color: '#F97316', destructive: false },
  { id: 'altin',   Icon: Gem,            label: 'Altın Al',       color: '#D97706', destructive: false },
  { id: 'yatirim', Icon: TrendingUp,     label: 'Yatırım',        color: '#3B82F6', destructive: false },
  { id: 'birikim', Icon: Flag,           label: 'Birikim Hedefi', color: '#8B5CF6', destructive: false },
  { id: 'freeze',  Icon: Snowflake,      label: 'Kartı Dondur',   color: '#EF4444', destructive: true  },
];

const MORE_SECONDARY = [
  { id: 'bagis', Icon: Heart, label: 'Bağış Yap' },
  { id: 'davet', Icon: Users, label: 'Arkadaşını Davet Et' },
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
  const [tabLayouts, setTabLayouts]         = useState<{ x: number; width: number }[]>([]);
  const [modeModalVisible, setModeModal]    = useState(false);
  const [moreModalVisible, setMoreModal]    = useState(false);

  const user              = useAuthStore((s) => s.user);
  const activeCurrency    = useAccountStore((s) => s.activeCurrency);
  const setActiveCurrency = useAccountStore((s) => s.setActiveCurrency);
  const activeMode        = useModeStore((s) => s.activeMode);
  const setMode           = useModeStore((s) => s.setMode);

  const accountIdx = ACCOUNTS.findIndex(a => a.currency === activeCurrency);
  const account    = ACCOUNTS[accountIdx] ?? ACCOUNTS[0];

  const handleSwap = () => {
    const nextIdx = (accountIdx + 1) % ACCOUNTS.length;
    setActiveCurrency(ACCOUNTS[nextIdx].currency);
  };

  const handleQuickAction = (id: string) => {
    if (id === 'modes') setModeModal(true);
    if (id === 'more')  setMoreModal(true);
  };

  const handleSelectMode = (mode: SpendingMode) => {
    if (activeMode?.id === mode.id) {
      setMode(null);
    } else {
      setMode(mode);
    }
    setModeModal(false);
  };

  const balanceStr = balanceVisible
    ? fmtNative(account.amount, account.currency)
    : '••••••';

  const pillX       = useRef(new Animated.Value(0)).current;
  const pillW       = useRef(new Animated.Value(80)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const layout = tabLayouts[activeSegment];
    if (!layout) return;
    Animated.parallel([
      Animated.timing(pillX, { toValue: layout.x, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.timing(pillW, { toValue: layout.width, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
    Animated.sequence([
      Animated.timing(cardOpacity, { toValue: 0, duration: 80,  useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
    ]).start();
  }, [activeSegment, tabLayouts]);

  const recentTx = getRecentTransactions(3, activeCurrency);
  const seg = SEGMENT_CONFIG[activeSegment];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* ── HEADER ── */}
        <View style={s.header}>
          <TouchableOpacity style={s.iconBox}>
            <Menu size={20} color={colors.text1} strokeWidth={1.8} />
          </TouchableOpacity>
          <Text style={s.logo}>NOVA <Text style={s.logoDot}>•</Text></Text>
          <View style={s.avatarBox}>
            <Text style={s.avatarLetter}>{(user?.name ?? 'N').charAt(0).toUpperCase()}</Text>
          </View>
        </View>

        {/* ── SEGMENT TABS ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.segScroll}>
          <View style={s.segContainer}>
            <Animated.View style={[s.pill, { transform: [{ translateX: pillX }], width: pillW }]} />
            {SEGMENTS.map((seg, i) => (
              <TouchableOpacity
                key={seg}
                onPress={() => setActiveSegment(i)}
                onLayout={({ nativeEvent: { layout } }) => {
                  setTabLayouts(prev => { const next = [...prev]; next[i] = { x: layout.x, width: layout.width }; return next; });
                }}
                style={s.segTab}
              >
                <Text style={[s.segLabel, i === activeSegment && s.segLabelActive]}>{seg}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* ── BAKİYE KARTI ── */}
        <Animated.View style={{ opacity: cardOpacity }}>
          <LinearGradient colors={seg.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.balanceCard}>
            <View style={s.balanceTop}>
              <Text style={s.balanceTitle}>Toplam Varlık</Text>
              <View style={s.topRight}>
                <TouchableOpacity onPress={() => setBalanceVisible(v => !v)}>
                  {balanceVisible ? <Eye size={18} color="rgba(255,255,255,0.7)" /> : <EyeOff size={18} color="rgba(255,255,255,0.7)" />}
                </TouchableOpacity>
                <TouchableOpacity style={s.swapBtn} onPress={handleSwap}>
                  <ArrowLeftRight size={13} color="rgba(255,255,255,0.9)" strokeWidth={2.2} />
                  <Text style={s.swapLabel}>{account.currency}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={s.balanceAmount}>{balanceStr}</Text>

            <View style={s.balanceChangeRow}>
              {account.changeUp
                ? <TrendingUp   size={14} color="#86EFAC" strokeWidth={2} />
                : <TrendingDown size={14} color="#F87171" strokeWidth={2} />
              }
              <Text style={[s.balanceChange, { color: account.changeUp ? '#86EFAC' : '#F87171' }]}>
                {account.changePct}
              </Text>
            </View>

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
          {QUICK_ACTIONS.map(({ id, Icon, label, color }) => {
            const isModeActive = id === 'modes' && !!activeMode;
            return (
              <TouchableOpacity key={id} style={s.actionItem} onPress={() => handleQuickAction(id)}>
                <View style={[
                  s.actionIconBox,
                  { backgroundColor: isModeActive ? activeMode!.color + '30' : color + '18' },
                  isModeActive && { borderColor: activeMode!.color + '88' },
                ]}>
                  {isModeActive
                    ? <Text style={s.actionEmoji}>{activeMode!.emoji}</Text>
                    : <Icon size={20} color={color} strokeWidth={1.8} />
                  }
                </View>
                <Text style={[s.actionLabel, isModeActive && { color: activeMode!.color }]}>
                  {isModeActive ? activeMode!.name : label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── AKTİF MOD BANNERI ── */}
        {activeMode && (
          <View style={[s.modeBanner, { backgroundColor: activeMode.bgColor, borderColor: activeMode.color + '44' }]}>
            <Text style={s.modeEmoji}>{activeMode.emoji}</Text>
            <View style={s.modeBannerInfo}>
              <Text style={[s.modeNameText, { color: activeMode.color }]}>{activeMode.name} Modu</Text>
              <Text style={s.modeWarningText}>{activeMode.warningText}</Text>
            </View>
            <TouchableOpacity onPress={() => setMode(null)} style={s.modeClose}>
              <X size={14} color={activeMode.color} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        )}

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
                  {r.up ? <TrendingUp size={11} color={colors.success} /> : <TrendingDown size={11} color={colors.error} />}
                  <Text style={[s.rateChange, { color: r.up ? colors.success : colors.error }]}>{r.change}</Text>
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
        <View style={s.txCard}>
          {recentTx.length === 0 ? (
            <View style={s.txEmpty}><Text style={s.txEmptyText}>Bu hesapta işlem yok</Text></View>
          ) : (
            recentTx.map((tx, i) => (
              <TransactionItem
                key={tx.id}
                tx={tx}
                showBorder={i < recentTx.length - 1}
                displayCurrency={activeCurrency}
              />
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── FLOATING AI BUTTON ── */}
      <TouchableOpacity style={s.fab}>
        <LinearGradient colors={['#7C3AED', '#A855F7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.fabGradient}>
          <Bot size={24} color="#fff" strokeWidth={1.8} />
        </LinearGradient>
      </TouchableOpacity>

      {/* ── MOD SEÇİM MODALI ── */}
      <Modal visible={modeModalVisible} transparent animationType="slide" onRequestClose={() => setModeModal(false)}>
        <Pressable style={s.modalOverlay} onPress={() => setModeModal(false)}>
          <Pressable style={s.modalCard} onPress={e => e.stopPropagation()}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Harcama Modu</Text>
              <TouchableOpacity style={s.modalCloseBtn} onPress={() => setModeModal(false)}>
                <X size={18} color={colors.text2} strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <Text style={s.modalSubtitle}>Modunu seç, limitini belirle</Text>

            <View style={s.modeGrid}>
              {SPENDING_MODES.map(mode => {
                const isActive = activeMode?.id === mode.id;
                return (
                  <TouchableOpacity
                    key={mode.id}
                    style={[
                      s.modeCard,
                      { backgroundColor: mode.bgColor, borderColor: isActive ? mode.color : mode.color + '33' },
                      isActive && s.modeCardActive,
                    ]}
                    onPress={() => handleSelectMode(mode)}
                    activeOpacity={0.8}
                  >
                    {isActive && (
                      <View style={[s.modeCheckBadge, { backgroundColor: mode.color }]}>
                        <Check size={10} color="#fff" strokeWidth={3} />
                      </View>
                    )}
                    <Text style={s.modeCardEmoji}>{mode.emoji}</Text>
                    <Text style={[s.modeCardName, { color: mode.color }]}>{mode.name}</Text>
                    <Text style={s.modeCardLimit}>Günlük ₺{mode.dailyLimit.toLocaleString('tr-TR')}</Text>
                    <Text style={s.modeCardWarning} numberOfLines={2}>{mode.warningText}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {activeMode && (
              <TouchableOpacity style={s.clearModeBtn} onPress={() => { setMode(null); setModeModal(false); }}>
                <Text style={s.clearModeBtnText}>Modu Kapat</Text>
              </TouchableOpacity>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── DAHA FAZLA MODALI ── */}
      <Modal visible={moreModalVisible} transparent animationType="slide" onRequestClose={() => setMoreModal(false)}>
        <Pressable style={s.modalOverlay} onPress={() => setMoreModal(false)}>
          <Pressable style={s.modalCard} onPress={e => e.stopPropagation()}>

            {/* Başlık */}
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Tüm İşlemler</Text>
              <TouchableOpacity style={s.modalCloseBtn} onPress={() => setMoreModal(false)}>
                <X size={18} color={colors.text2} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* 4×2 grid */}
            <View style={s.moreGrid}>
              {MORE_ACTIONS.map(({ id, Icon, label, color, destructive }) => (
                <TouchableOpacity key={id} style={s.moreItem} activeOpacity={0.7}
                  onPress={() => { if (id === 'sim') { setMoreModal(false); router.push('/screens/simulator'); } }}
                >
                  <View style={[
                    s.moreIconBox,
                    { backgroundColor: color + '18', borderColor: color + '33' },
                    destructive && s.moreIconBoxDestructive,
                  ]}>
                    <Icon size={22} color={color} strokeWidth={1.8} />
                  </View>
                  <Text style={[s.moreItemLabel, destructive && s.moreItemLabelDestructive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* ── Ayırıcı ── */}
            <View style={s.moreDivider} />

            {/* Bağış & Davet — küçük satırlar */}
            {MORE_SECONDARY.map(({ id, Icon, label }, i) => (
              <TouchableOpacity
                key={id}
                style={[s.moreSecRow, i < MORE_SECONDARY.length - 1 && s.moreSecRowBorder]}
                activeOpacity={0.7}
              >
                <View style={s.moreSecIconBox}>
                  <Icon size={16} color={colors.text3} strokeWidth={1.8} />
                </View>
                <Text style={s.moreSecLabel}>{label}</Text>
                <ChevronRight size={14} color={colors.text3} strokeWidth={2} />
              </TouchableOpacity>
            ))}

          </Pressable>
        </Pressable>
      </Modal>

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

  balanceCard:    { borderRadius: 20, padding: 20, marginBottom: 24 },
  balanceTop:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  balanceTitle:   { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500' },
  topRight:       { flexDirection: 'row', alignItems: 'center', gap: 10 },
  swapBtn:        { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  swapLabel:      { color: '#fff', fontSize: 12, fontWeight: '700' },
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

  actionsRow:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  actionItem:    { alignItems: 'center', gap: 6, flex: 1 },
  actionIconBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  actionLabel:   { color: colors.text2, fontSize: 11, fontWeight: '500', textAlign: 'center' },
  actionEmoji:   { fontSize: 20 },

  modeBanner:     { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, borderWidth: 1, padding: 12, marginBottom: 24 },
  modeEmoji:      { fontSize: 22 },
  modeBannerInfo: { flex: 1, gap: 2 },
  modeNameText:   { fontSize: 13, fontWeight: '700' },
  modeWarningText:{ color: colors.text2, fontSize: 12, lineHeight: 16 },
  modeClose:      { padding: 4 },

  ratesCard:     { backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  rateRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  rateRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  ratePair:      { color: colors.text1, fontSize: 14, fontWeight: '600' },
  rateRight:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rateValue:     { color: colors.text1, fontSize: 14, fontWeight: '600' },
  rateBadge:     { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  rateChange:    { fontSize: 12, fontWeight: '600' },

  txCard:      { backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  txEmpty:     { padding: 24, alignItems: 'center' },
  txEmptyText: { color: colors.text3, fontSize: 14 },

  fab:         { position: 'absolute', bottom: 24, right: 24, borderRadius: 30, elevation: 8, shadowColor: colors.purple, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12 },
  fabGradient: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },

  // ─── Ortak modal ───
  modalOverlay:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard:     { backgroundColor: colors.surface1, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 20, paddingBottom: 40, paddingHorizontal: 20, borderWidth: 1, borderColor: colors.border },
  modalHeader:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  modalTitle:    { color: colors.text1, fontSize: 18, fontWeight: '800' },
  modalCloseBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  modalSubtitle: { color: colors.text3, fontSize: 13, marginBottom: 20 },

  // ─── Mod kartları ───
  modeGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 8 },
  modeCard:       { width: '47%', borderRadius: 18, borderWidth: 1.5, padding: 16, gap: 4, position: 'relative' },
  modeCardActive: { borderWidth: 2 },
  modeCheckBadge: { position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  modeCardEmoji:  { fontSize: 28, marginBottom: 4 },
  modeCardName:   { fontSize: 15, fontWeight: '800' },
  modeCardLimit:  { color: colors.text2, fontSize: 12, fontWeight: '600' },
  modeCardWarning:{ color: colors.text3, fontSize: 11, lineHeight: 15, marginTop: 4 },
  clearModeBtn:     { marginTop: 16, alignItems: 'center', paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.border },
  clearModeBtnText: { color: colors.text2, fontSize: 14, fontWeight: '600' },

  // ─── Daha Fazla grid ───
  moreGrid:                 { flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, marginBottom: 4 },
  moreItem:                 { width: '25%', alignItems: 'center', paddingVertical: 12, gap: 6 },
  moreIconBox:              { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  moreIconBoxDestructive:   { borderColor: '#EF444433', backgroundColor: '#EF444414' },
  moreItemLabel:            { color: colors.text2, fontSize: 11, fontWeight: '500', textAlign: 'center' },
  moreItemLabelDestructive: { color: '#EF4444' },

  // ─── Daha Fazla ayırıcı & ikincil satırlar ───
  moreDivider:      { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  moreSecRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  moreSecRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  moreSecIconBox:   { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  moreSecLabel:     { flex: 1, color: colors.text2, fontSize: 14, fontWeight: '500' },
});
