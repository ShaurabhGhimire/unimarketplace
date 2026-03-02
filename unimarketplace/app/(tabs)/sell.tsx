import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

const categories = ['Furniture', 'Electronics', 'Books', 'Kitchen', 'Dorm'];
const conditions = ['Like New', 'Good', 'Fair'];

export default function SellScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Furniture');
  const [condition, setCondition] = useState('Good');
  const [moveOutMode, setMoveOutMode] = useState(false);

  const canPost = useMemo(() => {
    return title.trim().length > 0 && description.trim().length > 0 && Number(price) > 0;
  }, [description, price, title]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable style={styles.back}>
          <MaterialIcons name="arrow-back" size={30} color="#79808B" />
        </Pressable>
        <Text style={styles.headerTitle}>Create Listing</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <Pressable style={styles.uploadBox}>
            <MaterialIcons name="cloud-upload" size={22} color="#646AE8" />
            <Text style={styles.uploadText}>Upload Photos</Text>
          </Pressable>
          <Text style={styles.helper}>Add up to 5 photos. First photo will be the cover image.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Details</Text>

          <Text style={styles.fieldLabel}>Title *</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholder=""
            placeholderTextColor="#9AA3B0"
          />

          <Text style={styles.fieldLabel}>Description *</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.description]}
            multiline
            textAlignVertical="top"
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
          <Pressable
            style={styles.select}
            onPress={() => {
              const idx = categories.indexOf(category);
              setCategory(categories[(idx + 1) % categories.length]);
            }}>
            <View style={styles.selectLeft}>
              <MaterialIcons name="chair" size={20} color="#A26B45" />
              <Text style={styles.selectText}>{category}</Text>
            </View>
            <MaterialIcons name="keyboard-arrow-down" size={28} color="#8F8F8F" />
          </Pressable>

          <Text style={styles.fieldLabel}>Condition *</Text>
          <Pressable
            style={styles.select}
            onPress={() => {
              const idx = conditions.indexOf(condition);
              setCondition(conditions[(idx + 1) % conditions.length]);
            }}>
            <Text style={styles.selectText}>{condition}</Text>
            <MaterialIcons name="keyboard-arrow-down" size={28} color="#8F8F8F" />
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Move-Out Mode</Text>
            <View style={styles.optionalPill}>
              <Text style={styles.optionalText}>Optional</Text>
            </View>
          </View>

          <Text style={styles.moveOutCopy}>
            Enable this if you&apos;re moving out soon. Listings with move-out urgency get highlighted
            and attract more buyers!
          </Text>

          <Pressable style={styles.modeBtn} onPress={() => router.push('/move-out-mode')}>
            <Text style={styles.modeBtnText}>
              {moveOutMode ? 'Move-Out Mode Enabled' : 'Enable Move-Out Mode'}
            </Text>
          </Pressable>

          <View style={styles.inlineSwitchRow}>
            <Text style={styles.switchLabel}>Quick toggle</Text>
            <Switch value={moveOutMode} onValueChange={setMoveOutMode} trackColor={{ true: '#646AE8' }} />
          </View>
        </View>

        <Pressable style={[styles.postBtn, canPost ? styles.postEnabled : styles.postDisabled]}>
          <Text style={[styles.postText, canPost ? styles.postEnabledText : styles.postDisabledText]}>
            Post Listing
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
    fontSize: 42 / 2,
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
    fontSize: 44 / 2,
    fontWeight: '800',
    color: '#202A3E',
  },
  uploadBox: {
    marginTop: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#AFB2FA',
    borderRadius: 16,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  uploadText: {
    fontSize: 17,
    color: '#646AE8',
    fontWeight: '700',
  },
  helper: {
    marginTop: 12,
    color: '#647694',
    fontSize: 30 / 2,
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
    fontSize: 16 / 2 * 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#B8BDC8',
    borderRadius: 16,
    height: 76,
    paddingHorizontal: 16,
    color: '#1E2942',
    fontSize: 18,
    backgroundColor: '#F6F6F8',
  },
  description: {
    minHeight: 170,
    paddingTop: 18,
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
    fontSize: 40 / 2,
    fontWeight: '700',
    marginRight: 12,
  },
  priceInput: {
    flex: 1,
    color: '#1E2942',
    fontSize: 32 / 2,
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
  selectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    fontSize: 31 / 2,
    fontWeight: '500',
  },
  moveOutCopy: {
    marginTop: 12,
    color: '#5E7192',
    fontSize: 35 / 2,
    lineHeight: 31,
  },
  modeBtn: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#AFB2FA',
    height: 62,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeBtnText: {
    color: '#5962E8',
    fontSize: 17,
    fontWeight: '700',
  },
  inlineSwitchRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    color: '#687A96',
    fontSize: 14,
  },
  postBtn: {
    height: 62,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postEnabled: {
    backgroundColor: '#646AE8',
  },
  postDisabled: {
    backgroundColor: '#D0D1D5',
  },
  postText: {
    fontSize: 35 / 2,
    fontWeight: '700',
  },
  postEnabledText: {
    color: '#FFFFFF',
  },
  postDisabledText: {
    color: '#9E9EA2',
  },
  disclaimer: {
    textAlign: 'center',
    color: '#627592',
    fontSize: 16,
    lineHeight: 31,
    paddingHorizontal: 10,
  },
});
