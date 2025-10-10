// app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { 
          backgroundColor: '#1c1c1c', 
          borderTopWidth: 0,
        },
        headerStyle: { backgroundColor: '#1c1c1c' },
        headerTintColor: '#fff',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'CineInfo',
          tabBarLabel: 'Início',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="details"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}