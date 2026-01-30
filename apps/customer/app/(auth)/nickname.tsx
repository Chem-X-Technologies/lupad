import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/stores/authStore';

export default function NicknameScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const { updateNickname, isLoading } = useAuthStore();

  const handleBack = () => {
    router.back();
  };

  const handleNext = async () => {
    if (nickname.length < 2) return;

    try {
      await updateNickname(nickname);
      // Navigate to main app
      router.replace('/(app)');
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to save nickname. Please try again.'
      );
    }
  };

  const isValidNickname = nickname.length >= 2;

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
          <Text className="text-3xl font-bold text-white mb-2">Get Started</Text>
          <Text className="text-base text-white/80">What should we call you?</Text>
        </View>

        {/* Content */}
        <View className="flex-1 px-6 pt-12">
          {/* Nickname Input */}
          <TextInput
            className="text-2xl text-gray-dark text-center border-b border-gray-light pb-2"
            placeholder="Your nickname"
            placeholderTextColor="#9E9E9E"
            value={nickname}
            onChangeText={setNickname}
            autoFocus
            maxLength={30}
            editable={!isLoading}
          />
        </View>

        {/* Footer */}
        <View className="px-6 pb-8">
          <Text className="text-sm text-gray-medium text-center mb-4">
            By clicking next, you agree to our{' '}
            <Text className="text-primary font-semibold">Terms and Conditions</Text>
          </Text>

          <Pressable
            onPress={handleNext}
            disabled={!isValidNickname || isLoading}
            className={`w-full h-14 rounded-xl items-center justify-center ${
              isValidNickname && !isLoading ? 'bg-secondary active:opacity-80' : 'bg-secondary/50'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-base font-semibold">Next</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
