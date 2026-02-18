import { parseGroups } from '@/entities/user/lib/parse-groups';
import { User } from '@/entities/user/model/user.model';
import { http } from '@/shared/api/http/http';
import { secureStorage } from '@/shared/lib';
import { detectPlatform } from '@/shared/lib/platform/get-platform';
import { create } from 'zustand';

type AuthState = {
	user: User | null;
	groups: string[];
	isAuth: boolean;
	loading: boolean;
	error?: string;

	loginWithTelegram: (initData: string) => Promise<void>;
	logout: () => void;
	checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	groups: [],
	isAuth: false,
	loading: false,

	loginWithTelegram: async (initData: string) => {
		set({ loading: true });

		try {
			const response: any = await http.post('/auth/telegram', { initData });

			const { access_token, user } = response;

			// сохраняем токен
			secureStorage.setItem('access_token', access_token);

			set({
				user,
				groups: parseGroups(user.groups),
				isAuth: true,
				loading: false,
			});
		} catch (error: any) {
			set({
				isAuth: false,
				loading: false,
				error: error.message,
			});
		}
	},

	logout: () => {
		secureStorage.clearAll();
		set({
			user: null,
			groups: [],
			isAuth: false,
		});
	},

	checkAuth: async () => {
		set({ loading: true, error: undefined });
		try {
			const PLATFORM = detectPlatform();
			if (PLATFORM === 'web') {
				const user = await http.get<User>('/userinfo');
				set({
					user,
					groups: parseGroups(user.groups),
					isAuth: true,
					loading: false,
				});

				return;
			}

			throw new Error('Unknown platform');
		} catch (err: any) {
			console.log('[Auth] error:', err.message);
			set({ isAuth: false, loading: false });
			secureStorage.clearAll();
		}
	},
}));
