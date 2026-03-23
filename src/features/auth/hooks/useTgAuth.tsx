import {
	AppPlatform,
	detectPlatform,
	getPlatformName,
	isMobilePlatform,
	isTgPlatform,
} from '@/shared/lib/platform/get-platform';
import { init as initTmaSDK, retrieveRawInitData } from '@tma.js/sdk';
import { useEffect, useState } from 'react';

export const useTgAuth = () => {
	const [tgInitialized, setTgInitialized] = useState(false);
	const [tgUser, setTgUser] = useState<any | null>(null);
	const [tgWebApp, setTgWebApp] = useState<any | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [platform, setPlatform] = useState<AppPlatform>('unknown');
	const [rawInitData, setRawInitData] = useState<string | null>(null);

	useEffect(() => {
		const initialize = async () => {
			if (typeof window === 'undefined') return;

			try {
				// Initialize TMA SDK
				const webApp: any = await initTmaSDK();

				if (webApp) {
					setTgWebApp(webApp);

					// Get platform info
					const currentPlatform = detectPlatform();
					setPlatform(currentPlatform);

					// Get user data
					const user = webApp.initDataUnsafe?.user;
					if (user) {
						setTgUser(user);
					}

					// Retrieve raw init data
					const initData = retrieveRawInitData();
					if (initData) {
						setRawInitData(initData);
					}

					// Expand WebApp
					try {
						webApp.expand();
					} catch (e) {
						console.error('Error expanding WebApp:', e);
					}

					webApp.ready();
					setTgInitialized(true);
				}
			} catch (error) {
				console.error('Failed to initialize TMA SDK:', error);
				setPlatform(detectPlatform());
			} finally {
				setIsLoading(false);
			}
		};

		initialize();
	}, []);

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
		rawInitData,
	};
};
