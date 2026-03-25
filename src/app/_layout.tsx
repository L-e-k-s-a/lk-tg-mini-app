import { useMe } from '@/shared/api';
import { AppDefaultTheme } from '@/shared/constants/theme';
import { ApolloProvider, AppContextProvider } from '@/shared/lib';
import { Loader } from '@/shared/ui';
import { useUserInfoStore } from '@/shared/zustand/user-info/user-info.store';
import { ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

const InitialLayout = () => {
	const { data, loading, error } = useMe();
	const { setMe, setInfo } = useUserInfoStore();

	// Update store when data is available
	useEffect(() => {
		if (data?.me) {
			setMe(data.me);
		}
	}, [data, setMe, setInfo]);

	const isAuthenticated = !loading && !error && data?.me;

	if (loading) {
		return <Loader />;
	}

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Protected guard={isAuthenticated}>
				<Stack.Screen name='(tabs)' />
			</Stack.Protected>
			<Stack.Protected guard={!isAuthenticated}>
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
