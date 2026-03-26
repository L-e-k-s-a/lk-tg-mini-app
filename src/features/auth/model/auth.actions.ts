import { useAuthStore } from '@/features/auth';

export const useAuthActions = () => {
	const setUser = useAuthStore((state) => state.setUser);
	const setRole = useAuthStore((state) => state.setRole);
	return { setUser, setRole };
};
