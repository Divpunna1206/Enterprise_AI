import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { authApi } from '../api/auth.api';
import {
  clearStoredSession,
  normalizeApiError,
  readStoredSession,
  registerUnauthorizedHandler,
  writeStoredSession,
} from '../api/client';
import type { ApiError } from '../types/api.types';
import type {
  AuthUser,
  AuthSessionResponse,
  LoginRequest,
  StoredAuthSession,
  SuperAdminSignupRequest,
  SuperAdminSignupResponse,
} from '../types/auth.types';

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
type SignupOutcome =
  | { mode: 'authenticated'; user: AuthUser }
  | { mode: 'login_required'; message: string };

interface AuthContextValue {
  error: ApiError | null;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshCurrentUser: () => Promise<AuthUser | null>;
  session: StoredAuthSession | null;
  signupSuperAdmin: (payload: SuperAdminSignupRequest) => Promise<SignupOutcome>;
  status: AuthStatus;
  user: AuthUser | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function isAuthSessionResponse(
  response: SuperAdminSignupResponse,
): response is AuthSessionResponse {
  return (
    'accessToken' in response &&
    'refreshToken' in response &&
    'user' in response
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredAuthSession | null>(() => readStoredSession());
  const [status, setStatus] = useState<AuthStatus>(session ? 'loading' : 'unauthenticated');
  const [error, setError] = useState<ApiError | null>(null);

  const applySession = useCallback((nextSession: StoredAuthSession | null) => {
    setSession(nextSession);
    if (nextSession) {
      writeStoredSession(nextSession);
      setStatus('authenticated');
    } else {
      clearStoredSession();
      setStatus('unauthenticated');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (readStoredSession()?.accessToken) {
        await authApi.logout();
      }
    } catch {
      // Ignore logout network failures and clear locally.
    } finally {
      setError(null);
      applySession(null);
    }
  }, [applySession]);

  const refreshCurrentUser = useCallback(async () => {
    const stored = readStoredSession();
    if (!stored) {
      applySession(null);
      return null;
    }

    try {
      const user = await authApi.me();
      const nextSession: StoredAuthSession = {
        ...stored,
        user,
        organization: user.organization,
      };
      applySession(nextSession);
      return user;
    } catch (authError) {
      const normalized = normalizeApiError(authError);
      setError(normalized);
      applySession(null);
      return null;
    }
  }, [applySession]);

  const login = useCallback(
    async (payload: LoginRequest) => {
      setStatus('loading');
      setError(null);

      try {
        const response = await authApi.login(payload);
        const nextSession: StoredAuthSession = {
          ...response,
          organization: response.user.organization,
        };
        applySession(nextSession);
        return response.user;
      } catch (loginError) {
        const normalized = normalizeApiError(loginError);
        setError(normalized);
        setStatus('unauthenticated');
        throw normalized;
      }
    },
    [applySession],
  );

  const signupSuperAdmin = useCallback(
    async (payload: SuperAdminSignupRequest) => {
      setStatus('loading');
      setError(null);

      try {
        const response = await authApi.signupSuperAdmin(payload);

        if (isAuthSessionResponse(response)) {
          const nextSession: StoredAuthSession = {
            ...response,
            organization: response.user.organization,
          };
          applySession(nextSession);
          return { mode: 'authenticated', user: response.user } as const;
        }

        setStatus('unauthenticated');
        return {
          mode: 'login_required',
          message: response.message,
        } as const;
      } catch (signupError) {
        const normalized = normalizeApiError(signupError);
        setError(normalized);
        setStatus('unauthenticated');
        throw normalized;
      }
    },
    [applySession],
  );

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      applySession(null);
    });

    return () => registerUnauthorizedHandler(null);
  }, [applySession]);

  useEffect(() => {
    if (!session) return;
    void refreshCurrentUser();
  }, [refreshCurrentUser, session?.accessToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      error,
      isAuthenticated: status === 'authenticated' && Boolean(session?.accessToken),
      login,
      logout,
      refreshCurrentUser,
      session,
      signupSuperAdmin,
      status,
      user: session?.user ?? null,
    }),
    [error, login, logout, refreshCurrentUser, session, signupSuperAdmin, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('Auth context is missing.');
  }

  return context;
}
