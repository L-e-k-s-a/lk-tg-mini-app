import { User } from '@/entities/user/model/user.model';

export type TelegramAuthResponse = {
	access_token: string;
	refresh_token?: string;
	user: User;
};
