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
};

type CallbackResponse = ApiEnvelope<{
  user: AuthUser;
  session: {
    access_token: string;
    refresh_token?: string;
  };
}>;

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

export async function requestEduVerificationCode(email: string) {
  return request<ApiEnvelope<{ email: string }>>('/api/auth/email/request-code', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function verifyEduCode(email: string, code: string) {
  return request<ApiEnvelope<{ verified: boolean }>>('/api/auth/email/verify-code', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}

export async function authCallback(accessToken: string, refreshToken?: string) {
  return request<CallbackResponse>('/api/auth/callback', {
    method: 'POST',
    body: JSON.stringify({ access_token: accessToken, refresh_token: refreshToken }),
  });
}
