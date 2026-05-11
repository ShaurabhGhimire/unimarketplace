import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { resetPasswordWithOtp } from '@/lib/api';

export default function ResetPasswordScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (code.trim().length < 4) {
      Alert.alert('Invalid code', 'Please enter the verification code from your email.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Too short', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetPasswordWithOtp(email, code.trim(), password);
      Alert.alert('Success', 'Your password has been updated.', [
        { text: 'Sign In', onPress: () => router.replace('/onboarding/auth') },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Invalid or expired code.';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.title}>New Password</Text>
        <Text style={styles.subtitle}>Enter the code sent to {email} and choose a new password.</Text>

        <Text style={styles.label}>Verification Code *</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          placeholder="Enter code"
          placeholderTextColor="#98A3B5"
          value={code}
          onChangeText={setCode}
        />

        <Text style={styles.label}>New Password *</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="At least 6 characters"
          placeholderTextColor="#98A3B5"
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirm Password *</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Re-enter password"
          placeholderTextColor="#98A3B5"
          value={confirm}
          onChangeText={setConfirm}
        />

        <View style={styles.row}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Pressable style={styles.nextBtn} onPress={handleReset} disabled={loading}>
            <Text style={styles.nextText}>{loading ? 'Updating...' : 'Update Password'}</Text>
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
  subtitle: { marginTop: 6, color: '#60728F', fontSize: 14, lineHeight: 20 },
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
