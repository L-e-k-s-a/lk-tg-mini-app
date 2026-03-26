import { ME } from '@/features/auth/api/api/api.me';
import { useQuery } from '@apollo/client';

export const useMe = () => {
	const { data, loading, error } = useQuery(ME, {
		fetchPolicy: 'network-only',
	});

	return {
		data: data?.me,
		loading,
		error,
	};
};
