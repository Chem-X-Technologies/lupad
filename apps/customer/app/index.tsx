import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../src/stores/authStore';

export default function Index() {
  const { isAuthenticated, isInitialized, user } = useAuthStore();

  // Show loading while auth state is being determined
  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00BFA5' }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  // If authenticated, go to app (or nickname if not set)
  if (isAuthenticated) {
    if (!user?.nickname) {
      return <Redirect href="/(auth)/nickname" />;
    }
    return <Redirect href="/(app)" />;
  }

  // Not authenticated, go to onboarding
  return <Redirect href="/(auth)/onboarding" />;
}
