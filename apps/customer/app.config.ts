import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

  return {
    ...config,
    name: 'Lupad',
    slug: 'lupad-customer',
    version: '0.1.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    scheme: 'lupad',
    newArchEnabled: true,
    splash: {
      image: './assets/lupad-logo.png',
      resizeMode: 'contain',
      backgroundColor: '#00BFA5',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.lupad.customer',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#00BFA5',
      },
      package: 'com.lupad.customer',
      edgeToEdgeEnabled: true,
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    plugins: ['expo-router', 'expo-secure-store', 'expo-font'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      apiUrl,
      eas: {
        projectId: '04e0e37c-e137-402f-a045-6eb5de338c75',
      },
      router: {},
    },
    owner: 'chemical-x',
  };
};
