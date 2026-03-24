import { EndPoints, isDev } from '@/shared/constants/base';
import {
	detectPlatform,
	isTgPlatform,
} from '@/shared/lib/platform/get-platform';
import {
	ApolloClient,
	ApolloLink,
	HttpLink,
	InMemoryCache,
	split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { retrieveRawInitData } from '@tma.js/sdk';
import * as SecureStore from 'expo-secure-store';
import { createClient } from 'graphql-ws';

//
// -----------------------------
// utils
// -----------------------------

const getCookie = (name: string) => {
	if (typeof document === 'undefined') return null;
	const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
	return match ? decodeURIComponent(match[2]) : null;
};

//
// -----------------------------
// AUTH HEADERS (ГЛАВНОЕ)
// -----------------------------

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
	try {
		const platform = detectPlatform();
		console.log('platfrom', platform);
		// ✅ Telegram Mini App
		if (isTgPlatform(platform)) {
			// const initData = window?.Telegram?.WebApp?.initData;
			const initData = retrieveRawInitData();
			if (initData) {
				return {
					Authorization: `tma ${initData}`,
				};
			}

			console.warn('No initData in Telegram WebApp');
			return {};
		}

		// ✅ Web (cookie)
		if (platform === 'web') {
			const token = getCookie('access_token');
			return token ? { 'x-access-token': token } : {};
		}

		// ✅ Native (Expo)
		const token = await SecureStore.getItemAsync('access_token');
		return token ? { 'x-access-token': token } : {};
	} catch (error) {
		console.error('Failed to get auth headers', error);
		return {};
	}
};

//
// -----------------------------
// HTTP LINK
// -----------------------------

const httpLink = new HttpLink({
	uri: `${EndPoints.api}/graphql`,
	credentials: 'include',
});

//
// -----------------------------
// WS LINK (С АВТОРИЗАЦИЕЙ)
// -----------------------------

const wsClient = createClient({
	url: EndPoints.wss,
	keepAlive: 10000,

	connectionParams: async () => {
		const headers = await getAuthHeaders();
		return headers;
	},

	on: {
		connecting: () => console.log('WS connecting'),
		connected: () => console.log('WS connected'),
		closed: (e) => console.log('WS closed', e),
		error: (e) => console.log('WS error', e),
	},
});

const wsLink = new GraphQLWsLink(wsClient);

//
// -----------------------------
// ERROR LINK
// -----------------------------

const errorLink = onError(({ error }: any) => {
	if (!error) return;

	if ('errors' in error) {
		error.errors.forEach(({ message, locations, path }: any) => {
			console.error(`[GraphQL error]: ${message}`, locations, path);
		});
	} else {
		console.error('[Network error]:', error);
	}
});

//
// -----------------------------
// AUTH LINK
// -----------------------------

const authLink = setContext(async (_, { headers }) => {
	const authHeaders = await getAuthHeaders();

	return {
		headers: {
			...headers,
			...authHeaders,
		},
	};
});

//
// -----------------------------
// SPLIT LINK (HTTP / WS)
// -----------------------------

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === 'OperationDefinition' &&
			definition.operation === 'subscription'
		);
	},
	wsLink,
	httpLink,
);

//
// -----------------------------
// APOLLO CLIENT
// -----------------------------

export const apolloClient = new ApolloClient({
	link: ApolloLink.from([errorLink, authLink, splitLink]),
	cache: new InMemoryCache(),
	queryDeduplication: false,
	devtools: {
		enabled: isDev,
	},
});
