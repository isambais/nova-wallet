import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter,useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '../../src/theme/colors';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';


const emailSchema = z.object({
  email: z.string()
    .min(1, 'E-posta boş bırakılamaz')
    .email('Geçerli bir e-posta girin'),
});

type EmailForm = z.infer<typeof emailSchema>;


export default function EmailInputScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: 'login' | 'register' }>();
  const { control, handleSubmit, formState: { errors } } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

function handleNext(data: EmailForm) {
  router.push({
    pathname: '/(auth)/otp',
    params: { mode, method: 'email', target: data.email },
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

          <Text style={s.title}>E-posta adresin</Text>
          <Text style={s.sub}>Devam etmek için e-posta adresini gir</Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="ornek@mail.com"
                inputMode="email"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          {errors.email && (
            <Text style={s.error}>{errors.email.message}</Text>
          )}

          <Button
            label="Devam et"
            onPress={handleSubmit(handleNext)}
            style={s.btn}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
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
  error: {
    color: colors.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  btn: { marginTop: 16, marginBottom: 24 },
});