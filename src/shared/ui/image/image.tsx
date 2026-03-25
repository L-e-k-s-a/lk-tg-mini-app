import { getAuthHeaders } from '@/shared/api';
import { EndPoints } from '@/shared/constants/base';
import {
	detectPlatform,
	isTgPlatform,
} from '@/shared/lib/platform/get-platform';
import React, { useEffect, useState } from 'react';

interface ImageProps {
	id?: string;
	src?: string;
	className?: string;
	style?: React.CSSProperties;
	alt?: string;
	onError?: () => void;
	onLoad?: () => void;
	fallbackIcon?: React.ReactNode;
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
}: ImageProps) {
	const [imageError, setImageError] = useState(false);
	const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const loadImage = async () => {
			// If custom src is provided, use it directly
			if (src) {
				setImageDataUrl(src);
				return;
			}

			// If no id, show fallback
			if (!id) {
				setImageDataUrl(null);
				return;
			}

			const imageUrl = `${EndPoints.userpic}/${id}`;
			const platform = detectPlatform();
			const isTelegram = isTgPlatform(platform);

			// For Telegram, we need to fetch with auth headers
			if (isTelegram) {
				setIsLoading(true);
				try {
					const headers = await getAuthHeaders();

					const response = await fetch(imageUrl, {
						headers: headers,
						credentials: 'include',
					});

					if (!response.ok) {
						throw new Error(`HTTP ${response.status}`);
					}

					const blob = await response.blob();
					const url = URL.createObjectURL(blob);
					setImageDataUrl(url);
					setImageError(false);
				} catch (error) {
					console.error('Error loading user image:', error);
					setImageError(true);
					onError?.();
				} finally {
					setIsLoading(false);
				}
			} else {
				// For non-Telegram platforms, use direct img tag
				setImageDataUrl(imageUrl);
			}
		};

		loadImage();

		// Cleanup function to revoke blob URL
		return () => {
			if (
				imageDataUrl &&
				imageDataUrl !== src &&
				imageDataUrl.startsWith('blob:')
			) {
				URL.revokeObjectURL(imageDataUrl);
			}
		};
	}, [id, src]);

	// Show loading state
	if (isLoading) {
		return (
			<div
				className={className}
				style={{
					...style,
					backgroundColor: '#f0f0f0',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}>
				<span style={{ fontSize: '24px', opacity: 0.5 }}>⏳</span>
			</div>
		);
	}

	// Show fallback if no image or error
	if (!imageDataUrl || imageError) {
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
					}}>
					<span style={{ fontSize: '24px' }}>👤</span>
				</div>
			)
		);
	}

	// For Telegram, render img with blob URL
	if (isTgPlatform(detectPlatform()) && imageDataUrl.startsWith('blob:')) {
		return (
			<img
				src={imageDataUrl}
				alt={alt}
				className={className}
				style={style}
				onLoad={onLoad}
				loading='lazy'
			/>
		);
	}

	// For non-Telegram platforms, render img with direct URL
	return (
		<img
			src={imageDataUrl}
			alt={alt}
			className={className}
			style={style}
			onError={() => {
				setImageError(true);
				onError?.();
			}}
			onLoad={onLoad}
			loading='lazy'
			crossOrigin={undefined}
		/>
	);
}
