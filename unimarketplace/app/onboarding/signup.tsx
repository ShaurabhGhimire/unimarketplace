import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { gradYears, usColleges } from '@/data/colleges';
import { signUpWithEmail } from '@/lib/api';
import { saveAccessToken } from '@/lib/auth-storage';
import { useOnboarding } from '@/lib/onboarding-context';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [college, setCollege] = useState(usColleges[0]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gradYear, setGradYear] = useState(gradYears[1]);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { update } = useOnboarding();

  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 1 &&
      email.trim().endsWith('.edu') &&
      password.length >= 6 &&
      confirmPassword === password
    );
  }, [confirmPassword, email, name, password]);

  const handleSubmit = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!canSubmit) {
      Alert.alert('Missing info', 'Please fill all required fields correctly.');
      return;
    }

    setLoading(true);
    try {
      const res = await signUpWithEmail({
        email: normalizedEmail,
        password,
        name: name.trim(),
        college_name: college,
        grad_year: gradYear,
        avatar_url: avatarUrl.trim() || undefined,
      });

      const auth = res.data;
      if (!auth) {
        throw new Error('Signup payload missing');
      }

      await saveAccessToken(auth.access_token);
      update({
        authMethod: 'email-signup',
        name: auth.user.name ?? name.trim(),
        collegeName: auth.user.college_name ?? college,
        email: auth.user.email,
        gradYear: auth.user.grad_year ?? gradYear,
        avatarUrl: auth.user.avatar_url ?? avatarUrl.trim(),
        emailVerified: true,
        accessToken: auth.access_token,
      });
      router.replace('/(tabs)');
    } catch {
      Alert.alert(
        'Signup route pending',
        'Backend /api/auth/signup is not live yet. UI/state are ready and will connect once endpoint is available.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Complete all required information for onboarding.</Text>

          <Text style={styles.label}>Full Name *</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Jane Doe" />

          <Text style={styles.label}>College Name *</Text>
          <Pressable
            style={styles.select}
            onPress={() => {
              const idx = usColleges.indexOf(college);
              setCollege(usColleges[(idx + 1) % usColleges.length]);
            }}>
            <Text style={styles.selectText} numberOfLines={1}>
              {college}
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#80889A" />
          </Pressable>

          <Text style={styles.label}>College Email (.edu) *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@college.edu"
          />

          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="At least 6 characters"
          />

          <Text style={styles.label}>Confirm Password *</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Re-enter password"
          />

          <Text style={styles.label}>Graduation Year *</Text>
          <Pressable
            style={styles.select}
            onPress={() => {
              const idx = gradYears.indexOf(gradYear);
              setGradYear(gradYears[(idx + 1) % gradYears.length]);
            }}>
            <Text style={styles.selectText}>{gradYear}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#80889A" />
          </Pressable>

          <Text style={styles.label}>Profile Picture URL (Optional)</Text>
          <TextInput
            style={styles.input}
            value={avatarUrl}
            onChangeText={setAvatarUrl}
            autoCapitalize="none"
            placeholder="https://..."
          />

          <View style={styles.row}>
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <Text style={styles.backText}>Back</Text>
            </Pressable>
            <Pressable
              style={[styles.nextBtn, !canSubmit ? styles.disabledBtn : null]}
              onPress={handleSubmit}>
              <Text style={styles.nextText}>{loading ? 'Creating...' : 'Sign Up'}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#EDEEF2' },
  container: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#F6F6F8',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#DBDDE4',
    padding: 16,
  },
  title: { color: '#1F2A44', fontSize: 24, fontWeight: '800' },
  subtitle: { marginTop: 6, color: '#60728F', fontSize: 14 },
  label: { marginTop: 12, marginBottom: 6, color: '#60728F', fontSize: 13 },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#B8BDC8',
    paddingHorizontal: 14,
    color: '#1E2942',
    fontSize: 15,
    backgroundColor: '#F8F9FC',
  },
  select: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#B8BDC8',
    paddingHorizontal: 14,
    backgroundColor: '#F8F9FC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    flex: 1,
    color: '#1E2942',
    fontSize: 15,
    marginRight: 8,
  },
  row: { marginTop: 16, flexDirection: 'row', gap: 10 },
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
  disabledBtn: {
    opacity: 0.55,
  },
  backText: { color: '#6368E8', fontWeight: '700', fontSize: 15 },
  nextText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
