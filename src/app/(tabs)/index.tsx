import { Colors } from '@/shared/constants/theme';
import { MainLayout } from '@/shared/layouts';
import { Typography } from '@/shared/ui';
import { useUserInfoStore } from '@/shared/zustand';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreenTab() {
	const { me } = useUserInfoStore();
	console.log('me', me);
	return (
		<MainLayout>
			<View style={styles.section}>
				<Typography
					variant='h1'
					style={styles.title}>
					Welcome to FSD Structure
				</Typography>
				<Typography
					variant='body'
					style={styles.description}>
					This is a simple Expo app with Feature-Sliced Design architecture
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
