import { EndPoints, isDev } from '@/shared/constants/base';
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
import * as SecureStore from 'expo-secure-store';
import { createClient } from 'graphql-ws';
import { Platform } from 'react-native';

const getCookie = (name: string) => {
	const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
	return match ? decodeURIComponent(match[2]) : null;
};

export const getAccessToken = async (): Promise<Record<string, string>> => {
	try {
		let token: string | null = null;

		if (Platform.OS === 'web') {
			token = getCookie('access_token');
		} else {
			token = await SecureStore.getItemAsync('access_token');
		}

		return token ? { 'x-access-token': token } : {};
	} catch (error) {
		console.error('Failed to get access token', error);
		return {};
	}
};

const httpLink = new HttpLink({
	uri: `${EndPoints.api}/graphql`,
	credentials: 'include',
});

const wsClient = createClient({
	url: EndPoints.wss,
	keepAlive: 10000,
	on: {
		connecting: () => console.log('WS connecting'),
		connected: () => console.log('WS connected'),
		closed: (e) => console.log('WS closed', e),
		error: (e) => console.log('WS error', e),
	},
});

const wsLink = new GraphQLWsLink(wsClient);

const errorLink = onError(({ error }: any) => {
	if (!error) return;

	if ('errors' in error) {
		error.errors.forEach(({ message, locations, path }: any) => {
			console.error(
				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
			);
		});
	} else {
		console.error('[Network error]:', error);
	}
});

const authLink = setContext(async (_, { headers }) => {
	const tokenHeaders = await getAccessToken();
	return {
		headers: {
			...headers,
			...tokenHeaders,
		},
	};
});

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

export const apolloClient = new ApolloClient({
	link: ApolloLink.from([errorLink, authLink, splitLink]),
	cache: new InMemoryCache(),
	queryDeduplication: false,
	devtools: {
		enabled: isDev ? true : false,
	},
});
