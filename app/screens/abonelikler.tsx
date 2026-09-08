import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Modal, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, AlertCircle, CheckCircle, TrendingDown } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

type Sub = {
  id: string; name: string; emoji: string; color: string;
  monthlyTRY: number; category: string; lastUsed: string; risk: 'low' | 'mid' | 'high';
};

const SUBSCRIPTIONS: Sub[] = [
  { id: 'netflix',  name: 'Netflix',        emoji: '🎬', color: '#E50914', monthlyTRY: 149, category: 'Eğlence',  lastUsed: '2 gün önce',  risk: 'low'  },
  { id: 'spotify',  name: 'Spotify',         emoji: '🎵', color: '#1DB954', monthlyTRY: 49,  category: 'Müzik',    lastUsed: 'Bugün',       risk: 'low'  },
  { id: 'yt',       name: 'YouTube Premium', emoji: '▶️', color: '#FF0000', monthlyTRY: 79,  category: 'Eğlence',  lastUsed: '12 gün önce', risk: 'mid'  },
  { id: 'icloud',   name: 'iCloud 50 GB',   emoji: '☁️', color: '#3B82F6', monthlyTRY: 39,  category: 'Depolama', lastUsed: 'Otomatik',    risk: 'low'  },
  { id: 'disney',   name: 'Disney+',         emoji: '🏰', color: '#0063E5', monthlyTRY: 89,  category: 'Eğlence',  lastUsed: '24 gün önce', risk: 'high' },
  { id: 'blutv',    name: 'BluTV',           emoji: '📺', color: '#0093FF', monthlyTRY: 69,  category: 'Eğlence',  lastUsed: '18 gün önce', risk: 'high' },
];

const RISK = {
  low:  { label: 'Aktif',         color: '#10B981', bg: '#10B98118' },
  mid:  { label: 'Az kullanıyor', color: '#F59E0B', bg: '#F59E0B18' },
  high: { label: 'İptal önerisi', color: '#EF4444', bg: '#EF444418' },
};

function fmt(v: number) {
  return `₺ ${v.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function AboneliklerScreen() {
  const router = useRouter();
  const [cancelledSubs, setCancelledSubs] = useState<string[]>([]);
  const [cancelModal, setCancelModal] = useState<Sub | null>(null);
  const checkAnim = useRef(new Animated.Value(0)).current;

  const activeSubs = SUBSCRIPTIONS.filter(s => !cancelledSubs.includes(s.id));
  const monthlyTotal = activeSubs.reduce((t, s) => t + s.monthlyTRY, 0);
  const highRisk = activeSubs.filter(s => s.risk === 'high');

  function confirmCancel() {
    if (!cancelModal) return;
    Animated.timing(checkAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start(() => {
      setTimeout(() => {
        setCancelledSubs(prev => [...prev, cancelModal.id]);
        setCancelModal(null);
        checkAnim.setValue(0);
      }, 900);
    });
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors.text1} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={s.title}>Abonelikler</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Özet */}
        <View style={s.summaryCard}>
          <View>
            <Text style={s.summaryLabel}>Aylık Toplam</Text>
            <Text style={s.summaryAmount}>{fmt(monthlyTotal)}</Text>
            <Text style={s.summarySub}>{activeSubs.length} aktif abonelik</Text>
          </View>
          {highRisk.length > 0 && (
            <View style={s.warnBadge}>
              <AlertCircle size={14} color='#EF4444' strokeWidth={2} />
              <Text style={s.warnText}>{highRisk.length} iptal önerisi</Text>
            </View>
          )}
        </View>

        {/* Tasarruf ipucu */}
        {highRisk.length > 0 && (
          <View style={s.tipCard}>
            <TrendingDown size={16} color='#10B981' strokeWidth={2} />
            <Text style={s.tipText}>
              Az kullandığın abonelikleri iptal edersen aylık{' '}
              <Text style={s.tipHighlight}>{fmt(highRisk.reduce((t, s) => t + s.monthlyTRY, 0))}</Text>{' '}
              tasarruf edersin.
            </Text>
          </View>
        )}

        {/* Liste */}
        <View style={s.card}>
          {activeSubs.map((sub, i) => {
            const risk = RISK[sub.risk];
            return (
              <View key={sub.id}>
                {i > 0 && <View style={s.divider} />}
                <TouchableOpacity
                  style={s.subRow}
                  activeOpacity={sub.risk !== 'low' ? 0.7 : 1}
                  onPress={() => sub.risk !== 'low' && setCancelModal(sub)}
                >
                  <View style={[s.subEmoji, { backgroundColor: sub.color + '18' }]}>
                    <Text style={{ fontSize: 22 }}>{sub.emoji}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.subName}>{sub.name}</Text>
                    <Text style={s.subCat}>{sub.category} · {sub.lastUsed}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 6 }}>
                    <Text style={s.subPrice}>{fmt(sub.monthlyTRY)}</Text>
                    <View style={[s.riskBadge, { backgroundColor: risk.bg }]}>
                      <Text style={[s.riskText, { color: risk.color }]}>{risk.label}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      <Modal visible={!!cancelModal} transparent animationType="slide" onRequestClose={() => setCancelModal(null)}>
        <Pressable style={s.overlay} onPress={() => setCancelModal(null)} />
        <View style={s.sheet}>
          <View style={s.sheetHandle} />
          {cancelModal && (
            <>
              <Text style={s.sheetTitle}>Aboneliği İptal Et</Text>
              <View style={[s.sheetEmojiBox, { backgroundColor: cancelModal.color + '18' }]}>
                <Text style={{ fontSize: 36 }}>{cancelModal.emoji}</Text>
              </View>
              <Text style={s.sheetName}>{cancelModal.name}</Text>
              <Text style={s.sheetSub}>Son kullanım: {cancelModal.lastUsed}</Text>
              <Text style={s.sheetSaving}>İptal edersen aylık {fmt(cancelModal.monthlyTRY)} tasarruf edersin.</Text>
              <Animated.View style={[s.successRow, { opacity: checkAnim, transform: [{ scale: checkAnim }] }]}>
                <CheckCircle size={28} color='#10B981' strokeWidth={2} />
                <Text style={s.successText}>İptal edildi!</Text>
              </Animated.View>
              <TouchableOpacity style={[s.confirmBtn, { backgroundColor: '#EF4444' }]} onPress={confirmCancel} activeOpacity={0.8}>
                <Text style={s.confirmBtnText}>İptal Et</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setCancelModal(null)} activeOpacity={0.7}>
                <Text style={s.cancelBtnText}>Vazgeç</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
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

  summaryCard:  { backgroundColor: colors.surface1, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 18, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { color: colors.text3, fontSize: 12, fontWeight: '600' },
  summaryAmount:{ color: colors.text1, fontSize: 26, fontWeight: '800', marginVertical: 2 },
  summarySub:   { color: colors.text3, fontSize: 12 },
  warnBadge:    { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#EF444415', borderRadius: 10, borderWidth: 1, borderColor: '#EF444433', paddingHorizontal: 10, paddingVertical: 6 },
  warnText:     { color: '#EF4444', fontSize: 12, fontWeight: '700' },

  tipCard:      { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#10B98110', borderRadius: 14, borderWidth: 1, borderColor: '#10B98133', padding: 14, marginBottom: 12 },
  tipText:      { flex: 1, color: colors.text2, fontSize: 13, lineHeight: 19 },
  tipHighlight: { color: '#10B981', fontWeight: '800' },

  card:    { backgroundColor: colors.surface1, borderRadius: 20, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  divider: { height: 1, backgroundColor: colors.border, marginHorizontal: 16 },
  subRow:  { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  subEmoji:{ width: 46, height: 46, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  subName: { color: colors.text1, fontSize: 14, fontWeight: '700' },
  subCat:  { color: colors.text3, fontSize: 12, marginTop: 2 },
  subPrice:{ color: colors.text1, fontSize: 15, fontWeight: '800' },
  riskBadge:{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7 },
  riskText: { fontSize: 11, fontWeight: '700' },

  overlay:      { flex: 1, backgroundColor: '#00000066' },
  sheet:        { backgroundColor: colors.surface1, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40, gap: 12, alignItems: 'center' },
  sheetHandle:  { width: 36, height: 4, backgroundColor: colors.border, borderRadius: 2, marginBottom: 4 },
  sheetTitle:   { color: colors.text1, fontSize: 18, fontWeight: '800' },
  sheetEmojiBox:{ width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginVertical: 4 },
  sheetName:    { color: colors.text1, fontSize: 17, fontWeight: '800' },
  sheetSub:     { color: colors.text3, fontSize: 13 },
  sheetSaving:  { color: '#10B981', fontSize: 14, fontWeight: '700' },
  successRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, position: 'absolute', bottom: 120 },
  successText:  { color: '#10B981', fontSize: 18, fontWeight: '800' },
  confirmBtn:   { width: '100%', borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
  confirmBtnText:{ color: '#fff', fontSize: 16, fontWeight: '700' },
  cancelBtn:    { width: '100%', borderRadius: 16, paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  cancelBtnText:{ color: colors.text2, fontSize: 15, fontWeight: '600' },
});
