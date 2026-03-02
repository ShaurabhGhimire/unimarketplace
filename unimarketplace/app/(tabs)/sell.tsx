import { useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function SellScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: palette.background }]}> 
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: palette.text }]}>Create Listing</Text>
        <Text style={[styles.subtitle, { color: palette.muted }]}>Frontend form only for now. Hook this to Supabase later.</Text>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: palette.text }]}>Item title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="MacBook Air M2"
            placeholderTextColor={palette.muted}
            style={[styles.input, { backgroundColor: palette.card, borderColor: palette.border, color: palette.text }]}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: palette.text }]}>Price ($)</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholder="550"
            placeholderTextColor={palette.muted}
            style={[styles.input, { backgroundColor: palette.card, borderColor: palette.border, color: palette.text }]}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: palette.text }]}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholder="Condition, pickup location, and any notes"
            placeholderTextColor={palette.muted}
            style={[
              styles.input,
              styles.multiline,
              { backgroundColor: palette.card, borderColor: palette.border, color: palette.text },
            ]}
          />
        </View>

        <Pressable
          style={[styles.button, { backgroundColor: palette.tint }]}
          onPress={() => Alert.alert('Draft saved', 'Listing draft saved locally (mock).')}>
          <Text style={styles.buttonText}>Save Draft</Text>
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
    gap: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 15,
  },
  multiline: {
    minHeight: 120,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  button: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
