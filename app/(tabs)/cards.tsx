import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

export default function CardsScreen() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.body}>
        <CreditCard size={48} color={colors.text3} strokeWidth={1.5} />
        <Text style={s.title}>Kartlarım</Text>
        <Text style={s.sub}>Day 5'te gelecek 🚀</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  title: { color: colors.text1, fontSize: 18, fontWeight: '700' },
  sub:   { color: colors.text2, fontSize: 14 },
});
