import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

import type { ApiError, QueryValue } from '../types/api.types';
import type { AuthSessionResponse, StoredAuthSession } from '../types/auth.types';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  'http://localhost:4000/api/v1';
const AUTH_STORAGE_KEY = 'enterprise-ai-auth-session-v1';
const REQUEST_TIMEOUT_MS = 15000;

type RefreshQueueEntry = {
  reject: (error: unknown) => void;
  resolve: (accessToken: string | null) => void;
};

type ApiErrorResponseBody =
  | string
  | {
      message?: string | string[];
      error?: string;
      statusCode?: number;
    };

let refreshPromise: Promise<string | null> | null = null;
let unauthorizedHandler: (() => void) | null = null;
const retriedRequests = new WeakSet<InternalAxiosRequestConfig>();
let refreshQueue: RefreshQueueEntry[] = [];

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as ApiErrorResponseBody | undefined;
    const message = getApiErrorMessage(error, responseData);

    return {
      message,
      status: error.response?.status,
      code: typeof responseData === 'string' ? undefined : responseData?.error,
      details: error.response?.data,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: 'An unknown error occurred.' };
}

function getApiErrorMessage(
  error: AxiosError,
  responseData?: ApiErrorResponseBody,
): string {
  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData.trim();
  }

  if (Array.isArray(responseData?.message)) {
    const combinedMessage = responseData.message
      .map((message) => message.trim())
      .filter(Boolean)
      .join(', ');

    if (combinedMessage) {
      return combinedMessage;
    }
  }

  if (typeof responseData?.message === 'string' && responseData.message.trim()) {
    return responseData.message.trim();
  }

  if (typeof responseData?.error === 'string' && responseData.error.trim()) {
    return responseData.error.trim();
  }

  if (!error.response) {
    return 'Unable to reach the server. Check that the backend is running and try again.';
  }

  if (typeof error.message === 'string' && error.message.trim()) {
    return error.message.trim();
  }

  return 'Request failed.';
}

export function readStoredSession(): StoredAuthSession | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredAuthSession;
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function writeStoredSession(session: AuthSessionResponse | StoredAuthSession) {
  if (typeof window === 'undefined') return;

  const stored: StoredAuthSession = {
    ...session,
    organization: session.user.organization,
  };
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stored));
}

export function clearStoredSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function registerUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

function getAccessToken() {
  return readStoredSession()?.accessToken ?? null;
}

function getRefreshToken() {
  return readStoredSession()?.refreshToken ?? null;
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  const response = await axios.post<AuthSessionResponse>(
    `${API_BASE_URL}/auth/refresh`,
    { refreshToken },
    {
      timeout: REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  );

  writeStoredSession(response.data);
  return response.data.accessToken;
}

// function buildHeaders(headers?: AxiosRequestConfig['headers']) {
//   const normalized = AxiosHeaders.from(headers ?? {});
//   normalized.set('Accept', 'application/json');
//   return normalized;
// }

function buildHeaders(
  headers: InternalAxiosRequestConfig['headers'],
): AxiosHeaders {
  const normalized = AxiosHeaders.from(headers);
  normalized.set('Accept', 'application/json');
  return normalized;
}

function isRefreshRequest(config?: InternalAxiosRequestConfig) {
  return config?.url?.includes('/auth/refresh') ?? false;
}

function flushRefreshQueue(accessToken: string | null) {
  refreshQueue.forEach(({ resolve }) => resolve(accessToken));
  refreshQueue = [];
}

function rejectRefreshQueue(error: unknown) {
  refreshQueue.forEach(({ reject }) => reject(error));
  refreshQueue = [];
}

function enqueueRefreshWaiter(): Promise<string | null> {
  return new Promise<string | null>((resolve, reject) => {
    refreshQueue.push({ resolve, reject });
  });
}

function handleUnauthorized() {
  clearStoredSession();
  unauthorizedHandler?.();
}

function beginRefresh(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken()
      .then((accessToken) => {
        flushRefreshQueue(accessToken);
        return accessToken;
      })
      .catch((refreshError: unknown) => {
        rejectRefreshQueue(refreshError);
        throw refreshError;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  const headers = buildHeaders(config.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  config.headers = headers;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (
      !originalRequest ||
      status !== 401 ||
      retriedRequests.has(originalRequest) ||
      isRefreshRequest(originalRequest)
    ) {
      return Promise.reject(normalizeApiError(error));
    }

    retriedRequests.add(originalRequest);
    const queuedRetry = enqueueRefreshWaiter();

    try {
      void beginRefresh();

      const nextAccessToken = await queuedRetry;
      if (!nextAccessToken) {
        handleUnauthorized();
        return Promise.reject(normalizeApiError(error));
      }

      const headers = AxiosHeaders.from(originalRequest.headers);
      headers.set('Accept', 'application/json');
      headers.set('Authorization', `Bearer ${nextAccessToken}`);
      originalRequest.headers = headers;

      return apiClient(originalRequest);
    } catch (refreshError) {
      handleUnauthorized();
      return Promise.reject(normalizeApiError(refreshError));
    }
  },
);

export function createQueryParams(query?: Record<string, QueryValue>) {
  const params = new URLSearchParams();

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    params.set(key, String(value));
  });

  return params;
}

export async function getRequest<T>(url: string, config?: AxiosRequestConfig) {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

export async function postRequest<T, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
) {
  const response = await apiClient.post<T>(url, body, config);
  return response.data;
}

export async function patchRequest<T, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
) {
  const response = await apiClient.patch<T>(url, body, config);
  return response.data;
}

export async function deleteRequest<T>(url: string, config?: AxiosRequestConfig) {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
}

export async function uploadRequest<T>(url: string, body: FormData, config?: AxiosRequestConfig) {
  const response = await apiClient.post<T>(url, body, {
    ...config,
    headers: {
      ...(config?.headers ?? {}),
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
