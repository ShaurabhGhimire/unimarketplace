import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { ImagePickerAsset } from 'expo-image-picker';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SelectModal } from '@/components/SelectModal';
import { getAccessToken } from '@/lib/auth-storage';
import { createListing } from '@/lib/api';
import { pickImages, uploadImages } from '@/lib/storage';

const categories = ['Furniture', 'Electronics', 'Books', 'Kitchen', 'Decor', 'Clothing', 'Sports', 'Other'];
const conditions = ['New', 'Like New', 'Good', 'Fair'];

function buildMoveOutOptions(): { labels: string[]; isoMap: Record<string, string> } {
  const labels: string[] = [];
  const isoMap: Record<string, string> = {};
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    labels.push(label);
    isoMap[label] = d.toISOString();
  }
  return { labels, isoMap };
}

const { labels: moveOutLabels, isoMap: moveOutIsoMap } = buildMoveOutOptions();

export default function SellScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Furniture');
  const [condition, setCondition] = useState('Good');
  const [moveOutMode, setMoveOutMode] = useState(false);
  const [moveOutDate, setMoveOutDate] = useState(moveOutLabels[6]);
  const [pickedImages, setPickedImages] = useState<ImagePickerAsset[]>([]);
  const [loading, setLoading] = useState(false);

  const canPost = useMemo(() => {
    return (
      title.trim().length > 0 &&
      description.trim().length > 0 &&
      Number(price) > 0 &&
      (!moveOutMode || !!moveOutDate)
    );
  }, [description, moveOutDate, moveOutMode, price, title]);

  const handleSubmit = async () => {
    if (!canPost || loading) {
      return;
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      Alert.alert('Sign-in required', 'Authenticate first so the backend can create the listing under your account.');
      return;
    }

    setLoading(true);
    try {
      const images = pickedImages.length > 0 ? await uploadImages(pickedImages, accessToken) : [];

      await createListing(accessToken, {
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        category,
        condition,
        move_out_date: moveOutMode ? moveOutIsoMap[moveOutDate] : null,
        images,
      });

      Alert.alert('Listing created', 'Your listing has been posted.', [
        {
          text: 'View Browse',
          onPress: () => router.replace('/'),
        },
      ]);
      setTitle('');
      setDescription('');
      setPrice('');
      setCategory('Furniture');
      setCondition('Good');
      setMoveOutMode(false);
      setMoveOutDate(moveOutLabels[6]);
      setPickedImages([]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      Alert.alert('Create listing failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={30} color="#79808B" />
        </Pressable>
        <Text style={styles.headerTitle}>Create Listing</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <Pressable
            style={styles.uploadBox}
            onPress={async () => {
              const assets = await pickImages();
              if (assets.length > 0) setPickedImages(assets);
            }}>
            <MaterialIcons name="cloud-upload" size={22} color="#646AE8" />
            <Text style={styles.uploadText}>
              {pickedImages.length > 0 ? `${pickedImages.length} photo(s) selected` : 'Select Photos'}
            </Text>
          </Pressable>
          {pickedImages.length > 0 && (
            <View style={styles.thumbnailRow}>
              {pickedImages.map((img, i) => (
                <Image key={i} source={{ uri: img.uri }} style={styles.thumbnail} contentFit="cover" />
              ))}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Details</Text>

          <Text style={styles.fieldLabel}>Title *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholder="Vintage mini fridge"
            placeholderTextColor="#9AA3B0"
          />

          <Text style={styles.fieldLabel}>Description *</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.description]}
            multiline
            textAlignVertical="top"
            placeholder="Add condition, pickup details, and what is included"
            placeholderTextColor="#9AA3B0"
          />

          <Text style={styles.fieldLabel}>Price *</Text>
          <View style={styles.inputRow}>
            <Text style={styles.dollar}>$</Text>
            <TextInput
              value={price}
              onChangeText={setPrice}
              style={styles.priceInput}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#9AA3B0"
            />
          </View>

          <Text style={styles.fieldLabel}>Category *</Text>
          <SelectModal
            value={category}
            options={categories}
            onChange={setCategory}
            triggerStyle={styles.select}
            triggerTextStyle={styles.selectText}
          />

          <Text style={styles.fieldLabel}>Condition *</Text>
          <SelectModal
            value={condition}
            options={conditions}
            onChange={setCondition}
            triggerStyle={styles.select}
            triggerTextStyle={styles.selectText}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Move-Out Mode</Text>
            <View style={styles.optionalPill}>
              <Text style={styles.optionalText}>Optional</Text>
            </View>
          </View>

          <Text style={styles.moveOutCopy}>
            Enable this if you&apos;re moving out soon. Your listing will be marked urgent with your move-out deadline.
          </Text>

          <View style={styles.inlineSwitchRow}>
            <Text style={styles.switchLabel}>Move-Out Mode</Text>
            <Switch value={moveOutMode} onValueChange={setMoveOutMode} trackColor={{ true: '#646AE8' }} />
          </View>

          {moveOutMode && (
            <>
              <Text style={styles.dateLabel}>Move-out date (within 30 days)</Text>
              <SelectModal
                value={moveOutDate}
                options={moveOutLabels}
                onChange={setMoveOutDate}
                triggerStyle={styles.select}
                triggerTextStyle={styles.selectText}
              />
            </>
          )}
        </View>

        <Pressable
          style={[styles.postBtn, canPost ? styles.postEnabled : styles.postDisabled]}
          onPress={handleSubmit}>
          <Text style={[styles.postText, canPost ? styles.postEnabledText : styles.postDisabledText]}>
            {loading ? 'Posting Listing...' : 'Post Listing'}
          </Text>
        </Pressable>

        <Text style={styles.disclaimer}>
          By posting, you agree to meet buyers in safe, public locations and follow campus guidelines.
        </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  back: {
    width: 42,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#202A3E',
  },
  container: {
    padding: 12,
    paddingBottom: 100,
    gap: 12,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#DBDDE4',
    backgroundColor: '#F6F6F8',
    padding: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#202A3E',
  },
  uploadBox: {
    marginTop: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#AFB2FA',
    borderRadius: 16,
    minHeight: 76,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  uploadText: {
    fontSize: 17,
    color: '#646AE8',
    fontWeight: '700',
  },
  helper: {
    marginTop: 12,
    color: '#647694',
    fontSize: 15,
    lineHeight: 22,
  },
  fieldLabel: {
    marginTop: 14,
    marginLeft: 10,
    marginBottom: -8,
    zIndex: 1,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    backgroundColor: '#F6F6F8',
    color: '#5E7192',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#B8BDC8',
    borderRadius: 16,
    minHeight: 76,
    paddingHorizontal: 16,
    color: '#1E2942',
    fontSize: 18,
    backgroundColor: '#F6F6F8',
  },
  description: {
    minHeight: 170,
    paddingTop: 18,
  },
  imagesInput: {
    marginTop: 12,
    minHeight: 130,
  },
  inputRow: {
    borderWidth: 1,
    borderColor: '#B8BDC8',
    borderRadius: 16,
    height: 76,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F8',
  },
  dollar: {
    color: '#7A7A7A',
    fontSize: 20,
    fontWeight: '700',
    marginRight: 12,
  },
  priceInput: {
    flex: 1,
    color: '#1E2942',
    fontSize: 16,
  },
  select: {
    borderWidth: 1,
    borderColor: '#B8BDC8',
    borderRadius: 16,
    height: 76,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F6F6F8',
  },
  selectText: {
    color: '#1E2942',
    fontSize: 18,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionalPill: {
    backgroundColor: '#F4A208',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  optionalText: {
    color: '#1D1300',
    fontSize: 15,
    fontWeight: '500',
  },
  dateLabel: {
    marginTop: 12,
    marginBottom: 6,
    color: '#5E7192',
    fontSize: 13,
    fontWeight: '600',
  },
  moveOutCopy: {
    marginTop: 12,
    color: '#5E7192',
    fontSize: 16,
    lineHeight: 26,
  },
  inlineSwitchRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    color: '#687A96',
    fontSize: 17,
    fontWeight: '600',
  },
  postBtn: {
    height: 62,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postEnabled: {
    backgroundColor: '#646AE8',
  },
  postDisabled: {
    backgroundColor: '#C6CBDA',
  },
  postText: {
    fontSize: 17,
    fontWeight: '700',
  },
  postEnabledText: {
    color: '#FFFFFF',
  },
  postDisabledText: {
    color: '#7B8597',
  },
  disclaimer: {
    color: '#6A7890',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  thumbnailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 10,
  },
});
