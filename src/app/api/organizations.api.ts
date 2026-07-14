import { deleteRequest, getRequest, patchRequest, postRequest } from './client';
import type { OrganizationListItem, OrganizationsListResponse } from '../types/runtime-data.types';

export const organizationsApi = {
  list(query?: Record<string, string | number | undefined>) {
    return getRequest<OrganizationsListResponse>('/organizations', { params: query });
  },
  create(payload: Record<string, unknown>) {
    return postRequest<OrganizationListItem, Record<string, unknown>>('/organizations', payload);
  },
  getById(id: string) {
    return getRequest<OrganizationListItem>(`/organizations/${id}`);
  },
  update(id: string, payload: Record<string, unknown>) {
    return patchRequest<OrganizationListItem, Record<string, unknown>>(`/organizations/${id}`, payload);
  },
  updateStatus(id: string, payload: Record<string, unknown>) {
    return patchRequest<OrganizationListItem, Record<string, unknown>>(`/organizations/${id}/status`, payload);
  },
  remove(id: string) {
    return deleteRequest(`/organizations/${id}`);
  },
};
