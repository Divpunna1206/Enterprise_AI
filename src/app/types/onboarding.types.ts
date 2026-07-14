import type { PlatformRole, UserStatus } from './auth.types';

export interface RequestDemoPayload {
  schoolName: string;
  contactPersonName: string;
  email: string;
  phone: string;
  city: string;
  studentCount: number;
  message: string;
}

export interface RequestDemoResponse {
  message: string;
  requestId: string;
}

export interface CreateSchoolWithAdminPayload {
  organization: {
    name: string;
    slug: string;
    domain: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
  };
  admin: {
    fullName: string;
    email: string;
    phone: string;
  };
}

export interface CreateSchoolWithAdminResponse {
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  admin: {
    id: string;
    fullName: string;
    email: string;
    status: UserStatus;
  };
  invitation: {
    id: string;
    status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';
    expiresAt: string;
    inviteLink: string | null;
  };
}

export interface InvitationLookupResponse {
  invitation: {
    email: string;
    role: PlatformRole;
    status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED';
    expiresAt: string;
  };
  organization: {
    id: string;
    name: string;
    slug: string;
  };
  admin: {
    id: string;
    fullName: string;
    email: string;
    status: UserStatus;
  } | null;
}

export interface AcceptInvitationPayload {
  password: string;
  confirmPassword: string;
}

export interface AcceptInvitationResponse {
  message: string;
}
