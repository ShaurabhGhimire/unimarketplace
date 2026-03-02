import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { inboxThreads } from '@/data/mock';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function InboxScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.background }]}> 
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: palette.text }]}>Inbox</Text>
        <Text style={[styles.subtitle, { color: palette.muted }]}>Mock chat threads for buyer/seller communication</Text>

        {inboxThreads.map((thread) => (
          <View
            key={thread.id}
            style={[styles.card, { backgroundColor: palette.card, borderColor: palette.border }]}>
            <View style={styles.rowTop}>
              <Text style={[styles.name, { color: palette.text }]}>{thread.buyerName}</Text>
              <Text style={[styles.time, { color: palette.muted }]}>{thread.updatedAt}</Text>
            </View>
            <Text style={[styles.listing, { color: palette.muted }]}>{thread.listingTitle}</Text>
            <Text style={[styles.message, { color: palette.text }]}>{thread.lastMessage}</Text>
            {thread.unread ? <View style={[styles.badge, { backgroundColor: palette.tint }]} /> : null}
          </View>
        ))}
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
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    position: 'relative',
    gap: 5,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  time: {
    fontSize: 12,
  },
  listing: {
    fontSize: 12,
  },
  message: {
    fontSize: 14,
  },
  badge: {
    height: 10,
    width: 10,
    borderRadius: 99,
    position: 'absolute',
    right: 12,
    bottom: 12,
  },
});
