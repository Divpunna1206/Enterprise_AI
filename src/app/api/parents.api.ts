import { deleteRequest, getRequest, patchRequest, postRequest } from './client';
import type {
  ApiMessageResponse,
  LinkStudentPayload,
  ParentListQuery,
  ParentListResponse,
  ParentRecord,
  ParentStudentLinkRecord,
  ParentFormPayload,
} from '../types/school-admin.types';

export const parentsApi = {
  list(query?: ParentListQuery) {
    return getRequest<ParentListResponse>('/parents', { params: query });
  },
  create(payload: ParentFormPayload) {
    return postRequest<ParentRecord, ParentFormPayload>('/parents', payload);
  },
  getById(id: string) {
    return getRequest<ParentRecord>(`/parents/${id}`);
  },
  update(id: string, payload: Partial<ParentFormPayload>) {
    return patchRequest<ParentRecord, Partial<ParentFormPayload>>(`/parents/${id}`, payload);
  },
  remove(id: string) {
    return deleteRequest<ApiMessageResponse>(`/parents/${id}`);
  },
  linkStudent(id: string, payload: LinkStudentPayload) {
    return postRequest<ParentStudentLinkRecord, LinkStudentPayload>(`/parents/${id}/link-student`, payload);
  },
  unlinkStudent(id: string, studentId: string) {
    return deleteRequest<ApiMessageResponse>(`/parents/${id}/unlink-student/${studentId}`);
  },
  getChildren(id: string) {
    return getRequest<ParentStudentLinkRecord[]>(`/parents/${id}/children`);
  },
  getChildrenAttendance() {
    return getRequest('/parents/me/children-attendance');
  },
  getChildrenHomework() {
    return getRequest('/parents/me/children-homework');
  },
  getChildrenQuizResults() {
    return getRequest('/parents/me/children-quiz-results');
  },
  getChildrenProgress() {
    return getRequest('/parents/me/children-progress');
  },
  getChildrenRewards() {
    return getRequest('/parents/me/children-rewards');
  },
};
