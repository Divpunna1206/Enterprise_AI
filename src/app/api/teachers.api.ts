import { deleteRequest, getRequest, patchRequest, postRequest } from './client';
import type {
  ApiMessageResponse,
  TeacherAssignmentPayload,
  TeacherAssignmentRecord,
  TeacherFormPayload,
  TeacherListQuery,
  TeacherListResponse,
  TeacherRecord,
} from '../types/school-admin.types';

export const teachersApi = {
  list(query?: TeacherListQuery) {
    return getRequest<TeacherListResponse>('/teachers', { params: query });
  },
  create(payload: TeacherFormPayload) {
    return postRequest<TeacherRecord, TeacherFormPayload>('/teachers', payload);
  },
  getById(id: string) {
    return getRequest<TeacherRecord>(`/teachers/${id}`);
  },
  update(id: string, payload: Partial<TeacherFormPayload>) {
    return patchRequest<TeacherRecord | { user: TeacherRecord['user']; profile: TeacherRecord }, Partial<TeacherFormPayload>>(
      `/teachers/${id}`,
      payload,
    );
  },
  remove(id: string) {
    return deleteRequest<ApiMessageResponse>(`/teachers/${id}`);
  },
  assignSubjectClass(id: string, payload: TeacherAssignmentPayload) {
    return postRequest<TeacherAssignmentRecord, TeacherAssignmentPayload>(
      `/teachers/${id}/assign-subject-class`,
      payload,
    );
  },
  listClasses(id: string) {
    return getRequest<TeacherAssignmentRecord[]>(`/teachers/${id}/classes`);
  },
};
