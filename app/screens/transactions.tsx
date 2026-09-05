import { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, TextInput, Modal, Pressable, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, SlidersHorizontal, Check, X, FileDown } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { colors } from '../../src/theme/colors';
import { mockTransactions } from '../../src/data/transactions';
import { TransactionItem } from '../../src/components/ui/TransactionItem';
import type { Transaction } from '../../src/data/transactions';

// ─── TİPLER ──────────────────────────────────────────────────────
type TimeRange = {
  key: string;
  label: string;
  days: number | null;   // null = tümü
};

// ─── ZAMAN FİLTRELERİ ────────────────────────────────────────────
const TIME_RANGES: TimeRange[] = [
  { key: 'all',  label: 'Tüm Zamanlar', days: null },
  { key: '7d',   label: 'Son 1 Hafta',  days: 7    },
  { key: '30d',  label: 'Son 1 Ay',     days: 30   },
  { key: '90d',  label: 'Son 3 Ay',     days: 90   },
  { key: '180d', label: 'Son 6 Ay',     days: 180  },
  { key: '365d', label: 'Son 1 Yıl',    days: 365  },
];

// ─── KATEGORİ ETİKETLERİ ──────────────────────────────────────────
const CATEGORY_LABEL: Record<string, string> = {
  income: 'Gelir', food: 'Yemek', shopping: 'Alışveriş',
  transport: 'Ulaşım', bills: 'Fatura',
  entertainment: 'Eğlence', subscriptions: 'Abonelik',
};

// ─── PDF HTML ─────────────────────────────────────────────────────
function buildPdfHtml(txList: Transaction[], rangeLabel: string): string {
  const now = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const totalIncome  = txList.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalExpense = txList.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  const rows = txList.map(tx => {
    const isIncome = tx.amount >= 0;
    const sign     = isIncome ? '+' : '-';
    const color    = isIncome ? '#10B981' : '#EF4444';
    const abs      = Math.abs(tx.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const date     = new Date(tx.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
    const cat      = CATEGORY_LABEL[tx.category] ?? tx.category;
    return `
      <tr>
        <td>${tx.title}</td>
        <td>${tx.merchant}</td>
        <td>${cat}</td>
        <td>${date}</td>
        <td style="color:${color};font-weight:700;text-align:right">${sign}₺ ${abs}</td>
      </tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<style>
  body { font-family: -apple-system, Arial, sans-serif; margin: 32px; color: #111827; }
  h1   { font-size: 22px; font-weight: 800; color: #7C3AED; margin: 0 0 4px; }
  .sub { font-size: 13px; color: #6B7280; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { background: #7C3AED; color: #fff; padding: 10px 12px; text-align: left; }
  th:last-child { text-align: right; }
  td { padding: 9px 12px; border-bottom: 1px solid #E5E7EB; }
  tr:nth-child(even) td { background: #F9FAFB; }
  .summary { margin-top: 20px; display: flex; gap: 24px; }
  .sum-box { padding: 12px 20px; border-radius: 10px; }
  .income  { background: #D1FAE5; color: #065F46; }
  .expense { background: #FEE2E2; color: #7F1D1D; }
  .sum-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }
  .sum-val   { font-size: 18px; font-weight: 800; margin-top: 2px; }
  .footer { margin-top: 32px; font-size: 11px; color: #9CA3AF; text-align: center; }
</style></head><body>
  <h1>NOVA • İşlem Raporu</h1>
  <p class="sub">${rangeLabel} &nbsp;·&nbsp; Oluşturma tarihi: ${now} &nbsp;·&nbsp; ${txList.length} işlem</p>
  <table>
    <thead><tr><th>İşlem</th><th>Merchant</th><th>Kategori</th><th>Tarih</th><th>Tutar</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="summary">
    <div class="sum-box income">
      <div class="sum-label">Toplam Gelir</div>
      <div class="sum-val">+₺ ${totalIncome.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</div>
    </div>
    <div class="sum-box expense">
      <div class="sum-label">Toplam Gider</div>
      <div class="sum-val">-₺ ${totalExpense.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</div>
    </div>
  </div>
  <p class="footer">Nova Wallet — otomatik oluşturuldu</p>
</body></html>`;
}

// ─── EKRAN ────────────────────────────────────────────────────────
export default function TransactionsScreen() {
  const router = useRouter();
  const [activeTime, setActiveTime]       = useState<TimeRange>(TIME_RANGES[0]);
  const [search, setSearch]               = useState('');
  const [timeModalVisible, setTimeModal]  = useState(false);
  const [pdfLoading, setPdfLoading]       = useState(false);

  const filtered = useMemo(() => {
    const now = Date.now();

    return [...mockTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter(tx => {
        // Zaman filtresi
        if (activeTime.days !== null) {
          const diff = (now - new Date(tx.date).getTime()) / 86400000;
          if (diff > activeTime.days) return false;
        }
        // Arama filtresi
        if (search.trim()) {
          const q = search.toLowerCase();
          if (
            !tx.title.toLowerCase().includes(q) &&
            !tx.merchant.toLowerCase().includes(q)
          ) return false;
        }
        return true;
      });
  }, [activeTime, search]);

  const isTimeFiltered = activeTime.key !== 'all';

  async function handleDownload() {
    if (pdfLoading) return;
    setPdfLoading(true);
    try {
      const html  = buildPdfHtml(filtered, activeTime.label);
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'İşlemleri İndir' });
    } catch (e) {
      console.warn('PDF hatası:', e);
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      {/* ── BAŞLIK ── */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text1} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={s.title}>İşlemler</Text>
        <TouchableOpacity style={s.backBtn} onPress={handleDownload} disabled={pdfLoading}>
          {pdfLoading
            ? <ActivityIndicator size="small" color={colors.purple} />
            : <FileDown size={20} color={colors.text1} strokeWidth={2} />
          }
        </TouchableOpacity>
      </View>

      {/* ── ARAMA + FİLTRE ── */}
      <View style={s.searchRow}>
        <View style={s.searchBox}>
          <Search size={16} color={colors.text3} strokeWidth={2} />
          <TextInput
            style={s.searchInput}
            placeholder="İşlem ara…"
            placeholderTextColor={colors.text3}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <X size={15} color={colors.text3} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[s.filterIconBtn, isTimeFiltered && s.filterIconBtnActive]}
          onPress={() => setTimeModal(true)}
        >
          <SlidersHorizontal
            size={18}
            color={isTimeFiltered ? '#fff' : colors.text2}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>

      {/* Aktif zaman filtre rozeti */}
      {isTimeFiltered && (
        <View style={s.timeBadgeRow}>
          <View style={s.timeBadge}>
            <Text style={s.timeBadgeText}>{activeTime.label}</Text>
            <TouchableOpacity onPress={() => setActiveTime(TIME_RANGES[0])}>
              <X size={12} color={colors.purple} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── İŞLEM SAYISI ── */}
      <Text style={s.countText}>{filtered.length} işlem</Text>

      {/* ── LİSTE ── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.listCard}>
          {filtered.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyText}>İşlem bulunamadı</Text>
            </View>
          ) : (
            filtered.map((tx, i) => (
              <TransactionItem
                key={tx.id}
                tx={tx}
                showBorder={i < filtered.length - 1}
              />
            ))
          )}
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── ZAMAN FİLTRE MODAL ── */}
      <Modal
        visible={timeModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTimeModal(false)}
      >
        <Pressable style={s.modalOverlay} onPress={() => setTimeModal(false)}>
          <Pressable style={s.modalCard} onPress={e => e.stopPropagation()}>
            <Text style={s.modalTitle}>Zaman Aralığı</Text>
            {TIME_RANGES.map(tr => {
              const active = tr.key === activeTime.key;
              return (
                <TouchableOpacity
                  key={tr.key}
                  style={[s.modalRow, active && s.modalRowActive]}
                  onPress={() => { setActiveTime(tr); setTimeModal(false); }}
                >
                  <Text style={[s.modalRowText, active && s.modalRowTextActive]}>
                    {tr.label}
                  </Text>
                  {active && <Check size={16} color={colors.purple} strokeWidth={2.5} />}
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.surface1, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  title:   { color: colors.text1, fontSize: 17, fontWeight: '700' },

  // Arama + filtre ikonu satırı
  searchRow:          { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 10, marginBottom: 10 },
  searchBox:          { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface1, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, height: 42, gap: 8 },
  searchInput:        { flex: 1, color: colors.text1, fontSize: 14, paddingVertical: 0 },
  filterIconBtn:      { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.surface1, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  filterIconBtnActive:{ backgroundColor: colors.purple, borderColor: colors.purple },

  // Aktif zaman rozeti
  timeBadgeRow:  { paddingHorizontal: 20, marginBottom: 8 },
  timeBadge:     { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', backgroundColor: colors.purple + '18', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: colors.purple + '44' },
  timeBadgeText: { color: colors.purple, fontSize: 12, fontWeight: '600' },

  countText: { color: colors.text3, fontSize: 12, paddingHorizontal: 20, marginTop: 10, marginBottom: 12 },

  scroll:   { flex: 1 },
  content:  { paddingHorizontal: 20 },
  listCard: { backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  empty:    { padding: 32, alignItems: 'center' },
  emptyText:{ color: colors.text3, fontSize: 14 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard:    { backgroundColor: colors.surface1, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingBottom: 40, paddingHorizontal: 20, borderWidth: 1, borderColor: colors.border },
  modalTitle:   { color: colors.text1, fontSize: 16, fontWeight: '700', marginBottom: 16 },
  modalRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  modalRowActive: { },
  modalRowText:       { color: colors.text2, fontSize: 15, fontWeight: '500' },
  modalRowTextActive: { color: colors.purple, fontWeight: '700' },
});
