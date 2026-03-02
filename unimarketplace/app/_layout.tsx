import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { OnboardingProvider } from '@/lib/onboarding-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <OnboardingProvider>
        <Stack initialRouteName="onboarding/auth">
          <Stack.Screen name="onboarding/auth" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/email-signup" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/email-verify" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/profile-details" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/profile-complete" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="move-out-mode" options={{ headerShown: false }} />
          <Stack.Screen name="messages/[id]" options={{ headerShown: false }} />
        </Stack>
      </OnboardingProvider>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
