import Constants from 'expo-constants';
import * as Linking from 'expo-linking';

const APP_ENV = (process.env.EXPO_PUBLIC_APP_ENV ??
	Constants.expoConfig?.extra?.APP_ENV ??
	'local') as 'local' | 'dev' | 'prod';

const DOMAIN =
	process.env.EXPO_PUBLIC_API_DOMAIN ??
	Constants.expoConfig?.extra?.API_DOMAIN ??
	'localhost:9078';

const protocol = APP_ENV === 'local' ? 'http' : 'https';

export const BASE_URL = `${protocol}://${DOMAIN}/api`;

const redirectBase = Linking.createURL('');

export const dev = 'lk-dev.tsutmb.ru';
export const isDev = DOMAIN === dev;

export const EndPoints = {
	domain: DOMAIN,
	api: BASE_URL,
	wss: `${protocol === 'https' ? 'wss' : 'ws'}://${DOMAIN}/api`,
	avatar: `${BASE_URL}/files/avatar`,
	upload: `${BASE_URL}/files/commonStorage`,
	download: `${BASE_URL}/files/uploads`,
	recordbook: `${BASE_URL}/files/recordbooks`,
	reference: `${BASE_URL}/files/references`,
	spy: `${BASE_URL}/spy/set`,
	userpic: `${BASE_URL}/files/userpic`,
	auth: `${BASE_URL}/auth?redirect=${encodeURIComponent(redirectBase)}`,
	endSession: `${BASE_URL}/endSession?redirect=${encodeURIComponent(
		`${redirectBase}login`,
	)}`,
	vkmail: `https://biz.mail.ru/login/tsutmb.ru`,
	vkcloud: `https://cloud.mail.ru`,
	chatbot: `https://jivo.chat/OMAS4HokqF`,
	chatbotStudent: `https://jivo.chat/QoInfbNA9f`,
};
