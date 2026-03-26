import { User } from '@/entities/user';
import { create } from 'zustand';

interface AuthState {
	user: User | null;
	role: string | null; // role can start as null
	isLogged: boolean;
	setUser: (user: User | null) => void;
	setRole: (role: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	role: null,
	isLogged: false,
	setUser: (user) => set({ user, isLogged: !!user }),
	setRole: (role) => set({ role }),
}));
