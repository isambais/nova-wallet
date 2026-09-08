import { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Bot } from 'lucide-react-native';
import { TabBar } from '../../src/components/navigation/TabBar';
import HomeScreen from './home';
import VarliklarScreen from './varliklar';
import QRScreen from './qr';
import OdemelerScreen from './odemeler';
import CardsScreen from './cards';
import { colors } from '../../src/theme/colors';

export default function TabsLayout() {
  const [activeIndex, setActiveIndex] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const router = useRouter();

  function goTo(index: number) {
    pagerRef.current?.setPage(index);
    setActiveIndex(index);
  }

  return (
    <View style={s.root}>
      {/* PagerView + TabBar katmanı */}
      <View style={s.content}>
        <PagerView
          ref={pagerRef}
          style={s.pager}
          initialPage={0}
          onPageSelected={e => setActiveIndex(e.nativeEvent.position)}
          overScrollMode="never"
          scrollEnabled
        >
          <View key="0" style={s.page}><HomeScreen /></View>
          <View key="1" style={s.page}><VarliklarScreen /></View>
          <View key="2" style={s.page}><QRScreen /></View>
          <View key="3" style={s.page}><OdemelerScreen /></View>
          <View key="4" style={s.page}><CardsScreen /></View>
        </PagerView>
        <TabBar activeIndex={activeIndex} onPress={goTo} />
      </View>

      {/* FAB katmanı — native PagerView'un üstünde ayrı View */}
      <View style={s.fabLayer} pointerEvents="box-none">
        <TouchableOpacity
          style={s.fab}
          onPress={() => router.push('/screens/copilot' as any)}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#7C3AED', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={s.fabGradient}
          >
            <Bot size={24} color="#fff" strokeWidth={1.8} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
  },
  pager: { flex: 1 },
  page:  { flex: 1 },

  // FAB için ayrı katman — native view üstüne çıkar
  fabLayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 9999,
    elevation: 9999,
  },
  fab: {
    position: 'absolute',
    bottom: 88,
    right: 20,
    elevation: 9999,
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
