import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-gifted-charts';
import { TrendingUp, TrendingDown, ChevronRight } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

// ─── MOCK DATA ────────────────────────────────────────────────────
const PIE_DATA = [
  { value: 40, color: colors.purple,  label: 'Hisse Senedi' },
  { value: 30, color: colors.success, label: 'Kripto Para'  },
  { value: 20, color: colors.warning, label: 'Kıymetli Maden' },
  { value: 10, color: colors.text3,   label: 'Nakit'        },
];

const ASSETS = [
  {
    id: '1',
    name: 'Hisse Senedi',
    subtitle: 'Borsa İstanbul',
    value: '₺ 4.980,00',
    change: '+%3,20',
    up: true,
    pct: 40,
    color: colors.purple,
  },
  {
    id: '2',
    name: 'Kripto Para',
    subtitle: 'BTC · ETH · BNB',
    value: '₺ 3.735,00',
    change: '+%1,87',
    up: true,
    pct: 30,
    color: colors.success,
  },
  {
    id: '3',
    name: 'Kıymetli Maden',
    subtitle: 'Altın · Gümüş',
    value: '₺ 2.490,00',
    change: '-0,44%',
    up: false,
    pct: 20,
    color: colors.warning,
  },
  {
    id: '4',
    name: 'Nakit',
    subtitle: 'TRY · USD · EUR',
    value: '₺ 1.245,00',
    change: '+%0,00',
    up: true,
    pct: 10,
    color: colors.text3,
  },
];

const TOTAL = '₺ 12.450,00';

// ─── EKRAN ────────────────────────────────────────────────────────
export default function VarliklarScreen() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ── BAŞLIK ── */}
        <View style={s.header}>
          <Text style={s.title}>Varlıklarım</Text>
          <Text style={s.subtitle}>Toplam değeriniz</Text>
        </View>

        {/* ── TOPLAM TUTAR ── */}
        <Text style={s.total}>{TOTAL}</Text>
        <View style={s.changeRow}>
          <TrendingUp size={14} color={colors.success} strokeWidth={2} />
          <Text style={s.changeText}>+₺ 505,80 (%4,24) bu ay</Text>
        </View>

        {/* ── PASTA GRAFİĞİ ── */}
        <View style={s.pieCard}>
          <Text style={s.cardTitle}>Varlık Dağılımı</Text>
          <View style={s.pieRow}>
            <PieChart
              donut
              data={PIE_DATA}
              radius={80}
              innerRadius={54}
              innerCircleColor={colors.surface1}
              centerLabelComponent={() => (
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: colors.text2, fontSize: 10 }}>Toplam</Text>
                  <Text style={{ color: colors.text1, fontSize: 13, fontWeight: '700' }}>
                    ₺ 12.450
                  </Text>
                </View>
              )}
            />
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
        </View>

        {/* ── VARLIK LİSTESİ ── */}
        <View style={s.sectionRow}>
          <Text style={s.cardTitle}>Varlıklar</Text>
          <TouchableOpacity style={s.seeAll}>
            <Text style={s.seeAllText}>Tümü</Text>
            <ChevronRight size={14} color={colors.purpleLight} />
          </TouchableOpacity>
        </View>

        <View style={s.assetCard}>
          {ASSETS.map((a, i) => (
            <TouchableOpacity
              key={a.id}
              style={[s.assetRow, i < ASSETS.length - 1 && s.assetRowBorder]}
              onPress={() => setSelected(selected === a.id ? null : a.id)}
              activeOpacity={0.75}
            >
              {/* Renk çubuğu */}
              <View style={[s.assetBar, { backgroundColor: a.color }]} />

              {/* Bilgi */}
              <View style={s.assetInfo}>
                <Text style={s.assetName}>{a.name}</Text>
                <Text style={s.assetSub}>{a.subtitle}</Text>
              </View>

              {/* Sağ */}
              <View style={s.assetRight}>
                <Text style={s.assetValue}>{a.value}</Text>
                <View style={[
                  s.changeBadge,
                  { backgroundColor: a.up ? colors.success + '22' : colors.error + '22' }
                ]}>
                  {a.up
                    ? <TrendingUp size={10} color={colors.success} />
                    : <TrendingDown size={10} color={colors.error} />
                  }
                  <Text style={[s.changeBadgeText, { color: a.up ? colors.success : colors.error }]}>
                    {a.change}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 32 }} />

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.bg },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 20 },

  // Header
  header:   { paddingTop: 8, paddingBottom: 4 },
  title:    { color: colors.text1, fontSize: 22, fontWeight: '800' },
  subtitle: { color: colors.text2, fontSize: 13, marginTop: 2 },

  // Toplam
  total:      { color: colors.text1, fontSize: 34, fontWeight: '800', marginTop: 12, letterSpacing: 0.5 },
  changeRow:  { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, marginBottom: 24 },
  changeText: { color: colors.success, fontSize: 13, fontWeight: '500' },

  // Pie
  pieCard:  { backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 20, marginBottom: 24 },
  pieRow:   { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 16 },
  pieLegend:{ flex: 1, gap: 10 },
  legendRow:{ flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot:{ width: 10, height: 10, borderRadius: 5 },
  legendLabel:{ flex: 1, color: colors.text2, fontSize: 12 },
  legendValue:{ color: colors.text1, fontSize: 12, fontWeight: '600' },

  // Section
  sectionRow:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { color: colors.text1, fontSize: 16, fontWeight: '700' },
  seeAll:    { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText:{ color: colors.purpleLight, fontSize: 13, fontWeight: '500' },

  // Asset list
  assetCard:      { backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  assetRow:       { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  assetRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  assetBar:       { width: 3, height: 36, borderRadius: 2 },
  assetInfo:      { flex: 1 },
  assetName:      { color: colors.text1, fontSize: 14, fontWeight: '600', marginBottom: 2 },
  assetSub:       { color: colors.text2, fontSize: 12 },
  assetRight:     { alignItems: 'flex-end', gap: 4 },
  assetValue:     { color: colors.text1, fontSize: 14, fontWeight: '700' },
  changeBadge:    { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  changeBadgeText:{ fontSize: 11, fontWeight: '600' },
});
