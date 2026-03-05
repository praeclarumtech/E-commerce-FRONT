import { create } from "zustand";

interface AuthState {
    __token: string | undefined;
    setToken: (token: string) => void;
    getToken: () => string | null;
    isAuthenticated: () => boolean;
    logout: () => void;
}

const useAuth = create<AuthState>((set) => ({
    __token: undefined,
    setToken: (token: string) => {
        localStorage.setItem('__token', token);
        set({ __token: token });
    },
    getToken: () => localStorage.getItem('__token'),
    isAuthenticated: () => localStorage.getItem('__token') !== undefined,
    logout: () => {
        localStorage.removeItem('__token');
        set({ __token: undefined });
    },
}));

export { useAuth };