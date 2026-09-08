import { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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

  function goTo(index: number) {
    pagerRef.current?.setPage(index);
    setActiveIndex(index);
  }

  return (
    <View style={s.root}>
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
  );
}

const s = StyleSheet.create({
  root:  { flex: 1, backgroundColor: colors.bg },
  pager: { flex: 1 },
  page:  { flex: 1 },
});
