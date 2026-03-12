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
			const initialPlatform = detectPlatform();
			setPlatform(initialPlatform);

			initializeTgWebApp();
		}
	}, []);

	const initializeTgWebApp = () => {
		const webApp = window.Telegram?.WebApp;
		if (webApp) {
			handleTgInit(webApp);
			setIsLoading(false);
		} else {
			const isTelegram = isTgPlatform(detectPlatform());

			if (isTelegram) {
				let attempts = 0;
				const checkInterval = setInterval(() => {
					attempts++;
					const retryWebApp = window.Telegram?.WebApp;

					if (retryWebApp) {
						clearInterval(checkInterval);
						handleTgInit(retryWebApp);
						setIsLoading(false);
					} else if (attempts >= 10) {
						clearInterval(checkInterval);
						setIsLoading(false);
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
		const script = document.createElement('script');
		script.src = 'https://telegram.org/js/telegram-web-app.js?59';
		script.async = true;
		script.onload = () => {
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
		setTgWebApp(webApp);
		const updatedPlatform = detectPlatform();
		setPlatform(updatedPlatform);

		const user = webApp.initDataUnsafe?.user;
		if (user) {
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
