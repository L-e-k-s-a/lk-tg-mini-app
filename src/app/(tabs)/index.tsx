import { Colors } from '@/shared/constants/theme';
import { MainLayout } from '@/shared/layouts';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function HomeScreenTab() {
	return (
		<MainLayout>
			<></>
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
