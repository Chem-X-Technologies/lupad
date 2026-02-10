import { api, tokenStorage } from './api';
import { ApiResponse, getApiErrorMessage } from '@lupad/shared-utils';

// Driver profile info returned from /auth/me
export interface DriverProfile {
  id: string;
  vehicleType: string;
  licenseNumber: string;
  plateNumber: string;
  isVerified: boolean;
  isAvailable: boolean;
  rating: number;
  totalRides: number;
}

// User type returned from auth endpoints
export interface User {
  id: string;
  phone: string;
  name: string;
  email: string | null;
  userType: 'CUSTOMER' | 'DRIVER';
  authMethod: 'OTP' | 'PASSWORD';
  createdAt: string;
  updatedAt?: string;
  driver?: DriverProfile;
}

// Registration data for driver signup
export interface RegisterData {
  phone: string;
  name: string;
  email?: string;
  userType: 'DRIVER';
  password: string;
  vehicleType: string;
  licenseNumber: string;
  plateNumber: string;
}

// Response from POST /auth/register
interface RegisterResponse {
  phone: string;
  otpSent: boolean;
}

// Response from POST /auth/verify-otp and POST /auth/login
// Backend returns flat accessToken/refreshToken (not nested in tokens object)
interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Response from GET /auth/me
interface MeResponse {
  user: User;
}

// Auth API functions
export const authService = {
  /**
   * Register a new driver (sends OTP for verification)
   */
  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      const response = await api.post<ApiResponse<RegisterResponse>>(
        '/auth/register',
        data
      );
      return response.data.data;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Verify OTP and complete registration (returns tokens)
   */
  async verifyOtp(phone: string, otp: string): Promise<{ user: User }> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        '/auth/verify-otp',
        { phone, otp }
      );

      const { user, accessToken, refreshToken } = response.data.data;

      // Store tokens securely
      await tokenStorage.setTokens(accessToken, refreshToken);

      return { user };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Login with phone + password (returns tokens directly)
   */
  async login(
    phone: string,
    password: string
  ): Promise<{ user: User }> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        '/auth/login',
        { phone, password, userType: 'DRIVER' }
      );

      const { user, accessToken, refreshToken } = response.data.data;

      // Store tokens securely
      await tokenStorage.setTokens(accessToken, refreshToken);

      return { user };
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  },

  /**
   * Get current user profile (includes driver sub-object)
   */
  async getProfile(): Promise<User> {
    try {
      const response = await api.get<ApiResponse<MeResponse>>('/auth/me');
      return response.data.data.user;
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
