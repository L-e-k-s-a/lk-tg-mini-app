// features/max/hooks/useMaxAuth.ts
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export const useTgAuth = () => {
	const [tgInitialized, setTgInitialized] = useState(false);
	const [tgUser, setTgUser] = useState<any | null>(null);

	useEffect(() => {
		if (Platform.OS === 'web' && typeof window !== 'undefined') {
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

		// Подробное логирование
		console.log('Telegram WebApp данные:', {
			initData: webApp.initData,
			initDataUnsafe: webApp.initDataUnsafe,
			version: webApp.version,
			platform: webApp.platform,
		});

		const user = webApp.initDataUnsafe?.user;
		if (user) {
			console.log('Пользователь TG:', user);
			setTgUser(user);
		}

		if (webApp.themeParams) {
			applyTgTheme(webApp.themeParams);
		}

		webApp.ready();
		console.log('Telegram WebApp инициализирован');
	};

	const applyTgTheme = (themeParams: any) => {
		// Ваша логика применения темы
		console.log('Применяем тему:', themeParams);
	};

	return {
		tgInitialized,
		tgUser,
		isTgEnvironment:
			Platform.OS === 'web' && (!!window.Telegram?.WebApp || !!window.WebApp),
	};
};
