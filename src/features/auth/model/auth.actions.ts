import { useAuthStore } from '@/features/auth';

export const useAuthActions = () => {
	const setUser = useAuthStore((state) => state.setUser);
	return { setUser };
};
