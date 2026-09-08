import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Utensils, ShoppingBag, Car, Gamepad2, Zap, Heart, BookOpen, MoreHorizontal, TrendingDown, TrendingUp, Users } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

// ─── DATA ─────────────────────────────────────────────────────────
type AgeGroup = '18-24' | '25-34' | '35-44' | '45+';

type CategoryData = {
  id: string;
  label: string;
  Icon: any;
  color: string;
  userAmount: number;
  avgAmounts: Record<AgeGroup, number>;
};

const AGE_GROUPS: AgeGroup[] = ['18-24', '25-34', '35-44', '45+'];

const CATEGORIES: CategoryData[] = [
  { id: 'food',   label: 'Yemek',      Icon: Utensils,      color: '#F59E0B', userAmount: 1240, avgAmounts: { '18-24': 980,  '25-34': 1120, '35-44': 1350, '45+': 1100 } },
  { id: 'shop',   label: 'Alışveriş',  Icon: ShoppingBag,   color: '#EC4899', userAmount: 890,  avgAmounts: { '18-24': 1200, '25-34': 1050, '35-44': 900,  '45+': 760  } },
  { id: 'trans',  label: 'Ulaşım',     Icon: Car,           color: '#10B981', userAmount: 480,  avgAmounts: { '18-24': 620,  '25-34': 540,  '35-44': 490,  '45+': 420  } },
  { id: 'ent',    label: 'Eğlence',    Icon: Gamepad2,      color: '#8B5CF6', userAmount: 620,  avgAmounts: { '18-24': 850,  '25-34': 720,  '35-44': 580,  '45+': 440  } },
  { id: 'bills',  label: 'Faturalar',  Icon: Zap,           color: '#6366F1', userAmount: 475,  avgAmounts: { '18-24': 380,  '25-34': 460,  '35-44': 520,  '45+': 590  } },
  { id: 'health', label: 'Sağlık',     Icon: Heart,         color: '#EF4444', userAmount: 280,  avgAmounts: { '18-24': 180,  '25-34': 260,  '35-44': 380,  '45+': 520  } },
  { id: 'edu',    label: 'Eğitim',     Icon: BookOpen,      color: '#0EA5E9', userAmount: 220,  avgAmounts: { '18-24': 480,  '25-34': 320,  '35-44': 180,  '45+': 90   } },
  { id: 'other',  label: 'Diğer',      Icon: MoreHorizontal,color: '#6B7280', userAmount: 615,  avgAmounts: { '18-24': 520,  '25-34': 580,  '35-44': 640,  '45+': 700  } },
];

function fmt(v: number) {
  return `₺${v.toLocaleString('tr-TR', { minimumFractionDigits: 0 })}`;
}

function pctDiff(user: number, avg: number): { text: string; up: boolean } {
  const diff = ((user - avg) / avg) * 100;
  const abs = Math.abs(diff).toFixed(0);
  if (diff <= -5) return { text: `%${abs} az`, up: false };
  if (diff >= 5)  return { text: `%${abs} fazla`, up: true };
  return { text: 'Ortalama', up: false };
}

// ─── EKRAN ────────────────────────────────────────────────────────
export default function KarsilastirmaScreen() {
  const router = useRouter();
  const [activeGroup, setActiveGroup] = useState<AgeGroup>('25-34');

  const userTotal = CATEGORIES.reduce((s, c) => s + c.userAmount, 0);
  const avgTotal  = CATEGORIES.reduce((s, c) => s + c.avgAmounts[activeGroup], 0);
  const totalDiff = pctDiff(userTotal, avgTotal);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text1} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={s.title}>Harcama Karşılaştır</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Yaş grubu seçici */}
        <View style={s.groupCard}>
          <View style={s.groupHeader}>
            <Users size={14} color={colors.text3} strokeWidth={2} />
            <Text style={s.groupLabel}>Yaş grubu seç</Text>
          </View>
          <View style={s.groupRow}>
            {AGE_GROUPS.map(g => (
              <TouchableOpacity
                key={g}
                style={[s.groupBtn, activeGroup === g && s.groupBtnActive]}
                onPress={() => setActiveGroup(g)}
                activeOpacity={0.75}
              >
                <Text style={[s.groupBtnText, activeGroup === g && s.groupBtnTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Toplam özet */}
        <View style={s.summaryCard}>
          <View style={s.summaryCol}>
            <Text style={s.summarySmall}>Senin toplamın</Text>
            <Text style={s.summaryBig}>{fmt(userTotal)}</Text>
          </View>
          <View style={s.summaryDivider} />
          <View style={s.summaryCol}>
            <Text style={s.summarySmall}>{activeGroup} yaş ort.</Text>
            <Text style={[s.summaryBig, { color: colors.text2 }]}>{fmt(avgTotal)}</Text>
          </View>
        </View>

        {/* Fark badge */}
        <View style={[
          s.diffBadge,
          { backgroundColor: totalDiff.up ? colors.error + '15' : colors.success + '15', borderColor: totalDiff.up ? colors.error + '44' : colors.success + '44' }
        ]}>
          {totalDiff.up
            ? <TrendingUp size={15} color={colors.error} strokeWidth={2} />
            : <TrendingDown size={15} color={colors.success} strokeWidth={2} />
          }
          <Text style={[s.diffText, { color: totalDiff.up ? colors.error : colors.success }]}>
            {totalDiff.up
              ? `Yaş grubundan ${totalDiff.text} harcıyorsun`
              : `Yaş grubundan ${totalDiff.text} harcıyorsun 🎉`
            }
          </Text>
        </View>

        {/* Kategori karşılaştırması */}
        <Text style={s.sectionTitle}>Kategoriler</Text>
        <View style={s.catCard}>
          {CATEGORIES.map((cat, i) => {
            const avg = cat.avgAmounts[activeGroup];
            const maxVal = Math.max(cat.userAmount, avg);
            const userPct = cat.userAmount / maxVal;
            const avgPct  = avg / maxVal;
            const diff = pctDiff(cat.userAmount, avg);
            const { Icon } = cat;

            return (
              <View key={cat.id}>
                {i > 0 && <View style={s.divider} />}
                <View style={s.catRow}>
                  {/* İkon */}
                  <View style={[s.catIcon, { backgroundColor: cat.color + '18' }]}>
                    <Icon size={16} color={cat.color} strokeWidth={1.8} />
                  </View>

                  {/* Bilgi + barlar */}
                  <View style={{ flex: 1 }}>
                    <View style={s.catTopRow}>
                      <Text style={s.catLabel}>{cat.label}</Text>
                      <View style={[s.miniDiff, {
                        backgroundColor: diff.up ? colors.error + '15' : diff.text === 'Ortalama' ? colors.border : colors.success + '15'
                      }]}>
                        <Text style={[s.miniDiffText, {
                          color: diff.up ? colors.error : diff.text === 'Ortalama' ? colors.text3 : colors.success
                        }]}>
                          {diff.text}
                        </Text>
                      </View>
                    </View>

                    {/* Sen bar */}
                    <View style={s.barRow}>
                      <Text style={s.barLabelLeft}>Sen</Text>
                      <View style={s.barTrack}>
                        <View style={[s.barFill, { width: `${userPct * 100}%` as any, backgroundColor: cat.color }]} />
                      </View>
                      <Text style={s.barAmt}>{fmt(cat.userAmount)}</Text>
                    </View>

                    {/* Ort bar */}
                    <View style={s.barRow}>
                      <Text style={s.barLabelLeft}>Ort</Text>
                      <View style={s.barTrack}>
                        <View style={[s.barFill, { width: `${avgPct * 100}%` as any, backgroundColor: colors.text3 }]} />
                      </View>
                      <Text style={[s.barAmt, { color: colors.text3 }]}>{fmt(avg)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Insight kutusu */}
        <View style={s.insightCard}>
          <Text style={s.insightTitle}>💡 Öne çıkan</Text>
          <Text style={s.insightText}>
            {activeGroup === '18-24'
              ? 'Eğitime harcamanı artırabilirsin — yaş grubun senden %118 fazla harcıyor.'
              : activeGroup === '25-34'
              ? 'Alışveriş harcaman yaş grubundan %15 düşük — harika bir denge!'
              : activeGroup === '35-44'
              ? 'Sağlık harcamaların ortalamanın altında, düzenli kontroller önerilir.'
              : 'Eğlence ve ulaşım harcamalarında yaş grubuna göre belirgin tasarruf yapıyorsun.'
            }
          </Text>
        </View>

        <View style={{ height: 40 }} />
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

  groupCard:   { backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 14 },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  groupLabel:  { color: colors.text3, fontSize: 12, fontWeight: '600' },
  groupRow:    { flexDirection: 'row', gap: 8 },
  groupBtn:    { flex: 1, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: colors.border, alignItems: 'center', backgroundColor: colors.bg },
  groupBtnActive: { backgroundColor: colors.purple, borderColor: colors.purple },
  groupBtnText:   { color: colors.text2, fontSize: 13, fontWeight: '600' },
  groupBtnTextActive: { color: '#fff' },

  summaryCard:    { flexDirection: 'row', backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 10 },
  summaryCol:     { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, backgroundColor: colors.border, marginVertical: 4 },
  summarySmall:   { color: colors.text3, fontSize: 11, fontWeight: '600', marginBottom: 4 },
  summaryBig:     { color: colors.text1, fontSize: 20, fontWeight: '800' },

  diffBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 20 },
  diffText:  { fontSize: 13, fontWeight: '600', flex: 1 },

  sectionTitle: { color: colors.text1, fontSize: 16, fontWeight: '700', marginBottom: 12 },

  catCard: { backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginBottom: 16 },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 14 },
  catRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14 },
  catIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginTop: 2 },

  catTopRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  catLabel:    { color: colors.text1, fontSize: 13, fontWeight: '600' },
  miniDiff:    { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  miniDiffText:{ fontSize: 11, fontWeight: '700' },

  barRow:      { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  barLabelLeft:{ color: colors.text3, fontSize: 10, fontWeight: '600', width: 22 },
  barTrack:    { flex: 1, height: 5, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  barFill:     { height: 5, borderRadius: 3 },
  barAmt:      { color: colors.text1, fontSize: 11, fontWeight: '700', width: 54, textAlign: 'right' },

  insightCard:  { backgroundColor: colors.purple + '12', borderRadius: 16, borderWidth: 1, borderColor: colors.purple + '33', padding: 16 },
  insightTitle: { color: colors.text1, fontSize: 14, fontWeight: '700', marginBottom: 6 },
  insightText:  { color: colors.text2, fontSize: 13, lineHeight: 19 },
});
