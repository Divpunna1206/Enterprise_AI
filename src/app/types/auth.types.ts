export type PlatformRole =
  | 'SUPER_ADMIN'
  | 'SCHOOL_ADMIN'
  | 'PRINCIPAL'
  | 'TEACHER'
  | 'STUDENT'
  | 'PARENT'
  | 'ACCOUNTANT';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'INVITED' | 'PENDING';

export interface OrganizationSummary {
  id: string;
  name: string;
  slug: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: PlatformRole;
  status: UserStatus;
  organizationId: string | null;
  organization: OrganizationSummary | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SuperAdminSignupRequest {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export interface AuthSessionResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface LoginRequiredResponse {
  message: string;
}

export type SuperAdminSignupResponse =
  | AuthSessionResponse
  | LoginRequiredResponse;

export interface StoredAuthSession extends AuthSessionResponse {
  organization: OrganizationSummary | null;
}
