import { deleteRequest, patchRequest, postRequest } from './client';

export const lessonsApi = {
  create(courseId: string, payload: Record<string, unknown>) {
    return postRequest(`/courses/${courseId}/lessons`, payload);
  },
  update(id: string, payload: Record<string, unknown>) {
    return patchRequest(`/lessons/${id}`, payload);
  },
  remove(id: string) {
    return deleteRequest(`/lessons/${id}`);
  },
  reorder(payload: Record<string, unknown>) {
    return patchRequest('/lessons/reorder', payload);
  },
};

