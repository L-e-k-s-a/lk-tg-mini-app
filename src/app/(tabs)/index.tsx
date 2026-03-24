import { Loader, Typography } from '@/shared';
import { useMe } from '@/shared/api';
import { MainLayout } from '@/shared/layouts';
import { ErrorView } from '@/widgets/error-view';
import React from 'react';

export default function HomeScreenTab() {
	const { data, loading, error } = useMe();

	if (loading) return <Loader />;
	if (error) return <ErrorView error={error} />;

	return (
		<MainLayout>
			<Typography variant='body'>{JSON.stringify(data, null, 2)}</Typography>
		</MainLayout>
	);
}
