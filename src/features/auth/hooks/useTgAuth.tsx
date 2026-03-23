import { retrieveLaunchParams, retrieveRawInitData } from '@tma.js/sdk';
import { useEffect, useState } from 'react';

export const useTgAuth = () => {
	const [tgInitialized, setTgInitialized] = useState(false);
	const [tgUser, setTgUser] = useState<any | null>(null);
	const [rawInitData, setRawInitData] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		try {
			// raw init data (for backend later)
			const initData = retrieveRawInitData();
			if (initData) {
				setRawInitData(initData);
			}

			// parsed Telegram data
			const launchParams = retrieveLaunchParams();

			if (launchParams?.tgWebAppData?.user) {
				setTgUser(launchParams.tgWebAppData.user);
			}

			setTgInitialized(true);
		} catch (error) {
			console.error('Telegram SDK init error:', error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	return {
		tgInitialized,
		tgUser,
		rawInitData,
		isLoading,
	};
};
