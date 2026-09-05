import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';
import { colors } from '../../src/theme/colors';

const PIN_LENGTH = 6;

export default function PinScreen() {
  const router = useRouter();
  const { pinMode } = useLocalSearchParams<{ pinMode?: 'create' | 'enter' }>();
  const { pin: storedPin, setPin, logout } = useAuthStore();

  const [step, setStep] = useState<'first' | 'confirm'>('first');
  const [pin, setLocalPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<TextInput>(null);

  // Android'de autoFocus güvenilir değil — mount'tan 300ms sonra zorla focus
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, []);

  function handleChange(text: string) {
    const clean = text.replace(/[^0-9]/g, '').slice(0, PIN_LENGTH);
    setLocalPin(clean);
    setError('');
    if (clean.length === PIN_LENGTH) {
      setTimeout(() => handleContinue(clean), 150);
    }
  }

  function handleContinue(value = pin) {
    if (value.length < PIN_LENGTH) return;

    if (pinMode === 'enter') {
      if (value === storedPin) {
        router.replace('/(tabs)/home');
      } else {
        setError('Hatalı PIN. Tekrar dene.');
        setLocalPin('');
      }
      return;
    }

    // create mode
    if (step === 'first') {
      setFirstPin(value);
      setLocalPin('');
      setStep('confirm');
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      if (value === firstPin) {
        setPin(value);
        router.replace('/(tabs)/home');
      } else {
        setError("PIN'ler eşleşmedi. Tekrar dene.");
        setLocalPin('');
        setStep('first');
        setFirstPin('');
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  }

  // Kullanıcı değiştir — oturumu kapat, auth'a yönlendir
  function handleSwitchUser() {
    logout();
    router.replace('/');
  }

  // Şifremi unuttum — PIN'i sıfırla, OTP doğrulamasına yönlendir
  function handleForgotPin() {
    setPin('');       // store'daki PIN'i temizle
    router.replace({ pathname: '/(auth)/phone', params: { mode: 'login' } });
  }

  const title = pinMode === 'enter'
    ? "PIN'ini gir"
    : step === 'first' ? 'PIN Oluştur' : "PIN'ini Onayla";

  const subtitle = pinMode === 'enter'
    ? 'Hesabına erişmek için PIN gir'
    : step === 'first'
      ? 'Hesabını korumak için\n6 haneli bir PIN belirle'
      : "Aynı PIN'i tekrar gir";

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TextInput
          ref={inputRef}
          value={pin}
          onChangeText={handleChange}
          inputMode="numeric"
          maxLength={PIN_LENGTH}
          style={s.hiddenInput}
          autoFocus
          secureTextEntry
        />

        <View style={s.body}>
          <View style={s.logoWrap}>
            <Text style={s.logoTxt}>N</Text>
          </View>

          <Text style={s.title}>{title}</Text>
          <Text style={s.sub}>{subtitle}</Text>

          <TouchableOpacity activeOpacity={1} onPress={() => inputRef.current?.focus()}>
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
          </TouchableOpacity>

          {error ? <Text style={s.error}>{error}</Text> : null}

          {/* Create mode — geri butonu */}
          {pinMode !== 'enter' && step === 'confirm' && (
            <TouchableOpacity
              onPress={() => { setStep('first'); setLocalPin(''); setFirstPin(''); }}
            >
              <Text style={s.backLink}>← Geri</Text>
            </TouchableOpacity>
          )}

          {/* Enter mode — kullanıcı değiştir + şifremi unuttum */}
          {pinMode === 'enter' && (
            <View style={s.bottomLinks}>
              <TouchableOpacity onPress={handleForgotPin}>
                <Text style={s.linkText}>Şifremi Unuttum</Text>
              </TouchableOpacity>
              <Text style={s.dot2}>·</Text>
              <TouchableOpacity onPress={handleSwitchUser}>
                <Text style={s.linkText}>Kullanıcı Değiştir</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  hiddenInput: { position: 'absolute', top: -200, left: 0, width: 100, height: 40, opacity: 0 },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 48, alignItems: 'center' },
  logoWrap: {
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: colors.purple,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
    shadowColor: colors.purple, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 8,
  },
  logoTxt:  { color: '#fff', fontSize: 26, fontWeight: '800' },
  title:    { color: colors.text1, fontSize: 24, fontWeight: '700', marginBottom: 10, letterSpacing: -0.5 },
  sub:      { color: colors.text2, fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 40 },
  dots:     { flexDirection: 'row', gap: 16, marginBottom: 20 },
  dot: {
    width: 14, height: 14, borderRadius: 7,
    borderWidth: 1.5, borderColor: colors.surface3,
    backgroundColor: 'transparent',
  },
  dotFilled:  { backgroundColor: colors.purple, borderColor: colors.purple },
  dotActive:  { borderColor: colors.purpleLight, shadowColor: colors.purple, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 4 },
  error:      { color: colors.error, fontSize: 13, textAlign: 'center', marginTop: 16 },
  backLink:   { color: colors.text2, fontSize: 13, textAlign: 'center', marginTop: 20 },
  bottomLinks:{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 32 },
  linkText:   { color: colors.purpleLight, fontSize: 13, fontWeight: '500' },
  dot2:       { color: colors.text3, fontSize: 16 },
});
