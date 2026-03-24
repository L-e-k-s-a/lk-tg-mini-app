import { signInWithTg } from '@/shared/api/http/tg-auth';
import { retrieveLaunchParams, retrieveRawInitData } from '@tma.js/sdk';
import { useEffect, useState } from 'react';

export const useTgAuth = () => {
	const [tgInitialized, setTgInitialized] = useState(false);
	const [tgUser, setTgUser] = useState<any | null>(null);
	const [rawInitData, setRawInitData] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const init = async () => {
			try {
				const initData = retrieveRawInitData();

				if (initData) {
					setRawInitData(initData);
					await signInWithTg(initData);
				}

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
		};

		init();
	}, []);

	return {
		tgInitialized,
		tgUser,
		rawInitData,
		isLoading,
	};
};
