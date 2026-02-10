import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { createApiClient, TokenStorage } from '@lupad/shared-utils';

// API base URL - use your local IP for development
const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

// Token storage keys
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Token storage implementation using expo-secure-store
export const tokenStorage: TokenStorage = {
  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  },

  async clearTokens(): Promise<void> {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
};

// Create API client with token storage
export const api = createApiClient({
  baseURL: API_BASE_URL,
  tokenStorage,
});
