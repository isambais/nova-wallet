import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';

const KEYS = ['1','2','3','4','5','6','7','8','9','','0','⌫'];

export default function PINScreen() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser, setPin: savePin } = useAuthStore();

  const handleKey = (key: string) => {
    if (key === '⌫') {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (key === '') return;

    const newPin = pin + key;
    setPin(newPin);

    if (newPin.length === 4) {
      if (newPin === '1234') {
        savePin(newPin);
        setUser({
          id: '1',
          name: 'Isam Bais',
          phone: '+90 555 123 4567',
          language: 'tr',
          currency: 'TRY',
          balance: 24750.50,
        });
        router.replace('/');
      } else {
        setError('Hatalı PIN. Demo PIN: 1234');
        setPin('');
      }
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-20">
      <Text className="text-3xl font-bold text-gray-900 mb-2">PIN Oluştur</Text>
      <Text className="text-gray-500 mb-12">4 haneli güvenlik kodunuzu girin</Text>

      {/* PIN dots */}
      <View className="flex-row justify-center gap-4 mb-10">
        {[0,1,2,3].map((i) => (
          <View
            key={i}
            className={`w-4 h-4 rounded-full ${i < pin.length ? 'bg-purple-600' : 'bg-gray-200'}`}
          />
        ))}
      </View>

      {error ? (
        <Text className="text-red-500 text-sm text-center mb-4">{error}</Text>
      ) : null}

      {/* Keypad */}
      <View className="flex-row flex-wrap justify-center gap-4">
        {KEYS.map((key, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => handleKey(key)}
            className={`w-20 h-20 rounded-full items-center justify-center ${key === '' ? 'opacity-0' : 'bg-gray-100'}`}
            disabled={key === ''}
          >
            <Text className="text-2xl font-semibold text-gray-800">{key}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-center text-gray-400 text-sm mt-8">
        Demo PIN: <Text className="font-bold text-purple-600">1234</Text>
      </Text>
    </View>
  );
}