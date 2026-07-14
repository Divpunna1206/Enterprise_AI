import { getRequest, postRequest } from './client';
import type {
  AcceptInvitationPayload,
  AcceptInvitationResponse,
  CreateSchoolWithAdminPayload,
  CreateSchoolWithAdminResponse,
  InvitationLookupResponse,
  RequestDemoPayload,
  RequestDemoResponse,
} from '../types/onboarding.types';

export const onboardingApi = {
  requestDemo(payload: RequestDemoPayload) {
    return postRequest<RequestDemoResponse, RequestDemoPayload>('/onboarding/request-demo', payload);
  },
  createSchoolWithAdmin(payload: CreateSchoolWithAdminPayload) {
    return postRequest<CreateSchoolWithAdminResponse, CreateSchoolWithAdminPayload>(
      '/onboarding/create-school-with-admin',
      payload,
    );
  },
  getInvitation(token: string) {
    return getRequest<InvitationLookupResponse>(`/onboarding/invitations/${token}`);
  },
  acceptInvitation(token: string, payload: AcceptInvitationPayload) {
    return postRequest<AcceptInvitationResponse, AcceptInvitationPayload>(
      `/onboarding/invitations/${token}/accept`,
      payload,
    );
  },
};
