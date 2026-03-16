import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

type SupabaseClient = {
  auth: {
    signInWithOAuth: (params: {
      provider: 'google';
      options?: { redirectTo?: string; skipBrowserRedirect?: boolean };
    }) => Promise<{ data: { url: string | null }; error: { message: string } | null }>;
  };
};

function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  try {
    // Dynamic require until @supabase/supabase-js is installed.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require('@supabase/supabase-js');
    return createClient(url, key) as SupabaseClient;
  } catch {
    return null;
  }
}

function parseTokenFromUrl(url: string) {
  const hash = url.split('#')[1] ?? '';
  const params = new URLSearchParams(hash);
  return params.get('access_token');
}

export async function getGoogleAccessTokenViaSupabase(): Promise<string | null> {
  const client = getSupabaseClient();
  if (!client) {
    return null;
  }

  const redirectTo = Linking.createURL('onboarding/auth-callback');

  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error || !data.url) {
    return null;
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success' || !result.url) {
    return null;
  }

  return parseTokenFromUrl(result.url);
}
