// UserImage.tsx - React Web version for Telegram Mini App with Debug
import { EndPoints } from '@/shared/constants/base';
import {
	detectPlatform,
	isTgPlatform,
} from '@/shared/lib/platform/get-platform';
import { retrieveRawInitData } from '@tma.js/sdk';
import React, { useEffect, useState } from 'react';

interface ImageProps {
	id?: string;
	src?: string;
	className?: string;
	style?: React.CSSProperties;
	alt?: string;
	onError?: (error: ImageError) => void;
	onLoad?: () => void;
	fallbackIcon?: React.ReactNode;
	debug?: boolean; // Enable debug logging
}

interface ImageError {
	type: 'network' | 'auth' | '404' | 'cors' | 'unknown';
	message: string;
	status?: number;
	url?: string;
}

export function UserImage({
	id,
	src,
	className,
	style,
	alt = 'User avatar',
	onError,
	onLoad,
	fallbackIcon,
	debug = false, // Set to true to enable debug logs
}: ImageProps) {
	const [imageError, setImageError] = useState<ImageError | null>(null);
	const [loading, setLoading] = useState(true);
	const [retryCount, setRetryCount] = useState(0);
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	// Debug logger
	const logDebug = (message: string, data?: any) => {
		if (debug) {
			console.log(`[UserImage Debug] ${message}`, data || '');
		}
	};

	useEffect(() => {
		const buildImageUrl = () => {
			const url = src || (id ? `${EndPoints.userpic}/${id}` : null);

			if (!url) {
				logDebug('No image source provided', { id, src });
				return null;
			}

			const platform = detectPlatform();
			logDebug('Building image URL', { platform, url, id });

			// For TMA, add debug info as query param to help debug
			if (isTgPlatform(platform) && debug) {
				const separator = url.includes('?') ? '&' : '?';
				const timestamp = Date.now();
				return `${url}${separator}_t=${timestamp}&_debug=true`;
			}

			return url;
		};

		setImageUrl(buildImageUrl());
	}, [id, src, debug]);

	// Reset error when dependencies change
	useEffect(() => {
		setImageError(null);
		setLoading(true);
		setRetryCount(0);
	}, [imageUrl]);

	const handleError = (
		event: React.SyntheticEvent<HTMLImageElement, Event>,
	) => {
		const imgElement = event.currentTarget;
		const status = (imgElement as any).status; // Some browsers add status
		const url = imgElement.src;

		let error: ImageError;

		// Log all available error information
		logDebug('Image load error occurred', {
			url,
			status,
			id,
			src,
			platform: detectPlatform(),
			isTelegram: isTgPlatform(detectPlatform()),
			retryCount,
		});

		// Try to get more error details
		if (!url.startsWith('http')) {
			error = {
				type: 'network',
				message: `Invalid URL: ${url}`,
				url,
			};
		} else if (status === 401 || status === 403) {
			error = {
				type: 'auth',
				message: `Authentication failed (${status}) - Image endpoint requires auth`,
				status,
				url,
			};

			// Log auth details for TMA
			if (isTgPlatform(detectPlatform())) {
				const initData = retrieveRawInitData();
				logDebug('TMA Auth Debug', {
					hasInitData: !!initData,
					initDataLength: initData?.length,
					initDataPreview: initData?.substring(0, 50),
					url,
				});
			}
		} else if (status === 404) {
			error = {
				type: '404',
				message: `Image not found (404): ${url}`,
				status,
				url,
			};
		} else if (status === 0) {
			error = {
				type: 'cors',
				message: `CORS error or network issue - Status: ${status}`,
				status,
				url,
			};
		} else {
			error = {
				type: 'unknown',
				message: `Failed to load image: ${status || 'Unknown error'}`,
				status,
				url,
			};
		}

		setImageError(error);
		setLoading(false);
		onError?.(error);

		// Auto-retry once if it's a network error
		if (
			retryCount === 0 &&
			(error.type === 'network' || error.type === 'cors')
		) {
			logDebug('Auto-retrying image load', { retryCount: retryCount + 1 });
			setRetryCount(1);
			setTimeout(() => {
				setImageUrl((prevUrl) =>
					prevUrl
						? `${prevUrl}${prevUrl.includes('?') ? '&' : '?'}_retry=1`
						: null,
				);
			}, 1000);
		}
	};

	const handleLoad = () => {
		logDebug('Image loaded successfully', { url: imageUrl });
		setLoading(false);
		setImageError(null);
		onLoad?.();
	};

	// Render loading state
	if (loading && !imageError) {
		return (
			<div
				className={className}
				style={{
					...style,
					backgroundColor: '#f5f5f5',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					position: 'relative',
				}}>
				<span style={{ fontSize: '20px', opacity: 0.7 }}>⏳</span>
				{debug && (
					<div
						style={{
							position: 'absolute',
							bottom: 0,
							left: 0,
							right: 0,
							fontSize: '10px',
							backgroundColor: 'rgba(0,0,0,0.7)',
							color: 'white',
							padding: '2px',
							textAlign: 'center',
						}}>
						Loading...
					</div>
				)}
			</div>
		);
	}

	// Render error state with debug info
	if (imageError || !imageUrl) {
		const error = imageError || { type: 'unknown', message: 'No image URL' };

		return (
			fallbackIcon || (
				<div
					className={className}
					style={{
						...style,
						backgroundColor: '#e0e0e0',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						position: 'relative',
						flexDirection: 'column',
					}}
					title={debug ? `Error: ${error.message}` : undefined}>
					<span style={{ fontSize: '24px' }}>👤</span>
					{debug && (
						<div
							style={{
								position: 'absolute',
								bottom: 0,
								left: 0,
								right: 0,
								fontSize: '10px',
								backgroundColor:
									error.type === 'auth' ? '#ff0000' : 'rgba(0,0,0,0.7)',
								color: 'white',
								padding: '2px',
								textAlign: 'center',
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
							}}>
							{error.type === 'auth'
								? '🔒 Auth Failed'
								: error.type === '404'
									? '📁 Not Found'
									: '❌ Error'}
							{error.status && ` (${error.status})`}
						</div>
					)}
				</div>
			)
		);
	}

	return (
		<img
			src={imageUrl}
			alt={alt}
			className={className}
			style={style}
			onError={handleError}
			onLoad={handleLoad}
			loading='lazy'
			// Add crossOrigin for CORS if needed
			crossOrigin={
				isTgPlatform(detectPlatform()) ? 'use-credentials' : undefined
			}
		/>
	);
}
