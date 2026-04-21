import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { messageThreads } from '@/data/mock';

export default function InboxScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSubtitle}>Recent conversations</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {messageThreads.map((thread) => (
          <Pressable
            key={thread.id}
            style={styles.threadRow}
            onPress={() => router.push(`/messages/${thread.id}`)}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: thread.avatar }} style={styles.avatar} contentFit="cover" />
              {thread.unreadCount > 0 ? <View style={styles.unreadDot} /> : null}
            </View>

            <View style={styles.body}>
              <View style={styles.topLine}>
                <Text numberOfLines={1} style={styles.name}>
                  {thread.userName}
                </Text>
                <Text style={styles.time}>{thread.updatedAt}</Text>
              </View>

              <Text numberOfLines={1} style={[styles.preview, thread.unreadCount > 0 ? styles.previewUnread : null]}>
                {thread.lastMessage}
              </Text>
              <Text numberOfLines={1} style={styles.listing}>
                Re: {thread.listingTitle}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
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
