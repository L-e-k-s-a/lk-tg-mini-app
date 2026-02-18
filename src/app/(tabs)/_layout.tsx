import { Colors } from '@/shared/constants/theme';
import { IconSymbol } from '@/shared/ui/icon-symbol/icon-symbol';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.tint,
				headerShown: false,
				tabBarStyle: {
					minHeight: 40,
				},
			}}>
			<Tabs.Screen
				name='index'
				options={{
					title: 'Главная',
					tabBarIcon: ({ color }) => (
						<IconSymbol
							size={28}
							name={'house.fill'}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='debug'
				options={{
					title: 'tg',
					tabBarIcon: ({ color }) => (
						<IconSymbol
							size={28}
							name={'ant.fill'}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
