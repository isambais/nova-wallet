import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { colors } from '../../src/theme/colors';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';

export default function PhoneScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');

  function handleNext() {
    if (phone.length < 10) return;
    router.push('/(auth)/otp');
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.body}>
        {/* Logo */}
        <View style={s.logoWrap}>
          <Text style={s.logoTxt}>N</Text>
        </View>
        <Text style={s.brand}>NOVA</Text>

        <Text style={s.title}>{t('auth.phone.title')}</Text>
        <Text style={s.sub}>{t('auth.phone.subtitle')}</Text>

        <Input
          prefix={t('auth.phone.prefix')}
          placeholder={t('auth.phone.placeholder')}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          maxLength={10}
        />

        <Button
          label={t('auth.phone.continue')}
          onPress={handleNext}
          disabled={phone.length < 10}
          style={s.btn}
        />

        <Text style={s.terms}>
          {t('auth.phone.terms')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  logoWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.55,
    shadowRadius: 28,
    elevation: 14,
  },
  logoTxt: { color: '#fff', fontSize: 34, fontWeight: '800' },
  brand: {
    color: colors.text1,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 5,
    marginBottom: 48,
  },
  title: {
    color: colors.text1,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 10,
    letterSpacing: -0.8,
  },
  sub: {
    color: colors.text2,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 32,
  },
  btn: { marginTop: 16, marginBottom: 24 },
  terms: {
    color: colors.text3,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
