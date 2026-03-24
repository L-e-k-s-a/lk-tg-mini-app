import { EndPoints } from '@/shared/constants/base';
import {
	detectPlatform,
	isTgPlatform,
} from '@/shared/lib/platform/get-platform';
import * as SecureStore from 'expo-secure-store';

type TgAuthResponse = {
	access_token: string;
	refresh_token?: string;
};

const saveTokens = async (access: string, refresh?: string) => {
	const platform = detectPlatform();

	try {
		if (platform === 'web' || isTgPlatform(platform)) {
			// Web + Telegram Mini App
			localStorage.setItem('access_token', access);
			if (refresh) {
				localStorage.setItem('refresh_token', refresh);
			}
		} else {
			// iOS / Android
			await SecureStore.setItemAsync('access_token', access);
			if (refresh) {
				await SecureStore.setItemAsync('refresh_token', refresh);
			}
		}
	} catch (e) {
		console.error('Failed to save tokens', e);
	}
};

export const signInWithTg = async (
	initData: string,
): Promise<string | null> => {
	try {
		const response = await fetch(`${EndPoints.api}/tg/sign-in`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `tma ${initData}`,
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error: ${response.status}`);
		}

		const data: TgAuthResponse = await response.json();

		if (!data.access_token) {
			throw new Error('No access token returned');
		}

		await saveTokens(data.access_token, data.refresh_token);

		return data.access_token;
	} catch (error) {
		console.error('Telegram auth failed:', error);
		return null;
	}
};
