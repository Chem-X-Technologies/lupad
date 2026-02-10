import {
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/stores/authStore';
import { Button, Text, Header, PhoneInput } from '@lupad/shared-ui';

export default function RegisterScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const { requestOtp, isLoading } = useAuthStore();

  const handleSendOtp = async () => {
    if (phoneNumber.length < 10) return;

    try {
      // Format phone number with country code
      const fullPhone = `+63${phoneNumber}`;
      await requestOtp(fullPhone);

      // Navigate to OTP verification
      router.push('/(auth)/verify-otp');
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Failed to send OTP. Please try again.'
      );
    }
  };

  const isValidPhone = phoneNumber.length >= 10;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Header
          title="Sign Up"
          subtitle="Enter your mobile number"
          onBack={() => router.back()}
        />

        {/* Content */}
        <View className="flex-1 px-6 pt-8">
          {/* Phone Input */}
          <PhoneInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            editable={!isLoading}
          />
        </View>

        {/* Button */}
        <View className="px-6 pb-8">
          <Button
            variant="secondary"
            onPress={handleSendOtp}
            disabled={!isValidPhone || isLoading}
            className="h-14 rounded-xl"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text>Send OTP</Text>
            )}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
