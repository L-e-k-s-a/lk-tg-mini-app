import { parseGroups } from '@/entities/user/lib/parse-groups';
import { User } from '@/entities/user/model/user.model';
import { telegramAuth } from '@/features/auth/api/telegram-auth';
import { http } from '@/shared/api/http/http';
import { secureStorage } from '@/shared/lib';
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
			const { access_token, refresh_token, user } =
				await telegramAuth(initData);

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
			const token = await secureStorage.getItem('access_token');

			if (!token) {
				set({ isAuth: false, loading: false });
				return;
			}

			const user = await http.get<User>('/userinfo');

			set({
				user,
				groups: parseGroups(user.groups),
				isAuth: true,
				loading: false,
			});
		} catch (error: any) {
			console.log('[Auth check failed]', error.message);

			secureStorage.clearAll();

			set({
				user: null,
				groups: [],
				isAuth: false,
				loading: false,
			});
		}
	},
}));
