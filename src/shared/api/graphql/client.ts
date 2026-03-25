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
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition, Observable } from '@apollo/client/utilities';
import { retrieveRawInitData } from '@tma.js/sdk';
import * as SecureStore from 'expo-secure-store';
import { createClient } from 'graphql-ws';

const getCookie = (name: string) => {
	if (typeof document === 'undefined') return null;
	const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
	return match ? decodeURIComponent(match[2]) : null;
};

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
	try {
		const platform = detectPlatform();
		if (isTgPlatform(platform)) {
			const initData = retrieveRawInitData();
			if (initData) {
				return { Authorization: `tma ${initData}` };
			}
			console.warn('No initData in Telegram WebApp');
			return {};
		}
		if (platform === 'web') {
			const token = getCookie('access_token');
			return token ? { 'x-access-token': token } : {};
		}
		const token = await SecureStore.getItemAsync('access_token');
		return token ? { 'x-access-token': token } : {};
	} catch (error) {
		console.error('Failed to get auth headers', error);
		return {};
	}
};

const authLink = new ApolloLink((operation, forward) => {
	return new Observable((observer) => {
		let isSubscription = false;
		const definition = getMainDefinition(operation.query);
		if (
			definition.kind === 'OperationDefinition' &&
			definition.operation === 'subscription'
		) {
			isSubscription = true;
		}

		// Get auth headers
		getAuthHeaders()
			.then((authHeaders) => {
				// Set headers on the operation context
				operation.setContext(({ headers = {} }) => ({
					headers: {
						...headers,
						...authHeaders,
					},
				}));

				// For non-subscriptions, we can proceed with the request
				if (!isSubscription) {
					const subscription = forward(operation).subscribe({
						next: observer.next.bind(observer),
						error: observer.error.bind(observer),
						complete: observer.complete.bind(observer),
					});

					return () => {
						subscription.unsubscribe();
					};
				} else {
					// For subscriptions, just forward (wsLink handles auth)
					const subscription = forward(operation).subscribe({
						next: observer.next.bind(observer),
						error: observer.error.bind(observer),
						complete: observer.complete.bind(observer),
					});

					return () => {
						subscription.unsubscribe();
					};
				}
			})
			.catch((error) => {
				console.error('Error getting auth headers:', error);
				observer.error(error);
			});
	});
});

const httpLink = new HttpLink({
	uri: `${EndPoints.api}/graphql`,
	credentials: 'include',
	fetchOptions: {
		credentials: 'include',
	},
});

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

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
	if (graphQLErrors) {
		graphQLErrors.forEach(({ message, locations, path, extensions }) => {
			console.error(
				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
				extensions,
			);

			// ✅ Handle 401 errors
			if (extensions?.code === 'UNAUTHENTICATED' || message.includes('401')) {
				console.error('Authentication error, headers might be missing');
				// Log the headers that were sent
				const context = operation.getContext();
				console.error('Request headers:', context.headers);
			}
		});
	}

	if (networkError) {
		console.error(`[Network error]: ${networkError}`);

		// ✅ Log network error details
		if (networkError.message) {
			console.error('Network error message:', networkError.message);
		}
		if ('statusCode' in networkError) {
			console.error('Status code:', networkError.statusCode);
		}
	}
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
		enabled: isDev,
	},
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'network-only',
			errorPolicy: 'all',
		},
		query: {
			fetchPolicy: 'network-only',
			errorPolicy: 'all',
		},
		mutate: {
			errorPolicy: 'all',
		},
	},
});
