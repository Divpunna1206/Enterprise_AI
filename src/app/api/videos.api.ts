import { deleteRequest, getRequest, patchRequest, postRequest, uploadRequest } from './client';

export const videosApi = {
  upload(payload: FormData) {
    return uploadRequest('/videos/upload', payload);
  },
  list(query?: Record<string, string | number | undefined>) {
    return getRequest('/videos', { params: query });
  },
  getById(id: string) {
    return getRequest(`/videos/${id}`);
  },
  update(id: string, payload: Record<string, unknown>) {
    return patchRequest(`/videos/${id}`, payload);
  },
  remove(id: string) {
    return deleteRequest(`/videos/${id}`);
  },
  process(id: string) {
    return postRequest(`/videos/${id}/process`);
  },
  getProcessingStatus(id: string) {
    return getRequest(`/videos/${id}/processing-status`);
  },
};

