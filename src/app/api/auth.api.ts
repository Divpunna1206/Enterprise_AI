import { getRequest, postRequest } from './client';
import type {
  AuthSessionResponse,
  SuperAdminSignupResponse,
  LoginRequest,
  SuperAdminSignupRequest,
} from '../types/auth.types';

export const authApi = {
  login(payload: LoginRequest) {
    return postRequest<AuthSessionResponse, LoginRequest>('/auth/login', payload);
  },
  signupSuperAdmin(payload: SuperAdminSignupRequest) {
    return postRequest<SuperAdminSignupResponse, SuperAdminSignupRequest>(
      '/auth/super-admin/signup',
      payload,
    );
  },
  refresh(refreshToken: string) {
    return postRequest<AuthSessionResponse, { refreshToken: string }>('/auth/refresh', {
      refreshToken,
    });
  },
  me() {
    return getRequest<AuthSessionResponse['user']>('/auth/me');
  },
  logout() {
    return postRequest<{ message: string }>('/auth/logout');
  },
};
