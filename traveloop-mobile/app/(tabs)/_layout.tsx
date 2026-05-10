import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { Compass, Search, Globe, User, ShieldCheck } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00696b',
        tabBarInactiveTintColor: '#75777e',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#eceef0',
          borderTopColor: '#c5c6ce',
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700' as const,
          letterSpacing: 0.2,
        },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Trips', tabBarIcon: ({ color }) => <Compass color={color} size={22} /> }} />
      <Tabs.Screen name="search" options={{ title: 'Discover', tabBarIcon: ({ color }) => <Search color={color} size={22} /> }} />
      <Tabs.Screen name="community" options={{ title: 'Community', tabBarIcon: ({ color }) => <Globe color={color} size={22} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <User color={color} size={22} /> }} />
      <Tabs.Screen name="admin" options={{ title: 'Admin', tabBarIcon: ({ color }) => <ShieldCheck color={color} size={22} /> }} />
    </Tabs>
  );
}
