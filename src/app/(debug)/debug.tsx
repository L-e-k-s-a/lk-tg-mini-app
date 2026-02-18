// components/DebugTgInfo.tsx
import { useTgAuth } from '@/features/auth/hooks/useTgAuth';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DebugTgInfo() {
	const { tgInitialized, tgUser, isTgEnvironment } = useTgAuth();

	if (!isTgEnvironment) {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>❌ Не в среде Telegram</Text>
			</View>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.title}>📱 Telegram WebApp Debug</Text>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Статус:</Text>
				<Text>Инициализирован: {tgInitialized ? '✅' : '⏳'}</Text>
				<Text>Среда TG: {isTgEnvironment ? '✅' : '❌'}</Text>
			</View>

			{tgUser && (
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>👤 Пользователь:</Text>
					<Text>ID: {tgUser.id}</Text>
					<Text>
						Имя: {tgUser.first_name} {tgUser.last_name || ''}
					</Text>
					<Text>Username: @{tgUser.username || 'не указан'}</Text>
					<Text>Язык: {tgUser.language_code || 'не указан'}</Text>
					<Text>Премиум: {tgUser.is_premium ? '✅' : '❌'}</Text>
				</View>
			)}

			{typeof window !== 'undefined' && window.WebApp && (
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>🌐 WebApp данные:</Text>
					<Text>Версия: {window.WebApp.version}</Text>
					<Text>Платформа: {window.WebApp.platform}</Text>
					<Text>Цветовая схема: {window.WebApp.colorScheme}</Text>
				</View>
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#f5f5f5',
	},
	title: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	section: {
		backgroundColor: 'white',
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
});
