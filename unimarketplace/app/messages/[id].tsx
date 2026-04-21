import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { marketplaceItems, messageThreads, threadMessages } from '@/data/mock';

export default function MessageDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const [composer, setComposer] = useState('');
  const insets = useSafeAreaInsets();

  const thread = useMemo(() => {
    return messageThreads.find((item) => item.id === params.id) ?? messageThreads[0];
  }, [params.id]);

  const messages = threadMessages[thread.id] ?? [];
  const linkedListing = marketplaceItems.find((item) => item.id === thread.listingId);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={20}>
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable style={styles.back} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={21} color="#475569" />
          </Pressable>

          <Image source={{ uri: thread.avatar }} style={styles.headerAvatar} contentFit="cover" />

          <View style={styles.headerTextWrap}>
              <Text style={styles.headerName}>{thread.userName}</Text>
              <Text style={styles.headerListing}>Re: {thread.listingTitle}</Text>
            </View>
        </View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <Pressable
            style={styles.listingCard}
            onPress={() => {
              if (linkedListing) {
                router.push(`/listings/${linkedListing.id}`);
              }
            }}>
            <Image source={{ uri: thread.listingImage }} style={styles.listingImage} contentFit="cover" />
            <View style={styles.listingBody}>
              <Text numberOfLines={1} style={styles.listingTitle}>
                {thread.listingTitle}
              </Text>
              <Text style={styles.listingHint}>Open listing details</Text>
            </View>
          </Pressable>

          {messages.map((message) => (
            <View
              key={message.id}
              style={message.sender === 'me' ? styles.myBubbleWrap : styles.otherBubbleWrap}>
              <View style={[styles.bubble, message.sender === 'me' ? styles.myBubble : styles.otherBubble]}>
                <Text style={[styles.bubbleText, message.sender === 'me' ? styles.myBubbleText : null]}>
                  {message.text}
                </Text>
                <Text style={[styles.messageTime, message.sender === 'me' ? styles.myTimeText : styles.otherTimeText]}>
                  {message.time}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={[styles.composerWrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          <View style={styles.composerRow}>
            <Pressable style={styles.attachButton}>
              <MaterialIcons name="image" size={19} color="#64748B" />
            </Pressable>
            <TextInput
              value={composer}
              onChangeText={setComposer}
              placeholder="Type a message"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
            <Pressable style={styles.sendButton}>
              <MaterialIcons
                name="send"
                size={19}
                color={composer.trim().length > 0 ? '#FFFFFF' : '#A7B0BE'}
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EEF1F5',
  },
  header: {
    minHeight: 62,
    backgroundColor: '#F7F8FB',
    borderBottomWidth: 1,
    borderBottomColor: '#DEE4EC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  back: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE3EC',
  },
  headerAvatar: {
    height: 42,
    width: 42,
    borderRadius: 21,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerName: {
    color: '#172033',
    fontSize: 14,
    fontWeight: '700',
  },
  headerListing: {
    marginTop: 2,
    color: '#768398',
    fontSize: 11,
  },
  body: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 90,
    gap: 12,
  },
  listingCard: {
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    borderColor: '#DCE3EC',
    borderRadius: 18,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  listingImage: {
    height: 58,
    width: 58,
    borderRadius: 12,
  },
  listingBody: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  listingTitle: {
    color: '#172033',
    fontSize: 13,
    fontWeight: '700',
  },
  listingHint: {
    color: '#7C8AA1',
    fontSize: 11,
  },
  otherBubbleWrap: {
    alignItems: 'flex-start',
  },
  myBubbleWrap: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    gap: 6,
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE3EC',
  },
  myBubble: {
    backgroundColor: '#4F46E5',
  },
  bubbleText: {
    color: '#1F2937',
    fontSize: 13,
    lineHeight: 19,
  },
  myBubbleText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 10,
  },
  myTimeText: {
    color: '#DDE3FF',
  },
  otherTimeText: {
    color: '#8A96A8',
  },
  composerWrap: {
    borderTopWidth: 1,
    borderTopColor: '#DEE4EC',
    backgroundColor: '#F7F8FB',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  composerRow: {
    minHeight: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: '#DCE3EC',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  attachButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  input: {
    flex: 1,
    color: '#172033',
    fontSize: 13,
  },
  sendButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4F46E5',
  },
});
