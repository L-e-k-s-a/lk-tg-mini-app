// features/max/hooks/useMaxAuth.ts

import {
	AppPlatform,
	detectPlatform,
	getPlatformName,
	isMobilePlatform,
	isTgPlatform,
} from '@/shared/lib/platform/get-platform';
import { useEffect, useState } from 'react';

declare global {
	interface Window {
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
	const [platform, setPlatform] = useState<AppPlatform>('unknown');

	useEffect(() => {
		if (typeof window !== 'undefined') {
			// Сначала определяем платформу
			const initialPlatform = detectPlatform();
			setPlatform(initialPlatform);

			initializeTgWebApp();
		}
	}, []);

	const initializeTgWebApp = () => {
		const webApp = window.Telegram?.WebApp;

		if (webApp) {
			console.log('Telegram WebApp найден:', {
				platform: webApp.platform,
				version: webApp.version,
				initData: webApp.initDataUnsafe,
			});

			handleTgInit(webApp);
			setIsLoading(false);
		} else {
			console.log('Telegram WebApp не найден, проверяем наличие Telegram');

			// Проверяем, открыто ли приложение в Telegram
			const isTelegram = isTgPlatform(detectPlatform());

			if (isTelegram) {
				console.log('Обнаружена среда Telegram, ожидаем инициализацию');

				// В мобильных приложениях WebApp может инициализироваться с задержкой
				let attempts = 0;
				const checkInterval = setInterval(() => {
					attempts++;
					const retryWebApp = window.Telegram?.WebApp;

					if (retryWebApp) {
						console.log(
							'Telegram WebApp найден после задержки, попытка:',
							attempts,
						);
						clearInterval(checkInterval);
						handleTgInit(retryWebApp);
						setIsLoading(false);
					} else if (attempts >= 10) {
						// Максимум 5 секунд
						clearInterval(checkInterval);
						console.log('Telegram WebApp не инициализировался');
						setIsLoading(false);

						// Обновляем платформу на случай изменений
						setPlatform(detectPlatform());
					}
				}, 500);
			} else {
				// Если не в Telegram, загружаем скрипт для веб-версии
				loadTgScript();
			}
		}
	};

	const loadTgScript = () => {
		// Проверяем, не в Telegram ли мы (для надежности)
		if (isTgPlatform(platform)) {
			console.log('Уже в Telegram, скрипт не загружаем');
			return;
		}

		const script = document.createElement('script');
		script.src = 'https://telegram.org/js/telegram-web-app.js?59';
		script.async = true;

		script.onload = () => {
			console.log('Tg Bridge loaded');
			setTimeout(() => {
				const webApp = window.Telegram?.WebApp;
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
		console.log('Инициализация Telegram WebApp:', {
			platform: webApp.platform,
			version: webApp.version,
			initDataUnsafe: webApp.initDataUnsafe,
		});

		setTgWebApp(webApp);

		// Обновляем платформу после инициализации WebApp
		const updatedPlatform = detectPlatform();
		setPlatform(updatedPlatform);
		console.log('Платформа определена:', getPlatformName(updatedPlatform));

		const user = webApp.initDataUnsafe?.user;
		if (user) {
			console.log('Пользователь Telegram:', user);
			setTgUser(user);
		}

		// Expand the WebApp to full height
		try {
			webApp.expand();
		} catch (e) {
			console.error('Error expanding WebApp:', e);
		}

		webApp.ready();
		setTgInitialized(true);
		console.log('Telegram WebApp инициализирован');
	};

	return {
		tgInitialized,
		tgUser,
		tgWebApp,
		isLoading,
		platform,
		platformName: getPlatformName(platform),
		isTg: isTgPlatform(platform),
		isMobile: isMobilePlatform(platform),
		isTgEnvironment: isTgPlatform(platform),
		userAgent:
			typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
	};
};
