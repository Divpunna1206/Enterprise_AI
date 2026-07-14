import { getRequest } from './client';
import type {
  ChildProgressRecord,
  ClassProgressSummary,
  StudentProgressSummary,
  StudentSubjectProgress,
  TeacherProgressSummary,
} from '../types/runtime-data.types';

export const progressApi = {
  getStudentSummary(studentId: string) {
    return getRequest<StudentProgressSummary>(`/progress/student/${studentId}/summary`);
  },
  getStudentSubjects(studentId: string) {
    return getRequest<StudentSubjectProgress[]>(`/progress/student/${studentId}/subjects`);
  },
  getClassSummary(classId: string) {
    return getRequest<ClassProgressSummary>(`/progress/class/${classId}/summary`);
  },
  getTeacherSummary(teacherId: string) {
    return getRequest<TeacherProgressSummary>(`/progress/teacher/${teacherId}/summary`);
  },
  getMyProgress() {
    return getRequest<StudentProgressSummary>('/students/me/progress');
  },
  getChildrenProgress() {
    return getRequest<ChildProgressRecord[]>('/parents/me/children-progress');
  },
};
