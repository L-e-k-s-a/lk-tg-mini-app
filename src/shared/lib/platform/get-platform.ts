import { retrieveLaunchParams } from '@tma.js/sdk';

declare global {
	interface Window {
		Telegram?: {
			WebApp?: any;
		};
	}
}

export type AppPlatform = 'ios' | 'android' | 'web' | 'tg' | 'unknown';

export const detectPlatform = (): AppPlatform => {
	const RNPlatform = require('react-native').Platform;
	if (RNPlatform.OS === 'ios') return 'ios';
	if (RNPlatform.OS === 'android') return 'android';

	if (typeof window !== 'undefined') {
		// Telegram Web
		if (window?.Telegram?.WebApp) return 'tg';

		// TMA MiniApp detection
		try {
			const launchParams = retrieveLaunchParams();
			if (launchParams?.tmaApp) return 'tg';
		} catch (e) {
			// Not in miniapp
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
