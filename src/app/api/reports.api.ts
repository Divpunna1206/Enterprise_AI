import { getRequest } from './client';
import type {
  AiUsageReport,
  AttendanceSessionRecord,
  HomeworkReportRecord,
  SchoolSummaryReport,
  StudentPerformanceReportRow,
  TeacherPerformanceReportRow,
  QuizReportRecord,
} from '../types/runtime-data.types';

export const reportsApi = {
  getSchoolSummary(query?: Record<string, string | number | undefined>) {
    return getRequest<SchoolSummaryReport>('/reports/school-summary', { params: query });
  },
  getStudentPerformance(query?: Record<string, string | number | undefined>) {
    return getRequest<StudentPerformanceReportRow[]>('/reports/student-performance', { params: query });
  },
  getTeacherPerformance(query?: Record<string, string | number | undefined>) {
    return getRequest<TeacherPerformanceReportRow[]>('/reports/teacher-performance', { params: query });
  },
  getAttendance(query?: Record<string, string | number | undefined>) {
    return getRequest<AttendanceSessionRecord[]>('/reports/attendance', { params: query });
  },
  getQuiz(query?: Record<string, string | number | undefined>) {
    return getRequest<QuizReportRecord[]>('/reports/quiz', { params: query });
  },
  getHomework(query?: Record<string, string | number | undefined>) {
    return getRequest<HomeworkReportRecord[]>('/reports/homework', { params: query });
  },
  getAiUsage(query?: Record<string, string | number | undefined>) {
    return getRequest<AiUsageReport>('/reports/ai-usage', { params: query });
  },
};
