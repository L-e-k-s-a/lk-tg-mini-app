import { useTgAuth } from '@/features';
import { Container, Loader, Typography } from '@/shared';
import { useMe } from '@/shared/api';
import { MainLayout } from '@/shared/layouts';
import { ErrorView } from '@/widgets/error-view';
import React from 'react';

export default function HomeScreenTab() {
	const { tgUser } = useTgAuth();
	// const { data, loading, error } = useMe();

	// if (loading) return <Loader />;
	// if (error) return <ErrorView error={error} />;

	return (
		<MainLayout>
			<Container>
				{/* <Typography variant='body'>{JSON.stringify(data, null, 2)}</Typography> */}
				<></>
			</Container>
			<Container>
				<Typography variant='body'>
					{JSON.stringify(tgUser, null, 2)}
				</Typography>
			</Container>
		</MainLayout>
	);
}
