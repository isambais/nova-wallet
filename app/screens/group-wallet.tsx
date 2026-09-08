import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated, Modal, Pressable, TextInput, Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft, Users, Plus, ChevronRight, CheckCircle,
  Wallet, ArrowRightLeft, Crown,
} from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { CURRENCY_SYMBOL, type Currency } from '../../src/utils/currency';
import { useAccountStore } from '../../src/store/useAccountStore';

// ─── TİPLER ──────────────────────────────────────────────────────
type Member = {
  id: string;
  name: string;
  initials: string;
  color: string;
  paidTRY: number;
  isOwner?: boolean;
};

type Expense = {
  id: string;
  label: string;
  amountTRY: number;
  paidById: string;
  date: string;
};

// ─── DÖVİZ KURLARI ───────────────────────────────────────────────
const TO_TRY: Record<Currency, number> = { TRY: 1, USD: 32.45, EUR: 35.10 };

function fromTRY(amountTRY: number, currency: Currency): number {
  return amountTRY / TO_TRY[currency];
}

// ─── MOCK VERİ ───────────────────────────────────────────────────
const MOCK_MEMBERS: Member[] = [
  { id: 'isam',   name: 'Isam',   initials: 'I',  color: '#7C3AED', paidTRY: 4800, isOwner: true },
  { id: 'ahmet',  name: 'Ahmet',  initials: 'A',  color: '#3B82F6', paidTRY: 2200 },
  { id: 'zeynep', name: 'Zeynep', initials: 'Z',  color: '#EC4899', paidTRY: 1000 },
  { id: 'mert',   name: 'Mert',   initials: 'M',  color: '#10B981', paidTRY: 0    },
];

const MOCK_EXPENSES: Expense[] = [
  { id: '1', label: 'Otel (3 gece)',     amountTRY: 3600, paidById: 'isam',   date: '28 Ağu' },
  { id: '2', label: 'Ulaşım',           amountTRY: 1200, paidById: 'ahmet',  date: '28 Ağu' },
  { id: '3', label: 'Akşam yemeği',     amountTRY: 800,  paidById: 'isam',   date: '29 Ağu' },
  { id: '4', label: 'Müze & aktivite',  amountTRY: 600,  paidById: 'zeynep', date: '29 Ağu' },
  { id: '5', label: 'Market alışverişi',amountTRY: 400,  paidById: 'ahmet',  date: '30 Ağu' },
  { id: '6', label: 'Kahvaltı x3',      amountTRY: 400,  paidById: 'isam',   date: '30 Ağu' },
];

const CURRENCIES: Currency[] = ['TRY', 'USD', 'EUR'];

// ─── EKRAN ────────────────────────────────────────────────────────
export default function GroupWalletScreen() {
  const router = useRouter();
  const activeCurrency = useAccountStore((s) => s.activeCurrency);
  const [currency, setCurrency] = useState<Currency>(activeCurrency);
  const [activeTab, setActiveTab]   = useState<'ozet' | 'harcamalar'>('ozet');
  const [settleModal, setSettleModal] = useState<{ from: Member; toName: string; amountTRY: number } | null>(null);
  const [settled, setSettled] = useState<string[]>([]);
  const checkAnim = useRef(new Animated.Value(0)).current;

  const sym = CURRENCY_SYMBOL[currency];

  function fmt(amountTRY: number): string {
    const converted = fromTRY(amountTRY, currency);
    const locale = currency === 'USD' ? 'en-US' : currency === 'EUR' ? 'de-DE' : 'tr-TR';
    return `${sym} ${converted.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  const totalTRY  = MOCK_EXPENSES.reduce((s, e) => s + e.amountTRY, 0);
  const perPerson = totalTRY / MOCK_MEMBERS.length;

  // Kimin ne kadar borçlu / alacaklı olduğunu hesapla
  const balances = MOCK_MEMBERS.map(m => ({
    ...m,
    balanceTRY: m.paidTRY - perPerson,
  }));

  // Borçlular → alacaklılara ödemeler
  const debts: { fromId: string; fromName: string; toName: string; amountTRY: number }[] = [];
  const creditors = balances.filter(b => b.balanceTRY > 0.5).map(b => ({ ...b, rem: b.balanceTRY }));
  const debtors   = balances.filter(b => b.balanceTRY < -0.5).map(b => ({ ...b, rem: -b.balanceTRY }));

  for (const debtor of debtors) {
    let rem = debtor.rem;
    for (const cred of creditors) {
      if (rem <= 0 || cred.rem <= 0) continue;
      const pay = Math.min(rem, cred.rem);
      debts.push({ fromId: debtor.id, fromName: debtor.name, toName: cred.name, amountTRY: pay });
      rem      -= pay;
      cred.rem -= pay;
    }
  }

  function openSettle(debt: typeof debts[0]) {
    const from = MOCK_MEMBERS.find(m => m.id === debt.fromId)!;
    setSettleModal({ from, toName: debt.toName, amountTRY: debt.amountTRY });
    checkAnim.setValue(0);
  }

  function confirmSettle() {
    if (!settleModal) return;
    const key = `${settleModal.from.id}-${settleModal.toName}`;
    Animated.timing(checkAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start(() => {
      setTimeout(() => {
        setSettled(prev => [...prev, key]);
        setSettleModal(null);
        checkAnim.setValue(0);
      }, 900);
    });
  }

  const memberById = Object.fromEntries(MOCK_MEMBERS.map(m => [m.id, m]));

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      {/* ── BAŞLIK ── */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text1} strokeWidth={2} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={s.title}>Grup Cüzdanı</Text>
          <Text style={s.titleSub}>Yaz Tatili 🏖️</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* ── PARA BİRİMİ SEÇİCİ ── */}
        <View style={s.pillRow}>
          {CURRENCIES.map(c => (
            <TouchableOpacity
              key={c}
              style={[s.pill, currency === c && s.pillActive]}
              onPress={() => setCurrency(c)}
            >
              <Text style={[s.pillText, currency === c && s.pillTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── TOPLAM KART ── */}
        <View style={s.totalCard}>
          <View style={s.totalRow}>
            <View>
              <Text style={s.totalLabel}>Toplam Harcama</Text>
              <Text style={s.totalAmount}>{fmt(totalTRY)}</Text>
            </View>
            <View style={s.totalRight}>
              <Text style={s.perLabel}>Kişi başı</Text>
              <Text style={s.perAmount}>{fmt(perPerson)}</Text>
            </View>
          </View>
          <View style={s.totalDivider} />
          <View style={s.memberCountRow}>
            <Users size={14} color={colors.purple} strokeWidth={2} />
            <Text style={s.memberCount}>{MOCK_MEMBERS.length} üye · {MOCK_EXPENSES.length} harcama</Text>
          </View>
        </View>

        {/* ── TAB BAR ── */}
        <View style={s.tabBar}>
          {(['ozet', 'harcamalar'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[s.tab, activeTab === tab && s.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>
                {tab === 'ozet' ? 'Özet' : 'Harcamalar'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'ozet' ? (
          <>
            {/* ── ÜYELER ── */}
            <Text style={s.sectionTitle}>Üyeler</Text>
            <View style={s.card}>
              {balances.map((m, i) => {
                const isPositive = m.balanceTRY >= 0;
                return (
                  <View key={m.id}>
                    {i > 0 && <View style={s.divider} />}
                    <View style={s.memberRow}>
                      <View style={[s.avatar, { backgroundColor: m.color + '22', borderColor: m.color + '55' }]}>
                        <Text style={[s.avatarText, { color: m.color }]}>{m.initials}</Text>
                        {m.isOwner && (
                          <View style={s.crownBadge}>
                            <Crown size={8} color='#F59E0B' strokeWidth={2} />
                          </View>
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.memberName}>{m.name}</Text>
                        <Text style={s.memberPaid}>Ödedi: {fmt(m.paidTRY)}</Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[s.balance, { color: isPositive ? '#10B981' : '#EF4444' }]}>
                          {isPositive ? '+' : ''}{fmt(m.balanceTRY)}
                        </Text>
                        <Text style={s.balanceSub}>
                          {isPositive ? 'alacaklı' : m.balanceTRY === 0 ? 'dengede' : 'borçlu'}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* ── ÖDEMELER ── */}
            {debts.length > 0 && (
              <>
                <Text style={s.sectionTitle}>Kim Kime Ödeyecek?</Text>
                <View style={s.card}>
                  {debts.map((debt, i) => {
                    const key = `${debt.fromId}-${debt.toName}`;
                    const done = settled.includes(key);
                    return (
                      <View key={i}>
                        {i > 0 && <View style={s.divider} />}
                        <View style={s.debtRow}>
                          <View style={{ flex: 1 }}>
                            <Text style={s.debtText}>
                              <Text style={s.debtName}>{debt.fromName}</Text>
                              <Text style={s.debtArrow}> → </Text>
                              <Text style={s.debtName}>{debt.toName}</Text>
                            </Text>
                            <Text style={[s.debtAmount, { color: done ? '#10B981' : '#EF4444' }]}>
                              {fmt(debt.amountTRY)}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={[s.settleBtn, done && s.settleBtnDone]}
                            onPress={() => !done && openSettle(debt)}
                            activeOpacity={done ? 1 : 0.75}
                          >
                            {done
                              ? <CheckCircle size={14} color='#10B981' strokeWidth={2.5} />
                              : <ArrowRightLeft size={14} color={colors.purple} strokeWidth={2.5} />
                            }
                            <Text style={[s.settleBtnText, done && s.settleBtnTextDone]}>
                              {done ? 'Ödendi' : 'Öde'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </>
            )}
          </>
        ) : (
          <>
            {/* ── HARCAMALAR LİSTESİ ── */}
            <Text style={s.sectionTitle}>Tüm Harcamalar</Text>
            <View style={s.card}>
              {MOCK_EXPENSES.map((exp, i) => {
                const payer = memberById[exp.paidById];
                return (
                  <View key={exp.id}>
                    {i > 0 && <View style={s.divider} />}
                    <View style={s.expenseRow}>
                      <View style={[s.expAvatar, { backgroundColor: payer.color + '22' }]}>
                        <Text style={[s.expAvatarText, { color: payer.color }]}>{payer.initials}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.expLabel}>{exp.label}</Text>
                        <Text style={s.expPayer}>{payer.name} · {exp.date}</Text>
                      </View>
                      <Text style={s.expAmount}>{fmt(exp.amountTRY)}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* ── YENİ HARCAMA ── */}
        <TouchableOpacity style={s.addBtn} activeOpacity={0.75}>
          <Plus size={18} color={colors.purple} strokeWidth={2.5} />
          <Text style={s.addBtnText}>Harcama Ekle</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* ── ÖDEME ONAYI MODALİ ── */}
      <Modal visible={!!settleModal} transparent animationType="slide" onRequestClose={() => setSettleModal(null)}>
        <Pressable style={s.overlay} onPress={() => setSettleModal(null)} />
        <View style={s.sheet}>
          <View style={s.sheetHandle} />
          <Text style={s.sheetTitle}>Ödemeyi Onayla</Text>
          {settleModal && (
            <>
              <Text style={s.sheetSub}>
                {settleModal.from.name} → {settleModal.toName}
              </Text>
              <View style={s.sheetAmountBox}>
                <Wallet size={22} color={colors.purple} strokeWidth={2} />
                <Text style={s.sheetAmount}>{fmt(settleModal.amountTRY)}</Text>
              </View>

              <Animated.View style={[s.successRow, { opacity: checkAnim, transform: [{ scale: checkAnim }] }]}>
                <CheckCircle size={28} color='#10B981' strokeWidth={2} />
                <Text style={s.successText}>Ödendi! ✓</Text>
              </Animated.View>

              <TouchableOpacity style={s.confirmBtn} onPress={confirmSettle} activeOpacity={0.8}>
                <Text style={s.confirmBtnText}>Onayla</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.bg },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8 },

  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  title:   { color: colors.text1, fontSize: 17, fontWeight: '700' },
  titleSub:{ color: colors.text3, fontSize: 12, fontWeight: '500', marginTop: 1 },

  // Pills
  pillRow:       { flexDirection: 'row', gap: 10, marginBottom: 16 },
  pill:          { paddingHorizontal: 20, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface1 },
  pillActive:    { backgroundColor: colors.purple, borderColor: colors.purple },
  pillText:      { color: colors.text2, fontSize: 14, fontWeight: '600' },
  pillTextActive:{ color: '#fff' },

  // Total card
  totalCard:    { backgroundColor: colors.surface1, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 18, marginBottom: 16, gap: 14 },
  totalRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  totalLabel:   { color: colors.text3, fontSize: 12, fontWeight: '600', marginBottom: 4 },
  totalAmount:  { color: colors.text1, fontSize: 28, fontWeight: '800' },
  totalRight:   { alignItems: 'flex-end' },
  perLabel:     { color: colors.text3, fontSize: 12, fontWeight: '600', marginBottom: 4 },
  perAmount:    { color: colors.purple, fontSize: 20, fontWeight: '800' },
  totalDivider: { height: 1, backgroundColor: colors.border },
  totalRight2:  { alignItems: 'flex-end' },
  memberCountRow:{ flexDirection: 'row', alignItems: 'center', gap: 6 },
  memberCount:  { color: colors.text3, fontSize: 12, fontWeight: '600' },

  // Tab bar
  tabBar:        { flexDirection: 'row', backgroundColor: colors.surface1, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 4, marginBottom: 16, gap: 4 },
  tab:           { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: 'center' },
  tabActive:     { backgroundColor: colors.purple },
  tabText:       { color: colors.text3, fontSize: 13, fontWeight: '600' },
  tabTextActive: { color: '#fff' },

  // Section title
  sectionTitle:  { color: colors.text2, fontSize: 13, fontWeight: '700', marginBottom: 10, marginTop: 4 },

  // Card
  card:    { backgroundColor: colors.surface1, borderRadius: 20, borderWidth: 1, borderColor: colors.border, marginBottom: 16, overflow: 'hidden' },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 16 },

  // Member row
  memberRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  avatar:      { width: 44, height: 44, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  avatarText:  { fontSize: 16, fontWeight: '800' },
  crownBadge:  { position: 'absolute', top: -4, right: -4, backgroundColor: colors.bg, borderRadius: 6, padding: 2 },
  memberName:  { color: colors.text1, fontSize: 14, fontWeight: '700' },
  memberPaid:  { color: colors.text3, fontSize: 12, fontWeight: '500', marginTop: 2 },
  balance:     { fontSize: 15, fontWeight: '800' },
  balanceSub:  { color: colors.text3, fontSize: 11, fontWeight: '500', marginTop: 2 },

  // Debt row
  debtRow:      { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  debtText:     { fontSize: 13, fontWeight: '500', marginBottom: 3 },
  debtName:     { color: colors.text1, fontWeight: '700' },
  debtArrow:    { color: colors.text3 },
  debtAmount:   { fontSize: 15, fontWeight: '800' },
  settleBtn:    { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1, borderColor: colors.purple + '55', backgroundColor: colors.purple + '15' },
  settleBtnDone:{ borderColor: '#10B98133', backgroundColor: '#10B98115' },
  settleBtnText:    { color: colors.purple, fontSize: 12, fontWeight: '700' },
  settleBtnTextDone:{ color: '#10B981' },

  // Expense row
  expenseRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  expAvatar:     { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  expAvatarText: { fontSize: 14, fontWeight: '800' },
  expLabel:      { color: colors.text1, fontSize: 14, fontWeight: '600' },
  expPayer:      { color: colors.text3, fontSize: 12, fontWeight: '500', marginTop: 2 },
  expAmount:     { color: colors.text1, fontSize: 15, fontWeight: '800' },

  // Add button
  addBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: colors.purple + '55', borderStyle: 'dashed', borderRadius: 16, paddingVertical: 16, marginTop: 4, backgroundColor: colors.purple + '08' },
  addBtnText: { color: colors.purple, fontSize: 14, fontWeight: '700' },

  // Modal
  overlay:        { flex: 1, backgroundColor: '#00000066' },
  sheet:          { backgroundColor: colors.surface1, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40, gap: 16 },
  sheetHandle:    { width: 36, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 8 },
  sheetTitle:     { color: colors.text1, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  sheetSub:       { color: colors.text3, fontSize: 13, textAlign: 'center', marginTop: -8 },
  sheetAmountBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: colors.bg, borderRadius: 16, borderWidth: 1, borderColor: colors.border, paddingVertical: 16 },
  sheetAmount:    { color: colors.text1, fontSize: 28, fontWeight: '800' },
  successRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, position: 'absolute', alignSelf: 'center', bottom: 120 },
  successText:    { color: '#10B981', fontSize: 18, fontWeight: '800' },
  confirmBtn:     { backgroundColor: colors.purple, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
