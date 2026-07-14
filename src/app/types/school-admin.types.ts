import type { PaginatedResponse } from './api.types';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
export type SchoolUserStatus = 'ACTIVE' | 'INACTIVE' | 'INVITED' | 'SUSPENDED';

export interface ApiMessageResponse {
  message: string;
}

export interface BootstrapDefaultSetupResponse {
  message: string;
  academicYearsCreated: number;
  classesCreated: number;
  sectionsCreated: number;
  activeAcademicYear: AcademicYearRecord;
}

export interface UserProfileRecord {
  id: string;
  avatarUrl: string | null;
  gender: Gender | null;
  dateOfBirth: string | null;
  address: string | null;
  metadata: Record<string, unknown> | null;
}

export interface SchoolUserRecord {
  id: string;
  organizationId: string | null;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  status: SchoolUserStatus;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  lastLoginAt?: string | null;
  profile?: UserProfileRecord | null;
}

export interface AcademicYearRecord {
  id: string;
  organizationId: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SectionRecord {
  id: string;
  organizationId: string;
  classId: string;
  name: string;
  capacity: number | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    studentProfiles: number;
    teacherAssignments: number;
  };
}

export interface ClassRecord {
  id: string;
  organizationId: string;
  academicYearId: string;
  name: string;
  grade: string;
  createdAt: string;
  updatedAt: string;
  academicYear?: AcademicYearRecord;
  sections?: SectionRecord[];
  _count?: {
    studentProfiles: number;
    teacherAssignments: number;
  };
}

export interface SubjectRecord {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    teacherAssignments: number;
    courses: number;
  };
}

export interface TeacherAssignmentRecord {
  id: string;
  organizationId: string;
  teacherId: string;
  subjectId: string;
  classId: string;
  sectionId: string;
  academicYearId: string;
  subject: SubjectRecord;
  class: ClassRecord;
  section: SectionRecord;
  academicYear: AcademicYearRecord;
}

export interface TeacherRecord {
  id: string;
  organizationId: string;
  userId: string;
  employeeCode: string;
  qualification: string | null;
  experienceYears: number | null;
  joiningDate: string | null;
  createdAt: string;
  updatedAt: string;
  user: SchoolUserRecord;
  teacherAssignments?: TeacherAssignmentRecord[];
}

export interface StudentRecord {
  id: string;
  organizationId: string;
  userId: string;
  studentCode: string;
  rollNumber: string | null;
  admissionNumber: string;
  classId: string;
  sectionId: string;
  academicYearId: string;
  admissionDate: string | null;
  createdAt: string;
  updatedAt: string;
  user: SchoolUserRecord;
  class?: ClassRecord;
  section?: SectionRecord;
  academicYear?: AcademicYearRecord;
  _count?: {
    parentLinks: number;
  };
}

export interface ParentStudentLinkRecord {
  id: string;
  organizationId: string;
  parentUserId: string;
  studentUserId: string;
  studentProfileId: string | null;
  relation: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  studentUser?: SchoolUserRecord;
  studentProfile?: StudentRecord;
}

export interface ParentRecord extends SchoolUserRecord {
  parentStudentLinks?: ParentStudentLinkRecord[];
}

export interface TeacherListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: SchoolUserStatus;
  subjectId?: string;
}

export interface TeacherFormPayload {
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
  employeeCode: string;
  qualification?: string;
  experienceYears?: number;
  joiningDate?: string;
  status?: SchoolUserStatus;
  gender?: Gender;
  address?: string;
}

export interface TeacherAssignmentPayload {
  subjectId: string;
  classId: string;
  sectionId: string;
  academicYearId: string;
}

export interface StudentListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: SchoolUserStatus;
  classId?: string;
  sectionId?: string;
}

export interface StudentFormPayload {
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
  studentCode: string;
  rollNumber?: string;
  admissionNumber: string;
  classId: string;
  sectionId: string;
  academicYearId: string;
  admissionDate?: string;
  status?: SchoolUserStatus;
  gender?: Gender;
  address?: string;
}

export interface ParentListQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: SchoolUserStatus;
}

export interface ParentFormPayload {
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
  status?: SchoolUserStatus;
  gender?: Gender;
  address?: string;
}

export interface LinkStudentPayload {
  studentUserId: string;
  relation: string;
  isPrimary?: boolean;
}

export interface ClassListQuery {
  page?: number;
  limit?: number;
  search?: string;
  academicYearId?: string;
}

export interface ClassFormPayload {
  academicYearId: string;
  name: string;
  grade: string;
}

export interface SectionFormPayload {
  name: string;
  capacity?: number;
}

export interface AcademicYearFormPayload {
  name: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

export interface SubjectListQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface SubjectFormPayload {
  name: string;
  code: string;
  description?: string;
}

export type TeacherListResponse = PaginatedResponse<TeacherRecord>;
export type StudentListResponse = PaginatedResponse<StudentRecord>;
export type ParentListResponse = PaginatedResponse<ParentRecord>;
export type ClassListResponse = PaginatedResponse<ClassRecord>;
export type SubjectListResponse = PaginatedResponse<SubjectRecord>;
