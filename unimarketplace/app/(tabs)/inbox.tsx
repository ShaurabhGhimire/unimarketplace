import { Image } from 'expo-image';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { getConversations, type ConversationSummary } from '@/lib/api';
import { getAccessToken } from '@/lib/auth-storage';

function formatRelativeTime(iso: string | null): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(iso).toLocaleDateString();
}

const fallbackAvatar = 'https://images.unsplash.com/vector-1742875355318-00d715aec3e8?q=80&w=1480&auto=format&fit=crop';

export default function InboxScreen() {
  const insets = useSafeAreaInsets();
  const [threads, setThreads] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      async function load() {
        setLoading(true);
        setError(null);
        try {
          const token = await getAccessToken();
          if (!token) return;
          const payload = await getConversations(token);
          if (mounted && payload.status === 'success') {
            setThreads(payload.data?.conversations ?? []);
          }
        } catch {
          if (mounted) setError('Failed to load messages');
        } finally {
          if (mounted) setLoading(false);
        }
      }
      load();
      return () => { mounted = false; };
    }, [])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSubtitle}>Recent conversations</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>{error}</Text>
          <Pressable onPress={() => setLoading(true)} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        </View>
      ) : threads.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No conversations yet</Text>
          <Text style={styles.emptyHint}>Message a seller from any listing to get started</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {threads.map((thread) => (
            <Pressable
              key={thread.id}
              style={styles.threadRow}
              onPress={() => router.push(`/messages/${thread.id}`)}>
              <View style={styles.avatarWrap}>
                <Image
                  source={{ uri: thread.otherUser.avatar_url ?? fallbackAvatar }}
                  style={styles.avatar}
                  contentFit="cover"
                />
                {thread.unreadCount > 0 ? <View style={styles.unreadDot} /> : null}
              </View>

              <View style={styles.body}>
                <View style={styles.topLine}>
                  <Text numberOfLines={1} style={styles.name}>
                    {thread.otherUser.name ?? 'Unknown User'}
                  </Text>
                  <Text style={styles.time}>
                    {formatRelativeTime(thread.last_message_at ?? thread.created_at)}
                  </Text>
                </View>

                <Text
                  numberOfLines={1}
                  style={[styles.preview, thread.unreadCount > 0 ? styles.previewUnread : null]}>
                  {thread.lastMessage?.content ?? 'No messages yet'}
                </Text>
                <Text numberOfLines={1} style={styles.listing}>
                  Re: {thread.listing?.title ?? 'Listing'}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EEF1F5',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DEE4EC',
    backgroundColor: '#F7F8FB',
  },
  headerTitle: {
    color: '#172033',
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    marginTop: 3,
    color: '#768398',
    fontSize: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 32,
  },
  emptyText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyHint: {
    color: '#768398',
    fontSize: 13,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  container: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 96,
    gap: 8,
  },
  threadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE3EC',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  unreadDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  body: {
    flex: 1,
    gap: 3,
  },
  topLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    flex: 1,
    color: '#172033',
    fontSize: 14,
    fontWeight: '700',
  },
  time: {
    color: '#8592A6',
    fontSize: 11,
  },
  preview: {
    color: '#607088',
    fontSize: 12,
  },
  previewUnread: {
    color: '#334155',
    fontWeight: '700',
  },
  listing: {
    color: '#8B96A8',
    fontSize: 11,
  },
});
