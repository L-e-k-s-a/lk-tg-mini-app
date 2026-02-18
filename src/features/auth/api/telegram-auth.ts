import { http } from '@/shared/api/http/http';
import { TelegramAuthResponse } from '../model/auth.types';

export const telegramAuth = (
	initData: string,
): Promise<TelegramAuthResponse> => {
	return http.post<TelegramAuthResponse>('/auth/telegram', { initData });
};
