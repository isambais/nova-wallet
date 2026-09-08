import { View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';
import { useSettingsStore } from '../src/store/useSettingsStore';
import { colors } from '../src/theme/colors';

export default function Index() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasSelectedLanguage = useSettingsStore((s) => s.hasSelectedLanguage);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)/home');
    } else if (!hasSelectedLanguage) {
      // First launch — show language selection
      router.replace('/(auth)/language');
    } else {
      router.replace('/(auth)/phone');
    }
  }, [isAuthenticated, hasSelectedLanguage]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
      <ActivityIndicator size="large" color={colors.purple} />
    </View>
  );
}
