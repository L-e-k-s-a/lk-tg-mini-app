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
import * as SecureStore from 'expo-secure-store';
import { createClient } from 'graphql-ws';

// Получение токена в зависимости от платформы
export const getAccessToken = async (): Promise<Record<string, string>> => {
	try {
		let token: string | null = null;
		const platform = detectPlatform();

		if (platform === 'web' || isTgPlatform(platform)) {
			// Для веба и Telegram Web используем localStorage
			token = localStorage.getItem('access_token');
		} else {
			// Для нативных платформ используем SecureStore
			token = await SecureStore.getItemAsync('access_token');
		}

		return token ? { 'x-access-token': token } : {};
	} catch (error) {
		console.error('Failed to get access token', error);
		return {};
	}
};

// HTTP link для обычных запросов
const httpLink = new HttpLink({
	uri: `${EndPoints.api}/graphql`,
	credentials: 'include', // можно оставить для cookie, если нужны
});

// WebSocket link для подписок
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

// Линк для обработки ошибок
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

// Линк для добавления токена в заголовки
const authLink = setContext(async (_, { headers }) => {
	const tokenHeaders = await getAccessToken();
	return {
		headers: {
			...headers,
			...tokenHeaders,
		},
	};
});

// Разделение на WS для подписок и HTTP для запросов/мутаций
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

// Apollo Client
export const apolloClient = new ApolloClient({
	link: ApolloLink.from([errorLink, authLink, splitLink]),
	cache: new InMemoryCache(),
	queryDeduplication: false,
	devtools: {
		enabled: isDev,
	},
});
