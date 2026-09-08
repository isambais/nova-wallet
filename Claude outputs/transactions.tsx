import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../../src/theme/colors';

export default function TransactionsScreen() {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.body}>
        <ArrowLeftRight size={48} color={colors.text3} strokeWidth={1.5} />
        <Text style={s.title}>{t('tabs.transactions')}</Text>
        <Text style={s.sub}>Day 6'da gelecek 🚀</Text>
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
