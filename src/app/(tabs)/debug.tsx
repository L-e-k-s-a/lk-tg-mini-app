import { useTgAuth } from '@/features/auth/hooks/useTgAuth';
import { Button } from '@/shared';
import { Colors } from '@/shared/constants/theme';
import { MainLayout } from '@/shared/layouts';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function DebugTgInfo() {
	const {
		tgInitialized,
		tgUser,
		isLoading,
		platform,
		platformName,
		isTg,
		isMobile,
		userAgent,
	} = useTgAuth();

	const [webAppInfo, setWebAppInfo] = useState<any>(null);

	useEffect(() => {
		// Периодически проверяем обновление данных WebApp
		const interval = setInterval(() => {
			if (typeof window !== 'undefined') {
				const webApp = window.Telegram?.WebApp;
				if (webApp) {
					setWebAppInfo({
						version: webApp.version,
						platform: webApp.platform,
						colorScheme: webApp.colorScheme,
						isExpanded: webApp.isExpanded,
						viewportHeight: webApp.viewportHeight,
					});
				}
			}
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const testDetection = () => {
		Alert.alert(
			'Информация об устройстве',
			`Платформа: ${platform} (${platformName})\n` +
				`Telegram: ${isTg ? '✅' : '❌'}\n` +
				`Мобильное: ${isMobile ? '✅' : '❌'}\n` +
				`UserAgent: ${userAgent}`,
		);
	};

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

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Статус:</Text>
					<Text>Инициализирован: {tgInitialized ? '✅' : '⏳'}</Text>
					<Text>Среда TG: {isTg ? '✅' : '❌'}</Text>
					<Text>
						Платформа: {platform} ({platformName})
					</Text>
					<Text>Мобильное устройство: {isMobile ? '✅' : '❌'}</Text>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>📱 Информация об устройстве:</Text>
					<Text
						style={styles.userAgentText}
						numberOfLines={3}>
						User Agent: {userAgent}
					</Text>
					<Button
						title='Тест определения'
						onPress={testDetection}
						variant='secondary'
						style={styles.testButton}
					/>
				</View>

				{webAppInfo && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>🌐 WebApp данные:</Text>
						<Text>Версия: {webAppInfo.version}</Text>
						<Text>Платформа (WebApp): {webAppInfo.platform}</Text>
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
							Имя: {tgUser.first_name} {tgUser.last_name || ''}
						</Text>
						<Text>Username: @{tgUser.username || 'не указан'}</Text>
						<Text>Язык: {tgUser.language_code || 'не указан'}</Text>
					</View>
				)}

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
	testButton: {
		marginTop: 10,
	},
	userAgentText: {
		fontSize: 12,
		marginBottom: 10,
		color: '#666',
	},
});
