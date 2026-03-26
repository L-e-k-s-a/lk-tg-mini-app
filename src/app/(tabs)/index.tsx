import { useUser } from '@/features/auth';
import { Colors } from '@/shared/constants/model/theme';
import { MainLayout } from '@/shared/layouts';
import { Typography, UserImage } from '@/shared/ui';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreenTab() {
	const user = useUser();
	console.log(user);
	return (
		<MainLayout>
			<View style={styles.section}>
				<UserImage
					id={user?.data.id}
					style={{ width: 40, height: 40, borderRadius: 50 }}
				/>
				<Typography
					variant='h1'
					style={styles.title}>
					{`${user?.data.fullName}`}
				</Typography>
			</View>
		</MainLayout>
	);
}

const styles = StyleSheet.create({
	section: {
		marginTop: 22,
		backgroundColor: Colors.background,
		padding: 16,
		borderRadius: 12,
		elevation: 3,
	},
	title: {
		marginBottom: 8,
	},
	description: {
		color: Colors.gray,
		marginBottom: 16,
	},
	spacer: {
		height: 12,
	},
});
