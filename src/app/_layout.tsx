import { useAuthStore } from '@/features/auth';
import { useTgAuth } from '@/features/auth/hooks/useTgAuth';
import { Loader } from '@/shared';
import { AppDefaultTheme } from '@/shared/constants/theme';
import { ApolloProvider, AppContextProvider } from '@/shared/lib';
import { ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

const InitialLayout = () => {
	const { isAuth, loading, loginWithTelegram } = useAuthStore();
	const { tgWebApp, tgInitialized, isLoading } = useTgAuth();
	const [telegramChecked, setTelegramChecked] = useState(false);

	// useEffect(() => {
	// 	const tryTelegramLogin = async () => {
	// 		if (!tgInitialized) return;
	// 		if (!tgWebApp?.initData) {
	// 			setTelegramChecked(true);
	// 			return;
	// 		}

	// 		try {
	// 			await loginWithTelegram(tgWebApp.initData);
	// 		} catch (e) {
	// 			console.log('[Telegram login failed]');
	// 		} finally {
	// 			setTelegramChecked(true);
	// 		}
	// 	};

	// 	tryTelegramLogin();
	// }, [tgInitialized]);

	if (isLoading) return <Loader />;

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Protected guard={true}>
				<Stack.Screen name='(tabs)' />
			</Stack.Protected>

			<Stack.Protected guard={!true}>
				<Stack.Screen name='(auth)' />
			</Stack.Protected>

			<Stack.Screen name='+not-found' />
		</Stack>
	);
};

export default function RootLayout() {
	useEffect(() => {
		SplashScreen.hideAsync();
	}, []);

	useEffect(() => {
		if (Platform.OS === 'web') {
			document.title = 'ЛК ТГУ';
		}
	}, []);

	return (
		<ApolloProvider>
			<AppContextProvider>
				<ThemeProvider value={AppDefaultTheme}>
					<InitialLayout />
					<StatusBar style='auto' />
				</ThemeProvider>
			</AppContextProvider>
		</ApolloProvider>
	);
}
