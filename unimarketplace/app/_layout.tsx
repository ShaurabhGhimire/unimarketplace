import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="onboarding/select-college">
        <Stack.Screen name="onboarding/select-college" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/verify-email" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/verification-code" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/profile-info" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/college-details" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/profile-complete" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="move-out-mode" options={{ headerShown: false }} />
        <Stack.Screen name="messages/[id]" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
