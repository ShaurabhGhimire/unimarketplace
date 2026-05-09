import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'listing-images';
const AVATAR_BUCKET = 'avatars';
const MAX_IMAGES = 5;


async function compressImage(uri: string, maxWidth: number, quality: number): Promise<string> {
  if (Constants.executionEnvironment === 'storeClient') return uri;
  try {
    const { ImageManipulator, SaveFormat } = await import('expo-image-manipulator');
    const ctx = ImageManipulator.manipulate(uri).resize({ width: maxWidth });
    const rendered = await ctx.renderAsync();
    const saved = await rendered.saveAsync({ compress: quality, format: SaveFormat.JPEG });
    return saved.uri;
  } catch {
    return uri;
  }
}

function getSupabaseStorage(accessToken: string) {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL!;
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

export async function pickImages(): Promise<ImagePicker.ImagePickerAsset[]> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Camera roll permission is required to upload photos.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    allowsMultipleSelection: true,
    selectionLimit: MAX_IMAGES,
    quality: 0.8,
  });

  if (result.canceled) return [];
  return result.assets;
}

export async function uploadImages(
  assets: ImagePicker.ImagePickerAsset[],
  accessToken: string,
): Promise<string[]> {
  const supabase = getSupabaseStorage(accessToken);
  const urls: string[] = [];

  for (const asset of assets) {
    const compressedUri = await compressImage(asset.uri, 1200, 0.75);
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

    const formData = new FormData();
    formData.append('file', {
      uri: compressedUri,
      name: filename,
      type: 'image/jpeg',
    } as unknown as Blob);

    const { error } = await supabase.storage.from(BUCKET).upload(filename, formData, {
      contentType: 'image/jpeg',
      upsert: false,
    });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
    urls.push(data.publicUrl);
  }

  return urls;
}

export async function pickAvatar(): Promise<ImagePicker.ImagePickerAsset | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Camera roll permission is required to upload a photo.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    allowsMultipleSelection: false,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) return null;
  return result.assets[0] ?? null;
}

export async function uploadAvatar(
  asset: ImagePicker.ImagePickerAsset,
  accessToken: string,
): Promise<string> {
  const supabase = getSupabaseStorage(accessToken);
  const compressedUri = await compressImage(asset.uri, 400, 0.8);
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

  const formData = new FormData();
  formData.append('file', {
    uri: compressedUri,
    name: filename,
    type: 'image/jpeg',
  } as unknown as Blob);

  const { error } = await supabase.storage.from(AVATAR_BUCKET).upload(filename, formData, {
    contentType: 'image/jpeg',
    upsert: false,
  });

  if (error) throw new Error(`Avatar upload failed: ${error.message}`);

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}
