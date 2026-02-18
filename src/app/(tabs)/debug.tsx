// components/DebugTgInfo.tsx
import { useTgAuth } from '@/features/auth/hooks/useTgAuth';
import { Button } from '@/shared';
import { MainLayout } from '@/shared/layouts';
import { router } from 'expo-router';
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
		<MainLayout>
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
						<Text>Номер телефона: {tgUser.phone || 'не указан'}</Text>
						<Text>Username: @{tgUser.username || 'не указан'}</Text>
						<Text>Язык: {tgUser.language_code || 'не указан'}</Text>
						<Text>Премиум: {tgUser.is_premium ? '✅' : '❌'}</Text>
					</View>
				)}

				{typeof window !== 'undefined' && window?.Telegram?.WebApp && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>🌐 WebApp данные:</Text>
						<Text>Версия: {window?.Telegram?.WebApp?.version}</Text>
						<Text>Платформа: {window?.Telegram?.WebApp?.platform}</Text>
						<Text>Цветовая схема: {window?.Telegram?.WebApp?.colorScheme}</Text>
					</View>
				)}
				<Button
					style={styles.buttonBack}
					title='Вернуться назад'
					onPress={() => {
						router.replace('/');
					}}
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
	buttonBack: {
		marginTop: 20,
	},
});
