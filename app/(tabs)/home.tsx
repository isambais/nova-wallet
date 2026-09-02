import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-purple-600">NOVA Wallet</Text>
      <Text className="text-gray-500 mt-2">Ana ekran yakında 🚀</Text>
    </View>
  );
}