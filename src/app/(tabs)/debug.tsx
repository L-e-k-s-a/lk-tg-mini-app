import { useTgAuth } from '@/features/auth/hooks/useTgAuth';
import { Button } from '@/shared';
import { Colors } from '@/shared/constants/theme';
import { MainLayout } from '@/shared/layouts';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DebugTgInfo() {
	const { tgUser, isLoading, rawInitData } = useTgAuth();

	if (isLoading) {
		return (
			<MainLayout>
				<View style={styles.container}>
					<Text style={styles.title}>⏳ Загрузка Telegram WebApp...</Text>
				</View>
			</MainLayout>
		);
	}

	return (
		<MainLayout>
			<ScrollView style={styles.container}>
				<Text style={styles.title}>📱 Telegram WebApp Debug</Text>

				{tgUser && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>👤 Пользователь:</Text>
						<Text>ID: {tgUser.id}</Text>
						<Text>
							Имя: {tgUser.first_name} {tgUser.last_name || ''}
						</Text>
						<Text>Username: @{tgUser.username || 'не указан'}</Text>
						<Text>Язык: {tgUser.language_code || 'не указан'}</Text>
					</View>
				)}

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>🔍 Raw Init Data:</Text>
					<ScrollView style={styles.jsonContainer}>
						<Text style={styles.jsonText}>{rawInitData || 'Нет данных'}</Text>
					</ScrollView>
				</View>

				<Button
					style={styles.buttonBack}
					title='Вернуться назад'
					onPress={() => router.replace('/')}
					variant='primary'
				/>
			</ScrollView>
		</MainLayout>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	section: {
		backgroundColor: Colors.background,
		padding: 15,
		borderRadius: 10,
		marginBottom: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 10,
	},
	buttonBack: {
		marginTop: 20,
		marginBottom: 40,
	},
	userAgentText: {
		fontSize: 12,
		marginBottom: 10,
		color: '#666',
	},
	jsonContainer: {
		backgroundColor: '#f5f5f5',
		padding: 10,
		borderRadius: 8,
		maxHeight: 300,
	},
	jsonText: {
		fontSize: 10,
		fontFamily: 'monospace',
		color: '#333',
	},
});
