import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, Keyboard, Animated, Modal, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft, Plus, Target, CheckCircle, ChevronRight,
} from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { CURRENCY_SYMBOL, type Currency } from '../../src/utils/currency';
import { useAccountStore } from '../../src/store/useAccountStore';

// ─── TİPLER ──────────────────────────────────────────────────────
type Goal = {
  id: string;
  emoji: string;
  title: string;
  currentTRY: number;
  targetTRY: number;
  color: string;
};

// ─── DÖVİZ KURLARI ───────────────────────────────────────────────
const TO_TRY: Record<Currency, number> = { TRY: 1, USD: 32.45, EUR: 35.10 };

function fromTRY(amountTRY: number, currency: Currency): number {
  return amountTRY / TO_TRY[currency];
}

// ─── MOCK HEDEFLER ───────────────────────────────────────────────
const INITIAL_GOALS: Goal[] = [
  {
    id: 'tatil',
    emoji: '🏖️',
    title: 'Tatil Fonu',
    currentTRY: 3200,
    targetTRY: 8000,
    color: '#F59E0B',
  },
  {
    id: 'ev',
    emoji: '🏠',
    title: 'Ev Peşinatı',
    currentTRY: 25000,
    targetTRY: 50000,
    color: '#10B981',
  },
  {
    id: 'laptop',
    emoji: '💻',
    title: 'Laptop Fonu',
    currentTRY: 4500,
    targetTRY: 6000,
    color: '#3B82F6',
  },
  {
    id: 'araba',
    emoji: '🚗',
    title: 'Araba Değişimi',
    currentTRY: 8000,
    targetTRY: 120000,
    color: '#8B5CF6',
  },
];

// ─── EKRAN ────────────────────────────────────────────────────────
export default function GoalsScreen() {
  const router = useRouter();
  const activeCurrency = useAccountStore((s) => s.activeCurrency);
  const [currency, setCurrency] = useState<Currency>(activeCurrency);
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);

  // Para ekle modal state
  const [addModal, setAddModal] = useState<{ goalId: string; title: string } | null>(null);
  const [rawAmount, setRawAmount] = useState('');
  const confirmAnim = useRef(new Animated.Value(0)).current;

  const sym = CURRENCY_SYMBOL[currency];

  function fmt(amountTRY: number): string {
    const converted = fromTRY(amountTRY, currency);
    const locale = currency === 'USD' ? 'en-US' : currency === 'EUR' ? 'de-DE' : 'tr-TR';
    return `${sym} ${converted.toLocaleString(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  function openAdd(goalId: string, title: string) {
    setRawAmount('');
    setAddModal({ goalId, title });
    confirmAnim.setValue(0);
  }

  function handleConfirmAdd() {
    Keyboard.dismiss();
    if (!addModal) return;
    const numeric = parseFloat(rawAmount.replace(',', '.')) || 0;
    if (numeric <= 0) return;

    // Convert to TRY and add
    const addedTRY = numeric * TO_TRY[currency];

    setGoals(prev =>
      prev.map(g =>
        g.id === addModal.goalId
          ? { ...g, currentTRY: Math.min(g.currentTRY + addedTRY, g.targetTRY) }
          : g
      )
    );

    Animated.timing(confirmAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start(() => {
      setTimeout(() => {
        setAddModal(null);
        setRawAmount('');
        confirmAnim.setValue(0);
      }, 800);
    });
  }

  const CURRENCIES: Currency[] = ['TRY', 'USD', 'EUR'];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      {/* ── BAŞLIK ── */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text1} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={s.title}>Hedef Kartları</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >

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

        {/* ── HEDEF KARTLARI ── */}
        {goals.map(goal => {
          const pct = Math.round((goal.currentTRY / goal.targetTRY) * 100);
          const done = pct >= 100;

          return (
            <View key={goal.id} style={[s.card, done && s.cardDone]}>
              {/* Başlık satırı */}
              <View style={s.cardHeader}>
                <View style={[s.emojiBox, { backgroundColor: goal.color + '20' }]}>
                  <Text style={s.emoji}>{goal.emoji}</Text>
                </View>
                <View style={s.cardTitles}>
                  <Text style={s.goalTitle}>{goal.title}</Text>
                  <Text style={s.goalSub}>
                    {fmt(goal.currentTRY)}
                    <Text style={s.goalSubMuted}> / {fmt(goal.targetTRY)}</Text>
                  </Text>
                </View>
                {done && (
                  <CheckCircle size={22} color='#10B981' strokeWidth={2} />
                )}
              </View>

              {/* Progress bar */}
              <View style={s.barTrack}>
                <View
                  style={[
                    s.barFill,
                    {
                      backgroundColor: done ? '#10B981' : goal.color,
                      width: `${Math.min(pct, 100)}%`,
                    },
                  ]}
                />
              </View>

              {/* Yüzde + Para Ekle */}
              <View style={s.cardFooter}>
                <Text style={[s.pctText, { color: done ? '#10B981' : goal.color }]}>
                  %{pct} {done ? '— Hedef tamamlandı! 🎉' : 'tamamlandı'}
                </Text>
                {!done && (
                  <TouchableOpacity
                    style={[s.addBtn, { backgroundColor: goal.color + '1A', borderColor: goal.color + '44' }]}
                    onPress={() => openAdd(goal.id, goal.title)}
                    activeOpacity={0.75}
                  >
                    <Plus size={12} color={goal.color} strokeWidth={2.5} />
                    <Text style={[s.addBtnText, { color: goal.color }]}>Para Ekle</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}

        {/* ── YENİ HEDEF ── */}
        <TouchableOpacity style={s.newGoalBtn} activeOpacity={0.75}>
          <Plus size={18} color={colors.purple} strokeWidth={2.5} />
          <Text style={s.newGoalText}>Yeni Hedef Ekle</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* ── PARA EKLE MODALİ ── */}
      <Modal
        visible={!!addModal}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModal(null)}
      >
        <Pressable style={s.modalOverlay} onPress={() => setAddModal(null)} />
        <View style={s.sheet}>
          <View style={s.sheetHandle} />
          <Text style={s.sheetTitle}>Para Ekle</Text>
          {addModal && (
            <Text style={s.sheetSub}>{addModal.title} hedefine ekleme yap</Text>
          )}

          <Animated.View
            style={[
              s.sheetInput,
              {
                opacity: confirmAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0, 0] }),
              },
            ]}
          >
            <Text style={s.inputSym}>{sym}</Text>
            <TextInput
              style={s.inputField}
              value={rawAmount}
              onChangeText={setRawAmount}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.text3}
              maxLength={10}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleConfirmAdd}
            />
          </Animated.View>

          {/* Success feedback */}
          <Animated.View
            style={[
              s.successRow,
              {
                opacity: confirmAnim,
                transform: [{ scale: confirmAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
              },
            ]}
          >
            <CheckCircle size={28} color='#10B981' strokeWidth={2} />
            <Text style={s.successText}>Eklendi! 🎉</Text>
          </Animated.View>

          <TouchableOpacity
            style={[s.confirmBtn, (!rawAmount || parseFloat(rawAmount.replace(',', '.')) <= 0) && s.confirmBtnDisabled]}
            onPress={handleConfirmAdd}
            disabled={!rawAmount || parseFloat(rawAmount.replace(',', '.')) <= 0}
            activeOpacity={0.8}
          >
            <Text style={s.confirmBtnText}>Onayla</Text>
          </TouchableOpacity>
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

  // Currency pills
  pillRow:      { flexDirection: 'row', gap: 10, marginBottom: 20 },
  pill:         { paddingHorizontal: 20, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface1 },
  pillActive:   { backgroundColor: colors.purple, borderColor: colors.purple },
  pillText:     { color: colors.text2, fontSize: 14, fontWeight: '600' },
  pillTextActive:{ color: '#fff' },

  // Goal cards
  card:       { backgroundColor: colors.surface1, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 18, marginBottom: 14, gap: 14 },
  cardDone:   { borderColor: '#10B98133' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emojiBox:   { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  emoji:      { fontSize: 24 },
  cardTitles: { flex: 1, gap: 3 },
  goalTitle:  { color: colors.text1, fontSize: 15, fontWeight: '700' },
  goalSub:    { color: colors.text1, fontSize: 13, fontWeight: '700' },
  goalSubMuted:{ color: colors.text3, fontWeight: '500' },

  // Progress bar
  barTrack:   { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  barFill:    { height: '100%', borderRadius: 4 },

  // Footer
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pctText:    { fontSize: 12, fontWeight: '600' },
  addBtn:     { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1 },
  addBtnText: { fontSize: 12, fontWeight: '700' },

  // New goal
  newGoalBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: colors.purple + '55', borderStyle: 'dashed', borderRadius: 16, paddingVertical: 16, marginTop: 4, backgroundColor: colors.purple + '08' },
  newGoalText:{ color: colors.purple, fontSize: 14, fontWeight: '700' },

  // Modal / sheet
  modalOverlay:  { flex: 1, backgroundColor: '#00000066' },
  sheet:         { backgroundColor: colors.surface1, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40, gap: 16 },
  sheetHandle:   { width: 36, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 8 },
  sheetTitle:    { color: colors.text1, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  sheetSub:      { color: colors.text3, fontSize: 13, textAlign: 'center', marginTop: -8 },

  sheetInput:    { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg, borderRadius: 16, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  inputSym:      { color: colors.text2, fontSize: 24, fontWeight: '700' },
  inputField:    { flex: 1, color: colors.text1, fontSize: 32, fontWeight: '800', paddingVertical: 0 },

  successRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, position: 'absolute', alignSelf: 'center', bottom: 120 },
  successText:   { color: '#10B981', fontSize: 18, fontWeight: '800' },

  confirmBtn:         { backgroundColor: colors.purple, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  confirmBtnDisabled: { opacity: 0.4 },
  confirmBtnText:     { color: '#fff', fontSize: 16, fontWeight: '700' },
});
