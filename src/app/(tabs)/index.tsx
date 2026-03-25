import { Colors } from '@/shared/constants/theme';
import { MainLayout } from '@/shared/layouts';
import { Typography, UserImage } from '@/shared/ui';
import { useUserInfoStore } from '@/shared/zustand';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreenTab() {
	const { me } = useUserInfoStore();
	console.log('me', me);
	return (
		<MainLayout>
			<View style={styles.section}>
				<UserImage
					id={me?.data.guid}
					style={{ width: 40, height: 40, borderRadius: 50 }}
				/>
				<Typography
					variant='h1'
					style={styles.title}>
					{`${me?.data.full_name}`}
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
