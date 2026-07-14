import { getRequest, patchRequest, postRequest } from './client';
import type {
  AttendanceClassSummaryResponse,
  AttendanceSessionListResponse,
  AttendanceSessionRecord,
} from '../types/runtime-data.types';

export const attendanceApi = {
  createSession(payload: Record<string, unknown>) {
    return postRequest<AttendanceSessionRecord, Record<string, unknown>>('/attendance/sessions', payload);
  },
  listSessions(query?: Record<string, string | number | undefined>) {
    return getRequest<AttendanceSessionListResponse>('/attendance/sessions', { params: query });
  },
  getSession(id: string) {
    return getRequest<AttendanceSessionRecord>(`/attendance/sessions/${id}`);
  },
  upsertRecords(id: string, payload: Record<string, unknown>) {
    return postRequest(`/attendance/sessions/${id}/records`, payload);
  },
  updateRecord(id: string, payload: Record<string, unknown>) {
    return patchRequest(`/attendance/records/${id}`, payload);
  },
  submitSession(id: string) {
    return patchRequest(`/attendance/sessions/${id}/submit`);
  },
  getClassSummary(query?: Record<string, string | number | undefined>) {
    return getRequest<AttendanceClassSummaryResponse>('/attendance/class-summary', { params: query });
  },
};
