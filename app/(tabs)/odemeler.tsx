import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { RefreshCcw, Zap, Gift, Smartphone, ChevronRight } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';

const ITEMS = [
  { id: 'abonelikler',  label: 'Abonelikler',  sub: 'Netflix, Spotify ve diğerleri', Icon: RefreshCcw, color: '#7C3AED', route: '/screens/abonelikler'  },
  { id: 'faturalar',    label: 'Faturalar',     sub: 'Elektrik, gaz, su, internet',  Icon: Zap,        color: '#F59E0B', route: '/screens/faturalar'    },
  { id: 'hediye',       label: 'Hediye Kartı',  sub: 'Kart bakiyelerin',             Icon: Gift,       color: '#EC4899', route: '/screens/hediye-karti' },
  { id: 'gsm',          label: 'GSM',           sub: 'TL yükle, paket satın al',     Icon: Smartphone, color: '#10B981', route: '/screens/gsm'          },
];

export default function OdemelerScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>Ödemeler</Text>
      </View>

      <View style={s.list}>
        {ITEMS.map(({ id, label, sub, Icon, color, route }) => (
          <TouchableOpacity
            key={id}
            style={s.item}
            activeOpacity={0.7}
            onPress={() => router.push(route as any)}
          >
            <View style={[s.iconBox, { backgroundColor: color + '18', borderColor: color + '33' }]}>
              <Icon size={24} color={color} strokeWidth={1.8} />
            </View>
            <View style={s.itemText}>
              <Text style={s.itemLabel}>{label}</Text>
              <Text style={s.itemSub}>{sub}</Text>
            </View>
            <ChevronRight size={18} color={colors.text3} strokeWidth={2} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: colors.bg },
  header:    { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 },
  title:     { color: colors.text1, fontSize: 22, fontWeight: '800' },
  list:      { paddingHorizontal: 20, gap: 12 },
  item:      { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.surface1, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 18 },
  iconBox:   { width: 52, height: 52, borderRadius: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  itemText:  { flex: 1, gap: 3 },
  itemLabel: { color: colors.text1, fontSize: 16, fontWeight: '700' },
  itemSub:   { color: colors.text3, fontSize: 13 },
});
