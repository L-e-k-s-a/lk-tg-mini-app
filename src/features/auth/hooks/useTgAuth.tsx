// features/max/hooks/useMaxAuth.ts
import { detectPlatform } from '@/shared/lib/platform/get-platform';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

declare global {
	interface Window {
		WebApp?: any;
		Telegram?: {
			WebApp?: any;
		};
	}
}

export const useTgAuth = () => {
	const [tgInitialized, setTgInitialized] = useState(false);
	const [tgUser, setTgUser] = useState<any | null>(null);
	const PLATFORM = detectPlatform();
	useEffect(() => {
		if (
			(PLATFORM === 'tgWeb' || PLATFORM === 'tgMobile') &&
			typeof window !== 'undefined'
		) {
			loadTgScript();
		}
	}, []);

	const loadTgScript = () => {
		// Проверяем через Telegram объект
		if (window.Telegram?.WebApp) {
			handleTgInit(window.Telegram.WebApp);
			return;
		}

		// Альтернативная проверка
		if (window.WebApp) {
			handleTgInit(window.WebApp);
			return;
		}

		// Подключаем скрипт
		const script = document.createElement('script');
		script.src = 'https://telegram.org/js/telegram-web-app.js?59';
		script.async = true;

		script.onload = () => {
			console.log('Tg Bridge loaded');
			setTimeout(() => {
				if (window.Telegram?.WebApp) {
					handleTgInit(window.Telegram.WebApp);
				} else if (window.WebApp) {
					handleTgInit(window.WebApp);
				} else {
					console.error('WebApp not found after script load');
				}
			}, 100);
		};

		script.onerror = () => {
			console.error('Failed to load Tg Bridge');
		};

		document.head.appendChild(script);
	};

	const handleTgInit = (webApp: any) => {
		// Используйте any или импортированный тип
		setTgInitialized(true);

		const user = webApp.initDataUnsafe?.user;
		if (user) {
			setTgUser(user);
		}

		webApp.ready();
		console.log('Telegram WebApp инициализирован');
	};

	return {
		tgInitialized,
		tgUser,
		isTgEnvironment:
			Platform.OS === 'web' && (!!window.Telegram?.WebApp || !!window.WebApp),
	};
};
