import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/stores/authStore';
import { formatPhoneNumber } from '@lupad/shared-utils';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { pendingPhone, verifyOtp, requestOtp, isLoading, user } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(180); // 3 minutes
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Redirect if no pending phone
  useEffect(() => {
    if (!pendingPhone) {
      router.replace('/(auth)/register');
    }
  }, [pendingPhone, router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBack = () => {
    router.back();
  };

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: { nativeEvent: { key: string } }, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) return;

    try {
      await verifyOtp(otpString);

      // Check if user needs to set nickname (new user)
      if (!user?.nickname) {
        router.push('/(auth)/nickname');
      } else {
        // Existing user - go to home
        router.replace('/(app)');
      }
    } catch (error) {
      Alert.alert(
        'Verification Failed',
        error instanceof Error ? error.message : 'Invalid OTP. Please try again.'
      );
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (!pendingPhone) return;

    try {
      await requestOtp(pendingPhone);
      setTimer(180);
      Alert.alert('OTP Sent', 'A new OTP has been sent to your phone.');
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to resend OTP.'
      );
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

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
          <Text className="text-3xl font-bold text-white mb-2">Verification</Text>
          <Text className="text-base text-white/80">
            Enter the OTP sent to {pendingPhone ? formatPhoneNumber(pendingPhone) : ''}
          </Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-6 pt-12">
          {/* OTP Inputs */}
          <View className="flex-row justify-between mb-8">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                className="w-12 h-12 border-b-2 border-gray-light text-center text-2xl text-gray-dark"
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                selectTextOnFocus
                editable={!isLoading}
              />
            ))}
          </View>

          {/* Timer */}
          <View className="items-center">
            {timer > 0 ? (
              <Text className="text-gray-medium text-base">
                Request a new code in{' '}
                <Text className="text-gray-dark font-semibold">{formatTime(timer)}</Text>
              </Text>
            ) : (
              <Pressable onPress={handleResendOtp} disabled={isLoading}>
                <Text className="text-primary text-base font-semibold">Resend OTP</Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Button */}
        <View className="px-6 pb-8">
          <Pressable
            onPress={handleVerify}
            disabled={!isOtpComplete || isLoading}
            className={`w-full h-14 rounded-xl items-center justify-center ${
              isOtpComplete && !isLoading ? 'bg-secondary active:opacity-80' : 'bg-secondary/50'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-base font-semibold">Verify</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
