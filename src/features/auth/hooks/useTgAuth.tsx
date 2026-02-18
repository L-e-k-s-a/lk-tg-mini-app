// features/max/hooks/useMaxAuth.ts
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
	const [platform, setPlatform] = useState<string>('unknown');
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			initializeTgWebApp();
		}
	}, []);

	const detectPlatform = () => {
		// Пробуем получить платформу из WebApp
		const webApp = window.Telegram?.WebApp;
		if (webApp?.platform && webApp.platform !== 'unknown') {
			return webApp.platform;
		}

		// Определяем по user-agent
		const userAgent = navigator.userAgent || '';
		const vendor = navigator.vendor || '';

		console.log('User Agent:', userAgent);
		console.log('Vendor:', vendor);

		// iOS detection
		if (/iPhone|iPad|iPod/.test(userAgent)) {
			return 'ios';
		}

		// iOS detection for iPadOS 13+
		if (/Mac/.test(userAgent) && 'ontouchend' in document) {
			return 'ios';
		}

		// Android detection
		if (/Android/.test(userAgent)) {
			return 'android';
		}

		// Telegram Web detection
		if (userAgent.includes('Telegram')) {
			if (userAgent.includes('Android')) {
				return 'android';
			}
			if (userAgent.includes('iOS') || userAgent.includes('iPhone')) {
				return 'ios';
			}
			return 'telegram_web';
		}

		return 'unknown';
	};

	const initializeTgWebApp = () => {
		// Проверяем разные варианты доступа к WebApp
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
			const userAgent = navigator.userAgent || '';
			const isTelegram =
				userAgent.includes('Telegram') ||
				userAgent.includes('TApi') ||
				(window as any).Telegram !== undefined;

			if (isTelegram) {
				console.log('Обнаружена среда Telegram, ожидаем инициализацию');

				// В iOS WebApp может инициализироваться с задержкой
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

						// Даже если WebApp не найден, определяем платформу
						const detectedPlatform = detectPlatform();
						setPlatform(detectedPlatform);
					}
				}, 500);
			} else {
				// Если не в Telegram, загружаем скрипт для веб-версии
				loadTgScript();
			}
		}
	};

	const loadTgScript = () => {
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

		// Сохраняем платформу из WebApp или определяем сами
		if (webApp.platform && webApp.platform !== 'unknown') {
			setPlatform(webApp.platform);
		} else {
			const detectedPlatform = detectPlatform();
			setPlatform(detectedPlatform);
			console.log('Платформа определена по user-agent:', detectedPlatform);
		}

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

	// Функция для определения мобильного устройства
	const isMobile = () => {
		const currentPlatform =
			platform !== 'unknown' ? platform : detectPlatform();

		// Проверяем платформу
		if (
			currentPlatform === 'ios' ||
			currentPlatform === 'android' ||
			currentPlatform === 'mobile'
		) {
			return true;
		}

		// Fallback на user-agent
		const userAgent = navigator.userAgent || '';
		return /iPhone|iPad|iPod|Android|Mobile/.test(userAgent);
	};

	// Определяем среду Telegram
	const isTgEnvironment = () => {
		if (typeof window === 'undefined') return false;

		// Проверяем наличие WebApp
		const hasWebApp = !!window.Telegram?.WebApp;

		// Проверяем user-agent
		const userAgent = navigator.userAgent || '';
		const isTelegramUA =
			userAgent.includes('Telegram') || userAgent.includes('TApi');

		// Проверяем наличие Telegram в window
		const hasTelegramGlobal = !!(window as any).Telegram;

		return hasWebApp || isTelegramUA || hasTelegramGlobal;
	};

	return {
		tgInitialized,
		tgUser,
		tgWebApp,
		isLoading,
		platform: platform !== 'unknown' ? platform : detectPlatform(),
		isMobile: isMobile(),
		isTgEnvironment: isTgEnvironment(),
		// Добавляем user-agent для отладки
		userAgent:
			typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
	};
};
