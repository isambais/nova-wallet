import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../src/store/useAuthStore';
import { colors } from '../../src/theme/colors';
import { Keypad } from '../../src/components/ui/Keypad';

const PIN_LENGTH = 4;

export default function PinScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const setPin = useAuthStore((s) => s.setPin);
  const [pin, setLocalPin] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<string[]>([]);
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [error, setError] = useState('');

  function handlePress(key: string) {
    if (step === 'create') {
      if (pin.length >= PIN_LENGTH) return;
      const next = [...pin, key];
      setLocalPin(next);

      if (next.length === PIN_LENGTH) {
        // Move to confirm step
        setTimeout(() => setStep('confirm'), 200);
      }
    } else {
      if (confirm.length >= PIN_LENGTH) return;
      const next = [...confirm, key];
      setConfirm(next);

      if (next.length === PIN_LENGTH) {
        setTimeout(() => {
          if (next.join('') === pin.join('')) {
            setPin(next.join(''));
            router.replace('/(tabs)/home');
          } else {
            setError(t('auth.pin.error_mismatch'));
            setConfirm([]);
          }
        }, 200);
      }
    }
  }

  function handleDelete() {
    setError('');
    if (step === 'create') {
      setLocalPin((p) => p.slice(0, -1));
    } else {
      setConfirm((p) => p.slice(0, -1));
    }
  }

  const activeDots = step === 'create' ? pin : confirm;
  const title = step === 'create' ? t('auth.pin.title') : t('auth.pin.confirm_title');
  const subtitle = step === 'create' ? t('auth.pin.subtitle') : t('auth.pin.confirm_subtitle');

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.body}>
        {/* Logo */}
        <View style={s.logoWrap}>
          <Text style={s.logoTxt}>N</Text>
        </View>

        <Text style={s.title}>{title}</Text>
        <Text style={s.sub}>{subtitle}</Text>

        {/* PIN dots */}
        <View style={s.dots}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <View
              key={i}
              style={[
                s.dot,
                i < activeDots.length && s.dotFilled,
                i === activeDots.length && s.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Error message */}
        {!!error && <Text style={s.error}>{error}</Text>}
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
  dots:      { flexDirection: 'row', gap: 16, marginBottom: 16 },
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
  error: {
    color: '#FF6B6B',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
});
