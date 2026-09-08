import { useState } from 'react';
import { View,Text,TextInput, TouchableOpacity,KeyboardAvoidingView,Platform} from 'react-native';
import { useRouter } from 'expo-router';

export default function PhoneScreen(){
    const [phone,setPhone] = useState('');
    const router = useRouter();

    const handleContinue = () => {
        if (phone.length >= 10){
            router.push('/(auth)/otp');
        }
    };
    return (
    <KeyboardAvoidingView
        className="flex-1 bg-white"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
        <View className="flex-1 px-6 pt-20">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
                NOVA Wallet
            </Text>
            <Text className="text-gray-500 mb-10">
                Telefon numaranızı girin
            </Text>

        <View className="flex-row items-center border border-gray-200 rounded-2xl px-4 py-4 mb-4">
            <Text className="text-gray-700 font-medium mr-2">+90</Text>
                <TextInput
                    className="flex-1 text-gray-900 text-lg"
                    placeholder="5XX XXX XX XX"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={setPhone}
        />
        </View>

        <TouchableOpacity
        className={`rounded-2xl py-4 items-center ${phone.length >= 10 ? 'bg-purple-600' : 'bg-gray-200'}`}
        onPress={handleContinue}
        disabled={phone.length < 10}
        >
        <Text className={`font-semibold text-lg ${phone.length >= 10 ? 'text-white' : 'text-gray-400'}`}>
        Devam Et
        </Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-400 text-sm mt-6">
            Demo: Herhangi bir numara girebilirsiniz
        </Text>
    </View>
    </KeyboardAvoidingView>
    );
}