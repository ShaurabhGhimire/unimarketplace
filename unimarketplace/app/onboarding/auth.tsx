import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useOnboarding } from '@/lib/onboarding-context';

export default function AuthEntryScreen() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const { update, reset } = useOnboarding();

  const handleGoogle = async () => {
    setGoogleLoading(true);

    // Placeholder Google profile until backend provides OAuth start endpoint.
    update({
      authMethod: 'google',
      name: 'Saurav Ghimire',
      email: 'sghimire@caldwell.edu',
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      emailVerified: true,
    });

    setGoogleLoading(false);
    router.push('/onboarding/profile-details');
  };

  const handleEmailSignup = () => {
    reset();
    update({ authMethod: 'email' });
    router.push('/onboarding/email-signup');
  };

  return (
    <LinearGradient colors={['#5C63E8', '#8C59D5', '#E045A2']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.card}>
          <Text style={styles.title}>UniMarketplace</Text>
          <Text style={styles.subtitle}>Buy and sell safely with verified college students</Text>

          <Pressable style={styles.primaryBtn} onPress={handleGoogle}>
            <Text style={styles.primaryText}>
              {googleLoading ? 'Connecting...' : 'Continue with Google'}
            </Text>
          </Pressable>

          <Pressable style={styles.secondaryBtn} onPress={handleEmailSignup}>
            <Text style={styles.secondaryText}>Sign up with College Email</Text>
          </Pressable>

          <Text style={styles.caption}>Only .edu emails are allowed</Text>
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
    borderRadius: 30,
    padding: 20,
  },
  title: {
    color: '#1F2A44',
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 8,
    color: '#60728F',
    fontSize: 15,
    lineHeight: 22,
  },
  primaryBtn: {
    marginTop: 24,
    height: 54,
    borderRadius: 14,
    backgroundColor: '#6368E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  secondaryBtn: {
    marginTop: 10,
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#AAB0FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    color: '#5E64E8',
    fontWeight: '700',
    fontSize: 16,
  },
  caption: {
    marginTop: 12,
    textAlign: 'center',
    color: '#637898',
    fontSize: 13,
  },
});
