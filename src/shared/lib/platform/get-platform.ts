// lib/platform/detect.ts
import { Platform as RNPlatform } from 'react-native';

declare global {
	interface Window {
		Telegram?: {
			WebApp?: any;
		};
	}
}

export type AppPlatform = 'ios' | 'android' | 'web' | 'tg' | 'unknown';

export const detectPlatform = (): AppPlatform => {
	if (RNPlatform.OS === 'ios') return 'ios';
	if (RNPlatform.OS === 'android') return 'android';

	// ✅ Web check
	if (typeof window !== 'undefined') {
		if (window?.Telegram?.WebApp) {
			return 'tg';
		}

		return 'web';
	}

	return 'unknown';
};

// Simple helpers
export const isTgPlatform = (platform: AppPlatform): boolean => {
	return platform === 'tg';
};

export const isMobilePlatform = (platform: AppPlatform): boolean => {
	return platform === 'ios' || platform === 'android';
};

export const getPlatformName = (platform: AppPlatform): string => {
	switch (platform) {
		case 'ios':
			return 'iOS';
		case 'android':
			return 'Android';
		case 'tg':
			return 'Telegram';
		case 'web':
			return 'Web';
		default:
			return 'Unknown';
	}
};
