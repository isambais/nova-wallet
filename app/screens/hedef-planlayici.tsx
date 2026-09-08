import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Cpu, CheckCircle, ChevronRight, Plus, Plane, Smartphone, Car, Pencil, Target } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { DEMO_RISK_INPUT } from '../../src/services/risk-model.service';

// ─── Sabitler ────────────────────────────────────────────────────
const MONTHLY_SAVINGS = DEMO_RISK_INPUT.savingsAmount; // 1200 TL

type GoalPreset = {
  id: string;
  label: string;
  amount: number;
  color: string;
  Icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
};

const GOAL_PRESETS: GoalPreset[] = [
  { id: 'tatil',   label: 'Tatil',        amount: 5000,  color: '#6366F1', Icon: Plane      },
  { id: 'telefon', label: 'Yeni Telefon',  amount: 25000, color: '#EC4899', Icon: Smartphone },
  { id: 'araba',   label: 'Araç Peşinatı', amount: 50000, color: '#F59E0B', Icon: Car        },
  { id: 'ozel',    label: 'Özel Hedef',    amount: 0,     color: '#10B981', Icon: Pencil     },
];

// ─── Yardımcı: Ay → Tarih string ─────────────────────────────────
function monthsToDate(months: number): string {
  const MONTHS_TR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
                     'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + months, 1);
  return `${MONTHS_TR[target.getMonth()]} ${target.getFullYear()}`;
}

// ─── Aktif Hedefler (Demo) ────────────────────────────────────────
type ActiveGoal = {
  id: string;
  label: string;
  target: number;
  saved: number;
  color: string;
};

const DEMO_GOALS: ActiveGoal[] = [
  { id: 'g1', label: 'Tatil Fonu',  target: 5000,  saved: 2400, color: '#6366F1' },
];

// ─── Ana Ekran ────────────────────────────────────────────────────
export default function HedefPlanlayici() {
  const router = useRouter();
  const [selected, setSelected]   = useState<GoalPreset>(GOAL_PRESETS[0]);
  const [customAmt, setCustomAmt] = useState('');
  const [extraMonthly, setExtra]  = useState(0);

  const targetAmount = selected.id === 'ozel'
    ? (parseInt(customAmt.replace(/\D/g, ''), 10) || 0)
    : selected.amount;

  const totalMonthly  = MONTHLY_SAVINGS + extraMonthly;
  const monthsNeeded  = targetAmount > 0 ? Math.ceil(targetAmount / totalMonthly) : 0;
  const targetDate    = monthsNeeded > 0 ? monthsToDate(monthsNeeded) : '—';
  const pctPerMonth   = targetAmount > 0 ? Math.round((totalMonthly / targetAmount) * 100) : 0;

  // Hız değiştirici seçenekleri
  const BOOSTS = [
    { label: '₺200 ekle',  extra: 200  },
    { label: '₺500 ekle',  extra: 500  },
    { label: '₺1000 ekle', extra: 1000 },
  ];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ArrowLeft size={22} color={colors.text1} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>AI Hedef Planlayıcı</Text>
        <View style={s.aiBadge}>
          <Cpu size={11} color={colors.purple} strokeWidth={2} />
          <Text style={s.aiBadgeText}>AI</Text>
        </View>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* HEDEF SEÇ */}
        <Text style={s.sectionTitle}>Hedefinizi seçin</Text>
        <View style={s.presetGrid}>
          {GOAL_PRESETS.map(gp => {
            const active = selected.id === gp.id;
            return (
              <TouchableOpacity
                key={gp.id}
                style={[s.presetCard, { borderColor: active ? gp.color : colors.border, backgroundColor: active ? gp.color + '15' : colors.surface1 }]}
                onPress={() => { setSelected(gp); setCustomAmt(''); setExtra(0); }}
                activeOpacity={0.8}
              >
                <gp.Icon size={26} color={active ? gp.color : colors.text3} strokeWidth={1.8} />
                <Text style={[s.presetLabel, { color: active ? gp.color : colors.text2 }]}>{gp.label}</Text>
                {gp.id !== 'ozel' && (
                  <Text style={[s.presetAmount, { color: active ? gp.color : colors.text3 }]}>
                    ₺{gp.amount.toLocaleString('tr-TR')}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ÖZEL TUTAR */}
        {selected.id === 'ozel' && (
          <View style={s.card}>
            <Text style={s.cardLabel}>Hedef Tutarı (₺)</Text>
            <TextInput
              style={s.amtInput}
              value={customAmt}
              onChangeText={t => setCustomAmt(t.replace(/\D/g, ''))}
              keyboardType="numeric"
              placeholder="Örn: 10000"
              placeholderTextColor={colors.text3}
            />
          </View>
        )}

        {/* MEVCUT BİRİKİM BİLGİSİ */}
        <View style={s.savingsRow}>
          <View style={s.savingsItem}>
            <Text style={s.savingsLabel}>Aylık birikim</Text>
            <Text style={s.savingsVal}>₺{MONTHLY_SAVINGS.toLocaleString('tr-TR')}</Text>
          </View>
          <View style={s.savingsDivider} />
          <View style={s.savingsItem}>
            <Text style={s.savingsLabel}>Toplam aylık</Text>
            <Text style={[s.savingsVal, { color: colors.purple }]}>₺{totalMonthly.toLocaleString('tr-TR')}</Text>
          </View>
        </View>

        {/* AI HESABI */}
        {targetAmount > 0 && (
          <View style={s.aiCard}>
            <View style={s.aiCardHeader}>
              <Cpu size={14} color={colors.purple} strokeWidth={2} />
              <Text style={s.aiCardTitle}>AI Hesabı</Text>
            </View>

            <View style={s.resultRow}>
              <View style={s.resultItem}>
                <Text style={s.resultNum}>{monthsNeeded}</Text>
                <Text style={s.resultLabel}>ay</Text>
              </View>
              <View style={s.resultDivider} />
              <View style={s.resultItem}>
                <Text style={s.resultNum}>{targetDate}</Text>
                <Text style={s.resultLabel}>hedefe ulaşma</Text>
              </View>
              <View style={s.resultDivider} />
              <View style={s.resultItem}>
                <Text style={s.resultNum}>%{pctPerMonth}</Text>
                <Text style={s.resultLabel}>aylık ilerleme</Text>
              </View>
            </View>

            {/* İlerleme çubuğu (1 ay sonra) */}
            <View style={s.progressTrack}>
              <View style={[s.progressFill, { width: `${Math.min(pctPerMonth, 100)}%` as any, backgroundColor: selected.color }]} />
            </View>
            <Text style={s.progressLabel}>Her ay bu kadar ilerlersiniz → {monthsNeeded} ayda hedefe ulaşırsınız</Text>

            {/* Hız artırma */}
            <Text style={s.boostTitle}>Biraz daha hızlanmak ister misiniz?</Text>
            <View style={s.boostRow}>
              {BOOSTS.map(b => (
                <TouchableOpacity
                  key={b.label}
                  style={[s.boostBtn, extraMonthly === b.extra && s.boostBtnActive]}
                  onPress={() => setExtra(prev => prev === b.extra ? 0 : b.extra)}
                  activeOpacity={0.8}
                >
                  <Text style={[s.boostLabel, extraMonthly === b.extra && s.boostLabelActive]}>{b.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {extraMonthly > 0 && (
              <Text style={s.boostResult}>
                ₺{extraMonthly.toLocaleString('tr-TR')} ekleyerek {Math.ceil(targetAmount / (totalMonthly))} ayda ulaşırsınız
              </Text>
            )}
          </View>
        )}

        {/* HEDEF OLUŞTUR BUTONU */}
        {targetAmount > 0 && (
          <TouchableOpacity style={[s.createBtn, { backgroundColor: selected.color }]} activeOpacity={0.85}>
            <Plus size={18} color="#fff" strokeWidth={2.5} />
            <Text style={s.createBtnText}>Hedef Oluştur</Text>
          </TouchableOpacity>
        )}

        {/* AKTİF HEDEFLER */}
        <Text style={[s.sectionTitle, { marginTop: 24 }]}>Aktif Hedefler</Text>
        {DEMO_GOALS.map(g => {
          const pct = Math.round((g.saved / g.target) * 100);
          return (
            <View key={g.id} style={s.activeGoalCard}>
              <View style={s.activeGoalTop}>
                <Target size={22} color={g.color} strokeWidth={1.8} />
                <View style={s.activeGoalInfo}>
                  <Text style={s.activeGoalLabel}>{g.label}</Text>
                  <Text style={s.activeGoalSub}>
                    ₺{g.saved.toLocaleString('tr-TR')} / ₺{g.target.toLocaleString('tr-TR')} · %{pct}
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.text3} strokeWidth={2} />
              </View>
              <View style={s.activeGoalTrack}>
                <View style={[s.activeGoalFill, { width: `${pct}%` as any, backgroundColor: g.color }]} />
              </View>
            </View>
          );
        })}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── STİLLER ──────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.bg },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 16 },

  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  backBtn:      { padding: 4 },
  headerTitle:  { flex: 1, fontSize: 17, fontWeight: '700', color: colors.text1 },
  aiBadge:      { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.purple + '18', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  aiBadgeText:  { color: colors.purple, fontSize: 11, fontWeight: '700' },

  sectionTitle: { fontSize: 15, fontWeight: '700', color: colors.text1, marginBottom: 12 },

  // Presets
  presetGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  presetCard:  { width: '47%', borderWidth: 1.5, borderRadius: 16, padding: 14, alignItems: 'center', gap: 4 },
  presetLabel: { fontSize: 13, fontWeight: '600' },
  presetAmount:{ fontSize: 12 },

  // Custom
  card:      { backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 16 },
  cardLabel: { color: colors.text2, fontSize: 12, marginBottom: 8 },
  amtInput:  { color: colors.text1, fontSize: 22, fontWeight: '700', paddingVertical: 4 },

  // Savings info
  savingsRow:     { flexDirection: 'row', backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 16, overflow: 'hidden' },
  savingsItem:    { flex: 1, padding: 16, alignItems: 'center' },
  savingsDivider: { width: 1, backgroundColor: colors.border },
  savingsLabel:   { color: colors.text3, fontSize: 11, marginBottom: 4 },
  savingsVal:     { color: colors.text1, fontSize: 16, fontWeight: '700' },

  // AI Card
  aiCard:       { backgroundColor: colors.purple + '10', borderWidth: 1, borderColor: colors.purple + '28', borderRadius: 16, padding: 16, marginBottom: 16 },
  aiCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
  aiCardTitle:  { color: colors.purple, fontSize: 13, fontWeight: '700' },

  resultRow:      { flexDirection: 'row', marginBottom: 14 },
  resultItem:     { flex: 1, alignItems: 'center' },
  resultDivider:  { width: 1, backgroundColor: colors.purple + '30' },
  resultNum:      { color: colors.text1, fontSize: 18, fontWeight: '800', marginBottom: 2 },
  resultLabel:    { color: colors.text3, fontSize: 11, textAlign: 'center' },

  progressTrack:  { height: 6, backgroundColor: colors.surface2, borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  progressFill:   { height: 6, borderRadius: 4 },
  progressLabel:  { color: colors.text3, fontSize: 11, marginBottom: 14 },

  boostTitle:     { color: colors.text2, fontSize: 12, fontWeight: '600', marginBottom: 8 },
  boostRow:       { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  boostBtn:       { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface1 },
  boostBtnActive: { borderColor: colors.purple, backgroundColor: colors.purple + '15' },
  boostLabel:     { fontSize: 12, color: colors.text2, fontWeight: '500' },
  boostLabelActive:{ color: colors.purple, fontWeight: '700' },
  boostResult:    { color: colors.purple, fontSize: 12, fontWeight: '600', marginTop: 10 },

  // Create button
  createBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 16, paddingVertical: 16, marginBottom: 8 },
  createBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Active goals
  activeGoalCard:  { backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 10 },
  activeGoalTop:   { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  activeGoalInfo:  { flex: 1 },
  activeGoalLabel: { color: colors.text1, fontSize: 14, fontWeight: '600', marginBottom: 2 },
  activeGoalSub:   { color: colors.text3, fontSize: 12 },
  activeGoalTrack: { height: 5, backgroundColor: colors.surface2, borderRadius: 4, overflow: 'hidden' },
  activeGoalFill:  { height: 5, borderRadius: 4 },
});
