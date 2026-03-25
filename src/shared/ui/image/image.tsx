// UserImage.tsx - React Web version for Telegram Mini App
import { EndPoints } from '@/shared/constants/base';
import React, { useState } from 'react';

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

	const imageUrl = src || (id ? `${EndPoints.userpic}/${id}` : null);

	if (!imageUrl || imageError) {
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

	return (
		<img
			src={imageUrl}
			alt={alt}
			className={className}
			style={style}
			onError={() => {
				setImageError(true);
				onError?.();
			}}
			onLoad={onLoad}
			loading='lazy'
		/>
	);
}
