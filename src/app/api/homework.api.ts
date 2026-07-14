import { deleteRequest, getRequest, patchRequest, postRequest } from './client';

export const homeworkApi = {
  list(query?: Record<string, string | number | undefined>) {
    return getRequest('/homework', { params: query });
  },
  create(payload: Record<string, unknown>) {
    return postRequest('/homework', payload);
  },
  getById(id: string) {
    return getRequest(`/homework/${id}`);
  },
  update(id: string, payload: Record<string, unknown>) {
    return patchRequest(`/homework/${id}`, payload);
  },
  remove(id: string) {
    return deleteRequest(`/homework/${id}`);
  },
  publish(id: string) {
    return patchRequest(`/homework/${id}/publish`);
  },
  submit(id: string, payload: Record<string, unknown>) {
    return postRequest(`/homework/${id}/submit`, payload);
  },
  listSubmissions(id: string) {
    return getRequest(`/homework/${id}/submissions`);
  },
  gradeSubmission(submissionId: string, payload: Record<string, unknown>) {
    return patchRequest(`/homework/submissions/${submissionId}/grade`, payload);
  },
};

