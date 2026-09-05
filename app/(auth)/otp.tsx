import { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStore, generateMockIban } from '../../src/store/useAuthStore';
import { OTPBox } from '../../src/components/ui/OTPBox';

const A = {
  bg:          '#08091C',
  accent:      '#6B8CFF',
  btnFrom:     '#4E5EE8',
  logoBg:      '#0E1640',
  logoBorder:  'rgba(100,130,255,0.22)',
  text1:       '#FFFFFF',
  text2:       'rgba(255,255,255,0.4)',
  text3:       'rgba(255,255,255,0.26)',
  resend:      'rgba(255,255,255,0.33)',
};

const OTP_LENGTH = 6;
const DEMO_CODE  = '123456';

export default function OTPScreen() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const { mode, method, target } = useLocalSearchParams<{
    mode?: 'login' | 'register';
    method?: 'phone' | 'email';
    target?: string;
  }>();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<TextInput>(null);

  const otpArray = otp.split('').concat(Array(OTP_LENGTH - otp.length).fill(''));
  const isComplete = otp.length === OTP_LENGTH;

  function handleChange(text: string) {
    const clean = text.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
    setOtp(clean);
    setError('');
  }

  function handleVerify() {
  if (!isComplete) return;
  if (otp !== DEMO_CODE) {
    setError('Kod hatalı. Demo kod: 123456');
    return;
  }
  setUser({
    id: '1',
    name: 'Isam Bais',
    phone: method === 'phone' ? (target ?? '') : '',
    language: 'tr',
    currency: 'TRY',
    balance: 0,
    iban: generateMockIban(),   // her yeni kullanıcıya unique IBAN
  });

  // mode'a güvenmek yerine store'u kontrol et — daha güvenilir
  const hasPin = !!useAuthStore.getState().pin;
  if (!hasPin) {
    router.replace({ pathname: '/(auth)/pin', params: { pinMode: 'create' } });
  } else {
    router.replace('/(tabs)/home');
  }
}

  const subtitle = method === 'email'
    ? 'E-posta adresinize gönderilen kodu girin'
    : 'Telefonunuza gönderilen SMS kodunu girin';

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={A.bg} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Gizli TextInput — native klavyeyi açar */}
        <TextInput
          ref={inputRef}
          value={otp}
          onChangeText={handleChange}
          inputMode="numeric"
          maxLength={OTP_LENGTH}
          style={s.hiddenInput}
          autoFocus
        />

        {/* Geri */}
        <TouchableOpacity style={s.backWrap} onPress={() => router.back()}>
          <View style={s.backBtn}>
            <Text style={s.backArrow}>{'←'}</Text>
          </View>
        </TouchableOpacity>

        {/* İçerik */}
        <View style={s.body}>
          <View style={s.logoBadge}>
            <Text style={s.logoLetter}>N</Text>
          </View>

          <Text style={s.title}>Doğrulama Kodu</Text>
          <Text style={s.sub}>{subtitle}</Text>
          {target ? <Text style={s.subAccent}>{target}</Text> : null}

          {/* OTP kutularına basınca klavye açılır */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => inputRef.current?.focus()}
          >
            <OTPBox
              length={OTP_LENGTH}
              value={otpArray}
              activeIndex={otp.length < OTP_LENGTH ? otp.length : OTP_LENGTH}
            />
          </TouchableOpacity>

          {error ? <Text style={s.error}>{error}</Text> : null}

          <Text style={s.resendTxt}>
            Kodu almadın mı?{' '}
            <Text style={s.resendLink}>Tekrar gönder</Text>
          </Text>

          <TouchableOpacity
            style={[s.btn, !isComplete && s.btnDisabled]}
            onPress={handleVerify}
            disabled={!isComplete}
            activeOpacity={0.85}
          >
            <Text style={s.btnLabel}>Devam et</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: A.bg },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  backWrap: { paddingHorizontal: 20, paddingTop: 12 },
  backBtn: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { color: 'rgba(255,255,255,0.72)', fontSize: 16, marginTop: -1 },
  body: { flex: 1, alignItems: 'center', paddingHorizontal: 22, paddingTop: 16 },
  logoBadge: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: A.logoBg,
    borderWidth: 1, borderColor: A.logoBorder,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  logoLetter: { color: A.text1, fontSize: 20, fontWeight: '800' },
  title: {
    color: A.text1, fontSize: 20, fontWeight: '800',
    textAlign: 'center', marginBottom: 6,
  },
  sub: { color: A.text2, fontSize: 12, textAlign: 'center', marginBottom: 4 },
  subAccent: {
    color: A.accent, fontSize: 12, fontWeight: '600',
    textAlign: 'center', marginBottom: 22,
  },
  error: {
    color: '#FF6B6B', fontSize: 12,
    textAlign: 'center', marginTop: 10,
  },
  resendTxt: {
    color: A.resend, fontSize: 12,
    textAlign: 'center', marginTop: 16, marginBottom: 20,
  },
  resendLink: { color: A.accent, fontWeight: '600' },
  btn: {
    width: '100%', paddingVertical: 14,
    borderRadius: 100, backgroundColor: A.btnFrom,
    alignItems: 'center',
    shadowColor: A.btnFrom,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44, shadowRadius: 16, elevation: 10,
  },
  btnDisabled: { opacity: 0.35, shadowOpacity: 0 },
  btnLabel: { color: A.text1, fontSize: 14.5, fontWeight: '700' },
});