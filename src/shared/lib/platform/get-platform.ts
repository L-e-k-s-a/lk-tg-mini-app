// lib/platform/detect.ts
import { Platform as RNPlatform } from 'react-native';

declare global {
	interface Window {
		Telegram?: {
			WebApp?: any;
		};
	}
}

export type AppPlatform =
	| 'ios'
	| 'android'
	| 'web'
	| 'tgWeb'
	| 'tgMobile'
	| 'unknown';

export const detectPlatform = (): AppPlatform => {
	if (RNPlatform.OS === 'ios') return 'ios';
	if (RNPlatform.OS === 'android') return 'android';

	if (RNPlatform.OS === 'web') {
		if (typeof window !== 'undefined') {
			// Проверяем оба возможных места расположения WebApp
			const tgWebApp = window.Telegram?.WebApp;
			if (tgWebApp) return 'tgWeb';

			const userAgent = window.navigator.userAgent.toLowerCase();
			if (userAgent.includes('telegram')) return 'tgMobile';
		}
		return 'web';
	}

	return 'unknown';
};
