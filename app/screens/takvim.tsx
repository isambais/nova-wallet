import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronLeft, ChevronRight, RefreshCcw, X } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

const SW = Dimensions.get('window').width;

// ─── SABIT VERİ (Eylül 2026) ─────────────────────────────────────
type TxItem = { title: string; amountTRY: number; category: string };
type DayData = { spent: number; isSub?: boolean; txs: TxItem[] };

const FIXED_DATA: Record<string, Record<number, DayData>> = {
  '2026-9': {
    1:  { spent: 85,  txs: [{ title: 'Kahvaltı Cafe', amountTRY: 85,  category: 'Yemek' }] },
    3:  { spent: 210, txs: [{ title: 'Market', amountTRY: 155, category: 'Alışveriş' }, { title: 'Taksi', amountTRY: 55, category: 'Ulaşım' }] },
    4:  { spent: 49,  isSub: true, txs: [{ title: 'Spotify Premium', amountTRY: 49, category: 'Abonelik' }] },
    5:  { spent: 125, txs: [{ title: 'Öğle Yemeği', amountTRY: 75, category: 'Yemek' }, { title: 'Metro', amountTRY: 50, category: 'Ulaşım' }] },
    7:  { spent: 340, txs: [{ title: 'Kıyafet', amountTRY: 280, category: 'Alışveriş' }, { title: 'Kahve', amountTRY: 60, category: 'Yemek' }] },
    8:  { spent: 180, isSub: true, txs: [{ title: 'Netflix', amountTRY: 149, category: 'Abonelik' }, { title: 'Akşam Yemeği', amountTRY: 31, category: 'Yemek' }] },
    9:  { spent: 95,  txs: [{ title: 'Eczane', amountTRY: 95, category: 'Sağlık' }] },
    11: { spent: 190, txs: [{ title: 'Sinema', amountTRY: 120, category: 'Eğlence' }, { title: 'Taksi', amountTRY: 70, category: 'Ulaşım' }] },
    12: { spent: 620, txs: [{ title: 'AVM Alışveriş', amountTRY: 490, category: 'Alışveriş' }, { title: 'Restoran', amountTRY: 130, category: 'Yemek' }] },
    13: { spent: 55,  txs: [{ title: 'Kahvaltı', amountTRY: 55, category: 'Yemek' }] },
    15: { spent: 299, isSub: true, txs: [{ title: 'İnternet Faturası', amountTRY: 299, category: 'Abonelik' }] },
    16: { spent: 145, txs: [{ title: 'Kitap', amountTRY: 95, category: 'Eğitim' }, { title: 'Öğle', amountTRY: 50, category: 'Yemek' }] },
    17: { spent: 270, txs: [{ title: 'Konser Bileti', amountTRY: 270, category: 'Eğlence' }] },
    19: { spent: 89,  isSub: true, txs: [{ title: 'Disney+', amountTRY: 89, category: 'Abonelik' }] },
    20: { spent: 165, txs: [{ title: 'Market', amountTRY: 165, category: 'Alışveriş' }] },
    21: { spent: 320, txs: [{ title: 'Elektrik Faturası', amountTRY: 320, category: 'Faturalar' }] },
    22: { spent: 78,  txs: [{ title: 'Fastfood', amountTRY: 78, category: 'Yemek' }] },
    24: { spent: 200, txs: [{ title: 'Spor Salonu', amountTRY: 200, category: 'Sağlık' }] },
    25: { spent: 115, txs: [{ title: 'Akşam Yemeği', amountTRY: 115, category: 'Yemek' }] },
    26: { spent: 69,  isSub: true, txs: [{ title: 'BluTV', amountTRY: 69, category: 'Abonelik' }] },
    28: { spent: 185, txs: [{ title: 'Online Alışveriş', amountTRY: 185, category: 'Alışveriş' }] },
    29: { spent: 92,  txs: [{ title: 'Taksi + Kahve', amountTRY: 92, category: 'Ulaşım' }] },
    30: { spent: 45,  txs: [{ title: 'Atıştırmalık', amountTRY: 45, category: 'Yemek' }] },
  },
};

// Diğer aylar için deterministik mock üreticisi
function mockForDay(year: number, month: number, day: number): DayData {
  const seed = (year * 100 + month) * 31 + day;
  const r = (n: number) => ((seed * 1103515245 + n * 12345) & 0x7fffffff) % 1000;
  const skip = r(1) < 350; // ~%35 boş gün
  if (skip) return { spent: 0, txs: [] };
  const isSub = day === 4 || day === 8 || day === 15 || day === 19 || day === 26;
  const base = 50 + r(2) * 5;
  const cats = ['Yemek', 'Alışveriş', 'Ulaşım', 'Eğlence', 'Sağlık'];
  const cat = cats[r(3) % cats.length];
  const titles: Record<string, string[]> = {
    'Yemek':     ['Restoran', 'Kahvaltı', 'Market', 'Fastfood'],
    'Alışveriş': ['Kıyafet', 'Online Sipariş', 'Market', 'Elektronik'],
    'Ulaşım':    ['Taksi', 'Metro', 'Otobüs', 'Yakıt'],
    'Eğlence':   ['Sinema', 'Konser', 'Oyun', 'Etkinlik'],
    'Sağlık':    ['Eczane', 'Doktor', 'Spor Salonu', 'Vitamin'],
  };
  const title = titles[cat][r(4) % 4];
  return {
    spent: isSub ? 49 + r(5) % 200 : base,
    isSub,
    txs: [{ title: isSub ? ['Spotify', 'Netflix', 'Disney+', 'BluTV', 'İnternet'][r(6) % 5] : title, amountTRY: isSub ? 49 + r(5) % 200 : base, category: isSub ? 'Abonelik' : cat }],
  };
}

function getDayData(year: number, month: number, day: number): DayData {
  const key = `${year}-${month}`;
  return FIXED_DATA[key]?.[day] ?? mockForDay(year, month, day);
}

// ─── YARDIMCI ─────────────────────────────────────────────────────
const MONTH_TR = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
const DAY_LABELS = ['Pt','Sa','Ça','Pe','Cu','Ct','Pz'];
const CATEGORY_COLOR: Record<string, string> = {
  'Yemek':'#F59E0B','Alışveriş':'#EC4899','Ulaşım':'#10B981',
  'Eğlence':'#8B5CF6','Abonelik':'#6366F1','Sağlık':'#EF4444',
  'Eğitim':'#0EA5E9','Faturalar':'#F97316',
};

function daysInMonth(y: number, m: number) { return new Date(y, m, 0).getDate(); }
// JS Date: 0=Pzt,...,6=Pz için dönüşüm (0=Sun natively)
function firstDayOffset(y: number, m: number) {
  const d = new Date(y, m - 1, 1).getDay(); // 0=Sun
  return d === 0 ? 6 : d - 1; // Pt=0
}

function heatColor(spent: number) {
  if (spent === 0)   return null;
  if (spent < 100)   return '#10B981';
  if (spent < 250)   return '#F59E0B';
  if (spent < 400)   return '#EF4444';
  return '#7C3AED';
}

function fmt(v: number) { return `₺ ${v.toLocaleString('tr-TR', { minimumFractionDigits: 0 })}`; }

const MIN_YEAR = 2020;
const MAX_YEAR = 2030;
const YEARS = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i);

// ─── EKRAN ────────────────────────────────────────────────────────
export default function TakvimScreen() {
  const router = useRouter();
  const today = new Date();
  const [year, setYear]  = useState(2026);
  const [month, setMonth] = useState(9);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const totalDays = daysInMonth(year, month);
  const offset    = firstDayOffset(year, month);

  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthData: Record<number, DayData> = {};
  for (let d = 1; d <= totalDays; d++) monthData[d] = getDayData(year, month, d);

  const totalSpent = Object.values(monthData).reduce((t, d) => t + d.spent, 0);
  const activeDays = Object.values(monthData).filter(d => d.spent > 0).length;
  const subDays    = Object.values(monthData).filter(d => d.isSub).length;

  const selData = selectedDay ? monthData[selectedDay] : null;

  function prevMonth() {
    if (month === 1) { setYear(y => Math.max(MIN_YEAR, y - 1)); setMonth(12); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  }
  function nextMonth() {
    if (month === 12) { setYear(y => Math.min(MAX_YEAR, y + 1)); setMonth(1); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text1} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={s.title}>Para Akışı Takvimi</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Ay + Yıl navigasyon */}
        <View style={s.monthNav}>
          <TouchableOpacity style={s.navArrow} onPress={prevMonth}>
            <ChevronLeft size={20} color={colors.text2} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPickerOpen(true)} activeOpacity={0.75}>
            <Text style={s.monthText}>{MONTH_TR[month - 1]} {year}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.navArrow} onPress={nextMonth}>
            <ChevronRight size={20} color={colors.text2} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Özet */}
        <View style={s.summaryRow}>
          <View style={s.summaryBox}>
            <Text style={s.summaryLabel}>Toplam</Text>
            <Text style={s.summaryValue}>{fmt(totalSpent)}</Text>
          </View>
          <View style={s.summaryDivider} />
          <View style={s.summaryBox}>
            <Text style={s.summaryLabel}>Harcamalı Gün</Text>
            <Text style={s.summaryValue}>{activeDays}</Text>
          </View>
          <View style={s.summaryDivider} />
          <View style={s.summaryBox}>
            <Text style={s.summaryLabel}>Abonelik</Text>
            <Text style={s.summaryValue}>{subDays} gün</Text>
          </View>
        </View>

        {/* Legend */}
        <View style={s.legend}>
          {[['#10B981','< ₺100'],['#F59E0B','< ₺250'],['#EF4444','< ₺400'],['#7C3AED','₺400+']] .map(([c,l]) => (
            <View key={l} style={s.legendItem}>
              <View style={[s.legendDot,{ backgroundColor: c }]} />
              <Text style={s.legendText}>{l}</Text>
            </View>
          ))}
          <View style={s.legendItem}>
            <RefreshCcw size={9} color='#6366F1' strokeWidth={2.5} />
            <Text style={s.legendText}>Abonelik</Text>
          </View>
        </View>

        {/* Takvim */}
        <View style={s.calCard}>
          <View style={s.dayLabels}>
            {DAY_LABELS.map(d => <Text key={d} style={s.dayLabel}>{d}</Text>)}
          </View>
          <View style={s.grid}>
            {cells.map((day, idx) => {
              if (day === null) return <View key={`e-${idx}`} style={s.cell} />;
              const data  = monthData[day];
              const heat  = heatColor(data.spent);
              const isSel = selectedDay === day;
              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    s.cell,
                    heat && { backgroundColor: heat + '28' },
                    isSel && { backgroundColor: (heat ?? colors.border) + (heat ? '55' : ''), borderColor: heat ?? colors.text3, borderWidth: 1.5 },
                  ]}
                  onPress={() => setSelectedDay(isSel ? null : day)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.dayNum, isSel && s.dayNumSel]}>{day}</Text>
                  {heat && <View style={[s.heatDot,{ backgroundColor: heat }]} />}
                  {data.isSub && <RefreshCcw size={7} color='#6366F1' strokeWidth={2.5} style={s.subIcon} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Seçili gün detayı */}
        {selectedDay && selData && (
          <View style={s.detailCard}>
            <View style={s.detailHeader}>
              <Text style={s.detailDate}>{selectedDay} {MONTH_TR[month-1]} {year}</Text>
              {selData.spent > 0
                ? <Text style={s.detailTotal}>{fmt(selData.spent)}</Text>
                : <Text style={s.detailEmpty}>Harcama yok</Text>
              }
            </View>
            {selData.txs.map((tx, i) => {
              const cc = CATEGORY_COLOR[tx.category] ?? colors.text3;
              return (
                <View key={i} style={[s.txRow, i > 0 && s.txBorder]}>
                  <View style={[s.txDot, { backgroundColor: cc + '22', borderColor: cc + '44', borderWidth: 1 }]}>
                    <Text style={{ fontSize: 8, color: cc, fontWeight: '800' }}>{tx.category[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.txTitle}>{tx.title}</Text>
                    <Text style={s.txCat}>{tx.category}</Text>
                  </View>
                  <Text style={s.txAmount}>{fmt(tx.amountTRY)}</Text>
                </View>
              );
            })}
            {selData.txs.length === 0 && <Text style={s.noTxText}>Bu gün işlem yok</Text>}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Ay/Yıl Picker Modal */}
      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <Pressable style={s.overlay} onPress={() => setPickerOpen(false)} />
        <View style={s.sheet}>
          <View style={s.sheetHandle} />
          <View style={s.sheetHeader}>
            <Text style={s.sheetTitle}>Ay & Yıl Seç</Text>
            <TouchableOpacity onPress={() => setPickerOpen(false)}>
              <X size={20} color={colors.text2} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Yıl seçimi */}
          <Text style={s.pickerSection}>Yıl</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.yearRow}>
            {YEARS.map(y => (
              <TouchableOpacity
                key={y}
                style={[s.yearBtn, y === year && s.yearBtnActive]}
                onPress={() => setYear(y)}
                activeOpacity={0.75}
              >
                <Text style={[s.yearText, y === year && s.yearTextActive]}>{y}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Ay seçimi */}
          <Text style={s.pickerSection}>Ay</Text>
          <View style={s.monthGrid}>
            {MONTH_TR.map((m, i) => {
              const mi = i + 1;
              return (
                <TouchableOpacity
                  key={mi}
                  style={[s.monthBtn, mi === month && s.monthBtnActive]}
                  onPress={() => { setMonth(mi); setSelectedDay(null); setPickerOpen(false); }}
                  activeOpacity={0.75}
                >
                  <Text style={[s.monthBtnText, mi === month && s.monthBtnTextActive]}>{m}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.bg },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 8 },
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  title:   { color: colors.text1, fontSize: 17, fontWeight: '700' },

  monthNav:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  navArrow:  { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.surface1, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  monthText: { color: colors.text1, fontSize: 18, fontWeight: '800', textDecorationLine: 'underline', textDecorationStyle: 'dotted' },

  summaryRow:     { flexDirection: 'row', backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 12, overflow: 'hidden' },
  summaryBox:     { flex: 1, padding: 14, alignItems: 'center' },
  summaryDivider: { width: 1, backgroundColor: colors.border },
  summaryLabel:   { color: colors.text3, fontSize: 11, fontWeight: '600', marginBottom: 4, textAlign: 'center' },
  summaryValue:   { color: colors.text1, fontSize: 15, fontWeight: '800' },

  legend:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot:  { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: colors.text3, fontSize: 11, fontWeight: '500' },

  calCard:   { backgroundColor: colors.surface1, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 12, marginBottom: 16 },
  dayLabels: { flexDirection: 'row', marginBottom: 6 },
  dayLabel:  { flex: 1, textAlign: 'center', color: colors.text3, fontSize: 11, fontWeight: '700' },
  grid:      { flexDirection: 'row', flexWrap: 'wrap' },
  cell:      { width: `${100/7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 8, position: 'relative', padding: 2 },
  dayNum:    { color: colors.text2, fontSize: 12, fontWeight: '500' },
  dayNumSel: { color: colors.text1, fontWeight: '800' },
  heatDot:   { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
  subIcon:   { position: 'absolute', top: 3, right: 3 },

  detailCard:   { backgroundColor: colors.surface1, borderRadius: 20, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginBottom: 12 },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  detailDate:   { color: colors.text1, fontSize: 15, fontWeight: '700' },
  detailTotal:  { color: colors.text1, fontSize: 17, fontWeight: '900' },
  detailEmpty:  { color: colors.text3, fontSize: 14 },
  txRow:        { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, paddingHorizontal: 16 },
  txBorder:     { borderTopWidth: 1, borderTopColor: colors.border },
  txDot:        { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  txTitle:      { color: colors.text1, fontSize: 13, fontWeight: '600' },
  txCat:        { color: colors.text3, fontSize: 11, marginTop: 1 },
  txAmount:     { color: colors.text1, fontSize: 14, fontWeight: '800' },
  noTxText:     { color: colors.text3, fontSize: 13, padding: 16, textAlign: 'center' },

  overlay:     { flex: 1, backgroundColor: '#00000066' },
  sheet:       { backgroundColor: colors.surface1, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  sheetHandle: { width: 36, height: 4, backgroundColor: colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sheetTitle:  { color: colors.text1, fontSize: 18, fontWeight: '800' },
  pickerSection:{ color: colors.text3, fontSize: 12, fontWeight: '700', marginBottom: 10, letterSpacing: 0.5 },
  yearRow:     { gap: 8, paddingBottom: 16 },
  yearBtn:     { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border },
  yearBtnActive:{ backgroundColor: '#6366F1', borderColor: '#6366F1' },
  yearText:    { color: colors.text2, fontSize: 14, fontWeight: '600' },
  yearTextActive:{ color: '#fff' },
  monthGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  monthBtn:    { width: '30%', paddingVertical: 10, borderRadius: 12, backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  monthBtnActive:{ backgroundColor: '#6366F1', borderColor: '#6366F1' },
  monthBtnText:{ color: colors.text2, fontSize: 13, fontWeight: '600' },
  monthBtnTextActive:{ color: '#fff' },
});
