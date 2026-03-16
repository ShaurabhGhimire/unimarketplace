import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { messageThreads } from '@/data/mock';

export default function InboxScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {messageThreads.map((thread, index) => (
          <Pressable
            key={thread.id}
            style={[styles.threadRow, index === messageThreads.length - 1 ? styles.noDivider : null]}
            onPress={() => router.push(`/messages/${thread.id}`)}>
            <View style={styles.leftCol}>
              <View>
                <Image source={{ uri: thread.avatar }} style={styles.avatar} contentFit="cover" />
                {thread.unreadCount > 0 ? <View style={styles.onlineDot} /> : null}
              </View>
              <View style={styles.body}>
                <View style={styles.topLine}>
                  <Text style={styles.name}>{thread.userName}</Text>
                  <Text style={styles.time}>{thread.updatedAt}</Text>
                </View>
                <Text numberOfLines={1} style={[styles.preview, thread.unreadCount > 0 ? styles.unread : null]}>
                  {thread.lastMessage}
                </Text>
                <Text numberOfLines={1} style={styles.listing}>
                  Re: {thread.listingTitle}
                </Text>
              </View>
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
    backgroundColor: '#EDEEF2',
  },
  header: {
    height: 76,
    backgroundColor: '#F6F6F8',
    borderBottomWidth: 1,
    borderBottomColor: '#D3D5DB',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  headerTitle: {
    fontSize: 44 / 2,
    fontWeight: '800',
    color: '#202A3E',
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 120,
  },
  threadRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#CDD2DA',
    paddingBottom: 20,
    marginBottom: 20,
  },
  noDivider: {
    borderBottomWidth: 0,
  },
  leftCol: {
    flexDirection: 'row',
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineDot: {
    height: 11,
    width: 11,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#EDEEF2',
    backgroundColor: '#FA4F4F',
    position: 'absolute',
    right: 0,
    top: 2,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 40 / 2,
    fontWeight: '800',
    color: '#212B3F',
  },
  time: {
    color: '#6A7C97',
    fontSize: 32 / 2,
  },
  preview: {
    color: '#60728F',
    fontSize: 19,
  },
  unread: {
    color: '#4E627F',
    fontWeight: '700',
  },
  listing: {
    color: '#60728F',
    fontSize: 33 / 2,
  },
});
