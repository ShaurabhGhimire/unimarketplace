import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

import { requestEduVerificationCode } from '@/lib/api';
import { useOnboarding } from '@/lib/onboarding-context';

export default function EmailSigninScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { update, reset } = useOnboarding();

  const handleSendCode = async () => {
    const normalized = email.trim().toLowerCase();

    if (!normalized.endsWith('.edu')) {
      Alert.alert('Invalid email', 'Please use your college .edu email address.');
      return;
    }

    setLoading(true);
    try {
      await requestEduVerificationCode(normalized);
    } catch {
      Alert.alert('Using demo mode', 'Email code endpoint is not live yet. Use code 123456.');
    } finally {
      setLoading(false);
    }

    reset();
    update({ email: normalized, authMethod: 'email' });
    router.push('/onboarding/email-verify?mode=signin');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.subtitle}>Returning users can sign in with college email</Text>

        <Text style={styles.label}>College Email *</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@college.edu"
          placeholderTextColor="#98A3B5"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.row}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Pressable style={styles.nextBtn} onPress={handleSendCode}>
            <Text style={styles.nextText}>{loading ? 'Sending...' : 'Send Sign-In Code'}</Text>
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
