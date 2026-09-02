import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';

const CORRECT_OTP = '123456';

export default function OTPScreen() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputs = useRef<(TextInput | null)[]>([]);
  const router = useRouter();

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    setError('');

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== '') && index === 5) {
      const code = newOtp.join('');
      if (code === CORRECT_OTP) {
        router.push('/(auth)/pin');
      } else {
        setError('Hatalı kod. Demo kodu: 123456');
        setOtp(['', '', '', '', '', '']);
        inputs.current[0]?.focus();
      }
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 px-6 pt-20">
        <TouchableOpacity onPress={() => router.back()} className="mb-8">
          <Text className="text-purple-600 text-base">← Geri</Text>
        </TouchableOpacity>

        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Doğrulama Kodu
        </Text>
        <Text className="text-gray-500 mb-10">
          SMS ile gönderilen 6 haneli kodu girin
        </Text>

        <View className="flex-row justify-between mb-6">
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputs.current[index] = ref; }}
              className="w-12 h-14 border-2 border-gray-200 rounded-xl text-center text-xl font-bold text-gray-900"
              maxLength={1}
              keyboardType="number-pad"
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              style={{ borderColor: digit ? '#6C63FF' : '#E5E7EB' }}
            />
          ))}
        </View>

        {error ? (
          <Text className="text-red-500 text-sm text-center mb-4">{error}</Text>
        ) : null}

        <Text className="text-center text-gray-400 text-sm">
          Demo kodu: <Text className="font-bold text-purple-600">123456</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}