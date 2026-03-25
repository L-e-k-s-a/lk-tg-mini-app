import { STUDENT_INFO } from '@/shared/api/graphql/student-info/api/api.student-info';
import { useQuery } from '@apollo/client';

export const useStudentInfo = () =>
	useQuery(STUDENT_INFO, {
		fetchPolicy: 'network-only',
	});
