import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getConversations } from '@/lib/api';
import { getAccessToken } from '@/lib/auth-storage';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    async function fetchUnread() {
      try {
        const token = await getAccessToken();
        if (!token) return;
        const res = await getConversations(token);
        if (res.status === 'success') {
          const count = (res.data?.conversations ?? []).reduce((sum, c) => sum + c.unreadCount, 0);
          setTotalUnread(count);
        }
      } catch {}
    }
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5F64E8',
        tabBarInactiveTintColor: '#5E6A84',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          borderTopWidth: 0,
          backgroundColor: isDark ? '#1F2430' : '#F7F7FA',
          height: 54 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 6,
          paddingHorizontal: 6,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Browse',
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: 'Sell',
          tabBarIcon: ({ color }) => <IconSymbol size={21} name="plus.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Messages',
          tabBarBadge: totalUnread > 0 ? totalUnread : undefined,
          tabBarIcon: ({ color }) => <IconSymbol size={20} name="message.fill" color={color} />,
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
