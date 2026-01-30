import { View, Text, Image, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: 1,
    title: 'Track your ride',
    description:
      'Know your driver in advance and be able to view current location in real time on the map',
  },
  {
    id: 2,
    title: 'Safe & Reliable',
    description:
      'All our drivers are verified and trained to provide you with the best ride experience',
  },
  {
    id: 3,
    title: 'Easy Payment',
    description:
      'Pay with cash or digital payment methods. Simple and hassle-free transactions',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const handleLogin = () => {
    router.push('/(auth)/register');
  };

  const handleSignUp = () => {
    router.push('/(auth)/register');
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
            <View key={slide.id} className="flex-1 items-center justify-center px-6">
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
        <Pressable
          onPress={handleLogin}
          className="w-full h-14 bg-primary rounded-xl items-center justify-center mb-4 active:opacity-80"
        >
          <Text className="text-white text-base font-semibold uppercase tracking-wide">
            Log In
          </Text>
        </Pressable>

        <Pressable
          onPress={handleSignUp}
          className="w-full h-14 bg-secondary rounded-xl items-center justify-center active:opacity-80"
        >
          <Text className="text-white text-base font-semibold uppercase tracking-wide">
            Sign Up
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
