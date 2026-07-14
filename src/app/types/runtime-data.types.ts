import type { PaginatedResponse } from './api.types';
import type { PlatformRole } from './auth.types';

export type GenericObject = Record<string, unknown>;

export interface NamedReference {
  id: string;
  name?: string;
  fullName?: string;
  title?: string;
  label?: string;
  grade?: string;
}

export interface AttendanceSessionRecord extends GenericObject {
  id: string;
  date?: string;
  status?: string;
  class?: NamedReference | null;
  section?: NamedReference | null;
  teacher?: { id: string; user?: NamedReference | null } | null;
  _count?: { records?: number };
}

export type AttendanceClassSummaryResponse = GenericObject;
export type StudentAttendanceResponse = GenericObject;

export interface ParentAttendanceRecord extends GenericObject {
  studentId?: string;
  fullName?: string;
  attendance?: GenericObject;
  summary?: GenericObject;
}

export interface SchoolSummaryReport {
  metrics: Record<string, number>;
}

export interface StudentPerformanceReportRow {
  studentId: string;
  fullName: string;
  summary: GenericObject;
}

export interface TeacherPerformanceReportRow {
  teacherId: string;
  fullName: string;
  summary: GenericObject;
}

export interface QuizReportRecord extends GenericObject {
  id: string;
  title?: string;
  status?: string;
  totalMarks?: number;
  durationMinutes?: number;
  subject?: NamedReference | null;
  class?: NamedReference | null;
  section?: NamedReference | null;
  _count?: { attempts?: number; questions?: number };
}

export interface HomeworkReportRecord extends GenericObject {
  id: string;
  title?: string;
  dueDate?: string;
  status?: string;
  subject?: NamedReference | null;
  class?: NamedReference | null;
  section?: NamedReference | null;
  _count?: { submissions?: number };
}

export interface AiUsageReport {
  totalJobs: number;
  byStatus: Record<string, number>;
  recentJobs: GenericObject[];
}

export interface SourceLibraryItem extends GenericObject {
  id: string;
  title: string;
  type: string;
  status?: string;
  class?: NamedReference | null;
  subject?: NamedReference | null;
  uploadedBy?: {
    id: string;
    fullName?: string;
    email?: string;
    role?: PlatformRole | string;
  } | null;
  fileUrl?: string | null;
  extractedText?: string | null;
  metadata?: GenericObject | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SourceLibraryUploadResponse {
  item: SourceLibraryItem;
  jobId: string;
  message: string;
}

export interface AiSettingRecord extends GenericObject {
  id: string;
  organizationId: string;
  aiEnabled: boolean;
  studentAskAiEnabled: boolean;
  teacherAiToolsEnabled: boolean;
  parentAiSummaryEnabled: boolean;
  maxDailyAiRequestsPerStudent: number;
  allowedContentTypes: string[];
  safetyLevel: string;
  sourceOnlyMode: boolean;
  ageAppropriateOutput: boolean;
  teacherReviewRequired: boolean;
  promptInjectionProtection: boolean;
  showCitations: boolean;
  aiDisclaimer: string;
}

export interface AiModuleRecord extends GenericObject {
  id: string;
  key: string;
  name: string;
  description?: string | null;
  isEnabled: boolean;
}

export interface AiUsageLogRecord extends GenericObject {
  id: string;
  type?: string;
  action?: string;
  createdAt?: string;
  metadata?: GenericObject | null;
  user?: {
    id: string;
    fullName?: string;
    email?: string;
    role?: PlatformRole | string;
  } | null;
  job?: {
    id: string;
    status?: string;
    type?: string;
    createdAt?: string;
    updatedAt?: string;
  } | null;
}

export interface OrganizationListItem extends GenericObject {
  id: string;
  name: string;
  slug: string;
  domain?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  activePlan?: {
    id: string;
    name: string;
    status: string;
  } | null;
}

export interface PlanRecord extends GenericObject {
  id: string;
  name: string;
  code?: string;
  description?: string | null;
  priceMonthly?: number | string | null;
  priceYearly?: number | string | null;
  studentLimit?: number | null;
  teacherLimit?: number | null;
  isActive?: boolean;
  storageLimitGb?: number | null;
}

export interface SubscriptionRecord extends GenericObject {
  id: string;
  status?: string;
  startDate?: string | null;
  endDate?: string | null;
  organization?: NamedReference | null;
  plan?: PlanRecord | null;
}

export interface InvoiceRecord extends GenericObject {
  id: string;
  invoiceNumber?: string;
  status?: string;
  totalAmount?: number | string | null;
  dueDate?: string | null;
  createdAt?: string;
  organization?: NamedReference | null;
  subscription?: {
    id: string;
    status?: string;
    plan?: PlanRecord | null;
  } | null;
  payments?: PaymentRecord[];
}

export interface PaymentRecord extends GenericObject {
  id: string;
  status?: string;
  amount?: number | string | null;
  gateway?: string | null;
  createdAt?: string;
  invoice?: InvoiceRecord | null;
}

export interface ParentFeeRecord extends GenericObject {
  studentId?: string;
  studentName?: string;
  className?: string;
  sectionName?: string;
  pendingInvoices?: number;
  totalPendingAmount?: number | string | null;
}

export interface AccountantReportsResponse {
  totals: Record<string, number>;
  byInvoiceStatus: Record<string, number>;
  byPaymentStatus: Record<string, number>;
}

export interface ReminderResponse {
  message: string;
  recipients: number;
}

export type StudentProgressSummary = GenericObject;
export type TeacherProgressSummary = GenericObject;
export type ClassProgressSummary = GenericObject;

export interface StudentSubjectProgress {
  subjectId: string;
  subjectName: string;
  homeworkAssigned: number;
  homeworkSubmitted: number;
  homeworkCompletion: number;
  quizAverage: number;
}

export interface ChildProgressRecord {
  studentId: string;
  fullName: string;
  summary: GenericObject;
}

export type AttendanceSessionListResponse = PaginatedResponse<AttendanceSessionRecord>;
export type SourceLibraryListResponse = PaginatedResponse<SourceLibraryItem>;
export type AiUsageListResponse = PaginatedResponse<AiUsageLogRecord>;
export type OrganizationsListResponse = PaginatedResponse<OrganizationListItem>;
export type PlansListResponse = PaginatedResponse<PlanRecord>;
export type SubscriptionsListResponse = PaginatedResponse<SubscriptionRecord>;
export type InvoicesListResponse = PaginatedResponse<InvoiceRecord>;
export type PaymentsListResponse = PaginatedResponse<PaymentRecord>;
