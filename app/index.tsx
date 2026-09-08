import { View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';
import { useSettingsStore } from '../src/store/useSettingsStore';
import { colors } from '../src/theme/colors';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, pin } = useAuthStore();
  const hasSelectedLanguage = useSettingsStore((s) => s.hasSelectedLanguage);
  const [hydrated, setHydrated] = useState(false);

  // AsyncStorage'dan veri yüklenene kadar bekle
  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return; // Henüz yüklenmediyse bekle

    if (isAuthenticated && pin) {
  router.replace({ pathname: '/(auth)/pin', params: { pinMode: 'enter' } });
} else if (isAuthenticated && !pin) {
  router.replace({ pathname: '/(auth)/pin', params: { pinMode: 'create' } });
} else if (!hasSelectedLanguage) {
  router.replace('/(auth)/language');
} else {
  router.replace('/(auth)/phone');
}
  }, [hydrated, isAuthenticated, pin, hasSelectedLanguage]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
      <ActivityIndicator size="large" color={colors.purple} />
    </View>
  );
}