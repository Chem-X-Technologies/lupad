import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/stores/authStore';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/onboarding');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-bold text-gray-dark mb-4">
          Welcome{user?.nickname ? `, ${user.nickname}` : ''}!
        </Text>
        <Text className="text-base text-gray-medium text-center mb-8">
          You've completed the onboarding flow. The home screen with map will be built in the next feature.
        </Text>

        <Pressable
          onPress={handleLogout}
          disabled={isLoading}
          className="px-8 py-3 bg-primary rounded-xl active:opacity-80"
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold">Logout</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
