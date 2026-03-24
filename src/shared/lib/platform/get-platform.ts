import { retrieveLaunchParams } from '@tma.js/sdk';

declare global {
	interface Window {
		Telegram?: {
			WebApp?: any;
		};
		TmaWebApp?: any; // TMA MiniApp global object
	}
}

export type AppPlatform = 'ios' | 'android' | 'web' | 'tg' | 'unknown';

/**
 * Checks if the app is running inside a TMA MiniApp.
 */
export const isTmaMiniApp = (): boolean => {
	try {
		const params = retrieveLaunchParams();
		return params?.tgWebAppPlatform !== null;
	} catch {
		return false;
	}
};

/**
 * Detect the platform the app is running on.
 */
export const detectPlatform = (): AppPlatform => {
	// 1️⃣ React Native detection
	try {
		const RNPlatform = require('react-native').Platform;
		if (RNPlatform.OS === 'ios') return 'ios';
		if (RNPlatform.OS === 'android') return 'android';
	} catch {
		// Not in React Native
	}

	// 2️⃣ Web / Telegram / TMA detection
	if (typeof window !== 'undefined') {
		// Telegram WebApp
		if (window?.Telegram?.WebApp) return 'tg';

		// TMA MiniApp
		if (isTmaMiniApp()) return 'tg';

		// Regular Web
		return 'web';
	}

	// Unknown environment
	return 'unknown';
};

/**
 * Helpers
 */
export const isTgPlatform = (platform: AppPlatform): boolean =>
	platform === 'tg';
export const isMobilePlatform = (platform: AppPlatform): boolean =>
	platform === 'ios' || platform === 'android';

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
