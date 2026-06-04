import { create } from 'zustand';
import { authApi } from '@/api/auth';

interface User {
  id: string;
  name: string;
  email: string;
  businessName?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthReady: boolean;
  setAuth: (user: User, token: string) => void;
  initializeAuth: () => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const storedToken = localStorage.getItem('salesops-token');

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: storedToken,
  isAuthReady: !storedToken,
  isAuthenticated: false,
  setAuth: (user, token) => {
    localStorage.setItem('salesops-token', token);
    set({ user, token, isAuthenticated: true, isAuthReady: true });
  },
  initializeAuth: async () => {
    const token = localStorage.getItem('salesops-token');
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false, isAuthReady: true });
      return;
    }

    try {
      const user = await authApi.getMe();
      set({ user, token, isAuthenticated: true, isAuthReady: true });
    } catch {
      localStorage.removeItem('salesops-token');
      set({ user: null, token: null, isAuthenticated: false, isAuthReady: true });
    }
  },
  logout: () => {
    localStorage.removeItem('salesops-token');
    set({ user: null, token: null, isAuthenticated: false, isAuthReady: true });
  },
}));
