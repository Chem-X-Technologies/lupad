import {
  View,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, Header, Input, PhoneInput } from '@lupad/shared-ui';
import { useAuthStore } from '../../src/stores/authStore';

export default function RegisterPersonalScreen() {
  const router = useRouter();
  const { setPersonalInfo, pendingRegistration } = useAuthStore();
  const [phoneNumber, setPhoneNumber] = useState(
    pendingRegistration.phone?.replace('+63', '') || ''
  );
  const [name, setName] = useState(pendingRegistration.name || '');
  const [email, setEmail] = useState(pendingRegistration.email || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (phoneNumber.length < 10) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }
    if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;

    setPersonalInfo({
      phone: `+63${phoneNumber}`,
      name: name.trim(),
      email: email.trim() || undefined,
    });

    router.push('/(auth)/register-vehicle');
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Header
          title="Create Account"
          subtitle="Step 1 of 3 — Personal Info"
          onBack={() => router.back()}
        />

        <ScrollView
          className="flex-1 px-6 pt-8"
          keyboardShouldPersistTaps="handled"
        >
          {/* Phone Input */}
          <Text className="text-sm text-muted-foreground mb-1">
            Phone Number
          </Text>
          <PhoneInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            className="mb-1"
          />
          {errors.phone ? (
            <Text className="text-error text-sm mb-4">{errors.phone}</Text>
          ) : (
            <View className="mb-6" />
          )}

          {/* Name Input */}
          <Text className="text-sm text-muted-foreground mb-1">Full Name</Text>
          <Input
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            className="mb-1"
          />
          {errors.name ? (
            <Text className="text-error text-sm mb-4">{errors.name}</Text>
          ) : (
            <View className="mb-6" />
          )}

          {/* Email Input (optional) */}
          <Text className="text-sm text-muted-foreground mb-1">
            Email{' '}
            <Text className="text-muted-foreground">(optional)</Text>
          </Text>
          <Input
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            className="mb-1"
          />
          {errors.email ? (
            <Text className="text-error text-sm mb-4">{errors.email}</Text>
          ) : (
            <View className="mb-6" />
          )}

          {/* Login Link */}
          <View className="flex-row justify-center mt-4">
            <Text className="text-muted-foreground">
              Already have an account?{' '}
            </Text>
            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text className="text-primary font-semibold">Log In</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Button */}
        <View className="px-6 pb-8">
          <Button
            variant="secondary"
            onPress={handleNext}
            className="h-14 rounded-xl"
          >
            <Text>Next</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
