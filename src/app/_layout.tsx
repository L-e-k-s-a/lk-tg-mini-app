import { getUserType } from '@/entities/user';
import {
	mapAuthMeToUser,
	useAuth,
	useAuthActions,
	useMe,
} from '@/features/auth';
import { AppDefaultTheme } from '@/shared/constants/model/theme';
import { ApolloProvider, AppContextProvider, detectPlatform } from '@/shared/lib';
import { platformSlice } from '@/shared/store/platform';
import { Loader } from '@/shared/ui';
import { ErrorView } from '@/widgets/error-view';
import { ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';

const InitialLayout = () => {
	const { data, loading, error } = useMe();
	const isLogged = useAuth();
	// const setUser = useAuthStore((state) => state.setUser);
	const { setUser, setRole } = useAuthActions();
  const { setPlatform } = platformSlice()

	useEffect(() => {
		if (data !== undefined) {
			const user = mapAuthMeToUser(data);
			setUser(user);
			const role = getUserType(user.groups);
			setRole(role);
		}
		const platform = detectPlatform()
    setPlatform(platform)
    console.log(platform)
	}, [data, setUser, setRole]);

	console.log('dgsdg')

	if (loading) return <Loader text='куку'/>;
	if (error) return <ErrorView error={error} />;

	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Protected guard={isLogged}>
				<Stack.Screen name='(tabs)' />
			</Stack.Protected>

			<Stack.Protected guard={!isLogged}>
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
