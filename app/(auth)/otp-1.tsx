import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../src/store/useAuthStore';
import { OTPBox } from '../../src/components/ui/OTPBox';
import { Keypad } from '../../src/components/ui/Keypad';

// OTP screen accent palette (intentionally darker/bluer than home)
const A = {
  bg:          '#08091C',
  accent:      '#6B8CFF',
  accentDim:   'rgba(107,140,255,0.32)',
  accentFaint: 'rgba(107,140,255,0.09)',
  btnFrom:     '#4E5EE8',
  logoBg:      '#0E1640',
  logoBorder:  'rgba(100,130,255,0.22)',
  surface:     'rgba(255,255,255,0.055)',
  border:      'rgba(255,255,255,0.09)',
  text1:       '#FFFFFF',
  text2:       'rgba(255,255,255,0.4)',
  text3:       'rgba(255,255,255,0.26)',
  suggColor:   'rgba(255,255,255,0.5)',
};

const OTP_LENGTH = 4;

export default function OTPScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const setUser = useAuthStore((s) => s.setUser);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));

  const activeIndex = otp.findIndex((d) => d === '');
  const filledCount = otp.filter((d) => d !== '').length;
  const isComplete  = filledCount === OTP_LENGTH;

  function handlePress(key: string) {
    const idx = otp.findIndex((d) => d === '');
    if (idx === -1) return;
    const next = [...otp];
    next[idx] = key;
    setOtp(next);
  }

  function handleDelete() {
    const last = otp.map((d, i) => (d !== '' ? i : -1)).filter((i) => i !== -1).pop();
    if (last === undefined) return;
    const next = [...otp];
    next[last] = '';
    setOtp(next);
  }

  function handleVerify() {
    if (!isComplete) return;
    setUser({
      id: '1',
      name: 'Isam Bais',
      phone: '+90 552 004 04 40',
      language: 'tr',
      currency: 'TRY',
      balance: 0,
    });
    router.replace('/(auth)/pin');
  }

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={A.bg} />

      {/* Back */}
      <TouchableOpacity style={s.backWrap} onPress={() => router.back()}>
        <View style={s.backBtn}>
          <Text style={s.backArrow}>{'←'}</Text>
        </View>
      </TouchableOpacity>

      {/* Content */}
      <View style={s.body}>
        <View style={s.logoBadge}>
          <Text style={s.logoLetter}>N</Text>
        </View>

        <Text style={s.title}>{t('auth.otp.title')}</Text>
        <Text style={s.sub}>{t('auth.otp.subtitle', { phone: '+90 552 004 04 40' })}</Text>

        <OTPBox
          length={OTP_LENGTH}
          value={otp}
          activeIndex={activeIndex === -1 ? OTP_LENGTH : activeIndex}
        />

        <Text style={s.resend}>
          {t('auth.otp.resend_in', { seconds: 34 })}
        </Text>

        <TouchableOpacity
          style={[s.btn, !isComplete && s.btnDisabled]}
          onPress={handleVerify}
          disabled={!isComplete}
          activeOpacity={0.85}
        >
          <Text style={s.btnLabel}>{t('auth.otp.verify')}</Text>
        </TouchableOpacity>

        {/* Demo hint */}
        <View style={s.fromWrap}>
          <Text style={s.fromLabel}>{t('auth.otp.demo_hint')}</Text>
          <Text style={s.fromCode}>1 2 3  4 5 6</Text>
        </View>
      </View>

      <Keypad onPress={handlePress} onDelete={handleDelete} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: A.bg },

  backWrap: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 0 },
  backBtn: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { color: 'rgba(255,255,255,0.72)', fontSize: 16, marginTop: -1 },

  body: { flex: 1, alignItems: 'center', paddingHorizontal: 22, paddingTop: 10 },

  logoBadge: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: A.logoBg,
    borderWidth: 1, borderColor: A.logoBorder,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55, shadowRadius: 10, elevation: 6,
  },
  logoLetter: { color: A.text1, fontSize: 20, fontWeight: '800' },

  title: {
    color: A.text1, fontSize: 20, fontWeight: '800',
    textAlign: 'center', marginBottom: 6, letterSpacing: -0.35,
  },
  sub: {
    color: A.text2, fontSize: 12, textAlign: 'center',
    lineHeight: 18, marginBottom: 22,
  },

  resend: { color: 'rgba(255,255,255,0.33)', fontSize: 11.5, textAlign: 'center', marginTop: 14, marginBottom: 16 },

  btn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 100,
    backgroundColor: A.btnFrom,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: A.btnFrom,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.44,
    shadowRadius: 16,
    elevation: 10,
  },
  btnDisabled: { opacity: 0.35, shadowOpacity: 0 },
  btnLabel: { color: A.text1, fontSize: 14.5, fontWeight: '700' },

  fromWrap: { alignItems: 'center', gap: 3 },
  fromLabel: { color: A.text3, fontSize: 10, fontWeight: '500' },
  fromCode: { color: A.suggColor, fontSize: 13, fontWeight: '600', letterSpacing: 1.5 },
});
