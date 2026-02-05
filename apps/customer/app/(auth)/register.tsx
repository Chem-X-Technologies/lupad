import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/stores/authStore';
import { Button, Text, Header } from '@lupad/shared-ui';

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
          <View className="flex-row items-center border-b border-gray-light pb-2">
            <View className="flex-row items-center pr-4 border-r border-gray-light">
              <Text className="text-base text-gray-dark">+63</Text>
              <Ionicons
                name="chevron-down"
                size={16}
                color="#9E9E9E"
                className="ml-1"
              />
            </View>
            <TextInput
              className="flex-1 ml-4 text-lg text-gray-dark"
              placeholder="Mobile Number"
              placeholderTextColor="#9E9E9E"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={10}
              editable={!isLoading}
            />
          </View>
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
