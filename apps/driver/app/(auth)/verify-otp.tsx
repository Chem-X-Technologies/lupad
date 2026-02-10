import {
  View,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/stores/authStore';
import { formatPhoneNumber } from '@lupad/shared-utils';
import { Button, Text, Header, OtpInput } from '@lupad/shared-ui';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { pendingPhone, verifyOtp, register, isLoading } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(180); // 3 minutes

  // Redirect if no pending phone
  useEffect(() => {
    if (!pendingPhone) {
      router.replace('/(auth)/register-personal');
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

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) return;

    try {
      await verifyOtp(otpString);
      router.replace('/(app)');
    } catch (error) {
      Alert.alert(
        'Verification Failed',
        error instanceof Error
          ? error.message
          : 'Invalid OTP. Please try again.'
      );
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
    }
  };

  const handleResendOtp = async () => {
    try {
      // Re-call register to trigger a new OTP
      await register();
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
        <Header
          title="Verification"
          subtitle={`Enter the OTP sent to ${pendingPhone ? formatPhoneNumber(pendingPhone) : ''}`}
          onBack={() => router.back()}
        />

        {/* Content */}
        <View className="flex-1 px-6 pt-12">
          {/* OTP Input */}
          <OtpInput
            value={otp}
            onChange={setOtp}
            disabled={isLoading}
            className="mb-8"
          />

          {/* Timer */}
          <View className="items-center">
            {timer > 0 ? (
              <Text className="text-muted-foreground text-base">
                Request a new code in{' '}
                <Text className="text-foreground font-semibold">
                  {formatTime(timer)}
                </Text>
              </Text>
            ) : (
              <Pressable onPress={handleResendOtp} disabled={isLoading}>
                <Text className="text-primary text-base font-semibold">
                  Resend OTP
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Button */}
        <View className="px-6 pb-8">
          <Button
            variant="secondary"
            onPress={handleVerify}
            disabled={!isOtpComplete || isLoading}
            className="h-14 rounded-xl"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text>Verify</Text>
            )}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
