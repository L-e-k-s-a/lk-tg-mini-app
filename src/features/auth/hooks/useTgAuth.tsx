// features/max/hooks/useMaxAuth.ts
import { useEffect, useState } from 'react';

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
	const [tgWebApp, setTgWebApp] = useState<any | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			// Проверяем, не загружен ли уже скрипт
			if (window.Telegram?.WebApp || window.WebApp) {
				const webApp = window.Telegram?.WebApp || window.WebApp;
				handleTgInit(webApp);
				setIsLoading(false);
			} else {
				loadTgScript();
			}
		}
	}, []);

	const loadTgScript = () => {
		const script = document.createElement('script');
		script.src = 'https://telegram.org/js/telegram-web-app.js?59';
		script.async = true;

		script.onload = () => {
			console.log('Tg Bridge loaded');
			// Даем немного времени на инициализацию
			setTimeout(() => {
				const webApp = window.Telegram?.WebApp || window.WebApp;
				if (webApp) {
					handleTgInit(webApp);
				} else {
					console.error('WebApp not found after script load');
				}
				setIsLoading(false);
			}, 200);
		};

		script.onerror = () => {
			console.error('Failed to load Tg Bridge');
			setIsLoading(false);
		};

		document.head.appendChild(script);
	};

	const handleTgInit = (webApp: any) => {
		setTgWebApp(webApp);
		setTgInitialized(true);

		const user = webApp.initDataUnsafe?.user;
		if (user) {
			setTgUser(user);
		}

		// Expand the WebApp to full height
		webApp.expand();

		console.log('Telegram WebApp инициализирован');
		console.log('Platform:', webApp.platform);
		console.log('Version:', webApp.version);
	};

	// Функция для получения платформы с проверкой
	const getPlatform = () => {
		if (tgWebApp?.platform) {
			return tgWebApp.platform;
		}

		// Попытка получить платформу из глобального объекта
		const webApp = window.Telegram?.WebApp || window.WebApp;
		return webApp?.platform || 'unknown';
	};

	// Функция для определения мобильного устройства
	const isMobile = () => {
		const platform = getPlatform();
		return (
			platform === 'ios' || platform === 'android' || platform === 'mobile'
		);
	};

	return {
		tgInitialized,
		tgUser,
		tgWebApp,
		isLoading,
		isTgEnvironment:
			typeof window !== 'undefined' &&
			(!!window.Telegram?.WebApp || !!window.WebApp || tgInitialized),
		platform: getPlatform(),
		isMobile: isMobile(),
	};
};
