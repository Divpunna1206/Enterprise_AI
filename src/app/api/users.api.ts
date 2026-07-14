import { getRequest, patchRequest } from './client';
import type { PaginatedResponse } from '../types/api.types';
import type { UserListItem, UserProfileResponse } from '../types/user.types';

export const usersApi = {
  list(query?: Record<string, string | number | undefined>) {
    return getRequest<PaginatedResponse<UserListItem>>('/users', { params: query });
  },
  getProfile() {
    return getRequest<UserProfileResponse>('/users/me/profile');
  },
  updateProfile(payload: Record<string, unknown>) {
    return patchRequest<UserProfileResponse, Record<string, unknown>>('/users/me/profile', payload);
  },
};

