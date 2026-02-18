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
	| 'ios' // Нативное iOS приложение
	| 'android' // Нативное Android приложение
	| 'web' // Обычный веб-браузер
	| 'tgWeb' // Telegram Web (десктопная версия)
	| 'tgIos' // Telegram iOS приложение
	| 'tgAndroid' // Telegram Android приложение
	| 'tgMacos' // Telegram macOS приложение
	| 'tgWindows' // Telegram Windows приложение
	| 'unknown';

export const detectPlatform = (): AppPlatform => {
	// 1. Сначала проверяем React Native платформу
	if (RNPlatform.OS === 'ios') return 'ios';
	if (RNPlatform.OS === 'android') return 'android';

	// 2. Для веба - детектим окружение
	if (RNPlatform.OS === 'web' && typeof window !== 'undefined') {
		// Проверяем наличие Telegram WebApp
		const tgWebApp = window.Telegram?.WebApp;
		const userAgent = window.navigator.userAgent.toLowerCase();

		// Если есть WebApp - мы в Telegram окружении
		if (tgWebApp) {
			// Используем платформу из WebApp если доступна
			if (tgWebApp.platform) {
				const tgPlatform = tgWebApp.platform.toLowerCase();

				// Маппинг платформ Telegram в наши типы
				if (tgPlatform.includes('ios')) return 'tgIos';
				if (tgPlatform.includes('android')) return 'tgAndroid';
				if (tgPlatform.includes('macos')) return 'tgMacos';
				if (tgPlatform.includes('windows')) return 'tgWindows';
				if (tgPlatform.includes('web')) return 'tgWeb';
			}

			// Fallback на user-agent если платформа не определена
			if (userAgent.includes('iphone') || userAgent.includes('ipad'))
				return 'tgIos';
			if (userAgent.includes('android')) return 'tgAndroid';
			if (userAgent.includes('mac')) return 'tgMacos';
			if (userAgent.includes('windows')) return 'tgWindows';

			return 'tgWeb';
		}

		// Проверяем user-agent на наличие Telegram
		if (userAgent.includes('telegram')) {
			if (userAgent.includes('iphone') || userAgent.includes('ipad'))
				return 'tgIos';
			if (userAgent.includes('android')) return 'tgAndroid';
			if (userAgent.includes('mac')) return 'tgMacos';
			if (userAgent.includes('windows')) return 'tgWindows';
			return 'tgWeb';
		}

		// Обычный веб-браузер
		return 'web';
	}

	return 'unknown';
};

// Вспомогательная функция для проверки типа платформы
export const isTgPlatform = (platform: AppPlatform): boolean => {
	return platform.startsWith('tg');
};

export const isMobilePlatform = (platform: AppPlatform): boolean => {
	return (
		platform === 'ios' ||
		platform === 'android' ||
		platform === 'tgIos' ||
		platform === 'tgAndroid'
	);
};

export const getPlatformName = (platform: AppPlatform): string => {
	const names: Record<AppPlatform, string> = {
		ios: 'iOS Native',
		android: 'Android Native',
		web: 'Web Browser',
		tgWeb: 'Telegram Web',
		tgIos: 'Telegram iOS',
		tgAndroid: 'Telegram Android',
		tgMacos: 'Telegram macOS',
		tgWindows: 'Telegram Windows',
		unknown: 'Unknown',
	};
	return names[platform];
};
