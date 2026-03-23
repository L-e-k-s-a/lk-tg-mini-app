import { init, retrieveLaunchParams } from '@tma.js/sdk';
import { useEffect, useState } from 'react';

export const useTgAuth = () => {
	const [tgUser, setTgUser] = useState<any>(null);
	const [tgWebApp, setTgWebApp] = useState<any>(null);
	const [tgInitialized, setTgInitialized] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [rawInitData, setRawInitData] = useState<any>('');

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const isTg = !!window.Telegram?.WebApp;

		if (!isTg) {
			console.warn('Not in Telegram environment');
			setIsLoading(false);
			return;
		}

		try {
			const app: any = init();
			setTgWebApp(app);

			const user = app.initDataUnsafe?.user;
			if (user) setTgUser(user);

			const { tgWebAppData: initData } = retrieveLaunchParams();
			setRawInitData(initData);

			app.ready();
			app.expand();

			setTgInitialized(true);
		} catch (e) {
			console.error('TG init error:', e);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';

	const isMobile = /Android|iPhone|iPad|iPod/i.test(userAgent);

	const platform = tgWebApp?.platform || 'unknown';

	const platformNameMap: Record<string, string> = {
		ios: 'iOS',
		android: 'Android',
		web: 'Web',
		tdesktop: 'Telegram Desktop',
	};

	const platformName = platformNameMap[platform] || platform;

	const isTg = !!tgWebApp;

	return {
		tgInitialized,
		tgUser,
		isLoading,
		platform,
		platformName,
		isTg,
		isMobile,
		userAgent,
		rawInitData,
		tgWebApp,
	};
};
