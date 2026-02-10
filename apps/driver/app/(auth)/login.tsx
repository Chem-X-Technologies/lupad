import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text, Header, PhoneInput } from '@lupad/shared-ui';
import { useAuthStore } from '../../src/stores/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (phoneNumber.length < 10 || !password) return;

    try {
      const fullPhone = `+63${phoneNumber}`;
      await login(fullPhone, password);
      router.replace('/(app)');
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error instanceof Error
          ? error.message
          : 'Invalid credentials. Please try again.'
      );
    }
  };

  const isValid = phoneNumber.length >= 10 && password.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Header
          title="Welcome Back"
          subtitle="Log in to start driving"
          onBack={() => router.back()}
        />

        {/* Content */}
        <View className="flex-1 px-6 pt-8">
          {/* Phone Input */}
          <PhoneInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            editable={!isLoading}
            className="mb-6"
          />

          {/* Password Input */}
          <View className="flex-row items-center border-b border-input pb-2">
            <TextInput
              className="flex-1 text-lg text-foreground"
              placeholder="Password"
              placeholderTextColor="#9E9E9E"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={22}
                color="#9E9E9E"
              />
            </Pressable>
          </View>

          {/* Sign Up Link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-muted-foreground">
              Don't have an account?{' '}
            </Text>
            <Pressable
              onPress={() => router.push('/(auth)/register-personal')}
            >
              <Text className="text-primary font-semibold">Sign Up</Text>
            </Pressable>
          </View>
        </View>

        {/* Button */}
        <View className="px-6 pb-8">
          <Button
            variant="secondary"
            onPress={handleLogin}
            disabled={!isValid || isLoading}
            className="h-14 rounded-xl"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text>Log In</Text>
            )}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
