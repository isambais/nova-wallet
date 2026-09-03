/**
 * Custom Tab Bar — beyaz oval aktif gösterge, lucide ikonlar
 * Monzo referans tasarımına uygun: koyu zemin, minimal, temiz
 */
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, CreditCard, ArrowLeftRight, User } from 'lucide-react-native';
import { colors } from '../../theme/colors';

const ICONS: Record<string, (color: string, size: number) => React.ReactNode> = {
  home:         (c, s) => <Home size={s} color={c} strokeWidth={2} />,
  cards:        (c, s) => <CreditCard size={s} color={c} strokeWidth={2} />,
  transactions: (c, s) => <ArrowLeftRight size={s} color={c} strokeWidth={2} />,
  profile:      (c, s) => <User size={s} color={c} strokeWidth={2} />,
};

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={s.container}>
      <View style={s.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const iconFn = ICONS[route.name];

          function onPress() {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          }

          return (
            <TouchableOpacity
              key={route.key}
              style={s.tab}
              onPress={onPress}
              activeOpacity={0.75}
            >
              <View style={[s.iconWrap, focused && s.iconWrapActive]}>
                {iconFn?.(
                  focused ? colors.bg : colors.text2,
                  22,
                )}
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
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
    backgroundColor: colors.text1,   // beyaz oval
  },
});
