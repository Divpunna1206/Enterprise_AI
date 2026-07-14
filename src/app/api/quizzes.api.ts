import { deleteRequest, getRequest, patchRequest, postRequest } from './client';

export const quizzesApi = {
  list(query?: Record<string, string | number | undefined>) {
    return getRequest('/quizzes', { params: query });
  },
  create(payload: Record<string, unknown>) {
    return postRequest('/quizzes', payload);
  },
  getById(id: string) {
    return getRequest(`/quizzes/${id}`);
  },
  update(id: string, payload: Record<string, unknown>) {
    return patchRequest(`/quizzes/${id}`, payload);
  },
  remove(id: string) {
    return deleteRequest(`/quizzes/${id}`);
  },
  publish(id: string) {
    return patchRequest(`/quizzes/${id}/publish`);
  },
  createQuestion(id: string, payload: Record<string, unknown>) {
    return postRequest(`/quizzes/${id}/questions`, payload);
  },
  start(id: string, payload?: Record<string, unknown>) {
    return postRequest(`/quizzes/${id}/start`, payload);
  },
  submitAttempt(attemptId: string, payload: Record<string, unknown>) {
    return postRequest(`/quiz-attempts/${attemptId}/submit`, payload);
  },
  getAttemptResult(attemptId: string) {
    return getRequest(`/quiz-attempts/${attemptId}/result`);
  },
};

