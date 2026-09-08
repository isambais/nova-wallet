import { useState, type ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowLeftRight, ChevronRight, CreditCard, Landmark, LogOut, Settings, UserRound, X } from 'lucide-react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { colors } from '../../theme/colors';

type Section = 'details' | 'transactions' | 'banks' | 'cards' | 'settings' | 'logout';
const ITEMS = [
  { id: 'details', label: 'Hesap detayları', Icon: UserRound },
  { id: 'transactions', label: 'Hesap hareketleri', Icon: ArrowLeftRight },
  { id: 'banks', label: 'Banka hesapları', Icon: Landmark },
  { id: 'cards', label: 'Banka / kredi kartları', Icon: CreditCard },
  { id: 'settings', label: 'Ayarlar', Icon: Settings },
  { id: 'logout', label: 'Çıkış', Icon: LogOut },
] as const;

type Props = {
  visible: boolean;
  onClose: () => void;
  balanceVisible: boolean;
  onBalanceVisibilityChange: (visible: boolean) => void;
  transactions: { id: string; title: string; subtitle: string; amount: string; date: string; type: string }[];
  cards: ReactNode;
};

export function ProfileMenu({ visible, onClose, balanceVisible, onBalanceVisibilityChange, transactions, cards }: Props) {
  const [section, setSection] = useState<Section | null>(null);
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const router = useRouter();
  const back = () => section ? setSection(null) : onClose();

  function confirmLogout() {
    logout();
    onClose();
    router.replace('/');
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={back}
      statusBarTranslucent
      hardwareAccelerated
    >
      <View style={s.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Profil menüsünü kapat" />
        <SafeAreaView style={s.safe} pointerEvents="box-none">
          <View style={s.panel} accessibilityViewIsModal>
            <View style={s.header}>
              {section && <Pressable onPress={back} style={s.iconButton} accessibilityRole="button" accessibilityLabel="Profil menüsüne dön"><ArrowLeft size={20} color={colors.text1} /></Pressable>}
              <Text style={s.heading}>{section ? ITEMS.find(item => item.id === section)?.label : 'Profil'}</Text>
              <Pressable onPress={onClose} style={s.iconButton} accessibilityRole="button" accessibilityLabel="Kapat"><X size={20} color={colors.text2} /></Pressable>
            </View>

            {section === 'cards' ? <View style={s.cards}>{cards}</View> : (
              <ScrollView contentContainerStyle={s.content}>
                {!section && <>
                  <View style={s.identity}>
                    <View style={s.avatar}><Text style={s.initial}>{(user?.name ?? 'N').charAt(0).toUpperCase()}</Text></View>
                    <View style={s.grow}><Text style={s.name}>{user?.name ?? 'NOVA Kullanıcısı'}</Text><Text style={s.muted}>{user?.phone || 'Demo hesap'}</Text></View>
                  </View>
                  {ITEMS.map(({ id, label, Icon }) => (
                    <Pressable key={id} accessibilityRole="button" onPress={() => setSection(id)} style={({ pressed }) => [s.row, pressed && s.pressed]}>
                      <View style={[s.rowIcon, id === 'logout' && s.logoutIcon]}><Icon size={20} color={id === 'logout' ? colors.error : colors.purpleLight} /></View>
                      <Text style={[s.label, id === 'logout' && s.danger]}>{label}</Text>
                      <ChevronRight size={16} color={colors.text2} />
                    </Pressable>
                  ))}
                </>}

                {section === 'details' && <>
                  <Detail label="Ad soyad" value={user?.name} />
                  <Detail label="Telefon" value={user?.phone} />
                  <Detail label="Hesap numarası" value={user?.id} />
                  <Detail label="IBAN" value={user?.iban} />
                  <Text style={s.note}>Bu bilgiler NOVA demo hesabınıza aittir.</Text>
                </>}

                {section === 'transactions' && <>
                  <Text style={s.note}>Demo hesap hareketleri</Text>
                  {transactions.map(tx => <View key={tx.id} style={s.transaction}>
                    <View style={s.grow}><Text style={s.name}>{tx.title}</Text><Text style={s.muted}>{tx.subtitle} · {tx.date}</Text></View>
                    <Text style={[s.amount, { color: tx.type === 'in' ? colors.success : colors.text1 }]}>{balanceVisible ? tx.amount : '••••••'}</Text>
                  </View>)}
                  {transactions.length === 0 && <Text style={s.note}>Henüz hesap hareketi yok.</Text>}
                </>}

                {section === 'banks' && <View style={s.empty}>
                  <Landmark size={40} color={colors.purpleLight} />
                  <Text style={s.name}>Bağlı banka hesabı yok</Text>
                  <Text style={s.note}>Banka hesabı bağlama özelliği henüz kullanıma açık değil.</Text>
                </View>}

                {section === 'settings' && <View style={s.row}>
                  <View style={s.grow}><Text style={s.name}>Bakiyeyi göster</Text><Text style={s.muted}>Ana ekrandaki tutarların görünürlüğü</Text></View>
                  <Switch value={balanceVisible} onValueChange={onBalanceVisibilityChange} trackColor={{ false: colors.surface3, true: colors.purple }} accessibilityLabel="Bakiyeyi göster" />
                </View>}

                {section === 'logout' && <>
                  <Text style={s.note}>Hesabınızdan çıkış yapmak istiyor musunuz? Devam etmek için yeniden giriş yapmanız gerekecek.</Text>
                  <Pressable style={s.exitButton} onPress={confirmLogout} accessibilityRole="button"><Text style={s.exitText}>Çıkış yap</Text></Pressable>
                  <Pressable style={s.cancelButton} onPress={back} accessibilityRole="button"><Text style={s.name}>Vazgeç</Text></Pressable>
                </>}
              </ScrollView>
            )}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return <View style={s.detail}><Text style={s.muted}>{label}</Text><Text selectable style={s.name}>{value || 'Belirtilmedi'}</Text></View>;
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' },
  safe: { flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end', paddingHorizontal: 16, paddingVertical: 12 },
  panel: { width: '100%', maxWidth: 420, maxHeight: '92%', backgroundColor: colors.surface1, borderRadius: 24, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  heading: { flex: 1, color: colors.text1, fontSize: 19, fontWeight: '700', paddingLeft: 8 },
  iconButton: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 16 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 20, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  avatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.purple, justifyContent: 'center', alignItems: 'center' },
  initial: { color: colors.text1, fontSize: 22, fontWeight: '700' },
  grow: { flex: 1 },
  name: { color: colors.text1, fontSize: 15, fontWeight: '600', lineHeight: 23 },
  muted: { color: colors.text2, fontSize: 12, lineHeight: 19 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, minHeight: 60, borderRadius: 12 },
  rowIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(124,58,237,0.12)', alignItems: 'center', justifyContent: 'center' },
  logoutIcon: { backgroundColor: 'rgba(244,63,94,0.10)' },
  label: { flex: 1, color: colors.text1, fontSize: 15, fontWeight: '500' },
  danger: { color: colors.error },
  pressed: { backgroundColor: colors.surface2 },
  detail: { paddingVertical: 12, gap: 5, borderBottomWidth: 1, borderBottomColor: colors.border },
  note: { color: colors.text2, fontSize: 14, lineHeight: 22, marginVertical: 12 },
  transaction: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  amount: { fontSize: 14, fontWeight: '600' },
  empty: { alignItems: 'center', padding: 20, gap: 12 },
  cards: { height: 360 },
  exitButton: { backgroundColor: colors.error, padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  exitText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  cancelButton: { padding: 15, alignItems: 'center' },
});
