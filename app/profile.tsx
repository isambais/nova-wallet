import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, ArrowLeftRight, ChevronRight, CreditCard, Landmark, LogOut, Settings, UserRound } from 'lucide-react-native';
import { useAuthStore } from '../src/store/useAuthStore';
import { colors } from '../src/theme/colors';

type Section = 'details' | 'transactions' | 'banks' | 'cards' | 'settings' | 'logout';

const items = [
  { id: 'details', label: 'Hesap detayları', Icon: UserRound },
  { id: 'transactions', label: 'Hesap hareketleri', Icon: ArrowLeftRight },
  { id: 'banks', label: 'Banka hesapları', Icon: Landmark },
  { id: 'cards', label: 'Banka / kredi kartları', Icon: CreditCard },
  { id: 'settings', label: 'Ayarlar', Icon: Settings },
  { id: 'logout', label: 'Çıkış', Icon: LogOut },
] as const;

const movements = [
  ['Maaş Ödemesi', 'Şirket Transferi', '+₺ 8.200,00'],
  ['Market Alışverişi', 'Migros', '-₺ 320,50'],
  ['Kira Ödemesi', 'Otomatik Ödeme', '-₺ 2.800,00'],
];

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const [section, setSection] = useState<Section | null>(null);

  function leave() {
    logout();
    router.replace('/');
  }

  const title = section ? items.find(item => item.id === section)?.label : 'Profil';

  return <SafeAreaView style={s.safe} edges={['top']}>
    <View style={s.header}>
      <TouchableOpacity style={s.back} onPress={() => section ? setSection(null) : router.back()}>
        <ArrowLeft size={22} color={colors.text1} />
      </TouchableOpacity>
      <Text style={s.title}>{title}</Text>
      <View style={s.back} />
    </View>
    <ScrollView contentContainerStyle={s.content}>
      {!section && <>
        <View style={s.identity}>
          <View style={s.avatar}><Text style={s.initial}>{(user?.name ?? 'N')[0].toUpperCase()}</Text></View>
          <Text style={s.name}>{user?.name ?? 'NOVA Kullanıcısı'}</Text>
          <Text style={s.muted}>{user?.phone || 'Demo hesap'}</Text>
        </View>
        {items.map(({ id, label, Icon }) => <TouchableOpacity key={id} style={s.row} onPress={() => setSection(id)} activeOpacity={0.7}>
          <View style={[s.itemIcon, id === 'logout' && s.logoutIcon]}><Icon size={20} color={id === 'logout' ? colors.error : colors.purpleLight} /></View>
          <Text style={[s.rowText, id === 'logout' && s.danger]}>{label}</Text>
          <ChevronRight size={17} color={colors.text2} />
        </TouchableOpacity>)}
      </>}

      {section === 'details' && <View style={s.card}>
        <Detail label="Ad soyad" value={user?.name} />
        <Detail label="Telefon" value={user?.phone} />
        <Detail label="Hesap numarası" value={user?.id} />
        <Detail label="IBAN" value={user?.iban} />
      </View>}

      {section === 'transactions' && <View style={s.card}>{movements.map(([name, detail, amount]) => <View key={name} style={s.movement}>
        <View style={s.grow}><Text style={s.name}>{name}</Text><Text style={s.muted}>{detail}</Text></View>
        <Text style={[s.amount, amount.startsWith('+') && s.income]}>{amount}</Text>
      </View>)}</View>}

      {section === 'banks' && <Empty Icon={Landmark} text="Bağlı banka hesabı yok" />}
      {section === 'cards' && <View style={s.card}><Text style={s.name}>NOVA Sanal Kart</Text><Text style={s.cardNumber}>•••• •••• •••• 4242</Text><Text style={s.muted}>Kart ayrıntıları Kartlar sekmesinde yönetilir.</Text></View>}
      {section === 'settings' && <View style={s.card}><Text style={s.name}>Bildirimler</Text><Text style={s.muted}>Bildirim ve hesap tercihleri yakında burada yer alacak.</Text></View>}
      {section === 'logout' && <View style={s.card}><Text style={s.note}>Hesabından çıkış yapmak istiyor musun? Yeniden giriş yapman gerekecek.</Text><TouchableOpacity style={s.exit} onPress={leave}><Text style={s.exitText}>Çıkış yap</Text></TouchableOpacity></View>}
    </ScrollView>
  </SafeAreaView>;
}

function Detail({ label, value }: { label: string; value?: string }) {
  return <View style={s.detail}><Text style={s.muted}>{label}</Text><Text selectable style={s.name}>{value || 'Belirtilmedi'}</Text></View>;
}

function Empty({ Icon, text }: { Icon: typeof Landmark; text: string }) {
  return <View style={s.empty}><Icon size={46} color={colors.purpleLight} /><Text style={s.name}>{text}</Text><Text style={s.muted}>Bu özellik demo sürümünde henüz aktif değil.</Text></View>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg }, header: { height: 64, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: colors.border }, back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, title: { flex: 1, color: colors.text1, fontSize: 20, fontWeight: '700', textAlign: 'center' }, content: { padding: 20, paddingBottom: 40 },
  identity: { alignItems: 'center', paddingVertical: 20, marginBottom: 12 }, avatar: { width: 68, height: 68, borderRadius: 24, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }, initial: { color: '#fff', fontSize: 28, fontWeight: '800' }, name: { color: colors.text1, fontSize: 15, fontWeight: '600', lineHeight: 23 }, muted: { color: colors.text2, fontSize: 13, lineHeight: 20, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 64, paddingHorizontal: 14, marginBottom: 8, borderRadius: 16, backgroundColor: colors.surface1, borderWidth: 1, borderColor: colors.border }, itemIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(124,58,237,0.14)', alignItems: 'center', justifyContent: 'center' }, logoutIcon: { backgroundColor: 'rgba(244,63,94,0.1)' }, rowText: { flex: 1, color: colors.text1, fontSize: 15, fontWeight: '600' }, danger: { color: colors.error },
  card: { padding: 18, borderRadius: 18, backgroundColor: colors.surface1, borderWidth: 1, borderColor: colors.border, gap: 10 }, detail: { paddingVertical: 12, gap: 3, borderBottomWidth: 1, borderBottomColor: colors.border }, movement: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }, grow: { flex: 1 }, amount: { color: colors.text1, fontSize: 13, fontWeight: '700' }, income: { color: colors.success }, cardNumber: { color: colors.text1, fontSize: 18, letterSpacing: 2, marginVertical: 16 }, empty: { alignItems: 'center', gap: 12, padding: 40, borderRadius: 18, backgroundColor: colors.surface1 }, note: { color: colors.text2, fontSize: 14, lineHeight: 22 }, exit: { backgroundColor: colors.error, borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 8 }, exitText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
