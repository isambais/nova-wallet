import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft, Cpu, Camera, ScanLine,
  CheckCircle, Tag, RotateCcw, FileText, Zap,
} from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import {
  MOCK_RECEIPTS, CATEGORY_META, calcCategories, calcTotal,
  type MockReceipt,
} from '../../src/data/ai-scenarios/fis-scenarios';

// ─── Ekran Durumları ──────────────────────────────────────────────
type ScreenState = 'idle' | 'scanning' | 'result';

// ─── Bileşen: Demo Fiş Kartı (seçim) ─────────────────────────────
function ReceiptCard({
  receipt, onPress,
}: { receipt: MockReceipt; onPress: () => void }) {
  const total = calcTotal(receipt);
  return (
    <TouchableOpacity style={rc.card} onPress={onPress} activeOpacity={0.8}>
      <View style={rc.icon}>
        <FileText size={18} color={colors.purple} strokeWidth={1.8} />
      </View>
      <View style={rc.info}>
        <Text style={rc.label}>{receipt.label}</Text>
        <Text style={rc.store}>{receipt.store}</Text>
      </View>
      <Text style={rc.total}>₺{total.toLocaleString('tr-TR')}</Text>
    </TouchableOpacity>
  );
}

const rc = StyleSheet.create({
  card:  { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface1, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 8 },
  icon:  { width: 38, height: 38, borderRadius: 10, backgroundColor: colors.purple + '18', alignItems: 'center', justifyContent: 'center' },
  info:  { flex: 1 },
  label: { color: colors.text1, fontSize: 13, fontWeight: '600', marginBottom: 2 },
  store: { color: colors.text3, fontSize: 12 },
  total: { color: colors.purpleLight, fontSize: 14, fontWeight: '700' },
});

// ─── Bileşen: Sonuç Ekranı ────────────────────────────────────────
function ResultView({
  receipt, onReset,
}: { receipt: MockReceipt; onReset: () => void }) {
  const total      = calcTotal(receipt);
  const categories = calcCategories(receipt);

  return (
    <ScrollView style={rv.scroll} contentContainerStyle={rv.content} showsVerticalScrollIndicator={false}>

      {/* Başarı Başlığı */}
      <View style={rv.successRow}>
        <CheckCircle size={18} color={colors.success} strokeWidth={2} />
        <Text style={rv.successText}>Fiş başarıyla okundu</Text>
      </View>

      {/* Mağaza Bilgisi */}
      <View style={rv.storeCard}>
        <View style={rv.storeHeader}>
          <View style={rv.storeIcon}>
            <FileText size={16} color={colors.purple} strokeWidth={1.8} />
          </View>
          <View>
            <Text style={rv.storeName}>{receipt.store}</Text>
            <Text style={rv.storeDate}>{receipt.date}</Text>
          </View>
        </View>
      </View>

      {/* Kalemler */}
      <Text style={rv.sectionTitle}>Fiş Detayı</Text>
      <View style={rv.card}>
        {receipt.items.map((item, i) => {
          const meta = CATEGORY_META[item.category];
          return (
            <View key={i} style={[rv.itemRow, i < receipt.items.length - 1 && rv.itemBorder]}>
              <View style={[rv.catDot, { backgroundColor: meta.color }]} />
              <Text style={rv.itemName} numberOfLines={1}>{item.name}</Text>
              {item.qty > 1 && <Text style={rv.itemQty}>x{item.qty}</Text>}
              <Text style={rv.itemAmt}>₺{item.amount.toLocaleString('tr-TR')}</Text>
            </View>
          );
        })}
        <View style={rv.totalRow}>
          <Text style={rv.totalLabel}>Toplam</Text>
          <Text style={rv.totalAmt}>₺{total.toLocaleString('tr-TR')}</Text>
        </View>
      </View>

      {/* AI Kategorilendirme */}
      <Text style={rv.sectionTitle}>AI Kategorilendirme</Text>
      <View style={rv.card}>
        {categories.map((cat, i) => {
          const pct = Math.round((cat.total / total) * 100);
          return (
            <View key={i} style={[rv.catRow, i < categories.length - 1 && rv.itemBorder]}>
              <View style={rv.catLeft}>
                <Tag size={13} color={cat.color} strokeWidth={2} />
                <Text style={rv.catLabel}>{cat.label}</Text>
              </View>
              <View style={rv.catBar}>
                <View style={[rv.catFill, { width: `${pct}%` as any, backgroundColor: cat.color }]} />
              </View>
              <Text style={[rv.catPct, { color: cat.color }]}>%{pct}</Text>
              <Text style={rv.catAmt}>₺{cat.total.toLocaleString('tr-TR')}</Text>
            </View>
          );
        })}
      </View>

      {/* AI Yorum */}
      <View style={rv.aiCard}>
        <View style={rv.aiHeader}>
          <Cpu size={13} color={colors.purple} strokeWidth={2} />
          <Text style={rv.aiTitle}>AI Analizi</Text>
        </View>
        <Text style={rv.aiSummary}>{receipt.aiSummary}</Text>
        <View style={rv.tipRow}>
          <Zap size={12} color={colors.warning} strokeWidth={2} />
          <Text style={rv.tipText}>{receipt.aiTip}</Text>
        </View>
      </View>

      {/* Yeni Tara */}
      <TouchableOpacity style={rv.resetBtn} onPress={onReset} activeOpacity={0.85}>
        <RotateCcw size={16} color={colors.purple} strokeWidth={2} />
        <Text style={rv.resetText}>Yeni Fiş Tara</Text>
      </TouchableOpacity>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const rv = StyleSheet.create({
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 8 },

  successRow:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  successText: { color: colors.success, fontSize: 14, fontWeight: '600' },

  storeCard:   { backgroundColor: colors.surface1, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 20 },
  storeHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  storeIcon:   { width: 38, height: 38, borderRadius: 10, backgroundColor: colors.purple + '18', alignItems: 'center', justifyContent: 'center' },
  storeName:   { color: colors.text1, fontSize: 15, fontWeight: '700', marginBottom: 2 },
  storeDate:   { color: colors.text3, fontSize: 12 },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.text1, marginBottom: 10 },
  card:         { backgroundColor: colors.surface1, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 16 },

  itemRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  catDot:     { width: 7, height: 7, borderRadius: 4, flexShrink: 0 },
  itemName:   { flex: 1, color: colors.text2, fontSize: 13 },
  itemQty:    { color: colors.text3, fontSize: 12 },
  itemAmt:    { color: colors.text1, fontSize: 13, fontWeight: '600', minWidth: 60, textAlign: 'right' },

  totalRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, marginTop: 4, borderTopWidth: 1, borderTopColor: colors.border },
  totalLabel: { color: colors.text1, fontSize: 14, fontWeight: '700' },
  totalAmt:   { color: colors.purpleLight, fontSize: 16, fontWeight: '800' },

  catRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 9 },
  catLeft:  { flexDirection: 'row', alignItems: 'center', gap: 5, width: 90 },
  catLabel: { color: colors.text2, fontSize: 12, fontWeight: '500' },
  catBar:   { flex: 1, height: 5, backgroundColor: colors.surface2, borderRadius: 3, overflow: 'hidden' },
  catFill:  { height: 5, borderRadius: 3 },
  catPct:   { fontSize: 11, fontWeight: '700', width: 28, textAlign: 'right' },
  catAmt:   { color: colors.text3, fontSize: 11, width: 55, textAlign: 'right' },

  aiCard:   { backgroundColor: colors.purple + '10', borderWidth: 1, borderColor: colors.purple + '28', borderRadius: 14, padding: 14, marginBottom: 16 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  aiTitle:  { color: colors.purple, fontSize: 13, fontWeight: '700' },
  aiSummary:{ color: colors.text2, fontSize: 13, lineHeight: 19, marginBottom: 10 },
  tipRow:   { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  tipText:  { color: colors.warning, fontSize: 12, lineHeight: 18, flex: 1 },

  resetBtn:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, borderWidth: 1.5, borderColor: colors.purple, paddingVertical: 14 },
  resetText: { color: colors.purple, fontSize: 15, fontWeight: '700' },
});

// ─── Ana Ekran ────────────────────────────────────────────────────
export default function FisOkuyucu() {
  const router = useRouter();
  const [state,   setState]   = useState<ScreenState>('idle');
  const [receipt, setReceipt] = useState<MockReceipt | null>(null);

  const startScan = (r: MockReceipt) => {
    setState('scanning');
    setTimeout(() => {
      setReceipt(r);
      setState('result');
    }, 1800);
  };

  const reset = () => {
    setReceipt(null);
    setState('idle');
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      {/* HEADER */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={s.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={22} color={colors.text1} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>AI Fiş Okuyucu</Text>
        <View style={s.aiBadge}>
          <Cpu size={11} color={colors.purple} strokeWidth={2} />
          <Text style={s.aiBadgeText}>AI</Text>
        </View>
      </View>

      {/* ── IDLE ── */}
      {state === 'idle' && (
        <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

          {/* Scan Alanı */}
          <View style={s.scanArea}>
            <View style={s.scanFrame}>
              {/* Köşe süslemeleri */}
              <View style={[s.corner, s.cornerTL]} />
              <View style={[s.corner, s.cornerTR]} />
              <View style={[s.corner, s.cornerBL]} />
              <View style={[s.corner, s.cornerBR]} />
              <Camera size={40} color={colors.purple} strokeWidth={1.5} />
              <Text style={s.scanHint}>Fiş fotoğrafı çek</Text>
              <Text style={s.scanSub}>veya aşağıdan demo fiş seç</Text>
            </View>
          </View>

          {/* Demo Fişler */}
          <Text style={s.sectionTitle}>Demo Fişler</Text>
          <Text style={s.sectionSub}>Gerçek kameranın yerine demo fiş seç ve AI analizini gör</Text>
          {MOCK_RECEIPTS.map(r => (
            <ReceiptCard key={r.id} receipt={r} onPress={() => startScan(r)} />
          ))}

          <View style={{ height: 32 }} />
        </ScrollView>
      )}

      {/* ── SCANNING ── */}
      {state === 'scanning' && (
        <View style={s.scanningView}>
          <View style={s.scanningInner}>
            <View style={s.scanningIcon}>
              <ScanLine size={48} color={colors.purple} strokeWidth={1.5} />
            </View>
            <ActivityIndicator size="large" color={colors.purple} style={{ marginTop: 24, marginBottom: 16 }} />
            <Text style={s.scanningTitle}>Fiş Analiz Ediliyor</Text>
            <Text style={s.scanningText}>AI kalemleri kategorilendiriyor...</Text>
          </View>
        </View>
      )}

      {/* ── RESULT ── */}
      {state === 'result' && receipt && (
        <ResultView receipt={receipt} onReset={reset} />
      )}

    </SafeAreaView>
  );
}

// ─── STİLLER ──────────────────────────────────────────────────────
const CORNER = 18;
const CORNER_W = 3;

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content:{ paddingHorizontal: 16, paddingTop: 8 },

  header:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  backBtn:      { padding: 4 },
  headerTitle:  { flex: 1, fontSize: 17, fontWeight: '700', color: colors.text1 },
  aiBadge:      { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors.purple + '18', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  aiBadgeText:  { color: colors.purple, fontSize: 11, fontWeight: '700' },

  // Scan area
  scanArea:   { alignItems: 'center', marginVertical: 24 },
  scanFrame:  {
    width: 240, height: 200, borderRadius: 16,
    backgroundColor: colors.surface1,
    alignItems: 'center', justifyContent: 'center',
    gap: 8,
  },
  corner:     { position: 'absolute', width: CORNER, height: CORNER, borderColor: colors.purple },
  cornerTL:   { top: -1, left: -1, borderTopWidth: CORNER_W, borderLeftWidth: CORNER_W, borderTopLeftRadius: 10 },
  cornerTR:   { top: -1, right: -1, borderTopWidth: CORNER_W, borderRightWidth: CORNER_W, borderTopRightRadius: 10 },
  cornerBL:   { bottom: -1, left: -1, borderBottomWidth: CORNER_W, borderLeftWidth: CORNER_W, borderBottomLeftRadius: 10 },
  cornerBR:   { bottom: -1, right: -1, borderBottomWidth: CORNER_W, borderRightWidth: CORNER_W, borderBottomRightRadius: 10 },
  scanHint:   { color: colors.text1, fontSize: 14, fontWeight: '600', marginTop: 4 },
  scanSub:    { color: colors.text3, fontSize: 12 },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.text1, marginBottom: 4 },
  sectionSub:   { fontSize: 12, color: colors.text3, marginBottom: 12 },

  // Scanning
  scanningView:  { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  scanningInner: { alignItems: 'center' },
  scanningIcon:  { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.purple + '15', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: colors.purple + '40' },
  scanningTitle: { color: colors.text1, fontSize: 18, fontWeight: '700', textAlign: 'center' },
  scanningText:  { color: colors.text3, fontSize: 13, textAlign: 'center', marginTop: 6 },
});
