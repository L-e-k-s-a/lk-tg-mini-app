import { isTMAFp } from '@tma.js/bridge';
import { init as initTmaSDK, retrieveRawInitData } from '@tma.js/sdk';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { useEffect, useState } from 'react';

export const useTgAuth = () => {
	const [tgInitialized, setTgInitialized] = useState(false);
	const [tgUser, setTgUser] = useState<any | null>(null);
	const [tgWebApp, setTgWebApp] = useState<any | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isTgEnvironment, setIsTgEnvironment] = useState(false);
	const [rawInitData, setRawInitData] = useState<string | null>(null);

	useEffect(() => {
		const initialize = async () => {
			if (typeof window === 'undefined') return;

			try {
				// Check if running in Telegram environment using fp-ts
				const result: any = await pipe(
					isTMAFp('complete'),
					TE.match(
						(error: any) => {
							console.error('Error checking TMA environment:', error);
							return { isTMA: false, error };
						},
						(isTMA) => ({ isTMA, error: null }),
					),
				)();

				if (result.error) {
					setIsTgEnvironment(false);
					setIsLoading(false);
					return;
				}

				const isTMA = result.isTMA;
				setIsTgEnvironment(isTMA);

				if (isTMA) {
					// Initialize TMA SDK - this returns a Promise
					const webApp: any = await initTmaSDK();

					if (webApp) {
						setTgWebApp(webApp);

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
				}
			} catch (error) {
				console.error('Failed to initialize:', error);
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
		isTg: isTgEnvironment,
		isTgEnvironment,
		rawInitData,
	};
};
