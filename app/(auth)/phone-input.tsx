import { useForm , Controller} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod'; 
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';

const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, 'En az 10 rakam girin')
    .max(10, 'En fazla 10 rakam')
    .regex(/^[0-9]+$/, 'Sadece rakam girebilirsiniz'),
});

type PhoneForm = z.infer<typeof phoneSchema>;

export default function PhoneInputScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { mode } = useLocalSearchParams<{ mode?: 'login' | 'register' }>();
  const { control, handleSubmit, formState: { errors } } = useForm<PhoneForm>({
  resolver: zodResolver(phoneSchema),
  defaultValues: { phone: '' },
});

  function handleNext(data: PhoneForm) {
  router.push({
    pathname: '/(auth)/otp',
    params: { mode, method: 'phone', target: '+90 ' + data.phone },
  });
}

  return (
  <SafeAreaView style={s.safe} edges={['top']}>
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={s.body}>
        <TouchableOpacity style={s.back} onPress={() => router.back()} activeOpacity={0.7}>
          <ArrowLeft size={22} color={colors.text2} strokeWidth={1.8} />
        </TouchableOpacity>

        <Text style={s.title}>{t('auth.phone.title')}</Text>
        <Text style={s.sub}>{t('auth.phone.subtitle')}</Text>

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <Input
              prefix={t('auth.phone.prefix')}
              placeholder={t('auth.phone.placeholder')}
              inputMode="numeric"
              value={value}
              onChangeText={onChange}
              maxLength={10}
            />
          )}
        />

        {errors.phone && (
          <Text style={s.error}>{errors.phone.message}</Text>
        )}

        <Button
          label={t('auth.phone.continue')}
          onPress={handleSubmit(handleNext)}
          style={s.btn}
        />

        <Text style={s.terms}>{t('auth.phone.terms')}</Text>
      </View>
    </KeyboardAvoidingView>
  </SafeAreaView>
);
}

const s = StyleSheet.create({
  error: {
  color: colors.error,
  fontSize: 12,
  marginTop: 6,
  marginLeft: 4,
},
  safe: { flex: 1, backgroundColor: colors.bg },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  back: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    color: colors.text1,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.6,
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
