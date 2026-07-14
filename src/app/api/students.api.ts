import { deleteRequest, getRequest, patchRequest, postRequest } from './client';
import type {
  ApiMessageResponse,
  ParentStudentLinkRecord,
  StudentFormPayload,
  StudentListQuery,
  StudentListResponse,
  StudentRecord,
} from '../types/school-admin.types';

export const studentsApi = {
  list(query?: StudentListQuery) {
    return getRequest<StudentListResponse>('/students', { params: query });
  },
  create(payload: StudentFormPayload) {
    return postRequest<StudentRecord, StudentFormPayload>('/students', payload);
  },
  getById(id: string) {
    return getRequest<StudentRecord>(`/students/${id}`);
  },
  update(id: string, payload: Partial<StudentFormPayload>) {
    return patchRequest<StudentRecord | { user: StudentRecord['user']; profile: StudentRecord }, Partial<StudentFormPayload>>(
      `/students/${id}`,
      payload,
    );
  },
  remove(id: string) {
    return deleteRequest<ApiMessageResponse>(`/students/${id}`);
  },
  getParents(id: string) {
    return getRequest<ParentStudentLinkRecord[]>(`/students/${id}/parents`);
  },
  getPerformanceSummary(id: string) {
    return getRequest(`/students/${id}/performance-summary`);
  },
  getMyProgress() {
    return getRequest('/students/me/progress');
  },
  getMyAttendance() {
    return getRequest('/students/me/attendance');
  },
  getMyHomework() {
    return getRequest('/students/me/homework');
  },
  getMyQuizzes() {
    return getRequest('/students/me/quizzes');
  },
  getMyRewards() {
    return getRequest('/students/me/rewards');
  },
};
