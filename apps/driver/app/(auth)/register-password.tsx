import {
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Pressable,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button, Text, Header } from '@lupad/shared-ui';
import { useAuthStore } from '../../src/stores/authStore';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export default function RegisterPasswordScreen() {
  const router = useRouter();
  const { setPassword: storeSetPassword, register, isLoading } = useAuthStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!PASSWORD_REGEX.test(password)) {
      newErrors.password =
        'At least 8 characters, 1 uppercase, 1 lowercase, and 1 number';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAccount = async () => {
    if (!validate()) return;

    try {
      storeSetPassword(password);
      await register();
      router.push('/(auth)/verify-otp');
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Header
          title="Set Password"
          subtitle="Step 3 of 3 — Create your password"
          onBack={() => router.back()}
        />

        <View className="flex-1 px-6 pt-8">
          {/* Password Input */}
          <Text className="text-sm text-muted-foreground mb-1">Password</Text>
          <View className="flex-row items-center border-b border-input pb-2 mb-1">
            <TextInput
              className="flex-1 text-lg text-foreground"
              placeholder="Create a password"
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
          {errors.password ? (
            <Text className="text-error text-sm mb-4">{errors.password}</Text>
          ) : (
            <Text className="text-muted-foreground text-xs mb-4">
              At least 8 characters, 1 uppercase, 1 lowercase, and 1 number
            </Text>
          )}

          {/* Confirm Password Input */}
          <Text className="text-sm text-muted-foreground mb-1">
            Confirm Password
          </Text>
          <View className="flex-row items-center border-b border-input pb-2 mb-1">
            <TextInput
              className="flex-1 text-lg text-foreground"
              placeholder="Re-enter your password"
              placeholderTextColor="#9E9E9E"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!isLoading}
            />
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={22}
                color="#9E9E9E"
              />
            </Pressable>
          </View>
          {errors.confirmPassword && (
            <Text className="text-error text-sm mb-4">
              {errors.confirmPassword}
            </Text>
          )}
        </View>

        {/* Button */}
        <View className="px-6 pb-8">
          <Button
            variant="secondary"
            onPress={handleCreateAccount}
            disabled={isLoading}
            className="h-14 rounded-xl"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text>Create Account</Text>
            )}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
