import { User } from '@/entities/user';
import { create } from 'zustand';

interface AuthState {
	user: User | null;
	isLogged: boolean;
	setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isLogged: false,
	setUser: (user) => set({ user, isLogged: !!user }),
}));
