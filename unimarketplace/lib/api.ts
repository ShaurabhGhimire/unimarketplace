export type BackendItem = {
  id?: string;
  title?: string;
  price?: number;
  seller?: string;
  college?: string;
  image_url?: string;
  seller_avatar?: string;
  days_left?: string;
};

type ApiEnvelope<T> = {
  status: 'success' | 'error';
  message?: string;
  data?: T;
};

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  college_name?: string;
  grad_year?: string;
};

export type AuthResult = {
  user: AuthUser;
  access_token: string;
  refresh_token?: string;
  is_new_user?: boolean;
};

export type ListingRecord = {
  id: string;
  seller_id: string;
  college_id: string;
  category_id: string;
  title: string;
  description: string;
  price: number;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  status: 'active' | 'sold' | 'expired' | 'deleted';
  is_urgent: boolean;
  move_out_deadline: string | null;
  images: string[];
  views_count: number;
  favorites_count: number;
  created_at: string;
  updated_at: string;
};

export type CreateListingPayload = {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  move_out_date?: string | null;
  images?: string[];
};

const DEFAULT_API_URL = 'http://localhost:3000';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const body = (await response.json().catch(() => ({}))) as T;

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${path}`);
  }

  return body;
}

export async function getBackendHealth() {
  return request<{ status: string; message: string; timestamp: string }>('/health');
}

// Legacy placeholder route kept for compatibility with older local backend builds.
export async function getMarketplaceItems(): Promise<BackendItem[]> {
  const payload = await request<ApiEnvelope<unknown>>('/api/items');

  if (!payload || payload.status !== 'success') {
    return [];
  }

  if (!payload.data || !Array.isArray(payload.data)) {
    return [];
  }

  return payload.data as BackendItem[];
}

export async function getListings(accessToken: string): Promise<ListingRecord[]> {
  const payload = await request<ApiEnvelope<{ listings?: ListingRecord[] }>>(
    '/api/listings/get-all-listings',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (payload.status !== 'success') {
    return [];
  }

  return payload.data?.listings ?? [];
}

export async function createListing(accessToken: string, payload: CreateListingPayload) {
  return request<ApiEnvelope<{ listing: ListingRecord }>>('/api/listings/create-listing', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
}

// Existing backend route.
export async function handleOAuthCallback(accessToken: string, refreshToken?: string) {
  return request<
    ApiEnvelope<{
      user: AuthUser;
      session: {
        access_token: string;
        refresh_token?: string;
      };
    }>
  >('/api/auth/callback', {
    method: 'POST',
    body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
  });
}

// Existing backend route.
export async function getCurrentSession(accessToken: string) {
  return request<ApiEnvelope<{ user: AuthUser }>>('/api/auth/session', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

// Placeholder route expected from backend team.
export async function signInWithEmail(email: string, password: string) {
  return request<ApiEnvelope<AuthResult>>('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// Placeholder route expected from backend team.
export async function signUpWithEmail(payload: {
  email: string;
  password: string;
  name: string;
  college_name: string;
  grad_year: string;
  avatar_url?: string;
}) {
  return request<ApiEnvelope<AuthResult>>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// Placeholder route expected from backend team.
export async function completeGoogleProfile(payload: {
  access_token: string;
  name: string;
  college_name: string;
  grad_year: string;
  avatar_url?: string;
}) {
  return request<ApiEnvelope<{ user: AuthUser }>>('/api/auth/update-profilen', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
