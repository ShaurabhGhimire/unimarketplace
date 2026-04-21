import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { verifyEduCode } from '@/lib/api';
import { saveAccessToken } from '@/lib/auth-storage';
import { useOnboarding } from '@/lib/onboarding-context';

export default function EmailVerifyScreen() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { mode } = useLocalSearchParams<{ mode?: 'signup' | 'signin' }>();
  const { data, update } = useOnboarding();

  const handleVerify = async () => {
    if (code.trim().length < 4) {
      Alert.alert('Invalid code', 'Please enter the verification code.');
      return;
    }

    setLoading(true);
    let verifiedToken: string | null = null;
    try {
      const result = await verifyEduCode(data.email, code.trim());
      verifiedToken = result.data?.session?.access_token ?? null;
    } catch {
      if (!__DEV__ || code.trim() !== '123456') {
        setLoading(false);
        Alert.alert('Verification failed', 'Invalid or expired code. Please try again.');
        return;
      }
    }

    if (verifiedToken) {
      await saveAccessToken(verifiedToken);
      update({ emailVerified: true, accessToken: verifiedToken });
    } else {
      update({ emailVerified: true });
    }
    setLoading(false);

    if (mode === 'signin' || data.authMethod === 'email-signup') {
      router.replace('/(tabs)');
      return;
    }

    router.push('/onboarding/profile-details');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>Code sent to {data.email || 'your .edu email'}</Text>

        <Text style={styles.label}>Verification Code *</Text>
        <TextInput
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          style={styles.input}
          placeholder="123456"
          placeholderTextColor="#98A3B5"
        />

        <View style={styles.row}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Pressable style={styles.nextBtn} onPress={handleVerify}>
            <Text style={styles.nextText}>{loading ? 'Verifying...' : 'Verify Email'}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EDEEF2', justifyContent: 'center', padding: 16 },
  card: {
    backgroundColor: '#F6F6F8',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#DBDDE4',
    padding: 16,
  },
  title: { color: '#1F2A44', fontSize: 24, fontWeight: '800' },
  subtitle: { marginTop: 6, color: '#60728F', fontSize: 14 },
  label: { marginTop: 14, marginBottom: 6, color: '#60728F', fontSize: 13 },
  input: {
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#B8BDC8',
    paddingHorizontal: 14,
    color: '#1E2942',
    fontSize: 16,
  },
  row: { marginTop: 14, flexDirection: 'row', gap: 10 },
  backBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#AAB0FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#6368E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: '#6368E8', fontWeight: '700', fontSize: 15 },
  nextText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15, textAlign: 'center', paddingHorizontal: 8 },
});
