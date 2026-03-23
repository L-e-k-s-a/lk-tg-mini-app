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
		if (typeof window === 'undefined') return;

		const initializeTE = pipe(
			isTMAFp('complete'),
			TE.chain((isTMA) => {
				setIsTgEnvironment(isTMA);

				if (!isTMA) {
					return TE.right(null);
				}

				// Initialize SDK - wrap the Promise in TaskEither
				return TE.tryCatch(
					async () => initTmaSDK(),
					(error) =>
						new Error(`Failed to initialize TMA SDK: ${String(error)}`),
				);
			}),
			TE.chain((webApp: any) => {
				if (!webApp) {
					return TE.right(null);
				}

				// Process WebApp data
				setTgWebApp(webApp);

				const user = webApp.initDataUnsafe?.user;
				if (user) {
					setTgUser(user);
				}

				const initData = retrieveRawInitData();
				if (initData) {
					setRawInitData(initData);
				}

				try {
					webApp.expand();
				} catch (e) {
					console.error('Error expanding WebApp:', e);
				}

				webApp.ready();
				setTgInitialized(true);

				return TE.right(webApp);
			}),
		);

		// Execute the TaskEither
		const run = async () => {
			try {
				await initializeTE();
			} catch (error) {
				console.error('Failed to initialize:', error);
			} finally {
				setIsLoading(false);
			}
		};

		run();
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
