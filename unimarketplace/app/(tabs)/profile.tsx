import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const [moveOutMode, setMoveOutMode] = useState(false);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.background }]}> 
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: palette.text }]}>Your Profile</Text>
        <Text style={[styles.subtitle, { color: palette.muted }]}>Student verified frontend stub</Text>

        <View style={[styles.hero, { backgroundColor: palette.card, borderColor: palette.border }]}> 
          <Text style={[styles.name, { color: palette.text }]}>Saurav G.</Text>
          <Text style={[styles.college, { color: palette.muted }]}>California State University, East Bay</Text>
          <Text style={[styles.badge, { color: palette.tint }]}>Verified .edu account</Text>
        </View>

        <View style={[styles.statsRow, { backgroundColor: palette.card, borderColor: palette.border }]}> 
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: palette.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: palette.muted }]}>Listings</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: palette.text }]}>4.9</Text>
            <Text style={[styles.statLabel, { color: palette.muted }]}>Rating</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: palette.text }]}>38</Text>
            <Text style={[styles.statLabel, { color: palette.muted }]}>Sales</Text>
          </View>
        </View>

        <View style={[styles.rowCard, { backgroundColor: palette.card, borderColor: palette.border }]}> 
          <View>
            <Text style={[styles.rowTitle, { color: palette.text }]}>Move-Out Mode</Text>
            <Text style={[styles.rowSubtitle, { color: palette.muted }]}>Prioritize fast-selling and add countdown badges</Text>
          </View>
          <Switch value={moveOutMode} onValueChange={setMoveOutMode} trackColor={{ true: palette.tint }} />
        </View>

        <Pressable style={[styles.button, { backgroundColor: palette.tint }]}>
          <Text style={styles.buttonText}>Edit profile</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 4,
  },
  hero: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
  },
  college: {
    fontSize: 13,
  },
  badge: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  statsRow: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    gap: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
  },
  rowCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  rowSubtitle: {
    fontSize: 12,
    marginTop: 2,
    maxWidth: 230,
  },
  button: {
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
