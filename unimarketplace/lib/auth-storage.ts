const TOKEN_KEY = 'unimarketplace_access_token';
let memoryToken = '';

function getSecureStore():
  | {
      setItemAsync: (key: string, value: string) => Promise<void>;
      getItemAsync: (key: string) => Promise<string | null>;
      deleteItemAsync: (key: string) => Promise<void>;
    }
  | null {
  try {
    // Dynamic require keeps app compiling even if dependency is not installed yet.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('expo-secure-store');
  } catch {
    return null;
  }
}

export async function saveAccessToken(token: string) {
  memoryToken = token;

  const SecureStore = getSecureStore();
  if (SecureStore) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

export async function getAccessToken() {
  const SecureStore = getSecureStore();
  if (SecureStore) {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      memoryToken = token;
      return token;
    }
  }

  return memoryToken || null;
}

export async function clearAccessToken() {
  memoryToken = '';

  const SecureStore = getSecureStore();
  if (SecureStore) {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}
