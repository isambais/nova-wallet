import { Tabs } from 'expo-router';
import { TabBar } from '../../src/components/navigation/TabBar';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="cards" />
      <Tabs.Screen name="transactions" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
