import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QrCode } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

export default function QRScreen() {
  return <SafeAreaView style={s.safe} edges={['top']}>
    <View style={s.body}>
      <QrCode size={48} color={colors.text3} />
      <Text style={s.title}>QR İşlemleri</Text>
      <Text style={s.subtitle}>Bu özellik sonraki geliştirme gününde eklenecek.</Text>
    </View>
  </SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
  title: { color: colors.text1, fontSize: 18, fontWeight: '700' },
  subtitle: { color: colors.text2, fontSize: 14, textAlign: 'center' },
});
