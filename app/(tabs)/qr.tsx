import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QrCode, Camera, Copy, Share2, Image, Flashlight } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

// Mock QR data — 21×21 module grid (standard QR pattern with finder squares)
const QR_GRID: number[][] = [
  [1,1,1,1,1,1,1,0,1,0,0,0,1,0,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,1,1,0,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1,1,0,1,0,1],
  [0,1,0,1,1,0,0,0,0,1,0,1,0,0,1,0,0,1,0,1,0],
  [1,0,1,1,0,1,1,1,0,0,1,0,0,1,0,1,1,0,1,1,1],
  [0,1,0,0,1,0,0,0,1,0,0,1,1,0,1,0,0,1,0,0,0],
  [1,0,1,1,1,0,1,0,0,1,0,0,1,1,0,1,0,0,1,1,0],
  [0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,0,0,1,0,1,1],
  [1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,0,1,0,1,0,1],
  [1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,1,0,1,0,1,0],
  [1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,0,1,1,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,1,0,1,0,1,0,0,1,0,1],
  [1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,0,1,0,0,1,0],
  [1,0,0,0,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0,1],
  [1,1,1,1,1,1,1,0,0,1,0,1,0,0,1,0,1,0,1,1,0],
];

function QRCodeView({ size = 220, dark = '#111', light = 'transparent' }: { size?: number; dark?: string; light?: string }) {
  const moduleSize = size / 21;
  return (
    <View style={{ width: size, height: size, flexDirection: 'column' }}>
      {QR_GRID.map((row, r) => (
        <View key={r} style={{ flexDirection: 'row', flex: 1 }}>
          {row.map((cell, c) => (
            <View
              key={c}
              style={{
                flex: 1,
                backgroundColor: cell === 1 ? dark : light,
                borderRadius: cell === 1 ? 1 : 0,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

type Tab = 'show' | 'scan';

export default function QRScreen() {
  const [tab, setTab] = useState<Tab>('show');
  const [torchOn, setTorchOn] = useState(false);

  async function handleShare() {
    try {
      await Share.share({ message: 'NOVA Wallet · Isam · nova://pay/user/isam-001' });
    } catch {}
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>QR Kod</Text>
      </View>

      {/* Tab */}
      <View style={s.tabRow}>
        <TouchableOpacity
          style={[s.tabBtn, tab === 'show' && s.tabBtnActive]}
          onPress={() => setTab('show')}
          activeOpacity={0.7}
        >
          <QrCode size={15} color={tab === 'show' ? '#fff' : colors.text3} strokeWidth={2} />
          <Text style={[s.tabText, tab === 'show' && s.tabTextActive]}>QR Kodun</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.tabBtn, tab === 'scan' && s.tabBtnActive]}
          onPress={() => setTab('scan')}
          activeOpacity={0.7}
        >
          <Camera size={15} color={tab === 'scan' ? '#fff' : colors.text3} strokeWidth={2} />
          <Text style={[s.tabText, tab === 'scan' && s.tabTextActive]}>QR Tara</Text>
        </TouchableOpacity>
      </View>

      {tab === 'show' ? (
        /* ── QR GÖSTER ── */
        <View style={s.showContainer}>
          <View style={s.qrCard}>
            <View style={s.qrWrapper}>
              <QRCodeView size={210} dark={colors.text1} />
            </View>
            <View style={s.qrDivider} />
            <View style={s.userRow}>
              <View style={s.avatar}>
                <Text style={s.avatarText}>I</Text>
              </View>
              <View>
                <Text style={s.userName}>Isam</Text>
                <Text style={s.userHandle}>@isam-nova</Text>
              </View>
            </View>
          </View>

          <Text style={s.hint}>QR kodunu arkadaşına göster, para göndersin.</Text>

          <View style={s.actionRow}>
            <TouchableOpacity style={s.actionBtn} activeOpacity={0.75}>
              <Copy size={18} color={colors.text1} strokeWidth={2} />
              <Text style={s.actionLabel}>Linki Kopyala</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.actionBtn, s.actionBtnPrimary]} onPress={handleShare} activeOpacity={0.8}>
              <Share2 size={18} color='#fff' strokeWidth={2} />
              <Text style={[s.actionLabel, { color: '#fff' }]}>Paylaş</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* ── QR TARA ── */
        <View style={s.scanContainer}>
          <View style={s.viewfinder}>
            {/* Corner brackets */}
            <View style={[s.corner, s.cornerTL]} />
            <View style={[s.corner, s.cornerTR]} />
            <View style={[s.corner, s.cornerBL]} />
            <View style={[s.corner, s.cornerBR]} />
            {/* Scan line */}
            <View style={s.scanLine} />
            <Text style={s.scanHint}>QR kodu çerçeve içine hizala</Text>
          </View>

          <View style={s.scanActions}>
            <TouchableOpacity
              style={[s.scanBtn, torchOn && s.scanBtnActive]}
              onPress={() => setTorchOn(p => !p)}
              activeOpacity={0.75}
            >
              <Flashlight size={20} color={torchOn ? '#F59E0B' : colors.text2} strokeWidth={2} />
              <Text style={[s.scanBtnText, torchOn && { color: '#F59E0B' }]}>Fener</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.scanBtn} activeOpacity={0.75}>
              <Image size={20} color={colors.text2} strokeWidth={2} />
              <Text style={s.scanBtnText}>Galeriden Seç</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const ACCENT = '#6366F1';

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12 },
  title:  { color: colors.text1, fontSize: 22, fontWeight: '800' },

  tabRow:        { flexDirection: 'row', marginHorizontal: 20, marginBottom: 20, backgroundColor: colors.surface1, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 4, gap: 4 },
  tabBtn:        { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
  tabBtnActive:  { backgroundColor: ACCENT },
  tabText:       { color: colors.text3, fontSize: 14, fontWeight: '700' },
  tabTextActive: { color: '#fff' },

  /* QR Göster */
  showContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 20 },
  qrCard:   { backgroundColor: colors.surface1, borderRadius: 24, borderWidth: 1, borderColor: colors.border, padding: 24, alignItems: 'center', width: '100%', marginBottom: 16 },
  qrWrapper:{ padding: 12, backgroundColor: '#fff', borderRadius: 16 },
  qrDivider:{ height: 1, backgroundColor: colors.border, width: '100%', marginVertical: 18 },
  userRow:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar:   { width: 42, height: 42, borderRadius: 21, backgroundColor: ACCENT + '22', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: ACCENT + '44' },
  avatarText:{ color: ACCENT, fontSize: 18, fontWeight: '800' },
  userName: { color: colors.text1, fontSize: 15, fontWeight: '700' },
  userHandle:{ color: colors.text3, fontSize: 13 },
  hint:     { color: colors.text3, fontSize: 13, textAlign: 'center', marginBottom: 20 },
  actionRow:{ flexDirection: 'row', gap: 12, width: '100%' },
  actionBtn:{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.surface1, borderRadius: 14, borderWidth: 1, borderColor: colors.border, paddingVertical: 13 },
  actionBtnPrimary: { backgroundColor: ACCENT, borderColor: ACCENT },
  actionLabel:{ color: colors.text1, fontSize: 14, fontWeight: '700' },

  /* QR Tara */
  scanContainer: { flex: 1, alignItems: 'center', paddingHorizontal: 20 },
  viewfinder:    { width: 260, height: 260, alignItems: 'center', justifyContent: 'center', marginBottom: 32, position: 'relative', backgroundColor: colors.surface1 + '80', borderRadius: 4 },
  corner:        { position: 'absolute', width: 36, height: 36, borderColor: ACCENT, borderWidth: 3 },
  cornerTL:      { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 10 },
  cornerTR:      { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 10 },
  cornerBL:      { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 10 },
  cornerBR:      { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 10 },
  scanLine:      { position: 'absolute', top: '40%', left: 12, right: 12, height: 2, backgroundColor: ACCENT, opacity: 0.7, borderRadius: 1 },
  scanHint:      { position: 'absolute', bottom: 12, color: colors.text3, fontSize: 12, textAlign: 'center' },
  scanActions:   { flexDirection: 'row', gap: 16 },
  scanBtn:       { alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: colors.surface1, borderRadius: 16, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 24, paddingVertical: 14 },
  scanBtnActive: { borderColor: '#F59E0B44', backgroundColor: '#F59E0B08' },
  scanBtnText:   { color: colors.text2, fontSize: 13, fontWeight: '600' },
});
