import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

const shortcuts = [
  { href: '/(tabs)', icon: 'home', label: 'Browse Marketplace', detail: 'Jump back to the main feed' },
  { href: '/sell', icon: 'add-circle', label: 'Create Listing', detail: 'Open the sell flow' },
  { href: '/inbox', icon: 'message', label: 'Open Messages', detail: 'View active conversations' },
  { href: '/profile', icon: 'person', label: 'View Profile', detail: 'Check the profile experience' },
] as const;

export default function ModalScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.card}>
        <Text style={styles.title}>Demo Shortcuts</Text>
        <Text style={styles.subtitle}>Use this screen to jump around the app while testing on phone.</Text>

        <View style={styles.list}>
          {shortcuts.map((shortcut) => (
            <Link key={shortcut.href} href={shortcut.href} style={styles.link}>
              <View style={styles.row}>
                <View style={styles.iconWrap}>
                  <MaterialIcons name={shortcut.icon} size={22} color="#5F64E8" />
                </View>
                <View style={styles.copy}>
                  <Text style={styles.label}>{shortcut.label}</Text>
                  <Text style={styles.detail}>{shortcut.detail}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color="#8A94A8" />
              </View>
            </Link>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ECECF1',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    borderRadius: 28,
    backgroundColor: '#F8F8FB',
    borderWidth: 1,
    borderColor: '#D8DCE6',
    padding: 20,
  },
  title: {
    color: '#1F2A44',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 8,
    color: '#61728E',
    fontSize: 14,
    lineHeight: 20,
  },
  list: {
    marginTop: 18,
    gap: 12,
  },
  link: {
    textDecorationLine: 'none',
  },
  row: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E4EC',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF2FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
  },
  label: {
    color: '#1F2A44',
    fontSize: 15,
    fontWeight: '700',
  },
  detail: {
    marginTop: 4,
    color: '#61728E',
    fontSize: 12,
  },
});
