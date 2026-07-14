import type { OrganizationSummary, PlatformRole } from './auth.types';

export interface UserProfile {
  id: string;
  avatarUrl: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  address: string | null;
  metadata: Record<string, unknown> | null;
}

export interface UserProfileResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: PlatformRole;
  organizationId: string | null;
  profile: UserProfile | null;
}

export interface UserListItem extends UserProfileResponse {
  status?: string;
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  organization?: OrganizationSummary | null;
}

