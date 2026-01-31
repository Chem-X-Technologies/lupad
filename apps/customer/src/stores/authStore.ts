import { create } from 'zustand';
import { authService, User } from '../services/auth';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // Onboarding flow state
  pendingPhone: string | null;

  // Actions
  initialize: () => Promise<void>;
  requestOtp: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearPendingPhone: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  pendingPhone: null,

  // Initialize auth state on app start
  initialize: async () => {
    try {
      set({ isLoading: true });

      const isAuthenticated = await authService.isAuthenticated();

      if (isAuthenticated) {
        try {
          const user = await authService.getProfile();
          set({ user, isAuthenticated: true });
        } catch {
          // Token might be invalid, clear it
          await authService.logout();
          set({ user: null, isAuthenticated: false });
        }
      }
    } finally {
      set({ isLoading: false, isInitialized: true });
    }
  },

  // Request OTP for phone number
  requestOtp: async (phone: string) => {
    set({ isLoading: true });
    try {
      await authService.requestOtp(phone);
      set({ pendingPhone: phone });
    } finally {
      set({ isLoading: false });
    }
  },

  // Verify OTP and authenticate
  verifyOtp: async (otp: string) => {
    const { pendingPhone } = get();
    if (!pendingPhone) {
      throw new Error('No pending phone number');
    }

    set({ isLoading: true });
    try {
      const { user } = await authService.verifyOtp(pendingPhone, otp);
      set({
        user,
        isAuthenticated: true,
        pendingPhone: null,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Update user name
  updateName: async (name: string) => {
    set({ isLoading: true });
    try {
      const user = await authService.updateName(name);
      set({ user });
    } finally {
      set({ isLoading: false });
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({
        user: null,
        isAuthenticated: false,
        pendingPhone: null,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Clear pending phone (for back navigation)
  clearPendingPhone: () => {
    set({ pendingPhone: null });
  },
}));
