import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft, CheckCircle, AlertTriangle,
  Info, ChevronDown, ChevronUp, Cpu, Target, Zap,
} from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { DEMO_RISK_REPORT } from '../../src/services/risk-model.service';
import type { RiskCategory } from '../../src/services/risk-model.service';
import { getScoreScenario } from '../../src/data/ai-scenarios/score-scenarios';

// ─── Bileşen: Kategori Çubuğu ────────────────────────────────────
function CategoryBar({ cat }: { cat: RiskCategory }) {
  const [open, setOpen] = useState(false);
  const pct = cat.score;
  const barColor = pct >= 70 ? '#10B981' : pct >= 40 ? '#F59E0B' : '#EF4444';

  return (
    <TouchableOpacity onPress={() => setOpen(v => !v)} activeOpacity={0.8}>
      <View style={cb.row}>
        <View style={cb.labelRow}>
          <Text style={cb.label}>{cat.label}</Text>
          <View style={cb.rightRow}>
            <Text style={[cb.score, { color: barColor }]}>{Math.round(pct)}</Text>
            <Text style={cb.weight}>  (%{cat.weight})</Text>
            {open ? <ChevronUp size={13} color={colors.text3} /> : <ChevronDown size={13} color={colors.text3} />}
          </View>
        </View>
        <View style={cb.track}>
          <View style={[cb.fill, { width: `${pct}%` as any, backgroundColor: barColor }]} />
        </View>
      </View>
      {open && (
        <View style={cb.tip}>
          <Info size={12} color={colors.text3} strokeWidth={2} />
          <Text style={cb.tipText}>{cat.tip}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const cb = StyleSheet.create({
  row:      { marginBottom: 14 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  label:    { color: colors.text1, fontSize: 13, fontWeight: '500' },
  rightRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  score:    { fontSize: 13, fontWeight: '700' },
  weight:   { fontSize: 11, color: colors.text3 },
  track:    { height: 6, backgroundColor: colors.surface2, borderRadius: 4, overflow: 'hidden' },
  fill:     { height: 6, borderRadius: 4 },
  tip:      { flexDirection: 'row', alignItems: 'flex-start', gap: 6, paddingTop: 6, paddingBottom: 2 },
  tipText:  { color: colors.text3, fontSize: 12, flex: 1, lineHeight: 17 },
});

// ─── Ana Ekran ────────────────────────────────────────────────────
export default function SaglikSkoru() {
  const router  = useRouter();
  const report  = DEMO_RISK_REPORT;
  const scenario = getScoreScenario(report.totalScore);
  const score   = report.totalScore;
  const lc      = report.levelColor;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ArrowLeft size={22} color={colors.text1} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Finansal Sağlık Skoru</Text>
        <View style={s.aiBadge}>
          <Cpu size={11} color={colors.purple} strokeWidth={2} />
          <Text style={s.aiBadgeText}>AI</Text>
        </View>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* SKOR DAİRESİ */}
        <View style={s.scoreCard}>
          <View style={[s.scoreRing, { borderColor: lc, shadowColor: lc }]}>
            <Text style={[s.scoreNum, { color: lc }]}>{score}</Text>
            <Text style={[s.scoreLevel, { color: lc }]}>{report.levelLabel}</Text>
          </View>
          <Text style={s.scoreSummary}>{report.summary}</Text>
          <Text style={s.scoreDate}>Son güncelleme: Eylül 2026 · Sonraki: {report.nextCheckDate}</Text>

          {/* Skor skala */}
          <View style={s.scaleRow}>
            {['Zayıf', 'Orta', 'İyi', 'Mükemmel'].map((l, i) => (
              <View key={l} style={s.scaleItem}>
                <View style={[s.scaleDot, { backgroundColor: ['#EF4444','#F59E0B','#6366F1','#10B981'][i] }]} />
                <Text style={s.scaleLabel}>{l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* AI YORUMU */}
        <View style={s.aiCard}>
          <View style={s.aiCardHeader}>
            <Cpu size={14} color={colors.purple} strokeWidth={2} />
            <Text style={s.aiCardTitle}>AI Yorumu</Text>
          </View>
          <Text style={s.aiComment}>{scenario.aiComment}</Text>
        </View>

        {/* AYLIK HEDEF */}
        <View style={[s.goalCard, { borderLeftColor: lc }]}>
          <Target size={20} color={lc} strokeWidth={2} />
          <View style={s.goalText}>
            <Text style={s.goalTitle}>Bu Ayki Hedef</Text>
            <Text style={s.goalSub}>{scenario.monthlyGoal}</Text>
          </View>
        </View>

        {/* KATEGORİ ANALİZİ */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Kategori Analizi</Text>
          <Text style={s.sectionSub}>Kategoriye dokunarak ipucu görebilirsiniz</Text>
          <View style={s.card}>
            {report.categories.map(cat => (
              <CategoryBar key={cat.key} cat={cat} />
            ))}
          </View>
        </View>

        {/* GÜÇLÜ YÖNLER */}
        {scenario.strengths.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Güçlü Yönler</Text>
            <View style={s.card}>
              {scenario.strengths.map((str, i) => (
                <View key={i} style={[s.listRow, i < scenario.strengths.length - 1 && s.listBorder]}>
                  <CheckCircle size={15} color="#10B981" strokeWidth={2} />
                  <Text style={s.listText}>{str}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* İYİLEŞTİRME ÖNERİLERİ */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>İyileştirme Önerileri</Text>
          <View style={s.card}>
            {scenario.improvements.map((imp, i) => (
              <View key={i} style={[s.listRow, i < scenario.improvements.length - 1 && s.listBorder]}>
                <AlertTriangle size={15} color="#F59E0B" strokeWidth={2} />
                <Text style={s.listText}>{imp}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── STİLLER ──────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16 },

  // Header
  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  backBtn:      { padding: 4 },
  headerTitle:  { flex: 1, fontSize: 17, fontWeight: '700', color: colors.text1 },
  aiBadge:      { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.purple + '18', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  aiBadgeText:  { color: colors.purple, fontSize: 11, fontWeight: '700' },

  // Score
  scoreCard:    { alignItems: 'center', paddingVertical: 24, marginBottom: 12 },
  scoreRing:    {
    width: 160, height: 160, borderRadius: 80,
    borderWidth: 10, alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 16,
    elevation: 6,
    backgroundColor: colors.surface1,
  },
  scoreNum:     { fontSize: 48, fontWeight: '900', lineHeight: 54 },
  scoreLevel:   { fontSize: 13, fontWeight: '700', marginTop: 2 },
  scoreSummary: { color: colors.text2, fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 8, paddingHorizontal: 24 },
  scoreDate:    { color: colors.text3, fontSize: 11, textAlign: 'center', marginBottom: 16 },
  scaleRow:     { flexDirection: 'row', gap: 16 },
  scaleItem:    { alignItems: 'center', gap: 4 },
  scaleDot:     { width: 8, height: 8, borderRadius: 4 },
  scaleLabel:   { color: colors.text3, fontSize: 10 },

  // AI Card
  aiCard:       { backgroundColor: colors.purple + '12', borderWidth: 1, borderColor: colors.purple + '30', borderRadius: 16, padding: 16, marginBottom: 12 },
  aiCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  aiCardTitle:  { color: colors.purple, fontSize: 13, fontWeight: '700' },
  aiComment:    { color: colors.text2, fontSize: 13, lineHeight: 20 },

  // Goal Card
  goalCard:     { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, borderLeftWidth: 4, padding: 16, marginBottom: 20 },
  goalText:     { flex: 1 },
  goalTitle:    { color: colors.text1, fontSize: 13, fontWeight: '700', marginBottom: 3 },
  goalSub:      { color: colors.text2, fontSize: 12, lineHeight: 18 },

  // Section
  section:      { marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text1, marginBottom: 4 },
  sectionSub:   { fontSize: 12, color: colors.text3, marginBottom: 10 },
  card:         { backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 16 },

  // List
  listRow:      { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 10 },
  listBorder:   { borderBottomWidth: 1, borderBottomColor: colors.border },
  listText:     { flex: 1, color: colors.text2, fontSize: 13, lineHeight: 19 },
});
