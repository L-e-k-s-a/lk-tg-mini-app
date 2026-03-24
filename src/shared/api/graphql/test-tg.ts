export const retrieveRawInitData = () => {
	const user = {
		id: 3228777,
		first_name: 'Kolya',
		last_name: 'Gay',
		username: 'stratenkokolya',
		language_code: 'en',
	};

	const chat = {
		id: 987654321,
		type: 'private',
	};

	const params = new URLSearchParams({
		auth_date: Math.floor(Date.now() / 1000).toString(),
		hash: 'DEV_BYPASS_HASH',
		chat_instance: '987654321',
		chat_type: 'private',
		user: JSON.stringify(user),
		chat: JSON.stringify(chat),
	});

	return params.toString();
};
