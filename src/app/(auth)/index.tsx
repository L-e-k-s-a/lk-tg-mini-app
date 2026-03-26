import { Colors } from '@/shared/constants/model/theme';
import { FullScreenLayout } from '@/shared/layouts';
import { Typography } from '@/shared/ui';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function AuthOnlyMaxScreen() {
	return (
		<FullScreenLayout>
			<View style={styles.section}>
				<Typography
					variant='h1'
					style={styles.title}>
					Вход доступен только через Max.
				</Typography>
				<Typography
					variant='body'
					style={styles.description}>
					На данном этапе аутентификация доступна только в Max.
				</Typography>
			</View>
		</FullScreenLayout>
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
