// components/DebugTgInfo.tsx
import { useTgAuth } from '@/features/auth/hooks/useTgAuth';
import { Button } from '@/shared';
import { Colors } from '@/shared/constants/theme';
import { MainLayout } from '@/shared/layouts';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DebugTgInfo() {
	const {
		tgInitialized,
		tgUser,
		isTgEnvironment,
		platform,
		isMobile,
		isLoading,
	} = useTgAuth();
	const [webAppInfo, setWebAppInfo] = useState<any>(null);

	useEffect(() => {
		// Периодически проверяем обновление данных WebApp
		const interval = setInterval(() => {
			if (typeof window !== 'undefined') {
				const webApp = window.Telegram?.WebApp || window.WebApp;
				if (webApp) {
					setWebAppInfo({
						version: webApp.version,
						platform: webApp.platform,
						colorScheme: webApp.colorScheme,
						isExpanded: webApp.isExpanded,
						viewportHeight: webApp.viewportHeight,
						viewportStableHeight: webApp.viewportStableHeight,
					});
				}
			}
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	if (isLoading) {
		return (
			<MainLayout>
				<View style={styles.container}>
					<Text style={styles.title}>⏳ Загрузка Telegram WebApp...</Text>
				</View>
			</MainLayout>
		);
	}

	if (!isTgEnvironment) {
		return (
			<MainLayout>
				<View style={styles.container}>
					<Text style={styles.title}>❌ Не в среде Telegram</Text>
					<Text>Откройте это приложение через Telegram Mini App</Text>
				</View>
			</MainLayout>
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
					<Text>Платформа: {platform || 'не определена'}</Text>
					<Text>Мобильное устройство: {isMobile ? '✅' : '❌'}</Text>
				</View>

				{webAppInfo && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>🌐 WebApp данные:</Text>
						<Text>Версия: {webAppInfo.version}</Text>
						<Text>Платформа: {webAppInfo.platform}</Text>
						<Text>Цветовая схема: {webAppInfo.colorScheme}</Text>
						<Text>Развернут: {webAppInfo.isExpanded ? '✅' : '❌'}</Text>
						<Text>Высота: {webAppInfo.viewportHeight}</Text>
					</View>
				)}

				{tgUser && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>👤 Пользователь:</Text>
						<Text>ID: {tgUser.id}</Text>
						<Text>
							Имя: {tgUser.first_name} {tgUser.last_user || ''}
						</Text>
						<Text>Username: @{tgUser.username || 'не указан'}</Text>
						<Text>Язык: {tgUser.language_code || 'не указан'}</Text>
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
		shadowColor: Colors.black,
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
