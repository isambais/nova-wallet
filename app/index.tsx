import { View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useAuthStore } from '../src/store/useAuthStore';
import { useRouter } from 'expo-router';

export default function Index() {
    const router = useRouter ();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

    useEffect (() => {
        if (isAuthenticated) {
            router.replace('/screen/home');
        }else {
            router.replace('/(auth)/phone');
        }
    },[isAuthenticated]);

    return (
        <View className='flex-1 items-center justify-center bg-white'>
            <ActivityIndicator size="large" color="#6C63FF" />
        </View>
    );
}