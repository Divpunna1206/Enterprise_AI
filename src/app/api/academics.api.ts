import { deleteRequest, getRequest, patchRequest, postRequest } from './client';
import type {
  AcademicYearFormPayload,
  AcademicYearRecord,
  ApiMessageResponse,
  BootstrapDefaultSetupResponse,
  ClassFormPayload,
  ClassListQuery,
  ClassListResponse,
  ClassRecord,
  SectionFormPayload,
  SectionRecord,
  SubjectFormPayload,
  SubjectListQuery,
  SubjectListResponse,
  SubjectRecord,
} from '../types/school-admin.types';

export const academicsApi = {
  listAcademicYears() {
    return getRequest<AcademicYearRecord[]>('/academic-years');
  },
  createAcademicYear(payload: AcademicYearFormPayload) {
    return postRequest<AcademicYearRecord, AcademicYearFormPayload>('/academic-years', payload);
  },
  bootstrapDefaultSetup(payload?: { organizationId?: string }) {
    return postRequest<BootstrapDefaultSetupResponse, { organizationId?: string }>(
      '/academic-years/bootstrap-default-setup',
      payload,
    );
  },
  updateAcademicYear(id: string, payload: Partial<AcademicYearFormPayload>) {
    return patchRequest<AcademicYearRecord, Partial<AcademicYearFormPayload>>(`/academic-years/${id}`, payload);
  },
  activateAcademicYear(id: string) {
    return patchRequest<ApiMessageResponse>(`/academic-years/${id}/activate`);
  },
  deleteAcademicYear(id: string) {
    return deleteRequest<ApiMessageResponse>(`/academic-years/${id}`);
  },
  listClasses(query?: ClassListQuery) {
    return getRequest<ClassListResponse>('/classes', { params: query });
  },
  createClass(payload: ClassFormPayload) {
    return postRequest<ClassRecord, ClassFormPayload>('/classes', payload);
  },
  updateClass(id: string, payload: Partial<ClassFormPayload>) {
    return patchRequest<ClassRecord, Partial<ClassFormPayload>>(`/classes/${id}`, payload);
  },
  deleteClass(id: string) {
    return deleteRequest<ApiMessageResponse>(`/classes/${id}`);
  },
  createSection(classId: string, payload: SectionFormPayload) {
    return postRequest<SectionRecord, SectionFormPayload>(`/classes/${classId}/sections`, payload);
  },
  updateSection(id: string, payload: Partial<SectionFormPayload>) {
    return patchRequest<SectionRecord, Partial<SectionFormPayload>>(`/sections/${id}`, payload);
  },
  deleteSection(id: string) {
    return deleteRequest<ApiMessageResponse>(`/sections/${id}`);
  },
  listSubjects(query?: SubjectListQuery) {
    return getRequest<SubjectListResponse>('/subjects', { params: query });
  },
  createSubject(payload: SubjectFormPayload) {
    return postRequest<SubjectRecord, SubjectFormPayload>('/subjects', payload);
  },
  updateSubject(id: string, payload: Partial<SubjectFormPayload>) {
    return patchRequest<SubjectRecord, Partial<SubjectFormPayload>>(`/subjects/${id}`, payload);
  },
  deleteSubject(id: string) {
    return deleteRequest<ApiMessageResponse>(`/subjects/${id}`);
  },
};
