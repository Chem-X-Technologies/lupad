import { api, tokenStorage } from './api';
import { ApiResponse, getApiErrorMessage } from '@lupad/shared-utils';

// Auth response types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  phone: string;
  nickname: string | null;
  email: string | null;
  role: 'CUSTOMER' | 'DRIVER' | 'ADMIN';
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface OtpResponse {
  message: string;
  expiresAt: string;
}

// Auth API functions
export const authService = {
  /**
   * Request OTP for phone number (login or registration)
   */
  async requestOtp(phone: string): Promise<OtpResponse> {
    try {
      const response = await api.post<ApiResponse<OtpResponse>>('/auth/otp/request', {
        phone,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Verify OTP and get auth tokens
   */
  async verifyOtp(phone: string, otp: string): Promise<AuthResponse> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/otp/verify', {
        phone,
        otp,
      });

      const { tokens, user } = response.data.data;

      // Store tokens securely
      await tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);

      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Update user nickname (during onboarding)
   */
  async updateNickname(nickname: string): Promise<User> {
    try {
      const response = await api.put<ApiResponse<User>>('/users/me', {
        nickname,
      });
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    try {
      const response = await api.get<ApiResponse<User>>('/users/me');
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Logout - clear tokens
   */
  async logout(): Promise<void> {
    await tokenStorage.clearTokens();
  },

  /**
   * Check if user is authenticated (has valid token)
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await tokenStorage.getAccessToken();
    return !!token;
  },
};
