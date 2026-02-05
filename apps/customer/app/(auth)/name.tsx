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
import { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/stores/authStore';
import { Button, Text, Header, Input } from '@lupad/shared-ui';

export default function NameScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const { updateName, isLoading } = useAuthStore();
  const inputRef = useRef<TextInput>(null);

  const handleBack = () => {
    router.back();
  };

  const handleNext = async () => {
    if (name.length < 2) return;

    try {
      await updateName(name);
      // Navigate to main app
      router.replace('/(app)');
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error
          ? error.message
          : 'Failed to save name. Please try again.'
      );
    }
  };

  const isValidName = name.length >= 2;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Header
          title="Get Started"
          subtitle="What should we call you?"
          onBack={handleBack}
        />

        {/* Content */}
        <Pressable
          className="flex-1 px-6 pt-12"
          onPress={() => inputRef.current?.focus()}
        >
          {/* Name Input - Centered container with auto-width input */}
          <View className="items-center relative">
            {!name && (
              <Text
                className="text-gray-400 absolute font-normal pt-3"
                variant="h3"
              >
                Your name
              </Text>
            )}
            <Input
              ref={inputRef}
              className="border-0 rounded-none text-2xl pb-2 w-auto dark:bg-transparent"
              keyboardType="name-phone-pad"
              value={name}
              onChangeText={setName}
              autoFocus
              maxLength={30}
              editable={!isLoading}
            />
            {/* Full-width bottom border */}
            <View className="w-full h-[1px] bg-input" />
          </View>
        </Pressable>

        {/* Footer */}
        <View className="px-6 pb-8">
          <Text
            className="text-center mb-4 text-muted-foreground"
            variant="muted"
          >
            By clicking next, you agree to our{' '}
            <Text className="text-primary font-semibold" variant="small">
              Terms and Conditions
            </Text>
          </Text>

          <Button
            variant="secondary"
            onPress={handleNext}
            disabled={!isValidName || isLoading}
            className="h-14 rounded-xl"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text>Next</Text>
            )}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
