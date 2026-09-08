import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Smartphone, Wifi } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

type Pack = {
  id: string; label: string; detail: string; priceTRY: number; popular?: boolean; type: 'tl' | 'paket';
};

const GSM_PACKS: Pack[] = [
  { id: 'tl10',  label: '10 TL',         detail: 'Bakiye yükleme',           priceTRY: 10,  type: 'tl'    },
  { id: 'tl25',  label: '25 TL',         detail: 'Bakiye yükleme',           priceTRY: 25,  type: 'tl'    },
  { id: 'tl50',  label: '50 TL',         detail: 'Bakiye yükleme',           priceTRY: 50,  type: 'tl',  popular: true },
  { id: 'tl100', label: '100 TL',        detail: 'Bakiye yükleme',           priceTRY: 100, type: 'tl'    },
  { id: 'p1',    label: '3 GB · 7 gün',  detail: 'Ek internet paketi',       priceTRY: 39,  type: 'paket' },
  { id: 'p2',    label: '10 GB · 30 gün',detail: 'Aylık internet paketi',    priceTRY: 89,  type: 'paket', popular: true },
  { id: 'p3',    label: '20 GB · 30 gün',detail: 'Büyük internet paketi',    priceTRY: 149, type: 'paket' },
  { id: 'p4',    label: 'Sınırsız',      detail: 'Sınırsız internet paketi', priceTRY: 229, type: 'paket' },
];

type Tab = 'tl' | 'paket';

function fmt(v: number) {
  return `₺ ${v.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function GsmScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('tl');
  const [selected, setSelected] = useState<string | null>(null);

  const items = GSM_PACKS.filter(p => p.type === tab);

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text1} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={s.title}>GSM</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tab seçici */}
      <View style={s.tabRow}>
        <TouchableOpacity
          style={[s.tabBtn, tab === 'tl' && s.tabBtnActive]}
          onPress={() => { setTab('tl'); setSelected(null); }}
          activeOpacity={0.7}
        >
          <Smartphone size={15} color={tab === 'tl' ? '#fff' : colors.text3} strokeWidth={2} />
          <Text style={[s.tabText, tab === 'tl' && s.tabTextActive]}>TL Yükle</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.tabBtn, tab === 'paket' && s.tabBtnActive]}
          onPress={() => { setTab('paket'); setSelected(null); }}
          activeOpacity={0.7}
        >
          <Wifi size={15} color={tab === 'paket' ? '#fff' : colors.text3} strokeWidth={2} />
          <Text style={[s.tabText, tab === 'paket' && s.tabTextActive]}>İnternet Paketi</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.grid}>
          {items.map(pack => {
            const isSelected = selected === pack.id;
            return (
              <TouchableOpacity
                key={pack.id}
                style={[s.packCard, isSelected && s.packCardSelected]}
                onPress={() => setSelected(isSelected ? null : pack.id)}
                activeOpacity={0.75}
              >
                {pack.popular && (
                  <View style={s.popularBadge}>
                    <Text style={s.popularText}>Popüler</Text>
                  </View>
                )}
                <Text style={s.packLabel}>{pack.label}</Text>
                <Text style={s.packDetail}>{pack.detail}</Text>
                <Text style={[s.packPrice, isSelected && s.packPriceSelected]}>{fmt(pack.priceTRY)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selected && (
          <TouchableOpacity style={s.buyBtn} activeOpacity={0.8}>
            <Text style={s.buyBtnText}>
              {fmt(GSM_PACKS.find(p => p.id === selected)!.priceTRY)} Öde
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.bg },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  title:   { color: colors.text1, fontSize: 17, fontWeight: '700' },

  tabRow:        { flexDirection: 'row', marginHorizontal: 20, marginBottom: 4, backgroundColor: colors.surface1, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 4, gap: 4 },
  tabBtn:        { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
  tabBtnActive:  { backgroundColor: '#10B981' },
  tabText:       { color: colors.text3, fontSize: 14, fontWeight: '700' },
  tabTextActive: { color: '#fff' },

  grid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  packCard: {
    width: '47%', backgroundColor: colors.surface1, borderRadius: 18,
    borderWidth: 1, borderColor: colors.border, padding: 16, gap: 4,
  },
  packCardSelected: { borderColor: '#10B981', borderWidth: 2, backgroundColor: '#10B98108' },
  popularBadge:  { alignSelf: 'flex-start', backgroundColor: '#10B98118', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2, marginBottom: 4 },
  popularText:   { color: '#10B981', fontSize: 10, fontWeight: '700' },
  packLabel:     { color: colors.text1, fontSize: 15, fontWeight: '800' },
  packDetail:    { color: colors.text3, fontSize: 12, marginTop: 1 },
  packPrice:     { color: colors.text1, fontSize: 18, fontWeight: '900', marginTop: 8 },
  packPriceSelected: { color: '#10B981' },

  buyBtn:     { marginTop: 20, backgroundColor: '#10B981', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  buyBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
