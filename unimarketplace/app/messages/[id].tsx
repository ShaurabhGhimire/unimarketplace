import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useLocalSearchParams, router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { messageThreads, threadMessages } from '@/data/mock';

export default function MessageDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const [composer, setComposer] = useState('');

  const thread = useMemo(() => {
    return messageThreads.find((item) => item.id === params.id) ?? messageThreads[0];
  }, [params.id]);

  const messages = threadMessages[thread.id] ?? [];

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={20}>
        <View style={styles.header}>
          <Pressable style={styles.back} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={30} color="#79808B" />
          </Pressable>

          <Image source={{ uri: thread.avatar }} style={styles.headerAvatar} contentFit="cover" />

          <View style={styles.headerTextWrap}>
            <Text style={styles.headerName}>{thread.userName}</Text>
            <Text style={styles.headerListing}>Re: {thread.listingTitle}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <Pressable style={styles.listingCard}>
            <Image source={{ uri: thread.listingImage }} style={styles.listingImage} contentFit="cover" />
            <View style={styles.listingBody}>
              <Text style={styles.listingTitle}>{thread.listingTitle}</Text>
              <Text style={styles.listingHint}>Click to view listing details</Text>
            </View>
          </Pressable>

          {messages.map((message) => (
            <View
              key={message.id}
              style={[message.sender === 'me' ? styles.myBubbleWrap : styles.otherBubbleWrap]}>
              <View style={[styles.bubble, message.sender === 'me' ? styles.myBubble : styles.otherBubble]}>
                <Text style={[styles.bubbleText, message.sender === 'me' ? styles.myBubbleText : null]}>
                  {message.text}
                </Text>
                <Text style={[styles.messageTime, message.sender === 'me' ? styles.myBubbleText : styles.timeDark]}>
                  {message.time}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.composerWrap}>
          <View style={styles.composerRow}>
            <MaterialIcons name="image" size={30} color="#7F7F7F" />
            <TextInput
              value={composer}
              onChangeText={setComposer}
              placeholder="Type a message..."
              placeholderTextColor="#9CA3B0"
              style={styles.input}
            />
            <Pressable>
              <MaterialIcons
                name="send"
                size={32}
                color={composer.trim().length > 0 ? '#646AE8' : '#B3B6BD'}
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
    backgroundColor: '#EDEEF2',
  },
  header: {
    height: 76,
    backgroundColor: '#F6F6F8',
    borderBottomWidth: 1,
    borderBottomColor: '#D3D5DB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  back: {
    width: 42,
    alignItems: 'center',
  },
  headerAvatar: {
    height: 58,
    width: 58,
    borderRadius: 29,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerName: {
    color: '#1E2942',
    fontSize: 20 * 1,
    fontWeight: '800',
  },
  headerListing: {
    marginTop: 2,
    color: '#60728F',
    fontSize: 32 / 2,
  },
  body: {
    padding: 14,
    paddingBottom: 110,
    gap: 18,
  },
  listingCard: {
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: '#CFD3DC',
    borderRadius: 26,
    padding: 12,
    backgroundColor: '#F8F8FA',
  },
  listingImage: {
    height: 84,
    width: 84,
    borderRadius: 16,
  },
  listingBody: {
    flex: 1,
    justifyContent: 'center',
    gap: 5,
  },
  listingTitle: {
    color: '#1E2942',
    fontSize: 21,
    fontWeight: '800',
  },
  listingHint: {
    color: '#60728F',
    fontSize: 17,
  },
  otherBubbleWrap: {
    alignItems: 'flex-start',
  },
  myBubbleWrap: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#CFD3DC',
    gap: 8,
  },
  otherBubble: {
    backgroundColor: '#F7F7F8',
  },
  myBubble: {
    backgroundColor: '#646AE8',
    borderColor: '#646AE8',
  },
  bubbleText: {
    color: '#1E2942',
    fontSize: 19,
    lineHeight: 30,
  },
  myBubbleText: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 30 / 2,
  },
  timeDark: {
    color: '#5E6F8C',
  },
  composerWrap: {
    borderTopWidth: 1,
    borderTopColor: '#D3D5DB',
    backgroundColor: '#F7F7F9',
    padding: 10,
  },
  composerRow: {
    borderWidth: 1,
    borderColor: '#BCBFC8',
    borderRadius: 20,
    minHeight: 66,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    color: '#1E2942',
    fontSize: 35 / 2,
  },
});
