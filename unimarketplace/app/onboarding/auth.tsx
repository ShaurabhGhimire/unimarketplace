import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

import { handleOAuthCallback, signInWithEmail } from '@/lib/api';
import { saveAccessToken } from '@/lib/auth-storage';
import { useOnboarding } from '@/lib/onboarding-context';
import { getGoogleAccessTokenViaSupabase } from '@/lib/supabase-auth';

export default function AuthEntryScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleTokenInput, setGoogleTokenInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { update, reset } = useOnboarding();

  const handleSignin = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail.endsWith('.edu')) {
      Alert.alert('Invalid email', 'Sign in requires a .edu college email.');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Missing password', 'Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const result = await signInWithEmail(normalizedEmail, password);
      const auth = result.data;

      if (!auth) {
        throw new Error('No auth payload returned');
      }

      await saveAccessToken(auth.access_token);
      update({
        authMethod: 'email-signin',
        email: auth.user.email,
        name: auth.user.name ?? '',
        collegeName: auth.user.college_name ?? '',
        gradYear: auth.user.grad_year ?? '',
        avatarUrl: auth.user.avatar_url ?? '',
        emailVerified: true,
        accessToken: auth.access_token,
      });
      router.replace('/(tabs)');
    } catch {
      Alert.alert(
        'Sign in route pending',
        'Backend /api/auth/signin is not live yet. Please use Sign up or Google demo path for now.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);

    const supabaseToken = await getGoogleAccessTokenViaSupabase();

    // Frontend-controlled token fallback while OAuth dependencies/routes are still being finalized.
    const oauthToken =
      supabaseToken || googleTokenInput.trim() || process.env.EXPO_PUBLIC_GOOGLE_OAUTH_TOKEN || '';

    if (!oauthToken) {
      setGoogleLoading(false);
      Alert.alert(
        'Missing OAuth token',
        'Either configure Supabase env + client or paste a Google OAuth access token below.',
      );
      return;
    }

    try {
      const res = await handleOAuthCallback(oauthToken);
      const payload = res.data;

      if (!payload) {
        throw new Error('Google callback payload missing');
      }

      const user = payload.user;
      const accessToken = payload.session.access_token;
      const hasRequiredProfile = Boolean(
        user.name?.trim() && user.college_name?.trim() && user.grad_year?.trim(),
      );

      await saveAccessToken(accessToken);
      update({
        authMethod: 'google',
        name: user.name ?? '',
        email: user.email,
        avatarUrl: user.avatar_url ?? '',
        collegeName: user.college_name ?? '',
        gradYear: user.grad_year ?? '',
        emailVerified: true,
        accessToken,
      });

      setGoogleLoading(false);
      if (hasRequiredProfile) {
        router.replace('/(tabs)');
      } else {
        router.push('/onboarding/google-complete');
      }
      return;
    } catch {
      setGoogleLoading(false);
      Alert.alert(
        'Google sign-in failed',
        'Backend rejected the token. Confirm it is valid and tied to a .edu Google account.',
      );
    }
  };

  const handleSignup = () => {
    reset();
    update({ authMethod: 'email-signup' });
    router.push('/onboarding/signup');
  };

  return (
    <LinearGradient colors={['#5C63E8', '#8C59D5', '#E045A2']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.card}>
          <Text style={styles.title}>UniMarketplace</Text>
          <Text style={styles.subtitle}>Returning Users</Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="College email (.edu)"
            placeholderTextColor="#99A4B8"
            style={styles.input}
          />

          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#99A4B8"
            style={styles.input}
          />

          <Pressable style={styles.signinBtn} onPress={handleSignin}>
            <Text style={styles.signinText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
          </Pressable>

          <View style={styles.dividerWrap}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <Pressable style={styles.googleBtn} onPress={handleGoogle}>
            <Text style={styles.googleText}>
              {googleLoading ? 'Connecting...' : 'Continue with Google'}
            </Text>
          </Pressable>

          <TextInput
            value={googleTokenInput}
            onChangeText={setGoogleTokenInput}
            autoCapitalize="none"
            placeholder="Optional: paste Google OAuth access token"
            placeholderTextColor="#99A4B8"
            style={styles.tokenInput}
          />

          <View style={styles.signupRow}>
            <Text style={styles.signupHint}>Don&apos;t have an account?</Text>
            <Pressable onPress={handleSignup}>
              <Text style={styles.signupLink}> Signup</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1, justifyContent: 'center', padding: 16 },
  card: {
    backgroundColor: '#F3F4F8',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D7DAE2',
  },
  title: {
    color: '#1F2A44',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 6,
    color: '#60728F',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    marginTop: 12,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BBC0CD',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1E2942',
    backgroundColor: '#F8F9FC',
  },
  signinBtn: {
    marginTop: 14,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#6368E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signinText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  dividerWrap: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#D2D6E0',
  },
  dividerText: {
    color: '#7B879D',
    fontSize: 13,
  },
  googleBtn: {
    marginTop: 14,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#AAB0FA',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleText: {
    color: '#49557A',
    fontWeight: '700',
    fontSize: 15,
  },
  tokenInput: {
    marginTop: 10,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBC0CD',
    paddingHorizontal: 12,
    color: '#1E2942',
    fontSize: 13,
    backgroundColor: '#F8F9FC',
  },
  signupRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupHint: {
    color: '#637898',
    fontSize: 13,
  },
  signupLink: {
    color: '#6368E8',
    fontSize: 14,
    fontWeight: '700',
  },
});
