import { useAuthStore } from './auth.store';

export const useAuth = () => useAuthStore((s) => s.isLogged);
export const useUser = () => useAuthStore((s) => s.user);
