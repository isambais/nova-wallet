import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { I18nextProvider } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import i18n from '../src/i18n';
import { useSettingsStore } from '../src/store/useSettingsStore';

export default function RootLayout() {
  const loadSettings = useSettingsStore((s) => s.loadSettings);
  const isLoaded = useSettingsStore((s) => s.isLoaded);

  useEffect(() => {
    loadSettings();
  }, []);

  // Wait for settings to load before rendering (avoids flash of wrong language)
  if (!isLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <Stack screenOptions={{ headerShown: false }} />
        </I18nextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
