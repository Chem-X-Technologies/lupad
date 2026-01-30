import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// API response types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Token storage interface - implemented by each app
export interface TokenStorage {
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  setTokens(accessToken: string, refreshToken: string): Promise<void>;
  clearTokens(): Promise<void>;
}

// API client configuration
export interface ApiClientConfig {
  baseURL: string;
  tokenStorage: TokenStorage;
  timeout?: number;
}

// Create API client with token handling
export function createApiClient(config: ApiClientConfig): AxiosInstance {
  const { baseURL, tokenStorage, timeout = 10000 } = config;

  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout,
  });

  // Request interceptor - add auth token
  api.interceptors.request.use(
    async (requestConfig: InternalAxiosRequestConfig) => {
      const token = await tokenStorage.getAccessToken();
      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
      }
      return requestConfig;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handle token refresh
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // If 401 and we haven't retried yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = await tokenStorage.getRefreshToken();
          if (refreshToken) {
            const response = await axios.post(`${baseURL}/auth/refresh`, {
              refreshToken,
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data.data;
            await tokenStorage.setTokens(accessToken, newRefreshToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        } catch {
          // Refresh failed - clear tokens
          await tokenStorage.clearTokens();
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}

// Helper to extract error message from API error
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    return axiosError.response?.data?.message || error.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
