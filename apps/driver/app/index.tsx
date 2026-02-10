import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../src/stores/authStore';

export default function Index() {
  const { isAuthenticated, isInitialized } = useAuthStore();

  // Show loading while auth state is being determined
  if (!isInitialized) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  // If authenticated, go to app
  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  }

  // Not authenticated, go to onboarding
  return <Redirect href="/(auth)/onboarding" />;
}
