import { getRequest, patchRequest, postRequest, uploadRequest, deleteRequest } from './client';
import type {
  AiModuleRecord,
  AiSettingRecord,
  AiUsageListResponse,
  SourceLibraryItem,
  SourceLibraryListResponse,
  SourceLibraryUploadResponse,
} from '../types/runtime-data.types';

export const aiApi = {
  listSourceLibrary(query?: Record<string, string | number | undefined>) {
    return getRequest<SourceLibraryListResponse>('/source-library', { params: query });
  },
  uploadSourceLibraryItem(payload: FormData) {
    return uploadRequest<SourceLibraryUploadResponse>('/source-library/upload', payload);
  },
  getSourceLibraryItem(id: string) {
    return getRequest<SourceLibraryItem>(`/source-library/${id}`);
  },
  deleteSourceLibraryItem(id: string) {
    return deleteRequest(`/source-library/${id}`);
  },
  reindexSourceLibraryItem(id: string) {
    return postRequest(`/source-library/${id}/reindex`);
  },
  createSummary(payload: Record<string, unknown>) {
    return postRequest('/ai/summary', payload);
  },
  createWorksheet(payload: Record<string, unknown>) {
    return postRequest('/ai/worksheet', payload);
  },
  createQuiz(payload: Record<string, unknown>) {
    return postRequest('/ai/quiz', payload);
  },
  createCourseOutline(payload: Record<string, unknown>) {
    return postRequest('/ai/course-outline', payload);
  },
  createFeedback(payload: Record<string, unknown>) {
    return postRequest('/ai/feedback', payload);
  },
  ask(payload: Record<string, unknown>) {
    return postRequest('/ai/ask', payload);
  },
  studyCoach(payload: Record<string, unknown>) {
    return postRequest('/ai/study-coach', payload);
  },
  getJob(jobId: string) {
    return getRequest(`/ai/jobs/${jobId}`);
  },
  listJobs(query?: Record<string, string | number | undefined>) {
    return getRequest('/ai/jobs', { params: query });
  },
  getUsage(query?: Record<string, string | number | undefined>) {
    return getRequest<AiUsageListResponse>('/ai/usage', { params: query });
  },
  getSettings() {
    return getRequest<AiSettingRecord>('/ai/settings');
  },
  updateSettings(payload: Record<string, unknown>) {
    return patchRequest<AiSettingRecord, Record<string, unknown>>('/ai/settings', payload);
  },
  listModules() {
    return getRequest<AiModuleRecord[]>('/ai/modules');
  },
  toggleModule(id: string) {
    return patchRequest<AiModuleRecord>(`/ai/modules/${id}/toggle`);
  },
};
