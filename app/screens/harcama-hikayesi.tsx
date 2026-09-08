import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShoppingBag, Utensils, Car, Gamepad2, Zap, TrendingDown, TrendingUp, Star } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

const { width: SW } = Dimensions.get('window');

type Slide = {
  id: string;
  bg: string;
  accent: string;
  label: string;
  headline: string;
  value: string;
  sub: string;
  Icon: any;
  extra?: string;
};

const SLIDES: Slide[] = [
  {
    id: 'total',
    bg: '#6366F1',
    accent: '#fff',
    label: 'EYLÜL 2026',
    headline: 'Bu ay toplam',
    value: '₺ 4.820',
    sub: 'harcadın',
    Icon: Star,
    extra: 'Geçen aya göre ₺ 340 daha az 🎉',
  },
  {
    id: 'top-category',
    bg: '#F59E0B',
    accent: '#fff',
    label: 'EN ÇOK HARCAMA',
    headline: 'Kategori',
    value: 'Yemek & İçecek',
    sub: '₺ 1.240 · %26 pay',
    Icon: Utensils,
    extra: 'Ayda 34 yemek siparişi verdin 🍕',
  },
  {
    id: 'top-day',
    bg: '#EF4444',
    accent: '#fff',
    label: 'EN PAHALI GÜN',
    headline: '12 Eylül',
    value: '₺ 620',
    sub: 'tek günde harcandı',
    Icon: ShoppingBag,
    extra: 'AVM alışverişi + akşam yemeği 🛍️',
  },
  {
    id: 'transport',
    bg: '#10B981',
    accent: '#fff',
    label: 'ULAŞIM',
    headline: 'Bu ay',
    value: '₺ 480',
    sub: 'ulaşıma harcandı',
    Icon: Car,
    extra: 'Geçen aya göre %12 daha az ✅',
  },
  {
    id: 'subscriptions',
    bg: '#8B5CF6',
    accent: '#fff',
    label: 'ABONELİKLER',
    headline: 'Aylık toplam',
    value: '₺ 475',
    sub: '6 aktif abonelik',
    Icon: Zap,
    extra: 'Disney+ ve BluTV iptal edilebilir 💡',
  },
  {
    id: 'compare',
    bg: '#0EA5E9',
    accent: '#fff',
    label: 'AYLIK KARŞILAŞTIRMA',
    headline: 'Ağustos\'tan bu yana',
    value: '−₺ 340',
    sub: 'daha az harcadın',
    Icon: TrendingDown,
    extra: 'Harika gidiyorsun! Böyle devam 💪',
  },
];

function fmt(v: number) {
  return `₺ ${v.toLocaleString('tr-TR')}`;
}

export default function HarcamaHikayesiScreen() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const flatRef = useRef<FlatList>(null);

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SW);
    setCurrent(idx);
  }

  function goNext() {
    if (current < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: current + 1, animated: true });
    }
  }

  function goPrev() {
    if (current > 0) {
      flatRef.current?.scrollToIndex({ index: current - 1, animated: true });
    }
  }

  const slide = SLIDES[current];

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: slide.bg }]} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color='#fff' strokeWidth={2} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Harcama Hikayesi</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress dots */}
      <View style={s.dotsRow}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[s.dot, i === current && s.dotActive]} />
        ))}
      </View>

      {/* Slides */}
      <FlatList
        ref={flatRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[s.slide, { backgroundColor: item.bg }]}>
            <View style={s.slideInner}>
              <View style={s.iconCircle}>
                <item.Icon size={38} color={item.bg} strokeWidth={1.8} />
              </View>
              <Text style={s.slideLabel}>{item.label}</Text>
              <Text style={s.slideHeadline}>{item.headline}</Text>
              <Text style={s.slideValue}>{item.value}</Text>
              <Text style={s.slideSub}>{item.sub}</Text>
              {item.extra && (
                <View style={s.extraBox}>
                  <Text style={s.extraText}>{item.extra}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      />

      {/* Nav buttons */}
      <View style={s.navRow}>
        <TouchableOpacity
          style={[s.navBtn, current === 0 && s.navBtnDisabled]}
          onPress={goPrev}
          activeOpacity={0.75}
          disabled={current === 0}
        >
          <Text style={s.navBtnText}>← Önceki</Text>
        </TouchableOpacity>
        {current < SLIDES.length - 1 ? (
          <TouchableOpacity style={s.navBtnPrimary} onPress={goNext} activeOpacity={0.8}>
            <Text style={s.navBtnPrimaryText}>Sonraki →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={s.navBtnPrimary} onPress={() => router.back()} activeOpacity={0.8}>
            <Text style={s.navBtnPrimaryText}>Bitti ✓</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 4, paddingBottom: 12 },
  backBtn:{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#ffffff22', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '700', opacity: 0.9 },

  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 12 },
  dot:     { width: 24, height: 3, borderRadius: 2, backgroundColor: '#ffffff44' },
  dotActive:{ backgroundColor: '#fff', width: 32 },

  slide:      { width: SW, flex: 1, paddingHorizontal: 32 },
  slideInner: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  iconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
  slideLabel:   { color: '#ffffff99', fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  slideHeadline:{ color: '#ffffffcc', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  slideValue:   { color: '#fff', fontSize: 42, fontWeight: '900', textAlign: 'center', letterSpacing: -1 },
  slideSub:     { color: '#ffffffcc', fontSize: 16, textAlign: 'center', fontWeight: '500' },
  extraBox:     { marginTop: 8, backgroundColor: '#ffffff22', borderRadius: 14, paddingHorizontal: 20, paddingVertical: 12 },
  extraText:    { color: '#fff', fontSize: 14, fontWeight: '600', textAlign: 'center', lineHeight: 20 },

  navRow:         { flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingBottom: 24, paddingTop: 16 },
  navBtn:         { flex: 1, paddingVertical: 13, borderRadius: 14, borderWidth: 1, borderColor: '#ffffff44', alignItems: 'center' },
  navBtnDisabled: { opacity: 0.3 },
  navBtnText:     { color: '#fff', fontSize: 15, fontWeight: '600' },
  navBtnPrimary:  { flex: 1, paddingVertical: 13, borderRadius: 14, backgroundColor: '#fff', alignItems: 'center' },
  navBtnPrimaryText: { fontSize: 15, fontWeight: '700', color: '#333' },
});
