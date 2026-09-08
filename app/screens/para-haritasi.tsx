import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Utensils, ShoppingBag, Car, Gamepad2, Zap, Heart, BookOpen, MoreHorizontal } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

const { width: SW } = Dimensions.get('window');
const MAP_W = SW - 40; // padding 20 her yanda

type Category = {
  id: string;
  label: string;
  Icon: any;
  color: string;
  amountTRY: number;
  pct: number; // 0-100
  txCount: number;
};

const CATEGORIES: Category[] = [
  { id: 'food',   label: 'Yemek',      Icon: Utensils,     color: '#F59E0B', amountTRY: 1240, pct: 26, txCount: 34 },
  { id: 'shop',   label: 'Alışveriş',  Icon: ShoppingBag,  color: '#EC4899', amountTRY: 890,  pct: 18, txCount: 12 },
  { id: 'ent',    label: 'Eğlence',    Icon: Gamepad2,     color: '#8B5CF6', amountTRY: 620,  pct: 13, txCount: 9  },
  { id: 'other',  label: 'Diğer',      Icon: MoreHorizontal,color:'#6B7280', amountTRY: 615,  pct: 13, txCount: 18 },
  { id: 'trans',  label: 'Ulaşım',     Icon: Car,          color: '#10B981', amountTRY: 480,  pct: 10, txCount: 22 },
  { id: 'bills',  label: 'Faturalar',  Icon: Zap,          color: '#6366F1', amountTRY: 475,  pct: 10, txCount: 6  },
  { id: 'health', label: 'Sağlık',     Icon: Heart,        color: '#EF4444', amountTRY: 280,  pct: 6,  txCount: 4  },
  { id: 'edu',    label: 'Eğitim',     Icon: BookOpen,     color: '#0EA5E9', amountTRY: 220,  pct: 4,  txCount: 3  },
];

const TOTAL = CATEGORIES.reduce((t, c) => t + c.amountTRY, 0);

function fmt(v: number) {
  return `₺ ${v.toLocaleString('tr-TR', { minimumFractionDigits: 0 })}`;
}

// ─── Treemap layout ───────────────────────────────────────────────
// Satır 1: food (geniş sol) + shop (dar sağ)  → yüksek karo
// Satır 2: ent + other                          → orta karo
// Satır 3: trans + bills + health + edu        → küçük karolar
const TILE_HEIGHT_BIG  = 130;
const TILE_HEIGHT_MID  = 100;
const TILE_HEIGHT_SMALL = 80;

export default function ParaHaritasiScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<Category | null>(null);

  function handleTile(cat: Category) {
    setSelected(prev => (prev?.id === cat.id ? null : cat));
  }

  // Satır 1: food + shop
  const row1L = CATEGORIES[0]; // 26%
  const row1R = CATEGORIES[1]; // 18%
  const row1LW = MAP_W * (row1L.pct / (row1L.pct + row1R.pct));
  const row1RW = MAP_W - row1LW - 4;

  // Satır 2: ent + other
  const row2L = CATEGORIES[2]; // 13%
  const row2R = CATEGORIES[3]; // 13%

  // Satır 3: dört küçük
  const smallW = (MAP_W - 12) / 4;

  function Tile({
    cat, width, height, style,
  }: { cat: Category; width: number | string; height: number; style?: any }) {
    const isSelected = selected?.id === cat.id;
    const { Icon } = cat;
    return (
      <TouchableOpacity
        onPress={() => handleTile(cat)}
        activeOpacity={0.85}
        style={[
          s.tile,
          { width, height, backgroundColor: cat.color + (isSelected ? 'EE' : '22'), borderColor: isSelected ? cat.color : cat.color + '44' },
          isSelected && { borderWidth: 2 },
          style,
        ]}
      >
        <Icon size={20} color={cat.color} strokeWidth={1.8} />
        <Text style={[s.tileLabel, { color: cat.color }]} numberOfLines={1}>{cat.label}</Text>
        <Text style={[s.tilePct, { color: cat.color }]}>{cat.pct}%</Text>
        {height >= 100 && (
          <Text style={[s.tileAmt, { color: cat.color }]}>{fmt(cat.amountTRY)}</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text1} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={s.title}>Para Haritası</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Özet */}
        <View style={s.summaryRow}>
          <View>
            <Text style={s.summaryLabel}>Eylül 2026 · Toplam</Text>
            <Text style={s.summaryTotal}>{fmt(TOTAL)}</Text>
          </View>
          <View style={s.monthBadge}>
            <Text style={s.monthBadgeText}>8 kategori</Text>
          </View>
        </View>

        {/* ── Harita ── */}
        <View style={s.map}>
          {/* Satır 1 */}
          <View style={s.mapRow}>
            <Tile cat={row1L} width={row1LW} height={TILE_HEIGHT_BIG} />
            <Tile cat={row1R} width={row1RW} height={TILE_HEIGHT_BIG} />
          </View>
          {/* Satır 2 */}
          <View style={s.mapRow}>
            <Tile cat={row2L} width={(MAP_W - 4) / 2} height={TILE_HEIGHT_MID} />
            <Tile cat={row2R} width={(MAP_W - 4) / 2} height={TILE_HEIGHT_MID} />
          </View>
          {/* Satır 3 */}
          <View style={s.mapRow}>
            {CATEGORIES.slice(4).map((cat, i) => (
              <Tile key={cat.id} cat={cat} width={smallW} height={TILE_HEIGHT_SMALL} />
            ))}
          </View>
        </View>

        {/* ── Seçili kategori detayı ── */}
        {selected && (
          <View style={[s.detailCard, { borderColor: selected.color + '55' }]}>
            <View style={[s.detailIconBox, { backgroundColor: selected.color + '18' }]}>
              <selected.Icon size={24} color={selected.color} strokeWidth={1.8} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.detailName}>{selected.label}</Text>
              <Text style={s.detailSub}>{selected.txCount} işlem · %{selected.pct} pay</Text>
            </View>
            <Text style={[s.detailAmount, { color: selected.color }]}>{fmt(selected.amountTRY)}</Text>
          </View>
        )}

        {/* ── Sıralı liste ── */}
        <Text style={s.listTitle}>Sıralama</Text>
        <View style={s.listCard}>
          {CATEGORIES.map((cat, i) => (
            <View key={cat.id}>
              {i > 0 && <View style={s.divider} />}
              <TouchableOpacity
                style={s.listRow}
                onPress={() => handleTile(cat)}
                activeOpacity={0.75}
              >
                <Text style={s.rankNum}>{i + 1}</Text>
                <View style={[s.listDot, { backgroundColor: cat.color }]} />
                <Text style={s.listLabel}>{cat.label}</Text>
                <View style={s.barTrack}>
                  <View style={[s.barFill, { width: `${cat.pct}%` as any, backgroundColor: cat.color }]} />
                </View>
                <Text style={s.listPct}>{cat.pct}%</Text>
                <Text style={s.listAmt}>{fmt(cat.amountTRY)}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.bg },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8 },
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  title:   { color: colors.text1, fontSize: 17, fontWeight: '700' },

  summaryRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  summaryLabel: { color: colors.text3, fontSize: 12, fontWeight: '600', marginBottom: 2 },
  summaryTotal: { color: colors.text1, fontSize: 26, fontWeight: '900' },
  monthBadge:   { backgroundColor: colors.surface1, borderRadius: 10, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 6 },
  monthBadgeText:{ color: colors.text2, fontSize: 13, fontWeight: '600' },

  map:    { gap: 4, marginBottom: 16 },
  mapRow: { flexDirection: 'row', gap: 4 },

  tile:      { borderRadius: 14, borderWidth: 1, padding: 10, gap: 4, justifyContent: 'flex-end' },
  tileLabel: { fontSize: 12, fontWeight: '700' },
  tilePct:   { fontSize: 18, fontWeight: '900' },
  tileAmt:   { fontSize: 12, fontWeight: '600', opacity: 0.8 },

  detailCard:    { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 20 },
  detailIconBox: { width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  detailName:    { color: colors.text1, fontSize: 15, fontWeight: '700' },
  detailSub:     { color: colors.text3, fontSize: 12, marginTop: 2 },
  detailAmount:  { fontSize: 17, fontWeight: '900' },

  listTitle: { color: colors.text1, fontSize: 16, fontWeight: '700', marginBottom: 12 },
  listCard:  { backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  divider:   { height: 1, backgroundColor: colors.border, marginHorizontal: 16 },
  listRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 12 },
  rankNum:   { color: colors.text3, fontSize: 12, fontWeight: '700', width: 16 },
  listDot:   { width: 8, height: 8, borderRadius: 4 },
  listLabel: { color: colors.text1, fontSize: 13, fontWeight: '600', width: 70 },
  barTrack:  { flex: 1, height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  barFill:   { height: 6, borderRadius: 3 },
  listPct:   { color: colors.text3, fontSize: 12, width: 30, textAlign: 'right' },
  listAmt:   { color: colors.text1, fontSize: 13, fontWeight: '700', width: 70, textAlign: 'right' },
});
