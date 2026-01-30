import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/stores/authStore';

export default function RegisterScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const { requestOtp, isLoading } = useAuthStore();

  const handleBack = () => {
    router.back();
  };

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
        error instanceof Error ? error.message : 'Failed to send OTP. Please try again.'
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
        {/* Header */}
        <View className="bg-primary pt-12 pb-8 px-6 rounded-b-[32px]">
          <Pressable onPress={handleBack} className="mb-4">
            <Ionicons name="chevron-back" size={24} color="white" />
          </Pressable>
          <Text className="text-3xl font-bold text-white mb-2">Sign Up</Text>
          <Text className="text-base text-white/80">Enter your mobile number</Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-6 pt-8">
          {/* Phone Input */}
          <View className="flex-row items-center border-b border-gray-light pb-2">
            <View className="flex-row items-center pr-4 border-r border-gray-light">
              <Text className="text-base text-gray-dark">+63</Text>
              <Ionicons name="chevron-down" size={16} color="#9E9E9E" className="ml-1" />
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
          <Pressable
            onPress={handleSendOtp}
            disabled={!isValidPhone || isLoading}
            className={`w-full h-14 rounded-xl items-center justify-center ${
              isValidPhone && !isLoading ? 'bg-secondary active:opacity-80' : 'bg-secondary/50'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-base font-semibold">Send OTP</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
