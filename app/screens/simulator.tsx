import { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, Keyboard, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle,
} from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { CURRENCY_SYMBOL, type Currency } from '../../src/utils/currency';
import { useAccountStore } from '../../src/store/useAccountStore';

// ─── TİPLER ──────────────────────────────────────────────────────
type Category = {
  key: string;
  label: string;
  emoji: string;
  monthlyAvg: number; // TRY cinsinden aylık ortalama harcama
};

type RiskLevel = 'low' | 'medium' | 'high';

// ─── KATEGORİLER ─────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  { key: 'food',          label: 'Yemek',       emoji: '🍔', monthlyAvg: 2400 },
  { key: 'transport',     label: 'Ulaşım',       emoji: '🚌', monthlyAvg: 800  },
  { key: 'entertainment', label: 'Eğlence',      emoji: '🎬', monthlyAvg: 600  },
  { key: 'shopping',      label: 'Alışveriş',    emoji: '🛍️', monthlyAvg: 1800 },
  { key: 'bills',         label: 'Fatura',       emoji: '📄', monthlyAvg: 1200 },
  { key: 'subscriptions', label: 'Abonelik',     emoji: '📱', monthlyAvg: 400  },
];

// ─── DÖVİZ KURLARI (mock) ─────────────────────────────────────────
const TO_TRY: Record<Currency, number> = { TRY: 1, USD: 32.45, EUR: 35.10 };

// ─── RİSK HESAPLAMA ───────────────────────────────────────────────
function calcRisk(amountTRY: number, cat: Category): RiskLevel {
  const ratio = amountTRY / cat.monthlyAvg;
  if (ratio < 0.2) return 'low';
  if (ratio < 0.6) return 'medium';
  return 'high';
}

const RISK_CONFIG: Record<RiskLevel, {
  label: string; color: string; bg: string;
  Icon: typeof CheckCircle; headline: string; sub: string;
}> = {
  low: {
    label: 'Düşük Risk', color: '#10B981', bg: '#10B98118',
    Icon: CheckCircle,
    headline: 'Bütçe güvende 🟢',
    sub: 'Bu harcama aylık ortalamana göre makul.',
  },
  medium: {
    label: 'Orta Risk', color: '#F59E0B', bg: '#F59E0B18',
    Icon: AlertTriangle,
    headline: 'Dikkatli ol 🟡',
    sub: 'Bu harcama aylık ortalamanın önemli bir bölümünü oluşturuyor.',
  },
  high: {
    label: 'Yüksek Risk', color: '#EF4444', bg: '#EF444418',
    Icon: XCircle,
    headline: 'Bütçeni zorlayabilir 🔴',
    sub: 'Bu harcama aylık ortalamana göre oldukça yüksek.',
  },
};

const CURRENCIES: Currency[] = ['TRY', 'USD', 'EUR'];

// ─── EKRAN ────────────────────────────────────────────────────────
export default function SimulatorScreen() {
  const router = useRouter();
  const activeCurrency = useAccountStore((s) => s.activeCurrency);

  const [rawAmount, setRawAmount]       = useState('');
  const [currency, setCurrency]         = useState<Currency>(activeCurrency);
  const [selectedCat, setSelectedCat]   = useState<Category>(CATEGORIES[0]);
  const [result, setResult]             = useState<null | { risk: RiskLevel; amountTRY: number; pct: number }>(null);

  const resultAnim = useRef(new Animated.Value(0)).current;

  const sym = CURRENCY_SYMBOL[currency];
  const numericAmount = parseFloat(rawAmount.replace(',', '.')) || 0;

  function handleCalc() {
    Keyboard.dismiss();
    if (numericAmount <= 0) return;

    const amountTRY = numericAmount * TO_TRY[currency];
    const risk      = calcRisk(amountTRY, selectedCat);
    const pct       = Math.round((amountTRY / selectedCat.monthlyAvg) * 100);

    setResult({ risk, amountTRY, pct });

    resultAnim.setValue(0);
    Animated.timing(resultAnim, { toValue: 1, duration: 320, useNativeDriver: true }).start();
  }

  const risk = result ? RISK_CONFIG[result.risk] : null;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      {/* ── BAŞLIK ── */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text1} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={s.title}>Alırsam Ne Olur?</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── TUTAR GİRİŞİ ── */}
        <View style={s.amountCard}>
          <Text style={s.amountLabel}>Harcayacağın tutar</Text>
          <View style={s.amountRow}>
            <Text style={s.currencySym}>{sym}</Text>
            <TextInput
              style={s.amountInput}
              value={rawAmount}
              onChangeText={v => { setRawAmount(v); setResult(null); }}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.text3}
              maxLength={10}
              returnKeyType="done"
              onSubmitEditing={handleCalc}
            />
          </View>
          <View style={s.amountDivider} />
        </View>

        {/* ── PARA BİRİMİ ── */}
        <Text style={s.sectionLabel}>Para Birimi</Text>
        <View style={s.pillRow}>
          {CURRENCIES.map(c => (
            <TouchableOpacity
              key={c}
              style={[s.pill, currency === c && s.pillActive]}
              onPress={() => { setCurrency(c); setResult(null); }}
            >
              <Text style={[s.pillText, currency === c && s.pillTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── KATEGORİ ── */}
        <Text style={s.sectionLabel}>Kategori</Text>
        <View style={s.catGrid}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.key}
              style={[s.catItem, selectedCat.key === cat.key && s.catItemActive]}
              onPress={() => { setSelectedCat(cat); setResult(null); }}
              activeOpacity={0.75}
            >
              <Text style={s.catEmoji}>{cat.emoji}</Text>
              <Text style={[s.catLabel, selectedCat.key === cat.key && s.catLabelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── HESAPLA ── */}
        <TouchableOpacity
          style={[s.calcBtn, numericAmount <= 0 && s.calcBtnDisabled]}
          onPress={handleCalc}
          activeOpacity={0.8}
          disabled={numericAmount <= 0}
        >
          <Text style={s.calcBtnText}>Hesapla</Text>
        </TouchableOpacity>

        {/* ── SONUÇ ── */}
        {result && risk && (
          <Animated.View style={[s.resultCard, { backgroundColor: risk.bg, opacity: resultAnim, transform: [{ translateY: resultAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>

            {/* Risk rozeti */}
            <View style={[s.riskBadge, { backgroundColor: risk.color + '28', borderColor: risk.color + '55' }]}>
              <risk.Icon size={14} color={risk.color} strokeWidth={2.5} />
              <Text style={[s.riskBadgeText, { color: risk.color }]}>{risk.label}</Text>
            </View>

            <Text style={[s.resultHeadline, { color: risk.color }]}>{risk.headline}</Text>
            <Text style={s.resultSub}>{risk.sub}</Text>

            {/* ── Bütçe etkisi barı ── */}
            <View style={s.barSection}>
              <View style={s.barLabelRow}>
                <Text style={s.barLabel}>{selectedCat.label} aylık ortalaman</Text>
                <Text style={s.barValue}>
                  ₺ {selectedCat.monthlyAvg.toLocaleString('tr-TR')}
                </Text>
              </View>
              <View style={s.barTrack}>
                <Animated.View
                  style={[
                    s.barFill,
                    {
                      backgroundColor: risk.color,
                      width: `${Math.min(result.pct, 100)}%`,
                    },
                  ]}
                />
              </View>
              <Text style={[s.barPct, { color: risk.color }]}>
                Bu harcama aylık ortalamanın %{result.pct}'i
              </Text>
            </View>

            {/* ── Özet satır ── */}
            <View style={s.summaryRow}>
              <View style={s.summaryItem}>
                <Text style={s.summaryLabel}>Harcama</Text>
                <Text style={[s.summaryValue, { color: risk.color }]}>
                  {sym} {numericAmount.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </Text>
              </View>
              {currency !== 'TRY' && (
                <View style={s.summaryItem}>
                  <Text style={s.summaryLabel}>TRY Karşılığı</Text>
                  <Text style={[s.summaryValue, { color: colors.text1 }]}>
                    ₺ {result.amountTRY.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </Text>
                </View>
              )}
              <View style={s.summaryItem}>
                <Text style={s.summaryLabel}>Risk</Text>
                <View style={[s.riskDot, { backgroundColor: risk.color }]} />
              </View>
            </View>

          </Animated.View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
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

  // Tutar
  amountCard:  { backgroundColor: colors.surface1, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 20, marginBottom: 24 },
  amountLabel: { color: colors.text3, fontSize: 13, fontWeight: '500', marginBottom: 12 },
  amountRow:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  currencySym: { color: colors.text2, fontSize: 28, fontWeight: '700' },
  amountInput: { flex: 1, color: colors.text1, fontSize: 40, fontWeight: '800', paddingVertical: 0 },
  amountDivider:{ height: 2, backgroundColor: colors.purple, borderRadius: 1, marginTop: 12, width: '100%' },

  // Para birimi
  sectionLabel: { color: colors.text2, fontSize: 13, fontWeight: '600', marginBottom: 10, marginTop: 4 },
  pillRow:      { flexDirection: 'row', gap: 10, marginBottom: 20 },
  pill:         { paddingHorizontal: 20, paddingVertical: 9, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface1 },
  pillActive:   { backgroundColor: colors.purple, borderColor: colors.purple },
  pillText:     { color: colors.text2, fontSize: 14, fontWeight: '600' },
  pillTextActive:{ color: '#fff' },

  // Kategori
  catGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  catItem:     { width: '31%', alignItems: 'center', paddingVertical: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface1, gap: 4 },
  catItemActive:{ borderColor: colors.purple, backgroundColor: colors.purple + '14' },
  catEmoji:    { fontSize: 22 },
  catLabel:    { color: colors.text2, fontSize: 12, fontWeight: '500', textAlign: 'center' },
  catLabelActive:{ color: colors.purple, fontWeight: '700' },

  // Buton
  calcBtn:         { backgroundColor: colors.purple, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 20 },
  calcBtnDisabled: { opacity: 0.4 },
  calcBtnText:     { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Sonuç
  resultCard:    { borderRadius: 20, borderWidth: 1, borderColor: 'transparent', padding: 20, gap: 16 },
  riskBadge:     { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1 },
  riskBadgeText: { fontSize: 12, fontWeight: '700' },
  resultHeadline:{ fontSize: 18, fontWeight: '800' },
  resultSub:     { color: colors.text2, fontSize: 13, lineHeight: 19 },

  barSection:  { gap: 6 },
  barLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  barLabel:    { color: colors.text2, fontSize: 12, fontWeight: '500' },
  barValue:    { color: colors.text1, fontSize: 12, fontWeight: '700' },
  barTrack:    { height: 8, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden' },
  barFill:     { height: '100%', borderRadius: 4 },
  barPct:      { fontSize: 12, fontWeight: '600' },

  summaryRow:  { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.bg + 'aa', borderRadius: 12, padding: 12 },
  summaryItem: { alignItems: 'center', gap: 4 },
  summaryLabel:{ color: colors.text3, fontSize: 11, fontWeight: '500' },
  summaryValue:{ fontSize: 14, fontWeight: '800' },
  riskDot:     { width: 16, height: 16, borderRadius: 8 },
});
