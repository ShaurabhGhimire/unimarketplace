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
  session: {
    access_token: string;
    refresh_token?: string;
  };
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
  seller_name: string | null;
  seller_avatar_url: string | null;
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

  const body = (await response.json().catch(() => ({}))) as T & { message?: string };

  if (!response.ok) {
    const msg = body?.message ?? `HTTP ${response.status} for ${path}`;
    throw new Error(msg);
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

export type ListingFilters = {
  category?: string;
  condition?: string;
  min_price?: number;
  max_price?: number;
  q?: string;
};

export async function getListings(accessToken: string, filters?: ListingFilters): Promise<ListingRecord[]> {
  const params = new URLSearchParams();
  if (filters?.category && filters.category !== 'all') params.set('category', filters.category);
  if (filters?.condition) params.set('condition', filters.condition);
  if (filters?.min_price != null) params.set('min_price', String(filters.min_price));
  if (filters?.max_price != null) params.set('max_price', String(filters.max_price));
  if (filters?.q) params.set('q', filters.q);

  const qs = params.toString();
  const path = `/api/listings/get-all-listings${qs ? `?${qs}` : ''}`;

  const payload = await request<ApiEnvelope<{ listings?: ListingRecord[] }>>(path, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (payload.status !== 'success') {
    return [];
  }

  return payload.data?.listings ?? [];
}

export type SellerProfile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
  college_id: string | null;
};

export type PublicProfile = {
  id: string;
  name: string | null;
  avatar_url: string | null;
  graduation_year: number | null;
  bio: string | null;
  phone_number: string | null;
  college_name: string | null;
};

export async function getPublicProfile(accessToken: string, id: string) {
  return request<ApiEnvelope<{ profile: PublicProfile }>>(`/api/user/profile/${id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function getListingById(accessToken: string, id: string) {
  return request<ApiEnvelope<{ listing: ListingRecord; seller: SellerProfile | null }>>(`/api/listings/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export type ProfileRecord = {
  id: string;
  name: string | null;
  email: string;
  avatar_url: string | null;
  college_id: string | null;
  graduation_year: number | null;
  bio: string | null;
  phone_number: string | null;
  is_moving_out: boolean;
};

export async function getMyProfile(accessToken: string) {
  return request<ApiEnvelope<{ user: ProfileRecord }>>('/api/auth/me', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function updateProfile(
  accessToken: string,
  payload: { name?: string; graduation_year?: number | null; bio?: string; phone_number?: string; avatar_url?: string },
) {
  return request<ApiEnvelope<{ user: ProfileRecord }>>('/api/user/update-profile', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify(payload),
  });
}

export async function deleteAccount(accessToken: string) {
  return request<ApiEnvelope<null>>('/api/user/delete-account', {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function getMyListings(accessToken: string): Promise<ListingRecord[]> {
  const res = await request<ApiEnvelope<{ listings: ListingRecord[] }>>('/api/listings/my-listings', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.data?.listings ?? [];
}

export async function updateListingStatus(accessToken: string, id: string, status: 'active' | 'sold') {
  return request<ApiEnvelope<{ listing: ListingRecord }>>(`/api/listings/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ status }),
  });
}

export async function deleteListing(accessToken: string, id: string) {
  return request<ApiEnvelope<null>>(`/api/listings/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
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

export async function requestEduVerificationCode(email: string) {
  return request<ApiEnvelope<{ message: string }>>('/api/auth/request-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function verifyEduCode(email: string, token: string) {
  return request<ApiEnvelope<AuthResult>>('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, token }),
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

// ─── Messaging ────────────────────────────────────────────────────────────────

export type ConversationParticipant = {
  id: string;
  name: string | null;
  avatar_url: string | null;
};

export type ListingPreview = {
  id: string;
  title: string;
  images: string[];
  price?: number;
  status?: string;
};

export type MessageRecord = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
};

export type ConversationSummary = {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  is_active: boolean;
  last_message_at: string | null;
  created_at: string;
  otherUser: ConversationParticipant;
  listing: ListingPreview | null;
  lastMessage: MessageRecord | null;
  unreadCount: number;
};

export type ConversationDetail = {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  is_active: boolean;
  last_message_at: string | null;
  created_at: string;
  listing: ListingPreview | null;
  buyer: ConversationParticipant;
  seller: ConversationParticipant;
};

export async function getConversations(accessToken: string) {
  return request<ApiEnvelope<{ conversations: ConversationSummary[] }>>('/api/conversations', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function getOrCreateConversation(accessToken: string, listing_id: string) {
  return request<ApiEnvelope<{ conversation: { id: string; buyer_id: string; seller_id: string; listing_id: string; is_active: boolean; created_at: string } }>>('/api/conversations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ listing_id }),
  });
}

export async function getConversationById(accessToken: string, id: string) {
  return request<ApiEnvelope<{ conversation: ConversationDetail; messages: MessageRecord[] }>>(`/api/conversations/${id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

export async function sendMessage(accessToken: string, conversationId: string, content: string) {
  return request<ApiEnvelope<{ message: MessageRecord }>>(`/api/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ content }),
  });
}

export async function markConversationRead(accessToken: string, conversationId: string) {
  return request<ApiEnvelope<{ updated: boolean }>>(`/api/conversations/${conversationId}/read`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}` },
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
  const { access_token, grad_year, college_name: _college_name, ...rest } = payload;
  return request<ApiEnvelope<{ user: AuthUser }>>('/api/user/update-profile', {
    method: 'POST',
    headers: { Authorization: `Bearer ${access_token}` },
    body: JSON.stringify({
      ...rest,
      graduation_year: grad_year ? parseInt(grad_year, 10) : undefined,
    }),
  });
}
