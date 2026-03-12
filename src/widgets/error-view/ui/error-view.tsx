import { Button, IconSymbol, Typography } from '@/shared';
import { Colors } from '@/shared/constants/theme';
import { FullScreenLayout } from '@/shared/layouts';
import { IconSymbolName } from '@/shared/ui/icon-symbol/icon-symbol';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface ActionButton {
	text: string;
	onPress: () => void;
	icon?: IconSymbolName;
}

interface ErrorViewProps {
	error: any;
	title?: string;
	onRetry?: () => void;
	showDetailsToggle?: boolean;
	actionButton?: ActionButton;
	hideErrorDetails?: boolean;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
	error,
	title = 'Что-то пошло не так',
	onRetry,
	showDetailsToggle = true,
	actionButton,
	hideErrorDetails = false,
}) => {
	const [showDetails, setShowDetails] = useState(false);

	// --- Error Logic ---
	const getErrorMessage = (): string => {
		if (!error) return 'Неизвестная ошибка';
		if (typeof error === 'string') return error;
		if (error?.userMessage || error?.userFriendlyMessage)
			return error.userMessage || error.userFriendlyMessage;
		if (error?.message) return error.message;
		if (error?.networkError?.result?.message)
			return error.networkError.result.message;
		if (error?.description) return error.description;
		if (error?.networkError) return 'Проблема с сетью. Проверьте подключение.';
		return 'Произошла непредвиденная ошибка';
	};

	const getErrorDetails = (): string | null => {
		if (!error || hideErrorDetails) return null;
		try {
			return JSON.stringify(error, null, 2);
		} catch {
			return 'Не удалось отобразить детали ошибки';
		}
	};

	type ErrorType = 'network' | 'auth' | 'not-found' | 'server' | 'general';

	const getErrorType = (): ErrorType => {
		if (error?.networkError) return 'network';
		if (error?.code === 'NETWORK_ERROR') return 'network';
		if (error?.statusCode === 401 || error?.code === 'UNAUTHORIZED')
			return 'auth';
		if (error?.statusCode === 404) return 'not-found';
		if (error?.statusCode === 500) return 'server';
		return 'general';
	};

	const getErrorConfig = () => {
		const type = getErrorType();
		switch (type) {
			case 'network':
				return {
					icon: 'wifi.exclamationmark' as IconSymbolName,
					color: Colors.error,
					title: 'Проблема с подключением',
					subtitle: 'Проверьте интернет-соединение и попробуйте снова',
				};
			case 'auth':
				return {
					icon: 'lock.fill' as IconSymbolName,
					color: Colors.warning,
					title: 'Ошибка авторизации',
					subtitle: 'Возможно, ваша сессия истекла. Требуется повторный вход',
				};
			case 'not-found':
				return {
					icon: 'questionmark.circle.fill' as IconSymbolName,
					color: Colors.info,
					title: 'Не найдено',
					subtitle: 'Запрашиваемый ресурс не найден',
				};
			case 'server':
				return {
					icon: 'exclamationmark.triangle.fill' as IconSymbolName,
					color: Colors.error,
					title: 'Проблема на сервере',
					subtitle: 'Сервер временно недоступен. Попробуйте позже',
				};
			default:
				return {
					icon: 'exclamationmark.triangle.fill' as IconSymbolName,
					color: Colors.error,
					title,
					subtitle: getErrorMessage(),
				};
		}
	};

	const config = getErrorConfig();
	const errorDetails = getErrorDetails();

	return (
		<FullScreenLayout
			contentStyle={{ paddingHorizontal: 0, justifyContent: 'center' }}>
			<ScrollView
				contentContainerStyle={styles.container}
				showsVerticalScrollIndicator={false}>
				<View style={styles.content}>
					{/* Icon */}
					<View
						style={[
							styles.iconContainer,
							{ backgroundColor: `${config.color}15` },
						]}>
						<IconSymbol
							name={config.icon}
							size={64}
							color={config.color || Colors.error}
						/>
					</View>

					{/* Title & Subtitle */}
					<Typography
						variant='h2'
						style={styles.title}>
						{config.title}
					</Typography>
					<Typography
						variant='body'
						style={styles.subtitle}>
						{config.subtitle}
					</Typography>

					{/* Helpful Tips */}
					<View style={styles.tipsContainer}>
						<View style={styles.tipItem}>
							<IconSymbol
								name='wifi.exclamationmark'
								size={16}
								color='#666'
							/>
							<Typography
								variant='body'
								style={styles.tipText}>
								Проверьте интернет-соединение
							</Typography>
						</View>
						<View style={styles.tipItem}>
							<IconSymbol
								name='clock'
								size={16}
								color='#666'
							/>
							<Typography
								variant='body'
								style={styles.tipText}>
								Попробуйте позже, если проблема сохраняется
							</Typography>
						</View>
						<View style={styles.tipItem}>
							<IconSymbol
								name='repeat'
								size={16}
								color='#666'
							/>
							<Typography
								variant='body'
								style={styles.tipText}>
								Полностью закройте приложение и откройте его
							</Typography>
						</View>
					</View>

					{/* Error Details Toggle */}
					{showDetailsToggle && errorDetails && (
						<>
							<TouchableOpacity
								style={styles.detailsToggle}
								onPress={() => setShowDetails(!showDetails)}
								activeOpacity={0.7}>
								<Typography
									variant='caption'
									style={styles.detailsToggleText}>
									{showDetails ? 'Скрыть детали' : 'Показать детали ошибки'}
								</Typography>
								<IconSymbol
									name={showDetails ? 'chevron.up' : 'chevron.down'}
									size={20}
									color={Colors.gray || '#666'}
								/>
							</TouchableOpacity>

							{showDetails && (
								<ScrollView style={styles.detailsContainer}>
									<Typography
										variant='body'
										style={styles.detailsText}>
										{errorDetails}
									</Typography>
								</ScrollView>
							)}
						</>
					)}

					{/* Buttons */}
					<View style={styles.buttonsContainer}>
						{onRetry && (
							<Button
								title='Повторить попытку'
								onPress={onRetry}
								variant='primary'
								style={styles.button}
							/>
						)}

						{actionButton && (
							<View style={styles.buttonWithIcon}>
								{actionButton.icon && (
									<IconSymbol
										name={actionButton.icon}
										size={18}
										color={Colors.primary}
									/>
								)}
								<Button
									title={actionButton.text}
									onPress={actionButton.onPress}
									variant='secondary'
									style={styles.button}
								/>
							</View>
						)}
					</View>
				</View>
			</ScrollView>
		</FullScreenLayout>
	);
};

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		justifyContent: 'center',
		padding: 24,
		backgroundColor: Colors.background,
	},
	content: {
		alignItems: 'center',
		width: '100%',
		maxWidth: 500,
		alignSelf: 'center',
	},
	iconContainer: {
		padding: 20,
		borderRadius: 50,
		marginBottom: 24,
		justifyContent: 'center',
		alignItems: 'center',
		width: 104,
		height: 104,
	},
	title: {
		textAlign: 'center',
		marginBottom: 12,
		color: Colors.text,
		flexShrink: 1,
	},

	subtitle: {
		textAlign: 'center',
		marginBottom: 32,
		color: Colors.gray,
		lineHeight: 22,
		flexWrap: 'wrap',
		flexShrink: 1,
	},
	tipsContainer: { width: '100%', marginBottom: 32 },
	tipItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
		padding: 12,
		backgroundColor: Colors.surface,
		borderRadius: 8,
	},
	tipText: { marginLeft: 12, flex: 1 },
	detailsToggle: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		padding: 12,
		backgroundColor: Colors.surface,
		borderRadius: 8,
		marginBottom: 12,
	},
	detailsToggleText: { color: Colors.gray },
	detailsContainer: {
		maxHeight: 150,
		width: '100%',
		padding: 12,
		backgroundColor: Colors.surface,
		borderRadius: 8,
		marginBottom: 16,
	},
	detailsText: {
		fontFamily: 'monospace',
		fontSize: 12,
		color: Colors.text,
		lineHeight: 18,
		flexShrink: 1, // allows text to shrink
		flexWrap: 'wrap', // wrap inside container
		includeFontPadding: false,
	},
	buttonsContainer: { width: '100%', gap: 12, marginBottom: 24 },
	button: { marginVertical: 4 },
	buttonWithIcon: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
	},
});
