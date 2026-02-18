import { http } from '@/shared/api/http/http';

export const telegramAuth = async (initData: string) => {
	return http.post('/auth/telegram', { initData });
};
