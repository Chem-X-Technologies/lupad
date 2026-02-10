import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';
import { Button, Text } from '@lupad/shared-ui';

const slides = [
  {
    id: 1,
    title: 'Earn on your schedule',
    description:
      'Drive with Lupad and earn money on your own terms. Accept rides when it works for you.',
  },
  {
    id: 2,
    title: 'Easy navigation',
    description:
      'Get turn-by-turn directions and real-time updates for every ride. Focus on driving.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleSignUp = () => {
    router.push('/(auth)/register-personal');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Pager View for slides */}
      <View className="flex-1">
        <PagerView
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={0}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
          {slides.map((slide) => (
            <View
              key={slide.id}
              className="flex-1 items-center justify-center px-6"
            >
              {/* Illustration placeholder */}
              <View className="w-64 h-64 bg-gray-light rounded-full items-center justify-center mb-8">
                <View className="w-24 h-24 bg-secondary rounded-full items-center justify-center">
                  <Text className="text-white text-4xl">🚗</Text>
                </View>
              </View>

              {/* Title */}
              <Text className="text-2xl font-bold text-gray-dark text-center mb-4">
                {slide.title}
              </Text>

              {/* Description */}
              <Text className="text-base text-gray-medium text-center px-4">
                {slide.description}
              </Text>
            </View>
          ))}
        </PagerView>

        {/* Pagination dots */}
        <View className="flex-row justify-center items-center py-4">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`w-8 h-1 mx-1 rounded-full ${
                currentPage === index ? 'bg-primary' : 'bg-gray-light'
              }`}
            />
          ))}
        </View>
      </View>

      {/* Buttons */}
      <View className="px-6 pb-8">
        <Button
          variant="default"
          onPress={handleLogin}
          className="mb-4 bg-primary"
        >
          <Text>Log In</Text>
        </Button>

        <Button variant="secondary" onPress={handleSignUp}>
          <Text>Sign Up</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
