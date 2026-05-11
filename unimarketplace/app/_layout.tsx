import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { getMyProfile } from '@/lib/api';
import { clearAccessToken, getAccessToken } from '@/lib/auth-storage';
import { OnboardingProvider } from '@/lib/onboarding-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const token = await getAccessToken();
        if (!token) {
          router.replace('/onboarding/auth');
          return;
        }
        const res = await getMyProfile(token);
        if (res.status === 'success') {
          router.replace('/(tabs)');
        } else {
          await clearAccessToken();
          router.replace('/onboarding/auth');
        }
      } catch {
        await clearAccessToken();
        router.replace('/onboarding/auth');
      } finally {
        setChecking(false);
      }
    }
    checkSession();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <OnboardingProvider>
        <Stack initialRouteName="onboarding/auth">
          <Stack.Screen name="onboarding/auth" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/signup" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/google-complete" options={{ headerShown: false }} />

          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="move-out-mode" options={{ headerShown: false }} />
          <Stack.Screen name="messages/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="listings/[id]" options={{ headerShown: false }} />

          <Stack.Screen name="onboarding/email-signin" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/email-signup" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/email-verify" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/profile-details" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/profile-complete" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/auth-callback" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/forgot-password" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding/reset-password" options={{ headerShown: false }} />
        </Stack>

        {checking && (
          <View style={styles.splash}>
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
        )}
      </OnboardingProvider>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF1F5',
  },
});
