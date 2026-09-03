import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';
import { colors } from '../../src/theme/colors';
import { Keypad } from '../../src/components/ui/Keypad';

const PIN_LENGTH = 4;

export default function PinScreen() {
  const router = useRouter();
  const setPin = useAuthStore((s) => s.setPin);
  const [pin, setLocalPin] = useState<string[]>([]);

  function handlePress(key: string) {
    if (pin.length >= PIN_LENGTH) return;
    const next = [...pin, key];
    setLocalPin(next);

    if (next.length === PIN_LENGTH) {
      setPin(next.join(''));
      router.replace('/(tabs)/home');
    }
  }

  function handleDelete() {
    setLocalPin((p) => p.slice(0, -1));
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.body}>

        {/* Logo */}
        <View style={s.logoWrap}>
          <Text style={s.logoTxt}>N</Text>
        </View>

        <Text style={s.title}>PIN Oluştur</Text>
        <Text style={s.sub}>
          Hesabını korumak için{'\n'}4 haneli bir PIN belirle.
        </Text>

        {/* PIN dots */}
        <View style={s.dots}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <View
              key={i}
              style={[
                s.dot,
                i < pin.length && s.dotFilled,
                i === pin.length && s.dotActive,
              ]}
            />
          ))}
        </View>

      </View>

      <Keypad onPress={handlePress} onDelete={handleDelete} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: colors.bg },
  body:      { flex: 1, paddingHorizontal: 24, paddingTop: 48, alignItems: 'center' },
  logoWrap:  {
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: colors.purple,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
    shadowColor: colors.purple, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 8,
  },
  logoTxt:   { color: '#fff', fontSize: 26, fontWeight: '800' },
  title:     { color: colors.text1, fontSize: 24, fontWeight: '700', marginBottom: 10, letterSpacing: -0.5 },
  sub:       { color: colors.text2, fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 40 },
  dots:      { flexDirection: 'row', gap: 16, marginBottom: 20 },
  dot:       {
    width: 14, height: 14, borderRadius: 7,
    borderWidth: 1.5, borderColor: colors.surface3,
    backgroundColor: 'transparent',
  },
  dotFilled: { backgroundColor: colors.purple, borderColor: colors.purple },
  dotActive: {
    borderColor: colors.purpleLight,
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 8, elevation: 4,
  },
});
