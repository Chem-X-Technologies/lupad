import { create } from 'zustand';
import { authService, User, RegisterData } from '../services/auth';

interface PendingRegistration {
  // Step 1: Personal Info
  phone?: string;
  name?: string;
  email?: string;
  // Step 2: Vehicle Info
  vehicleType?: string;
  licenseNumber?: string;
  plateNumber?: string;
  // Step 3: Password
  password?: string;
}

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // Multi-step registration state
  pendingRegistration: PendingRegistration;
  pendingPhone: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: (phone: string, password: string) => Promise<void>;
  setPersonalInfo: (data: {
    phone: string;
    name: string;
    email?: string;
  }) => void;
  setVehicleInfo: (data: {
    vehicleType: string;
    licenseNumber: string;
    plateNumber: string;
  }) => void;
  setPassword: (password: string) => void;
  register: () => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
  clearPendingRegistration: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  pendingRegistration: {},
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

  // Login with phone + password
  login: async (phone: string, password: string) => {
    set({ isLoading: true });
    try {
      const { user } = await authService.login(phone, password);
      set({
        user,
        isAuthenticated: true,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Step 1: Set personal info
  setPersonalInfo: (data) => {
    set((state) => ({
      pendingRegistration: {
        ...state.pendingRegistration,
        phone: data.phone,
        name: data.name,
        email: data.email,
      },
    }));
  },

  // Step 2: Set vehicle info
  setVehicleInfo: (data) => {
    set((state) => ({
      pendingRegistration: {
        ...state.pendingRegistration,
        vehicleType: data.vehicleType,
        licenseNumber: data.licenseNumber,
        plateNumber: data.plateNumber,
      },
    }));
  },

  // Step 3: Set password
  setPassword: (password) => {
    set((state) => ({
      pendingRegistration: {
        ...state.pendingRegistration,
        password,
      },
    }));
  },

  // Submit registration (all data collected from 3 steps)
  register: async () => {
    const { pendingRegistration } = get();

    const { phone, name, email, vehicleType, licenseNumber, plateNumber, password } =
      pendingRegistration;

    if (!phone || !name || !vehicleType || !licenseNumber || !plateNumber || !password) {
      throw new Error('Missing registration data');
    }

    const registerData: RegisterData = {
      phone,
      name,
      email: email || undefined,
      userType: 'DRIVER',
      password,
      vehicleType,
      licenseNumber,
      plateNumber,
    };

    set({ isLoading: true });
    try {
      await authService.register(registerData);
      set({ pendingPhone: phone });
    } finally {
      set({ isLoading: false });
    }
  },

  // Verify OTP after registration
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
        pendingRegistration: {},
      });
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
        pendingRegistration: {},
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Clear pending registration (for back navigation)
  clearPendingRegistration: () => {
    set({ pendingRegistration: {}, pendingPhone: null });
  },
}));
