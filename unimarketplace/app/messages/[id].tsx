import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createClient } from '@supabase/supabase-js';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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

import {
  getConversationById,
  markConversationRead,
  sendMessage as apiSendMessage,
  type ConversationDetail,
  type MessageRecord,
} from '@/lib/api';
import { getAccessToken } from '@/lib/auth-storage';

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(iso).toLocaleDateString();
}

const fallbackAvatar = 'https://images.unsplash.com/vector-1742875355318-00d715aec3e8?q=80&w=1480&auto=format&fit=crop';
const fallbackImage = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80';

export default function MessageDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const [composer, setComposer] = useState('');
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const realtimeClientRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const realtimeChannelRef = useRef<any>(null);

  useEffect(() => {
    let mounted = true;

    async function setup() {
      const token = await getAccessToken();
      if (!token || !mounted) return;

      try {
        const jwtPayload = JSON.parse(atob(token.split('.')[1]));
        if (mounted && jwtPayload.sub) setCurrentUserId(jwtPayload.sub);
      } catch {}

      try {
        const res = await getConversationById(token, params.id);
        if (mounted && res.status === 'success' && res.data) {
          setConversation(res.data.conversation);
          setMessages(res.data.messages);
          markConversationRead(token, params.id).catch(() => {});
        }
      } catch {
        // conversation will stay null, error state shown below
      } finally {
        if (mounted) setLoading(false);
      }

      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseAnonKey || !mounted) return;

      const client = createClient(supabaseUrl, supabaseAnonKey);
      client.realtime.setAuth(token);
      realtimeClientRef.current = client;

      const channel = client
        .channel(`messages:${params.id}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${params.id}` },
          (payload) => {
            const newMsg = payload.new as MessageRecord;
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        )
        .subscribe();

      realtimeChannelRef.current = channel;
    }

    setup();

    return () => {
      mounted = false;
      if (realtimeClientRef.current && realtimeChannelRef.current) {
        realtimeClientRef.current.removeChannel(realtimeChannelRef.current);
      }
      realtimeClientRef.current = null;
      realtimeChannelRef.current = null;
    };
  }, [params.id]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  async function handleSend() {
    const trimmed = composer.trim();
    if (!trimmed || sending) return;
    setSending(true);
    try {
      const token = await getAccessToken();
      if (!token) return;
      const res = await apiSendMessage(token, params.id, trimmed);
      if (res.status === 'success' && res.data?.message) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === res.data!.message.id)) return prev;
          return [...prev, res.data!.message];
        });
        setComposer('');
      }
    } catch {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  }

  const otherUser = conversation
    ? conversation.seller_id === currentUserId
      ? conversation.buyer
      : conversation.seller
    : null;

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  if (!conversation) {
    return (
      <SafeAreaView style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: '#334155', fontSize: 15 }}>Conversation not found</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: '#4F46E5', fontSize: 14 }}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

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

          <Image
            source={{ uri: otherUser?.avatar_url ?? fallbackAvatar }}
            style={styles.headerAvatar}
            contentFit="cover"
          />

          <View style={styles.headerTextWrap}>
            <Text style={styles.headerName}>{otherUser?.name ?? 'User'}</Text>
            <Text style={styles.headerListing}>Re: {conversation.listing?.title ?? 'Listing'}</Text>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}>
          <Pressable
            style={styles.listingCard}
            onPress={() => router.push(`/listings/${conversation.listing_id}`)}>
            <Image
              source={{ uri: conversation.listing?.images?.[0] ?? fallbackImage }}
              style={styles.listingImage}
              contentFit="cover"
            />
            <View style={styles.listingBody}>
              <Text numberOfLines={1} style={styles.listingTitle}>
                {conversation.listing?.title ?? 'Listing'}
              </Text>
              <Text style={styles.listingHint}>Open listing details</Text>
            </View>
          </Pressable>

          {messages.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>No messages yet — say hello!</Text>
            </View>
          ) : (
            messages.map((message) => {
              const isMe = message.sender_id === currentUserId;
              return (
                <View key={message.id} style={isMe ? styles.myBubbleWrap : styles.otherBubbleWrap}>
                  <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
                    <Text style={[styles.bubbleText, isMe ? styles.myBubbleText : null]}>
                      {message.content}
                    </Text>
                    <Text style={[styles.messageTime, isMe ? styles.myTimeText : styles.otherTimeText]}>
                      {formatRelativeTime(message.created_at)}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        <View style={[styles.composerWrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          <View style={styles.composerRow}>
            <Pressable style={styles.attachButton}>
              <MaterialIcons name="image" size={19} color="#64748B" />
            </Pressable>
            <TextInput
              value={composer}
              onChangeText={setComposer}
              onSubmitEditing={handleSend}
              placeholder="Type a message"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              returnKeyType="send"
            />
            <Pressable
              style={[styles.sendButton, (composer.trim().length === 0 || sending) && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={composer.trim().length === 0 || sending}>
              {sending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <MaterialIcons
                  name="send"
                  size={19}
                  color={composer.trim().length > 0 ? '#FFFFFF' : '#A7B0BE'}
                />
              )}
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
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#768398',
    fontSize: 13,
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
  sendButtonDisabled: {
    backgroundColor: '#E2E8F0',
  },
});
