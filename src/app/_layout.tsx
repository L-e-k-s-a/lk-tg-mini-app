import { Loader } from '@/shared';
import { useMe } from '@/shared/api';
import { AppDefaultTheme } from '@/shared/constants/theme';
import { ApolloProvider, AppContextProvider } from '@/shared/lib';
import { ErrorView } from '@/widgets/error-view';
import { ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

const InitialLayout = () => {
	const { data, loading, error } = useMe();
	if (loading) return <Loader />;

	if (error) return <ErrorView error={error} />;
	console.log('data', data);
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Protected guard={!!data}>
				<Stack.Screen name='(tabs)' />
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
