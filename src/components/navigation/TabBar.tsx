import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, TrendingUp, QrCode, ArrowLeftRight, CreditCard } from 'lucide-react-native';
import { colors } from '../../theme/colors';

interface TabBarProps {
  activeIndex: number;
  onPress: (index: number) => void;
}

const TABS = [
  { name: 'home',     icon: (c: string, s: number) => <Home           size={s} color={c} strokeWidth={2} /> },
  { name: 'varliklar',icon: (c: string, s: number) => <TrendingUp     size={s} color={c} strokeWidth={2} /> },
  { name: 'qr',       icon: (c: string, s: number) => <QrCode         size={s} color={c} strokeWidth={2} /> },
  { name: 'odemeler', icon: (c: string, s: number) => <ArrowLeftRight size={s} color={c} strokeWidth={2} /> },
  { name: 'cards',    icon: (c: string, s: number) => <CreditCard     size={s} color={c} strokeWidth={2} /> },
];

export function TabBar({ activeIndex, onPress }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={s.bar}>
        {TABS.map((tab, index) => {
          const focused = activeIndex === index;
          const isQR    = tab.name === 'qr';

          if (isQR) {
            return (
              <TouchableOpacity
                key={tab.name}
                style={s.qrTab}
                onPress={() => onPress(index)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#7C3AED', '#A855F7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.qrBtn}
                >
                  <QrCode size={26} color="#fff" strokeWidth={2} />
                </LinearGradient>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.name}
              style={s.tab}
              onPress={() => onPress(index)}
              activeOpacity={0.75}
            >
              <View style={[s.iconWrap, focused && s.iconWrapActive]}>
                {tab.icon(focused ? colors.bg : colors.text2, 22)}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: colors.surface1,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Normal tab
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 48,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.text1,
  },

  // QR center tab
  qrTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  qrBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
});
