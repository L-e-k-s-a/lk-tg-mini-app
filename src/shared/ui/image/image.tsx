import { EndPoints } from '@/shared/constants/base';
import { Image as ExpoImage } from 'expo-image';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

interface ImageProps {
	id?: string;
	style?: StyleProp<any>;
	containerStyle?: StyleProp<ViewStyle>;
	src?: string;
	contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
	transition?: number;
	placeholder?: string;
	priority?: 'low' | 'normal' | 'high';
	onError?: () => void;
	onLoad?: () => void;
}

export function UserImage({
	id,
	style,
	src,
	contentFit = 'cover',
	transition = 300,
	placeholder,
	priority = 'normal',
	onError,
	onLoad,
}: ImageProps) {
	const imageSource = src ? src : id ? `${EndPoints.userpic}/${id}` : undefined;

	if (!imageSource) {
		return null;
	}

	return (
		<ExpoImage
			source={imageSource}
			style={style}
			contentFit={contentFit}
			transition={transition}
			placeholder={placeholder}
			priority={priority}
			onError={onError}
			onLoad={onLoad}
		/>
	);
}
