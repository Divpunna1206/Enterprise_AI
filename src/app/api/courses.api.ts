import { deleteRequest, getRequest, patchRequest, postRequest } from './client';

export const coursesApi = {
  list(query?: Record<string, string | number | undefined>) {
    return getRequest('/courses', { params: query });
  },
  create(payload: Record<string, unknown>) {
    return postRequest('/courses', payload);
  },
  getById(id: string) {
    return getRequest(`/courses/${id}`);
  },
  update(id: string, payload: Record<string, unknown>) {
    return patchRequest(`/courses/${id}`, payload);
  },
  remove(id: string) {
    return deleteRequest(`/courses/${id}`);
  },
  publish(id: string) {
    return patchRequest(`/courses/${id}/publish`);
  },
  listLessons(id: string) {
    return getRequest(`/courses/${id}/lessons`);
  },
};

