import { useTgAuth } from '@/features';
import { Typography } from '@/shared';
import { MainLayout } from '@/shared/layouts';
import { detectPlatform } from '@/shared/lib/platform/get-platform';
import { retrieveLaunchParams } from '@tma.js/sdk';
import React from 'react';

export default function HomeScreenTab() {
	const { tgUser } = useTgAuth();
	const params = retrieveLaunchParams();
	// const { data, loading, error } = useMe();

	// if (loading) return <Loader />;
	// if (error) return <ErrorView error={error} />;
	const platform = detectPlatform();
	return (
		<MainLayout>
			{/* <Typography variant='body'>{JSON.stringify(data, null, 2)}</Typography> */}
			<Typography variant='body'>
				{JSON.stringify(platform, null, 2)}
			</Typography>
			<Typography variant='body'>{JSON.stringify(tgUser, null, 2)}</Typography>
			<Typography variant='body'>{JSON.stringify(params, null, 2)}</Typography>
		</MainLayout>
	);
}
