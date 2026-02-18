import { useMaxAuth } from '@/features/auth/hooks/useMaxAuth';
import { useTgAuth } from '@/features/auth/hooks/useTgAuth';
import { Loader } from '@/shared';
import { AppDefaultTheme } from '@/shared/constants/theme';
import { ApolloProvider, AppContextProvider } from '@/shared/lib';
import { ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, Text, View } from 'react-native';

// Компонент для инициализации MAX
const MaxInitializer = ({ children }: { children: React.ReactNode }) => {
	const { maxInitialized, isMaxEnvironment } = useMaxAuth();

	// Показываем загрузку пока MAX инициализируется
	if (isMaxEnvironment && !maxInitialized) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Loader />
				<Text style={{ marginTop: 10 }}>Подключение к MAX...</Text>
			</View>
		);
	}

	return <>{children}</>;
};
// Компонент для инициализации MAX
const TGInitializer = ({ children }: { children: React.ReactNode }) => {
	const { tgInitialized, isTgEnvironment } = useTgAuth();

	// Показываем загрузку пока MAX инициализируется
	if (isTgEnvironment && !tgInitialized) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Loader />
				<Text style={{ marginTop: 10 }}>Подключение к MAX...</Text>
			</View>
		);
	}

	return <>{children}</>;
};
const InitialLayout = () => {
	// const { isAuth, loading, checkAuth } = useAuthStore();

	// useEffect(() => {
	// 	checkAuth();
	// }, []);

	// if (loading) return <Loader />;

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Protected guard={false}>
				<Stack.Screen name='(tabs)' />
			</Stack.Protected>

			<Stack.Protected guard={!false}>
				<Stack.Screen name='(tg)' />
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
					<TGInitializer>
						<InitialLayout />
					</TGInitializer>
					<StatusBar style='auto' />
				</ThemeProvider>
			</AppContextProvider>
		</ApolloProvider>
	);
}
