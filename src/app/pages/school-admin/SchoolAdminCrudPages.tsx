import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { BookOpen, CheckCircle2, GraduationCap, Layers3, Plus, School, Search, Trash2, UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';

import { academicsApi } from '../../api/academics.api';
import { normalizeApiError } from '../../api/client';
import { parentsApi } from '../../api/parents.api';
import { studentsApi } from '../../api/students.api';
import { teachersApi } from '../../api/teachers.api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Textarea } from '../../components/ui/textarea';
import type { ApiError } from '../../types/api.types';
import type {
  AcademicYearFormPayload,
  AcademicYearRecord,
  BootstrapDefaultSetupResponse,
  ClassFormPayload,
  ClassRecord,
  Gender,
  LinkStudentPayload,
  ParentFormPayload,
  ParentRecord,
  SchoolUserStatus,
  SectionFormPayload,
  SectionRecord,
  StudentFormPayload,
  StudentRecord,
  SubjectFormPayload,
  SubjectRecord,
  TeacherAssignmentPayload,
  TeacherFormPayload,
  TeacherRecord,
} from '../../types/school-admin.types';

type StatusVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'muted';

const PAGE_LIMIT = 10;
const LOOKUP_LIMIT = 100;
const USER_STATUS_OPTIONS: SchoolUserStatus[] = ['ACTIVE', 'INACTIVE', 'INVITED', 'SUSPENDED'];
const GENDER_OPTIONS: Gender[] = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'];
const ACADEMIC_YEAR_TYPE_OPTIONS = ['Current Year', 'Past Year', 'Future Year'] as const;
const ACADEMIC_YEAR_VALUE_OPTIONS = ['2024-2025', '2025-2026', '2026-2027', '2027-2028', '2028-2029'];
const CLASS_VALUE_OPTIONS = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const SECTION_VALUE_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

function compactObject<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (entry === undefined || entry === null) return false;
      if (typeof entry === 'string' && entry.trim() === '') return false;
      return true;
    }),
  ) as Partial<T>;
}

function toDateInputValue(value?: string | null) {
  if (!value) return '';
  return value.slice(0, 10);
}

function formatDate(value?: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString();
}

function inferAcademicYearType(name: string) {
  const firstYear = Number(name.split('-')[0]);
  const currentYear = new Date().getFullYear();
  if (Number.isNaN(firstYear)) return 'Current Year';
  if (firstYear < currentYear) return 'Past Year';
  if (firstYear > currentYear) return 'Future Year';
  return 'Current Year';
}

function statusBadgeVariant(status: string): StatusVariant {
  if (status === 'ACTIVE' || status === 'ACCEPTED' || status === 'Indexed') return 'success';
  if (status === 'INACTIVE' || status === 'SUSPENDED') return 'destructive';
  if (status === 'INVITED' || status === 'PENDING') return 'warning';
  return 'muted';
}

function CrudPageHeader({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="space-y-3">
        <Badge variant="primary" className="w-fit">
          School Admin Management
        </Badge>
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
            <p className="max-w-3xl text-sm text-muted-foreground md:text-base">{description}</p>
          </div>
        </div>
      </div>
      {actionLabel && onAction ? (
        <div className="flex flex-wrap gap-3">
          <Button onClick={onAction}>
            <Plus className="h-4 w-4" />
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
  aside,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <Card className="overflow-hidden rounded-3xl border-white/60 bg-white/90 shadow-sm shadow-slate-200/60 backdrop-blur">
      <CardHeader className="border-b border-slate-100/80 bg-slate-50/70">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description ? <CardDescription className="mt-1">{description}</CardDescription> : null}
          </div>
          {aside}
        </div>
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
}

function SearchToolbar({
  search,
  onSearchChange,
  onSearchSubmit,
  onReset,
  filters,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onReset: () => void;
  filters?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="flex w-full flex-col gap-3 md:flex-row">
        <div className="relative w-full md:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onSearchSubmit();
              }
            }}
            className="h-11 w-full rounded-2xl border border-input bg-background pl-9 pr-3 text-sm outline-none"
            placeholder="Search records"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={onSearchSubmit}>
            Search
          </Button>
          <Button variant="ghost" onClick={onReset}>
            Reset
          </Button>
        </div>
      </div>
      {filters ? <div className="flex flex-wrap gap-3">{filters}</div> : null}
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder = 'All',
  disabled = false,
}: {
  label?: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      {label ? <label className="text-sm font-medium">{label}</label> : null}
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 min-w-[160px] rounded-2xl border border-input bg-background px-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={`${label}-${index}`} className="rounded-3xl border-white/70 bg-white shadow-sm">
          <CardContent className="space-y-3 p-6">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: ApiError; onRetry: () => void }) {
  return (
    <div className="space-y-4 rounded-3xl border border-destructive/20 bg-destructive/5 p-5">
      <p className="text-sm text-destructive">{error.message}</p>
      <Button onClick={onRetry}>Retry</Button>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="rounded-3xl border-dashed border-slate-300 bg-slate-50/70">
      <CardContent className="flex flex-col items-center gap-3 px-6 py-10 text-center">
        <School className="h-10 w-10 text-primary" />
        <div>
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function PaginationControls({
  page,
  totalPages,
  total,
  label,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  label: string;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-muted-foreground">
        {label}: {total}
      </p>
      <div className="flex items-center gap-3">
        <Button variant="outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {Math.max(totalPages, 1)}
        </span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-sm text-destructive">{message}</p> : null;
}

function UserStatusBadge({ status }: { status: string }) {
  return <Badge variant={statusBadgeVariant(status)}>{status}</Badge>;
}

function getNextSuspendStatus(status: SchoolUserStatus): SchoolUserStatus {
  return status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
}

function getStatusActionLabel(status: SchoolUserStatus) {
  return status === 'ACTIVE' ? 'Suspend' : 'Activate';
}

function usePagedResource<T>(loader: () => Promise<{ items: T[]; meta: { page: number; limit: number; total: number; totalPages: number } }>, deps: readonly unknown[]) {
  const [data, setData] = useState<{ items: T[]; meta: { page: number; limit: number; total: number; totalPages: number } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = () => setReloadToken((current) => current + 1);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await loader();
        if (!cancelled) {
          setData(response);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(normalizeApiError(requestError));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [...deps, reloadToken]);

  return { data, loading, error, refetch };
}

function useAsyncResource<T>(loader: () => Promise<T>, deps: readonly unknown[]) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = () => setReloadToken((current) => current + 1);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await loader();
        if (!cancelled) {
          setData(response);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(normalizeApiError(requestError));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [...deps, reloadToken]);

  return { data, loading, error, refetch };
}

function useSchoolLookups() {
  const academicYears = useAsyncResource(() => academicsApi.listAcademicYears(), []);
  const classes = useAsyncResource(
    async () => (await academicsApi.listClasses({ page: 1, limit: LOOKUP_LIMIT })).items,
    [],
  );
  const subjects = useAsyncResource(
    async () => (await academicsApi.listSubjects({ page: 1, limit: LOOKUP_LIMIT })).items,
    [],
  );
  const students = useAsyncResource(
    async () => (await studentsApi.list({ page: 1, limit: LOOKUP_LIMIT })).items,
    [],
  );

  return { academicYears, classes, subjects, students };
}

function RecordActions({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

type DevLoginCredential = {
  email: string;
  fullName: string;
  loginUrl: string;
  password: string;
  role: 'Teacher' | 'Student' | 'Parent';
};

async function copyText(text: string, successMessage: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
  } catch {
    toast.error('Could not copy to clipboard.');
  }
}

function DevCredentialPanel({
  credential,
}: {
  credential: DevLoginCredential | null;
}) {
  if (!credential) return null;

  return (
    <Card className="rounded-3xl border-emerald-200 bg-emerald-50/80 shadow-sm">
      <CardHeader>
        <Badge variant="success" className="w-fit">
          Development Login Ready
        </Badge>
        <CardTitle>{credential.role} account created</CardTitle>
        <CardDescription>
          Development credential display only. In production this should be invite/email based.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-white/80 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Name</p>
            <p className="mt-2 font-medium text-foreground">{credential.fullName}</p>
          </div>
          <div className="rounded-2xl bg-white/80 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Role</p>
            <p className="mt-2 font-medium text-foreground">{credential.role}</p>
          </div>
          <div className="rounded-2xl bg-white/80 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Email</p>
            <p className="mt-2 font-medium text-foreground">{credential.email}</p>
          </div>
          <div className="rounded-2xl bg-white/80 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Password</p>
            <p className="mt-2 font-medium text-foreground">{credential.password}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-white/80 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Login URL</p>
          <p className="mt-2 font-medium text-foreground">{credential.loginUrl}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() =>
              void copyText(
                `Role: ${credential.role}\nEmail: ${credential.email}\nPassword: ${credential.password}\nLogin URL: ${credential.loginUrl}`,
                `${credential.role} credentials copied.`,
              )
            }
          >
            Copy Credentials
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BootstrapSummaryCard({
  summary,
}: {
  summary: BootstrapDefaultSetupResponse | null;
}) {
  if (!summary) return null;

  return (
    <Card className="rounded-3xl border-primary/15 bg-primary/5 shadow-sm">
      <CardHeader>
        <Badge variant="primary" className="w-fit">
          Default Setup Ready
        </Badge>
        <CardTitle>{summary.message}</CardTitle>
        <CardDescription>
          Active academic year: {summary.activeAcademicYear.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm md:grid-cols-3">
        <div className="rounded-2xl bg-white/80 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Academic Years Created
          </p>
          <p className="mt-2 font-medium text-foreground">{summary.academicYearsCreated}</p>
        </div>
        <div className="rounded-2xl bg-white/80 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Classes Created
          </p>
          <p className="mt-2 font-medium text-foreground">{summary.classesCreated}</p>
        </div>
        <div className="rounded-2xl bg-white/80 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Sections Created
          </p>
          <p className="mt-2 font-medium text-foreground">{summary.sectionsCreated}</p>
        </div>
      </CardContent>
    </Card>
  );
}

type TeacherFormState = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  employeeCode: string;
  qualification: string;
  experienceYears: string;
  joiningDate: string;
  status: string;
  gender: string;
  address: string;
};

const emptyTeacherForm: TeacherFormState = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  employeeCode: '',
  qualification: '',
  experienceYears: '',
  joiningDate: '',
  status: 'ACTIVE',
  gender: '',
  address: '',
};

type TeacherAssignmentState = {
  subjectId: string;
  classId: string;
  sectionId: string;
  academicYearId: string;
};

const emptyTeacherAssignment: TeacherAssignmentState = {
  subjectId: '',
  classId: '',
  sectionId: '',
  academicYearId: '',
};

function teacherFormFromRecord(teacher: TeacherRecord): TeacherFormState {
  return {
    fullName: teacher.user.fullName,
    email: teacher.user.email,
    phone: teacher.user.phone ?? '',
    password: '',
    employeeCode: teacher.employeeCode,
    qualification: teacher.qualification ?? '',
    experienceYears: teacher.experienceYears !== null && teacher.experienceYears !== undefined ? String(teacher.experienceYears) : '',
    joiningDate: toDateInputValue(teacher.joiningDate),
    status: teacher.user.status,
    gender: teacher.user.profile?.gender ?? '',
    address: teacher.user.profile?.address ?? '',
  };
}

function validateTeacherForm(form: TeacherFormState, mode: 'create' | 'edit') {
  const errors: Partial<Record<keyof TeacherFormState, string>> = {};
  if (!form.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!form.email.trim()) errors.email = 'Email is required.';
  if (mode === 'create' && form.password.trim().length < 8) errors.password = 'Password must be at least 8 characters.';
  if (mode === 'edit' && form.password.trim() && form.password.trim().length < 8) errors.password = 'Password must be at least 8 characters.';
  if (!form.employeeCode.trim()) errors.employeeCode = 'Employee code is required.';
  return errors;
}

function validateTeacherAssignment(form: TeacherAssignmentState, requireAll = true) {
  const errors: Partial<Record<keyof TeacherAssignmentState, string>> = {};
  const hasAnyValue = Object.values(form).some((value) => value.trim().length > 0);
  const hasAllValues = Object.values(form).every((value) => value.trim().length > 0);

  if (!requireAll && !hasAnyValue) {
    return errors;
  }

  if (hasAllValues) {
    return errors;
  }

  if (!form.subjectId) errors.subjectId = 'Subject is required.';
  if (!form.classId) errors.classId = 'Class is required.';
  if (!form.sectionId) errors.sectionId = 'Section is required.';
  if (!form.academicYearId) errors.academicYearId = 'Academic year is required.';
  return errors;
}

export function SchoolAdminTeachersPage() {
  const navigate = useNavigate();
  const lookups = useSchoolLookups();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [page, setPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<TeacherFormState>(emptyTeacherForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof TeacherFormState, string>>>({});
  const [editingTeacher, setEditingTeacher] = useState<TeacherRecord | null>(null);
  const [deleteTeacher, setDeleteTeacher] = useState<TeacherRecord | null>(null);
  const [assignmentTeacher, setAssignmentTeacher] = useState<TeacherRecord | null>(null);
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState<TeacherAssignmentState>(emptyTeacherAssignment);
  const [assignmentErrors, setAssignmentErrors] = useState<Partial<Record<keyof TeacherAssignmentState, string>>>({});
  const [latestCredential, setLatestCredential] = useState<DevLoginCredential | null>(null);
  const [mutating, setMutating] = useState(false);

  const teachers = usePagedResource(
    () =>
      teachersApi.list({
        page,
        limit: PAGE_LIMIT,
        search: search || undefined,
        status: (statusFilter || undefined) as SchoolUserStatus | undefined,
        subjectId: subjectFilter || undefined,
      }),
    [page, search, statusFilter, subjectFilter],
  );

  const classOptions = lookups.classes.data ?? [];
  const assignmentClassOptions = useMemo(
    () =>
      classOptions.filter((item) =>
        assignmentForm.academicYearId ? item.academicYearId === assignmentForm.academicYearId : true,
      ),
    [classOptions, assignmentForm.academicYearId],
  );
  const selectedClassSections = useMemo(
    () => assignmentClassOptions.find((item) => item.id === assignmentForm.classId)?.sections ?? [],
    [assignmentClassOptions, assignmentForm.classId],
  );
  const hasSubjects = (lookups.subjects.data?.length ?? 0) > 0;
  const hasAcademicYears = (lookups.academicYears.data?.length ?? 0) > 0;
  const hasClasses = classOptions.length > 0;
  const hasAnySections = classOptions.some((item) => (item.sections?.length ?? 0) > 0);
  const teacherAssignmentSetupReady = hasSubjects && hasAcademicYears && hasClasses && hasAnySections;
  const assignmentFieldsDisabled = !teacherAssignmentSetupReady;

  useEffect(() => {
    if (!dialogOpen && !assignmentOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [dialogOpen, assignmentOpen]);

  const openCreate = () => {
    setDialogMode('create');
    setEditingTeacher(null);
    setLatestCredential(null);
    setForm(emptyTeacherForm);
    setFormErrors({});
    setAssignmentForm(emptyTeacherAssignment);
    setAssignmentErrors({});
    setDialogOpen(true);
  };

  const openEdit = (teacher: TeacherRecord) => {
    setDialogMode('edit');
    setEditingTeacher(teacher);
    setLatestCredential(null);
    setForm(teacherFormFromRecord(teacher));
    setFormErrors({});
    setAssignmentForm(emptyTeacherAssignment);
    setAssignmentErrors({});
    setDialogOpen(true);
  };

  const openAssign = (teacher: TeacherRecord) => {
    setAssignmentTeacher(teacher);
    setAssignmentForm(emptyTeacherAssignment);
    setAssignmentErrors({});
    setAssignmentOpen(true);
  };

  const submitForm = async () => {
    const validation = validateTeacherForm(form, dialogMode);
    setFormErrors(validation);

    if (Object.keys(validation).length > 0) {
      return;
    }

    setMutating(true);

    try {
      const payload = compactObject({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password.trim(),
        employeeCode: form.employeeCode.trim(),
        qualification: form.qualification.trim(),
        experienceYears: form.experienceYears ? Number(form.experienceYears) : undefined,
        joiningDate: form.joiningDate || undefined,
        status: form.status as SchoolUserStatus,
        gender: (form.gender || undefined) as Gender | undefined,
        address: form.address.trim(),
      }) as TeacherFormPayload;

      if (dialogMode === 'create') {
        const assignmentValidation = validateTeacherAssignment(assignmentForm, false);
        const hasAssignment = Object.values(assignmentForm).every((value) => value.trim().length > 0);
        if (Object.keys(assignmentValidation).length > 0) {
          setAssignmentErrors(assignmentValidation);
          return;
        }

        const createdTeacher = await teachersApi.create(payload);
        if (hasAssignment) {
          await teachersApi.assignSubjectClass(createdTeacher.userId, {
            subjectId: assignmentForm.subjectId,
            classId: assignmentForm.classId,
            sectionId: assignmentForm.sectionId,
            academicYearId: assignmentForm.academicYearId,
          });
        }

        setLatestCredential({
          role: 'Teacher',
          fullName: payload.fullName,
          email: payload.email,
          password: payload.password ?? '',
          loginUrl: `${window.location.origin}/login`,
        });
        toast.success('Teacher created successfully.');
        setForm(emptyTeacherForm);
        setFormErrors({});
        setAssignmentForm(emptyTeacherAssignment);
        setAssignmentErrors({});
      } else if (editingTeacher) {
        await teachersApi.update(editingTeacher.userId, payload);
        toast.success('Teacher updated successfully.');
        setLatestCredential(null);
        setForm(emptyTeacherForm);
        setFormErrors({});
        setAssignmentForm(emptyTeacherAssignment);
        setAssignmentErrors({});
      }

      setDialogOpen(false);
      teachers.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const submitAssignment = async () => {
    const validation = validateTeacherAssignment(assignmentForm);
    setAssignmentErrors(validation);

    if (Object.keys(validation).length > 0 || !assignmentTeacher) {
      return;
    }

    setMutating(true);

    try {
      const payload: TeacherAssignmentPayload = {
        subjectId: assignmentForm.subjectId,
        classId: assignmentForm.classId,
        sectionId: assignmentForm.sectionId,
        academicYearId: assignmentForm.academicYearId,
      };
      await teachersApi.assignSubjectClass(assignmentTeacher.userId, payload);
      toast.success('Teacher assigned successfully.');
      setAssignmentOpen(false);
      teachers.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const toggleStatus = async (teacher: TeacherRecord) => {
    setMutating(true);
    try {
      const nextStatus = getNextSuspendStatus(teacher.user.status);
      await teachersApi.update(teacher.userId, { status: nextStatus });
      toast.success(`Teacher ${nextStatus === 'ACTIVE' ? 'activated' : 'suspended'} successfully.`);
      teachers.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTeacher) return;
    setMutating(true);
    try {
      await teachersApi.remove(deleteTeacher.userId);
      toast.success('Teacher deleted successfully.');
      setDeleteTeacher(null);
      teachers.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  return (
    <div className="space-y-6">
      <DevCredentialPanel credential={latestCredential} />

      <CrudPageHeader
        icon={<Users className="h-7 w-7" />}
        title="Teachers"
        description="Replace the mock teacher roster with live backend CRUD, subject assignment, search, filters, and status actions."
        actionLabel="Create Teacher"
        onAction={openCreate}
      />

      {!teacherAssignmentSetupReady ? (
        <SectionCard
          title="Teacher Assignment Setup Required"
          description="Teacher creation can continue, but assignment depends on the academic foundation and subject master data."
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Complete this setup order before assigning a teacher to a live class-section combination.</p>
            <div className="grid gap-3 md:grid-cols-4">
              <div className={cn('rounded-2xl border px-4 py-3', hasSubjects ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-800')}>
                1. Create Subject
              </div>
              <div className={cn('rounded-2xl border px-4 py-3', hasAcademicYears ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-800')}>
                2. Create Academic Year
              </div>
              <div className={cn('rounded-2xl border px-4 py-3', hasClasses ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-800')}>
                3. Create Class
              </div>
              <div className={cn('rounded-2xl border px-4 py-3', hasAnySections ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-800')}>
                4. Create Section
              </div>
            </div>
          </div>
        </SectionCard>
      ) : null}

      <SectionCard title="Teacher Management" description="Live organization teachers from the backend with create, edit, delete, and assignment actions.">
        <div className="space-y-6">
          <SearchToolbar
            search={searchInput}
            onSearchChange={setSearchInput}
            onSearchSubmit={() => {
              setPage(1);
              setSearch(searchInput.trim());
            }}
            onReset={() => {
              setSearchInput('');
              setSearch('');
              setStatusFilter('');
              setSubjectFilter('');
              setPage(1);
            }}
            filters={
              <>
                <SelectField
                  value={statusFilter}
                  onChange={(value) => {
                    setStatusFilter(value);
                    setPage(1);
                  }}
                  placeholder="All statuses"
                  options={USER_STATUS_OPTIONS.map((item) => ({ label: item, value: item }))}
                />
                <SelectField
                  value={subjectFilter}
                  onChange={(value) => {
                    setSubjectFilter(value);
                    setPage(1);
                  }}
                  placeholder="All subjects"
                  options={(lookups.subjects.data ?? []).map((item) => ({ label: item.name, value: item.id }))}
                />
              </>
            }
          />

          {teachers.loading ? <LoadingState label="teachers" /> : null}
          {teachers.error ? <ErrorState error={teachers.error} onRetry={teachers.refetch} /> : null}
          {!teachers.loading && !teachers.error && (teachers.data?.items.length ?? 0) === 0 ? (
            <EmptyState title="No teachers found" description="Try a different search or create the first teacher for this school." />
          ) : null}

          {!teachers.loading && !teachers.error && teachers.data ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Employee Code</TableHead>
                      <TableHead>Qualification</TableHead>
                      <TableHead>Joining Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assignments</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.data.items.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{teacher.user.fullName}</p>
                            <p className="text-sm text-muted-foreground">{teacher.user.email}</p>
                            <p className="text-xs text-muted-foreground">{teacher.user.phone ?? 'No phone'}</p>
                          </div>
                        </TableCell>
                        <TableCell>{teacher.employeeCode}</TableCell>
                        <TableCell>{teacher.qualification ?? '-'}</TableCell>
                        <TableCell>{formatDate(teacher.joiningDate)}</TableCell>
                        <TableCell>
                          <UserStatusBadge status={teacher.user.status} />
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            {(teacher.teacherAssignments ?? []).slice(0, 2).map((assignment) => (
                              <div key={assignment.id} className="rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-700">
                                {assignment.subject.name} • {assignment.class.name} {assignment.section.name}
                              </div>
                            ))}
                            {(teacher.teacherAssignments?.length ?? 0) === 0 ? (
                              <span className="text-xs text-muted-foreground">No assignments yet</span>
                            ) : null}
                            {(teacher.teacherAssignments?.length ?? 0) > 2 ? (
                              <span className="text-xs text-muted-foreground">
                                +{(teacher.teacherAssignments?.length ?? 0) - 2} more
                              </span>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <RecordActions>
                            <Button variant="outline" size="sm" onClick={() => openEdit(teacher)}>
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => openAssign(teacher)}>
                              Assign
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => void toggleStatus(teacher)} disabled={mutating}>
                              {getStatusActionLabel(teacher.user.status)}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteTeacher(teacher)}>
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </RecordActions>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <PaginationControls
                page={teachers.data.meta.page}
                totalPages={teachers.data.meta.totalPages}
                total={teachers.data.meta.total}
                label="Teachers"
                onPageChange={setPage}
              />
            </>
          ) : null}
        </div>
      </SectionCard>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="!flex w-[95vw] !max-w-[960px] max-h-[calc(100vh-2rem)] flex-col overflow-hidden !gap-0 !rounded-3xl !p-0 shadow-2xl sm:max-h-[calc(100vh-3rem)]">
          <DialogHeader className="shrink-0 border-b border-slate-200 bg-background px-5 py-4 pr-12 sm:px-8 sm:py-6">
            <DialogTitle>{dialogMode === 'create' ? 'Create Teacher' : 'Edit Teacher'}</DialogTitle>
            <DialogDescription>
              Create teacher profile and optionally assign subject/class/section.
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-8 sm:py-6">
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <div className="mb-4 space-y-1">
                  <h3 className="text-base font-semibold text-foreground">Basic Login Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Password is required when creating a teacher and remains optional during edits.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Input label="Full Name" value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} error={formErrors.fullName} />
                  <Input label="Email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} error={formErrors.email} />
                  <Input label="Phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
                  <Input label={dialogMode === 'create' ? 'Password' : 'Password (optional)'} type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} error={formErrors.password} />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <div className="mb-4 space-y-1">
                  <h3 className="text-base font-semibold text-foreground">Professional Details</h3>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Input label="Employee Code" value={form.employeeCode} onChange={(event) => setForm((current) => ({ ...current, employeeCode: event.target.value }))} error={formErrors.employeeCode} />
                  <Input label="Qualification" value={form.qualification} onChange={(event) => setForm((current) => ({ ...current, qualification: event.target.value }))} />
                  <Input label="Experience Years" type="number" min="0" value={form.experienceYears} onChange={(event) => setForm((current) => ({ ...current, experienceYears: event.target.value }))} />
                  <Input label="Joining Date" type="date" value={form.joiningDate} onChange={(event) => setForm((current) => ({ ...current, joiningDate: event.target.value }))} />
                  <SelectField label="Status" value={form.status} onChange={(value) => setForm((current) => ({ ...current, status: value }))} options={USER_STATUS_OPTIONS.map((item) => ({ label: item, value: item }))} placeholder="Select status" />
                  <SelectField label="Gender" value={form.gender} onChange={(value) => setForm((current) => ({ ...current, gender: value }))} options={GENDER_OPTIONS.map((item) => ({ label: item.replaceAll('_', ' '), value: item }))} placeholder="Select gender" />
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Address</label>
                    <Textarea value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} />
                  </div>
                </div>
              </div>

              {dialogMode === 'create' ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                  <div className="mb-4 space-y-1">
                    <h3 className="text-base font-semibold text-foreground">Optional Initial Assignment</h3>
                    <p className="text-sm text-muted-foreground">
                      Leave all fields blank, or complete all fields to assign the teacher immediately.
                    </p>
                  </div>
                  {!hasSubjects ? (
                    <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      <p>No subjects found. Please create a subject before assigning this teacher.</p>
                      <div className="mt-3">
                        <Button type="button" variant="outline" size="sm" onClick={() => navigate('/school-admin/subjects')}>
                          Go to Subjects
                        </Button>
                      </div>
                    </div>
                  ) : null}
                  {!hasAcademicYears ? (
                    <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      Create an academic year first.
                    </div>
                  ) : null}
                  {(!hasClasses || !hasAnySections) ? (
                    <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      Create class and section first.
                    </div>
                  ) : null}
                  {assignmentForm.classId && selectedClassSections.length === 0 ? (
                    <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      No sections available for this class.
                    </div>
                  ) : null}
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <SelectField
                        label="Subject"
                        value={assignmentForm.subjectId}
                        onChange={(value) => setAssignmentForm((current) => ({ ...current, subjectId: value }))}
                        options={(lookups.subjects.data ?? []).map((item) => ({ label: item.name, value: item.id }))}
                        placeholder="Select subject"
                        disabled={assignmentFieldsDisabled}
                      />
                      <FieldError message={assignmentErrors.subjectId} />
                    </div>
                    <div>
                      <SelectField
                        label="Academic Year"
                        value={assignmentForm.academicYearId}
                        onChange={(value) =>
                          setAssignmentForm((current) => ({
                            ...current,
                            academicYearId: value,
                            classId: '',
                            sectionId: '',
                          }))
                        }
                        options={(lookups.academicYears.data ?? []).map((item) => ({ label: item.name, value: item.id }))}
                        placeholder="Select academic year"
                        disabled={assignmentFieldsDisabled}
                      />
                      <FieldError message={assignmentErrors.academicYearId} />
                    </div>
                    <div>
                      <SelectField
                        label="Class"
                        value={assignmentForm.classId}
                        onChange={(value) => setAssignmentForm((current) => ({ ...current, classId: value, sectionId: '' }))}
                        options={assignmentClassOptions.map((item) => ({ label: item.name, value: item.id }))}
                        placeholder="Select class"
                        disabled={assignmentFieldsDisabled || !assignmentForm.academicYearId}
                      />
                      <FieldError message={assignmentErrors.classId} />
                    </div>
                    <div>
                      <SelectField
                        label="Section"
                        value={assignmentForm.sectionId}
                        onChange={(value) => setAssignmentForm((current) => ({ ...current, sectionId: value }))}
                        options={selectedClassSections.map((item) => ({ label: item.name, value: item.id }))}
                        placeholder="Select section"
                        disabled={assignmentFieldsDisabled || !assignmentForm.classId || selectedClassSections.length === 0}
                      />
                      <FieldError message={assignmentErrors.sectionId} />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <DialogFooter className="shrink-0 border-t border-slate-200 bg-background px-5 py-4 sm:flex-row sm:justify-end sm:px-8 sm:py-5">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void submitForm()} disabled={mutating}>
              {mutating ? 'Saving...' : dialogMode === 'create' ? 'Create Teacher' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={assignmentOpen} onOpenChange={setAssignmentOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Subject and Class</DialogTitle>
            <DialogDescription>
              {assignmentTeacher ? `Create a live teacher assignment for ${assignmentTeacher.user.fullName}.` : 'Create a live teacher assignment.'}
            </DialogDescription>
          </DialogHeader>
          {!hasSubjects ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              No subjects available. Create subject first.
            </div>
          ) : null}
          {!hasAcademicYears ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Create an academic year first.
            </div>
          ) : null}
          {(!hasClasses || !hasAnySections) ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Create class and section first.
            </div>
          ) : null}
          {assignmentForm.classId && selectedClassSections.length === 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              No sections available for this class.
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <SelectField label="Subject" value={assignmentForm.subjectId} onChange={(value) => setAssignmentForm((current) => ({ ...current, subjectId: value }))} options={(lookups.subjects.data ?? []).map((item) => ({ label: item.name, value: item.id }))} placeholder="Select subject" disabled={!teacherAssignmentSetupReady} />
              <FieldError message={assignmentErrors.subjectId} />
            </div>
            <div>
              <SelectField label="Academic Year" value={assignmentForm.academicYearId} onChange={(value) => setAssignmentForm((current) => ({ ...current, academicYearId: value, classId: '', sectionId: '' }))} options={(lookups.academicYears.data ?? []).map((item) => ({ label: item.name, value: item.id }))} placeholder="Select academic year" disabled={!teacherAssignmentSetupReady} />
              <FieldError message={assignmentErrors.academicYearId} />
            </div>
            <div>
              <SelectField label="Class" value={assignmentForm.classId} onChange={(value) => setAssignmentForm((current) => ({ ...current, classId: value, sectionId: '' }))} options={assignmentClassOptions.map((item) => ({ label: item.name, value: item.id }))} placeholder="Select class" disabled={!teacherAssignmentSetupReady || !assignmentForm.academicYearId} />
              <FieldError message={assignmentErrors.classId} />
            </div>
            <div>
              <SelectField label="Section" value={assignmentForm.sectionId} onChange={(value) => setAssignmentForm((current) => ({ ...current, sectionId: value }))} options={selectedClassSections.map((item) => ({ label: item.name, value: item.id }))} placeholder="Select section" disabled={!teacherAssignmentSetupReady || !assignmentForm.classId || selectedClassSections.length === 0} />
              <FieldError message={assignmentErrors.sectionId} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignmentOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void submitAssignment()} disabled={mutating || !teacherAssignmentSetupReady}>
              {mutating ? 'Saving...' : 'Assign Teacher'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteTeacher)} onOpenChange={(open) => !open && setDeleteTeacher(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete teacher?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTeacher ? `This will soft delete ${deleteTeacher.user.fullName} and mark the teacher inactive.` : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmDelete()} disabled={mutating}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

type StudentFormState = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  studentCode: string;
  rollNumber: string;
  admissionNumber: string;
  classId: string;
  sectionId: string;
  academicYearId: string;
  admissionDate: string;
  status: string;
  gender: string;
  address: string;
};

const emptyStudentForm: StudentFormState = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  studentCode: '',
  rollNumber: '',
  admissionNumber: '',
  classId: '',
  sectionId: '',
  academicYearId: '',
  admissionDate: '',
  status: 'ACTIVE',
  gender: '',
  address: '',
};

function studentFormFromRecord(student: StudentRecord): StudentFormState {
  return {
    fullName: student.user.fullName,
    email: student.user.email,
    phone: student.user.phone ?? '',
    password: '',
    studentCode: student.studentCode,
    rollNumber: student.rollNumber ?? '',
    admissionNumber: student.admissionNumber,
    classId: student.classId,
    sectionId: student.sectionId,
    academicYearId: student.academicYearId,
    admissionDate: toDateInputValue(student.admissionDate),
    status: student.user.status,
    gender: student.user.profile?.gender ?? '',
    address: student.user.profile?.address ?? '',
  };
}

function validateStudentForm(form: StudentFormState, mode: 'create' | 'edit') {
  const errors: Partial<Record<keyof StudentFormState, string>> = {};
  if (!form.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!form.email.trim()) errors.email = 'Email is required.';
  if (mode === 'create' && form.password.trim().length < 8) errors.password = 'Password must be at least 8 characters.';
  if (mode === 'edit' && form.password.trim() && form.password.trim().length < 8) errors.password = 'Password must be at least 8 characters.';
  if (!form.studentCode.trim()) errors.studentCode = 'Student code is required.';
  if (!form.admissionNumber.trim()) errors.admissionNumber = 'Admission number is required.';
  if (!form.classId) errors.classId = 'Class is required.';
  if (!form.sectionId) errors.sectionId = 'Section is required.';
  if (!form.academicYearId) errors.academicYearId = 'Academic year is required.';
  return errors;
}

export function SchoolAdminStudentsPage() {
  const lookups = useSchoolLookups();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [page, setPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<StudentFormState>(emptyStudentForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof StudentFormState, string>>>({});
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<StudentRecord | null>(null);
  const [latestCredential, setLatestCredential] = useState<DevLoginCredential | null>(null);
  const [bootstrapSummary, setBootstrapSummary] = useState<BootstrapDefaultSetupResponse | null>(null);
  const [mutating, setMutating] = useState(false);

  const students = usePagedResource(
    () =>
      studentsApi.list({
        page,
        limit: PAGE_LIMIT,
        search: search || undefined,
        status: (statusFilter || undefined) as SchoolUserStatus | undefined,
        classId: classFilter || undefined,
        sectionId: sectionFilter || undefined,
      }),
    [page, search, statusFilter, classFilter, sectionFilter],
  );

  const classOptions = lookups.classes.data ?? [];
  const selectedFilterSections = useMemo(() => classOptions.find((item) => item.id === classFilter)?.sections ?? [], [classOptions, classFilter]);
  const selectedFormSections = useMemo(() => classOptions.find((item) => item.id === form.classId)?.sections ?? [], [classOptions, form.classId]);
  const hasAcademicYears = (lookups.academicYears.data?.length ?? 0) > 0;
  const hasClasses = classOptions.length > 0;
  const hasAnySections = classOptions.some((item) => (item.sections?.length ?? 0) > 0);
  const studentSetupReady = hasAcademicYears && hasClasses && hasAnySections;

  const openCreate = () => {
    setDialogMode('create');
    setEditingStudent(null);
    setLatestCredential(null);
    setForm(emptyStudentForm);
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEdit = (student: StudentRecord) => {
    setDialogMode('edit');
    setEditingStudent(student);
    setLatestCredential(null);
    setForm(studentFormFromRecord(student));
    setFormErrors({});
    setDialogOpen(true);
  };

  const submitForm = async () => {
    const validation = validateStudentForm(form, dialogMode);
    setFormErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setMutating(true);
    try {
      const payload = compactObject({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password.trim(),
        studentCode: form.studentCode.trim(),
        rollNumber: form.rollNumber.trim(),
        admissionNumber: form.admissionNumber.trim(),
        classId: form.classId,
        sectionId: form.sectionId,
        academicYearId: form.academicYearId,
        admissionDate: form.admissionDate || undefined,
        status: form.status as SchoolUserStatus,
        gender: (form.gender || undefined) as Gender | undefined,
        address: form.address.trim(),
      }) as StudentFormPayload;

      if (dialogMode === 'create') {
        await studentsApi.create(payload);
        setLatestCredential({
          role: 'Student',
          fullName: payload.fullName,
          email: payload.email,
          password: payload.password ?? '',
          loginUrl: `${window.location.origin}/login`,
        });
        toast.success('Student created successfully.');
        setForm(emptyStudentForm);
        setFormErrors({});
      } else if (editingStudent) {
        await studentsApi.update(editingStudent.userId, payload);
        toast.success('Student updated successfully.');
        setLatestCredential(null);
        setForm(emptyStudentForm);
        setFormErrors({});
      }

      setDialogOpen(false);
      students.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const toggleStatus = async (student: StudentRecord) => {
    setMutating(true);
    try {
      const nextStatus = getNextSuspendStatus(student.user.status);
      await studentsApi.update(student.userId, { status: nextStatus });
      toast.success(`Student ${nextStatus === 'ACTIVE' ? 'activated' : 'suspended'} successfully.`);
      students.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteStudent) return;
    setMutating(true);
    try {
      await studentsApi.remove(deleteStudent.userId);
      toast.success('Student deleted successfully.');
      setDeleteStudent(null);
      students.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const runDefaultSetup = async () => {
    setMutating(true);
    try {
      const summary = await academicsApi.bootstrapDefaultSetup();
      setBootstrapSummary(summary);
      toast.success(summary.message);
      lookups.academicYears.refetch();
      lookups.classes.refetch();
      students.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  return (
    <div className="space-y-6">
      <DevCredentialPanel credential={latestCredential} />
      <BootstrapSummaryCard summary={bootstrapSummary} />

      <CrudPageHeader
        icon={<GraduationCap className="h-7 w-7" />}
        title="Students"
        description="Live student records with class and section filters, real backend pagination, and create, edit, delete, and status actions."
        actionLabel="Create Student"
        onAction={openCreate}
      />

      {!studentSetupReady ? (
        <SectionCard
          title="Student Setup Required"
          description="Student creation depends on the existing academic structure from the live backend."
        >
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Create academic years, classes and sections before adding students.</p>
            <div className="grid gap-3 md:grid-cols-3">
              <div className={cn('rounded-2xl border px-4 py-3', hasAcademicYears ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-800')}>
                1. Create Academic Year
              </div>
              <div className={cn('rounded-2xl border px-4 py-3', hasClasses ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-800')}>
                2. Create Class
              </div>
              <div className={cn('rounded-2xl border px-4 py-3', hasAnySections ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-800')}>
                3. Create Section
              </div>
            </div>
            <p>Then return here to create the student with `academicYearId`, `classId`, and `sectionId`.</p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => void runDefaultSetup()} disabled={mutating}>
                {mutating ? 'Creating Setup...' : 'Create Default Academic Setup'}
              </Button>
            </div>
          </div>
        </SectionCard>
      ) : null}

      <SectionCard title="Student Management" description="Replace mock student rows with real student profiles from the backend.">
        <div className="space-y-6">
          <SearchToolbar
            search={searchInput}
            onSearchChange={setSearchInput}
            onSearchSubmit={() => {
              setPage(1);
              setSearch(searchInput.trim());
            }}
            onReset={() => {
              setSearchInput('');
              setSearch('');
              setStatusFilter('');
              setClassFilter('');
              setSectionFilter('');
              setPage(1);
            }}
            filters={
              <>
                <SelectField value={statusFilter} onChange={(value) => { setStatusFilter(value); setPage(1); }} placeholder="All statuses" options={USER_STATUS_OPTIONS.map((item) => ({ label: item, value: item }))} />
                <SelectField value={classFilter} onChange={(value) => { setClassFilter(value); setSectionFilter(''); setPage(1); }} placeholder="All classes" options={classOptions.map((item) => ({ label: `${item.grade} • ${item.name}`, value: item.id }))} />
                <SelectField value={sectionFilter} onChange={(value) => { setSectionFilter(value); setPage(1); }} placeholder="All sections" options={selectedFilterSections.map((item) => ({ label: item.name, value: item.id }))} />
              </>
            }
          />

          {students.loading ? <LoadingState label="students" /> : null}
          {students.error ? <ErrorState error={students.error} onRetry={students.refetch} /> : null}
          {!students.loading && !students.error && (students.data?.items.length ?? 0) === 0 ? (
            <EmptyState title="No students found" description="Try a different search or create the first student record for this school." />
          ) : null}

          {!students.loading && !students.error && students.data ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Student Code</TableHead>
                      <TableHead>Admission No.</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Academic Year</TableHead>
                      <TableHead>Parents</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.data.items.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{student.user.fullName}</p>
                            <p className="text-sm text-muted-foreground">{student.user.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{student.studentCode}</TableCell>
                        <TableCell>{student.admissionNumber}</TableCell>
                        <TableCell>
                          {student.class?.name ?? '-'} {student.section?.name ? `• ${student.section.name}` : ''}
                        </TableCell>
                        <TableCell>{student.academicYear?.name ?? '-'}</TableCell>
                        <TableCell>{student._count?.parentLinks ?? 0}</TableCell>
                        <TableCell>
                          <UserStatusBadge status={student.user.status} />
                        </TableCell>
                        <TableCell>
                          <RecordActions>
                            <Button variant="outline" size="sm" onClick={() => openEdit(student)}>
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => void toggleStatus(student)} disabled={mutating}>
                              {getStatusActionLabel(student.user.status)}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteStudent(student)}>
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </RecordActions>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <PaginationControls
                page={students.data.meta.page}
                totalPages={students.data.meta.totalPages}
                total={students.data.meta.total}
                label="Students"
                onPageChange={setPage}
              />
            </>
          ) : null}
        </div>
      </SectionCard>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="!flex max-h-[90vh] w-[calc(100vw-2rem)] !max-w-5xl flex-col overflow-hidden !gap-0 !p-0 sm:rounded-2xl">
          <DialogHeader className="shrink-0 border-b bg-background px-6 py-4 pr-12">
            <DialogTitle>{dialogMode === 'create' ? 'Create Student' : 'Edit Student'}</DialogTitle>
            <DialogDescription>Use the backend student DTO exactly, including class, section, and academic year ids.</DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {!studentSetupReady && dialogMode === 'create' ? (
              <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Create an academic year, class, and section first. Student creation stays blocked until those required ids exist.
              </div>
            ) : null}
          <div className="space-y-6">
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
              <div>
                <h3 className="text-base font-semibold text-foreground">Login Details</h3>
                <p className="text-sm text-muted-foreground">
                  Password is required for login creation during development.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Full Name" value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} error={formErrors.fullName} />
                <Input label="Email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} error={formErrors.email} />
                <Input label="Phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
                <Input label={dialogMode === 'create' ? 'Password' : 'Password (optional)'} type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} error={formErrors.password} />
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
              <div>
                <h3 className="text-base font-semibold text-foreground">Academic Details</h3>
                <p className="text-sm text-muted-foreground">
                  Select the academic structure first, then enter the student admission identifiers.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <SelectField label="Academic Year" value={form.academicYearId} onChange={(value) => setForm((current) => ({ ...current, academicYearId: value }))} options={(lookups.academicYears.data ?? []).map((item) => ({ label: item.name, value: item.id }))} placeholder="Select academic year" />
                  <FieldError message={formErrors.academicYearId} />
                </div>
                <div>
                  <SelectField label="Class" value={form.classId} onChange={(value) => setForm((current) => ({ ...current, classId: value, sectionId: '' }))} options={classOptions.map((item) => ({ label: item.name, value: item.id }))} placeholder="Select class" />
                  <FieldError message={formErrors.classId} />
                </div>
                <div>
                  <SelectField label="Section" value={form.sectionId} onChange={(value) => setForm((current) => ({ ...current, sectionId: value }))} options={selectedFormSections.map((item) => ({ label: item.name, value: item.id }))} placeholder="Select section" />
                  <FieldError message={formErrors.sectionId} />
                </div>
                <Input label="Student Code" value={form.studentCode} onChange={(event) => setForm((current) => ({ ...current, studentCode: event.target.value }))} error={formErrors.studentCode} />
                <Input label="Admission Number" value={form.admissionNumber} onChange={(event) => setForm((current) => ({ ...current, admissionNumber: event.target.value }))} error={formErrors.admissionNumber} />
                <Input label="Roll Number" value={form.rollNumber} onChange={(event) => setForm((current) => ({ ...current, rollNumber: event.target.value }))} />
                <Input label="Admission Date" type="date" value={form.admissionDate} onChange={(event) => setForm((current) => ({ ...current, admissionDate: event.target.value }))} />
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-5">
              <div>
                <h3 className="text-base font-semibold text-foreground">Profile Details</h3>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <SelectField label="Gender" value={form.gender} onChange={(value) => setForm((current) => ({ ...current, gender: value }))} options={GENDER_OPTIONS.map((item) => ({ label: item.replaceAll('_', ' '), value: item }))} placeholder="Select gender" />
                <SelectField label="Status" value={form.status} onChange={(value) => setForm((current) => ({ ...current, status: value }))} options={USER_STATUS_OPTIONS.map((item) => ({ label: item, value: item }))} placeholder="Select status" />
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Address</label>
                  <Textarea value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} />
                </div>
              </div>
            </div>
          </div>
        </div>
          <DialogFooter className="shrink-0 border-t bg-background px-6 py-4">
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => void submitForm()} disabled={mutating || (dialogMode === 'create' && !studentSetupReady)}>
            {mutating ? 'Saving...' : dialogMode === 'create' ? 'Create Student' : 'Save Changes'}
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteStudent)} onOpenChange={(open) => !open && setDeleteStudent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete student?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteStudent ? `This will soft delete ${deleteStudent.user.fullName} and mark the student inactive.` : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmDelete()} disabled={mutating}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

type ParentFormState = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  status: string;
  gender: string;
  address: string;
};

const emptyParentForm: ParentFormState = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  status: 'ACTIVE',
  gender: '',
  address: '',
};

type LinkStudentState = {
  studentUserId: string;
  relation: string;
  isPrimary: boolean;
};

const emptyLinkStudent: LinkStudentState = {
  studentUserId: '',
  relation: '',
  isPrimary: false,
};

function parentFormFromRecord(parent: ParentRecord): ParentFormState {
  return {
    fullName: parent.fullName,
    email: parent.email,
    phone: parent.phone ?? '',
    password: '',
    status: parent.status,
    gender: parent.profile?.gender ?? '',
    address: parent.profile?.address ?? '',
  };
}

function validateParentForm(form: ParentFormState, mode: 'create' | 'edit') {
  const errors: Partial<Record<keyof ParentFormState, string>> = {};
  if (!form.fullName.trim()) errors.fullName = 'Full name is required.';
  if (!form.email.trim()) errors.email = 'Email is required.';
  if (mode === 'create' && form.password.trim().length < 8) errors.password = 'Password must be at least 8 characters.';
  if (mode === 'edit' && form.password.trim() && form.password.trim().length < 8) errors.password = 'Password must be at least 8 characters.';
  return errors;
}

function validateLinkStudent(form: LinkStudentState) {
  const errors: Partial<Record<keyof LinkStudentState, string>> = {};
  if (!form.studentUserId) errors.studentUserId = 'Student is required.';
  if (!form.relation.trim()) errors.relation = 'Relation is required.';
  return errors;
}

export function SchoolAdminParentsPage() {
  const lookups = useSchoolLookups();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<ParentFormState>(emptyParentForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ParentFormState, string>>>({});
  const [editingParent, setEditingParent] = useState<ParentRecord | null>(null);
  const [deleteParent, setDeleteParent] = useState<ParentRecord | null>(null);
  const [linkParent, setLinkParent] = useState<ParentRecord | null>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkForm, setLinkForm] = useState<LinkStudentState>(emptyLinkStudent);
  const [linkErrors, setLinkErrors] = useState<Partial<Record<keyof LinkStudentState, string>>>({});
  const [latestCredential, setLatestCredential] = useState<DevLoginCredential | null>(null);
  const [mutating, setMutating] = useState(false);
  const hasStudents = (lookups.students.data?.length ?? 0) > 0;

  const parents = usePagedResource(
    () =>
      parentsApi.list({
        page,
        limit: PAGE_LIMIT,
        search: search || undefined,
        status: (statusFilter || undefined) as SchoolUserStatus | undefined,
      }),
    [page, search, statusFilter],
  );

  const openCreate = () => {
    setDialogMode('create');
    setEditingParent(null);
    setLatestCredential(null);
    setForm(emptyParentForm);
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEdit = (parent: ParentRecord) => {
    setDialogMode('edit');
    setEditingParent(parent);
    setLatestCredential(null);
    setForm(parentFormFromRecord(parent));
    setFormErrors({});
    setDialogOpen(true);
  };

  const openLink = (parent: ParentRecord) => {
    setLinkParent(parent);
    setLinkForm(emptyLinkStudent);
    setLinkErrors({});
    setLinkOpen(true);
  };

  const submitForm = async () => {
    const validation = validateParentForm(form, dialogMode);
    setFormErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setMutating(true);
    try {
      const payload = compactObject({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password.trim(),
        status: form.status as SchoolUserStatus,
        gender: (form.gender || undefined) as Gender | undefined,
        address: form.address.trim(),
      }) as ParentFormPayload;

      if (dialogMode === 'create') {
        await parentsApi.create(payload);
        setLatestCredential({
          role: 'Parent',
          fullName: payload.fullName,
          email: payload.email,
          password: payload.password ?? '',
          loginUrl: `${window.location.origin}/login`,
        });
        toast.success('Parent created successfully.');
        setForm(emptyParentForm);
        setFormErrors({});
      } else if (editingParent) {
        await parentsApi.update(editingParent.id, payload);
        toast.success('Parent updated successfully.');
        setLatestCredential(null);
        setForm(emptyParentForm);
        setFormErrors({});
      }

      setDialogOpen(false);
      parents.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const submitLink = async () => {
    const validation = validateLinkStudent(linkForm);
    setLinkErrors(validation);
    if (Object.keys(validation).length > 0 || !linkParent) return;

    setMutating(true);
    try {
      const payload: LinkStudentPayload = {
        studentUserId: linkForm.studentUserId,
        relation: linkForm.relation.trim(),
        isPrimary: linkForm.isPrimary,
      };
      await parentsApi.linkStudent(linkParent.id, payload);
      toast.success('Parent linked to student successfully.');
      setLinkOpen(false);
      parents.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const toggleStatus = async (parent: ParentRecord) => {
    setMutating(true);
    try {
      const nextStatus = getNextSuspendStatus(parent.status);
      await parentsApi.update(parent.id, { status: nextStatus });
      toast.success(`Parent ${nextStatus === 'ACTIVE' ? 'activated' : 'suspended'} successfully.`);
      parents.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteParent) return;
    setMutating(true);
    try {
      await parentsApi.remove(deleteParent.id);
      toast.success('Parent deleted successfully.');
      setDeleteParent(null);
      parents.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  return (
    <div className="space-y-6">
      <DevCredentialPanel credential={latestCredential} />

      <CrudPageHeader
        icon={<UserPlus className="h-7 w-7" />}
        title="Parents"
        description="Live parent accounts with real backend CRUD, search, filters, child-link actions, and status management."
        actionLabel="Create Parent"
        onAction={openCreate}
      />

      {!hasStudents ? (
        <SectionCard
          title="Parent Linking Setup Required"
          description="Parent creation can continue, but linking depends on at least one student record."
        >
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Create a student first, then return here to link that student to a parent.
          </div>
        </SectionCard>
      ) : null}

      <SectionCard title="Parent Management" description="Replace mock parent records with real organization parent accounts and live child links.">
        <div className="space-y-6">
          <SearchToolbar
            search={searchInput}
            onSearchChange={setSearchInput}
            onSearchSubmit={() => {
              setPage(1);
              setSearch(searchInput.trim());
            }}
            onReset={() => {
              setSearchInput('');
              setSearch('');
              setStatusFilter('');
              setPage(1);
            }}
            filters={
              <SelectField value={statusFilter} onChange={(value) => { setStatusFilter(value); setPage(1); }} placeholder="All statuses" options={USER_STATUS_OPTIONS.map((item) => ({ label: item, value: item }))} />
            }
          />

          {parents.loading ? <LoadingState label="parents" /> : null}
          {parents.error ? <ErrorState error={parents.error} onRetry={parents.refetch} /> : null}
          {!parents.loading && !parents.error && (parents.data?.items.length ?? 0) === 0 ? (
            <EmptyState title="No parents found" description="Try a different search or create the first parent account for this school." />
          ) : null}

          {!parents.loading && !parents.error && parents.data ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parent</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Linked Students</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parents.data.items.map((parent) => (
                      <TableRow key={parent.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{parent.fullName}</p>
                            <p className="text-sm text-muted-foreground">{parent.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{parent.phone ?? '-'}</TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            {(parent.parentStudentLinks ?? []).slice(0, 2).map((link) => (
                              <div key={link.id} className="rounded-2xl bg-slate-50 px-3 py-2 text-xs text-slate-700">
                                {link.studentUser?.fullName ?? link.studentUserId} • {link.relation}
                              </div>
                            ))}
                            {(parent.parentStudentLinks?.length ?? 0) === 0 ? (
                              <span className="text-xs text-muted-foreground">No linked students yet</span>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <UserStatusBadge status={parent.status} />
                        </TableCell>
                        <TableCell>
                          <RecordActions>
                            <Button variant="outline" size="sm" onClick={() => openEdit(parent)}>
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => openLink(parent)}>
                              Link Student
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => void toggleStatus(parent)} disabled={mutating}>
                              {getStatusActionLabel(parent.status)}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteParent(parent)}>
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </RecordActions>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <PaginationControls
                page={parents.data.meta.page}
                totalPages={parents.data.meta.totalPages}
                total={parents.data.meta.total}
                label="Parents"
                onPageChange={setPage}
              />
            </>
          ) : null}
        </div>
      </SectionCard>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'create' ? 'Create Parent' : 'Edit Parent'}</DialogTitle>
            <DialogDescription>Use the backend parent DTO fields exactly. Password is required only when creating or resetting.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Full Name" value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} error={formErrors.fullName} />
            <Input label="Email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} error={formErrors.email} />
            <Input label="Phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
            <Input label={dialogMode === 'create' ? 'Password' : 'Password (optional)'} type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} error={formErrors.password} />
            <SelectField label="Status" value={form.status} onChange={(value) => setForm((current) => ({ ...current, status: value }))} options={USER_STATUS_OPTIONS.map((item) => ({ label: item, value: item }))} placeholder="Select status" />
            <SelectField label="Gender" value={form.gender} onChange={(value) => setForm((current) => ({ ...current, gender: value }))} options={GENDER_OPTIONS.map((item) => ({ label: item.replaceAll('_', ' '), value: item }))} placeholder="Select gender" />
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Address</label>
              <Textarea value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void submitForm()} disabled={mutating}>
              {mutating ? 'Saving...' : dialogMode === 'create' ? 'Create Parent' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Link Student</DialogTitle>
            <DialogDescription>
              {linkParent ? `Create a live parent-student link for ${linkParent.fullName}.` : 'Create a live parent-student link.'}
            </DialogDescription>
          </DialogHeader>
          {(lookups.students.data?.length ?? 0) === 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Create at least one student first, then return here to link that student to this parent.
            </div>
          ) : null}
          <div className="grid gap-4">
            <div>
              <SelectField
                label="Student"
                value={linkForm.studentUserId}
                onChange={(value) => setLinkForm((current) => ({ ...current, studentUserId: value }))}
                options={(lookups.students.data ?? []).map((item) => ({ label: `${item.user.fullName} • ${item.studentCode}`, value: item.userId }))}
                placeholder="Select student"
              />
              <FieldError message={linkErrors.studentUserId} />
            </div>
            <Input
              label="Relation"
              value={linkForm.relation}
              onChange={(event) => setLinkForm((current) => ({ ...current, relation: event.target.value }))}
              error={linkErrors.relation}
              placeholder="Mother, Father, Guardian"
            />
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <input
                type="checkbox"
                checked={linkForm.isPrimary}
                onChange={(event) => setLinkForm((current) => ({ ...current, isPrimary: event.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 accent-[var(--color-primary)]"
              />
              Set as primary guardian
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void submitLink()} disabled={mutating || (lookups.students.data?.length ?? 0) === 0}>
              {mutating ? 'Saving...' : 'Link Student'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteParent)} onOpenChange={(open) => !open && setDeleteParent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete parent?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteParent ? `This will soft delete ${deleteParent.fullName} and mark the parent inactive.` : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmDelete()} disabled={mutating}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

type ClassFormState = {
  academicYearId: string;
  name: string;
  grade: string;
  sectionName: string;
  capacity: string;
};

const emptyClassForm: ClassFormState = {
  academicYearId: '',
  name: '',
  grade: '',
  sectionName: '',
  capacity: '',
};

type ClassSectionRow = {
  classRecord: ClassRecord;
  section: SectionRecord | null;
  academicYear: string;
  className: string;
  sectionName: string;
  capacity: number | string;
  studentsCount: number;
  teachersCount: number;
};

function classFormFromRecord(record: ClassRecord, section?: SectionRecord | null): ClassFormState {
  return {
    academicYearId: record.academicYearId,
    name: record.name,
    grade: record.grade,
    sectionName: section?.name ?? '',
    capacity: section?.capacity !== null && section?.capacity !== undefined ? String(section.capacity) : '',
  };
}

function validateClassForm(form: ClassFormState, options?: { requireSection?: boolean }) {
  const errors: Partial<Record<keyof ClassFormState, string>> = {};
  const requireSection = options?.requireSection ?? true;
  if (!form.academicYearId) errors.academicYearId = 'Academic year is required.';
  if (!form.name.trim()) errors.name = 'Class name is required.';
  if (requireSection) {
    if (!form.sectionName.trim()) errors.sectionName = 'Section is required.';
    if (!form.capacity.trim()) {
      errors.capacity = 'Total student capacity is required.';
    } else if (Number(form.capacity) <= 0) {
      errors.capacity = 'Total student capacity must be a positive number.';
    }
  }
  return errors;
}

export function SchoolAdminClassesSectionsPage() {
  const lookups = useSchoolLookups();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [academicYearFilter, setAcademicYearFilter] = useState('');
  const [page, setPage] = useState(1);
  const [classDialogMode, setClassDialogMode] = useState<'create' | 'edit'>('create');
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [classForm, setClassForm] = useState<ClassFormState>(emptyClassForm);
  const [classErrors, setClassErrors] = useState<Partial<Record<keyof ClassFormState, string>>>({});
  const [editingClass, setEditingClass] = useState<ClassRecord | null>(null);
  const [editingSection, setEditingSection] = useState<SectionRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'class' | 'section'; classRecord?: ClassRecord; sectionRecord?: SectionRecord } | null>(null);
  const [bootstrapSummary, setBootstrapSummary] = useState<BootstrapDefaultSetupResponse | null>(null);
  const [mutating, setMutating] = useState(false);

  const classes = usePagedResource(
    () =>
      academicsApi.listClasses({
        page,
        limit: PAGE_LIMIT,
        search: search || undefined,
        academicYearId: academicYearFilter || undefined,
      }),
    [page, search, academicYearFilter],
  );

  const openCreateClass = () => {
    setClassDialogMode('create');
    setEditingClass(null);
    setEditingSection(null);
    setClassForm(emptyClassForm);
    setClassErrors({});
    setClassDialogOpen(true);
  };

  const openEditRow = (row: ClassSectionRow) => {
    setClassDialogMode('edit');
    setEditingClass(row.classRecord);
    setEditingSection(row.section);
    setClassForm(classFormFromRecord(row.classRecord, row.section));
    setClassErrors({});
    setClassDialogOpen(true);
  };

  const submitClass = async () => {
    const validation = validateClassForm(classForm, {
      requireSection: classDialogMode === 'create' || Boolean(editingSection),
    });
    setClassErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setMutating(true);
    try {
      const classPayload: ClassFormPayload = {
        academicYearId: classForm.academicYearId,
        name: classForm.name.trim(),
        grade: classForm.name.trim(),
      };
      const sectionPayload: SectionFormPayload | null =
        classDialogMode === 'create' || editingSection
          ? {
              name: classForm.sectionName.trim(),
              capacity: Number(classForm.capacity),
            }
          : null;

      if (classDialogMode === 'create') {
        const matchingClassResponse = await academicsApi.listClasses({
          page: 1,
          limit: LOOKUP_LIMIT,
          academicYearId: classForm.academicYearId,
          search: classForm.name.trim(),
        });

        const existingClass = matchingClassResponse.items.find(
          (item) =>
            item.academicYearId === classForm.academicYearId &&
            item.name.trim().toLowerCase() === classForm.name.trim().toLowerCase(),
        );

        const classRecord = existingClass ?? (await academicsApi.createClass(classPayload));

        try {
          await academicsApi.createSection(classRecord.id, sectionPayload as SectionFormPayload);
        } catch (error) {
          const normalized = normalizeApiError(error);
          if (normalized.message.toLowerCase().includes('section') && normalized.message.toLowerCase().includes('exists')) {
            toast.error('Section already exists for this class.');
            return;
          }
          throw error;
        }

        toast.success('Class and section created successfully.');
      } else if (editingClass) {
        await academicsApi.updateClass(editingClass.id, classPayload);

        if (editingSection && sectionPayload) {
          await academicsApi.updateSection(editingSection.id, sectionPayload);
          toast.success('Class and section updated successfully.');
        } else {
          toast.success('Class updated successfully.');
        }
      }

      setClassDialogOpen(false);
      classes.refetch();
      lookups.classes.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setMutating(true);
    try {
      if (deleteTarget.type === 'class' && deleteTarget.classRecord) {
        await academicsApi.deleteClass(deleteTarget.classRecord.id);
        toast.success('Class deleted successfully.');
      }

      if (deleteTarget.type === 'section' && deleteTarget.sectionRecord) {
        await academicsApi.deleteSection(deleteTarget.sectionRecord.id);
        toast.success('Section deleted successfully.');
      }

      setDeleteTarget(null);
      classes.refetch();
      lookups.classes.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const classSectionRows = useMemo<ClassSectionRow[]>(
    () =>
      (classes.data?.items ?? []).flatMap((classRecord) => {
        if ((classRecord.sections?.length ?? 0) > 0) {
          return (classRecord.sections ?? []).map((section) => ({
            classRecord,
            section,
            academicYear: classRecord.academicYear?.name ?? '-',
            className: classRecord.name,
            sectionName: section.name,
            capacity: section.capacity ?? '-',
            studentsCount: section._count?.studentProfiles ?? 0,
            teachersCount: section._count?.teacherAssignments ?? 0,
          }));
        }

        return [
          {
            classRecord,
            section: null,
            academicYear: classRecord.academicYear?.name ?? '-',
            className: classRecord.name,
            sectionName: '-',
            capacity: '-',
            studentsCount: 0,
            teachersCount: 0,
          },
        ];
      }),
    [classes.data?.items],
  );

  const runDefaultSetup = async () => {
    setMutating(true);
    try {
      const summary = await academicsApi.bootstrapDefaultSetup();
      setBootstrapSummary(summary);
      toast.success(summary.message);
      lookups.academicYears.refetch();
      lookups.classes.refetch();
      classes.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  return (
    <div className="space-y-6">
      <BootstrapSummaryCard summary={bootstrapSummary} />

      <CrudPageHeader
        icon={<Layers3 className="h-7 w-7" />}
        title="Classes and Sections"
        description="Live class-and-section management with backend pagination, academic-year filters, and section-level student and teacher counts."
        actionLabel="Create Class & Section"
        onAction={openCreateClass}
      />

      <SectionCard title="Class Structure" description="Manage academic year, class, section, capacity, and live assigned student and teacher counts in a clean ERP table.">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => void runDefaultSetup()} disabled={mutating}>
              {mutating ? 'Creating Setup...' : 'Create Default Academic Setup'}
            </Button>
          </div>
          <SearchToolbar
            search={searchInput}
            onSearchChange={setSearchInput}
            onSearchSubmit={() => {
              setPage(1);
              setSearch(searchInput.trim());
            }}
            onReset={() => {
              setSearchInput('');
              setSearch('');
              setAcademicYearFilter('');
              setPage(1);
            }}
            filters={
              <SelectField
                value={academicYearFilter}
                onChange={(value) => {
                  setAcademicYearFilter(value);
                  setPage(1);
                }}
                placeholder="All academic years"
                options={(lookups.academicYears.data ?? []).map((item) => ({ label: item.name, value: item.id }))}
              />
            }
          />

          {classes.loading ? <LoadingState label="classes" /> : null}
          {classes.error ? <ErrorState error={classes.error} onRetry={classes.refetch} /> : null}
          {!classes.loading && !classes.error && (classes.data?.items.length ?? 0) === 0 ? (
            <EmptyState title="No classes found" description="Try a different filter or create the first class for this academic year." />
          ) : null}

          {!classes.loading && !classes.error && classes.data ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Academic Year</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Total Capacity</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Teachers</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classSectionRows.map((row) => (
                      <TableRow key={row.section?.id ?? row.classRecord.id}>
                        <TableCell>{row.academicYear}</TableCell>
                        <TableCell>{row.className}</TableCell>
                        <TableCell>{row.sectionName}</TableCell>
                        <TableCell>{row.capacity}</TableCell>
                        <TableCell>{row.studentsCount}</TableCell>
                        <TableCell>{row.teachersCount}</TableCell>
                        <TableCell>
                          <RecordActions>
                            <Button variant="outline" size="sm" onClick={() => openEditRow(row)}>
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() =>
                                setDeleteTarget(
                                  row.section
                                    ? { type: 'section', classRecord: row.classRecord, sectionRecord: row.section }
                                    : { type: 'class', classRecord: row.classRecord },
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </RecordActions>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <PaginationControls
                page={classes.data.meta.page}
                totalPages={classes.data.meta.totalPages}
                total={classes.data.meta.total}
                label="Classes"
                onPageChange={setPage}
              />
            </>
          ) : null}
        </div>
      </SectionCard>

      <Dialog open={classDialogOpen} onOpenChange={setClassDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{classDialogMode === 'create' ? 'Create Class & Section' : 'Edit Class & Section'}</DialogTitle>
            <DialogDescription>
              Configure the academic year, class, section, and total student capacity. Student and teacher totals update automatically from their own modules.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <SelectField label="Academic Year" value={classForm.academicYearId} onChange={(value) => setClassForm((current) => ({ ...current, academicYearId: value }))} options={(lookups.academicYears.data ?? []).map((item) => ({ label: item.name, value: item.id }))} placeholder="Select academic year" />
              <FieldError message={classErrors.academicYearId} />
            </div>
            <div>
              <SelectField label="Class" value={classForm.name} onChange={(value) => setClassForm((current) => ({ ...current, name: value, grade: value }))} options={CLASS_VALUE_OPTIONS.map((item) => ({ label: item, value: item }))} placeholder="Select class" />
              <FieldError message={classErrors.name} />
            </div>
            <div>
              <SelectField
                label="Section"
                value={classForm.sectionName}
                onChange={(value) => setClassForm((current) => ({ ...current, sectionName: value }))}
                options={SECTION_VALUE_OPTIONS.map((item) => ({ label: item, value: item }))}
                placeholder="Select section"
                disabled={classDialogMode === 'edit' && !editingSection}
              />
              <FieldError message={classErrors.sectionName} />
            </div>
            <div>
              <Input
                label="Total Student Capacity"
                type="number"
                min="1"
                value={classForm.capacity}
                onChange={(event) => setClassForm((current) => ({ ...current, capacity: event.target.value }))}
                error={classErrors.capacity}
                disabled={classDialogMode === 'edit' && !editingSection}
              />
            </div>
            {classDialogMode === 'edit' && !editingSection ? (
              <div className="md:col-span-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                This class does not have a section yet. Use Create Class & Section to add one.
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClassDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void submitClass()} disabled={mutating}>
              {mutating ? 'Saving...' : classDialogMode === 'create' ? 'Create Class & Section' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteTarget?.type ?? 'record'}?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === 'section' && deleteTarget.sectionRecord && deleteTarget.classRecord
                ? `Delete Section ${deleteTarget.sectionRecord.name} from Class ${deleteTarget.classRecord.name}?`
                : deleteTarget?.type === 'class' && deleteTarget.classRecord
                  ? `Delete Class ${deleteTarget.classRecord.name}?`
                  : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmDelete()} disabled={mutating}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

type AcademicYearFormState = {
  yearType: (typeof ACADEMIC_YEAR_TYPE_OPTIONS)[number];
  academicYear: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

const emptyAcademicYearForm: AcademicYearFormState = {
  yearType: 'Current Year',
  academicYear: '',
  startDate: '',
  endDate: '',
  isActive: false,
};

function academicYearFormFromRecord(record: AcademicYearRecord): AcademicYearFormState {
  return {
    yearType: inferAcademicYearType(record.name),
    academicYear: record.name,
    startDate: toDateInputValue(record.startDate),
    endDate: toDateInputValue(record.endDate),
    isActive: record.isActive,
  };
}

function validateAcademicYearForm(form: AcademicYearFormState) {
  const errors: Partial<Record<keyof AcademicYearFormState, string>> = {};
  if (!form.academicYear.trim()) errors.academicYear = 'Academic year is required.';
  if (!form.startDate) errors.startDate = 'Start date is required.';
  if (!form.endDate) errors.endDate = 'End date is required.';
  return errors;
}

export function SchoolAdminAcademicYearsPage() {
  const academicYears = useAsyncResource(() => academicsApi.listAcademicYears(), []);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [page, setPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<AcademicYearFormState>(emptyAcademicYearForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof AcademicYearFormState, string>>>({});
  const [editingRecord, setEditingRecord] = useState<AcademicYearRecord | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<AcademicYearRecord | null>(null);
  const [mutating, setMutating] = useState(false);

  const filteredYears = useMemo(() => {
    const all = academicYears.data ?? [];
    return all.filter((item) => {
      const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        !activeFilter ||
        (activeFilter === 'ACTIVE' ? item.isActive : !item.isActive);
      return matchesSearch && matchesFilter;
    });
  }, [academicYears.data, search, activeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredYears.length / PAGE_LIMIT));
  const pagedYears = filteredYears.slice((page - 1) * PAGE_LIMIT, page * PAGE_LIMIT);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

  const openCreate = () => {
    setDialogMode('create');
    setEditingRecord(null);
    setForm(emptyAcademicYearForm);
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEdit = (record: AcademicYearRecord) => {
    setDialogMode('edit');
    setEditingRecord(record);
    setForm(academicYearFormFromRecord(record));
    setFormErrors({});
    setDialogOpen(true);
  };

  const submitForm = async () => {
    const validation = validateAcademicYearForm(form);
    setFormErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setMutating(true);
    try {
      const payload: AcademicYearFormPayload = {
        name: form.academicYear.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        isActive: form.isActive,
      };

      if (dialogMode === 'create') {
        await academicsApi.createAcademicYear(payload);
        toast.success('Academic year created successfully.');
      } else if (editingRecord) {
        await academicsApi.updateAcademicYear(editingRecord.id, payload);
        toast.success('Academic year updated successfully.');
      }

      setDialogOpen(false);
      academicYears.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const activateYear = async (record: AcademicYearRecord) => {
    setMutating(true);
    try {
      await academicsApi.activateAcademicYear(record.id);
      toast.success('Academic year activated successfully.');
      academicYears.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteRecord) return;
    setMutating(true);
    try {
      await academicsApi.deleteAcademicYear(deleteRecord.id);
      toast.success('Academic year deleted successfully.');
      setDeleteRecord(null);
      academicYears.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  return (
    <div className="space-y-6">
      <CrudPageHeader
        icon={<School className="h-7 w-7" />}
        title="Academic Years"
        description="Live academic-year setup with create, edit, activate, delete, client-side search, and pagination over the backend response."
        actionLabel="Create Academic Year"
        onAction={openCreate}
      />

      <SectionCard title="Academic Year Management" description="This screen now uses the live academic-year API and removes the old mock fallback.">
        <div className="space-y-6">
          <SearchToolbar
            search={searchInput}
            onSearchChange={setSearchInput}
            onSearchSubmit={() => {
              setSearch(searchInput.trim());
              setPage(1);
            }}
            onReset={() => {
              setSearchInput('');
              setSearch('');
              setActiveFilter('');
              setPage(1);
            }}
            filters={
              <SelectField
                value={activeFilter}
                onChange={(value) => {
                  setActiveFilter(value);
                  setPage(1);
                }}
                placeholder="All states"
                options={[
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Inactive', value: 'INACTIVE' },
                ]}
              />
            }
          />

          {academicYears.loading ? <LoadingState label="academic-years" /> : null}
          {academicYears.error ? <ErrorState error={academicYears.error} onRetry={academicYears.refetch} /> : null}
          {!academicYears.loading && !academicYears.error && pagedYears.length === 0 ? (
            <EmptyState title="No academic years found" description="Create the first academic year or adjust the current filters." />
          ) : null}

          {!academicYears.loading && !academicYears.error && pagedYears.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Academic Year</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedYears.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.name}</TableCell>
                        <TableCell>{formatDate(record.startDate)}</TableCell>
                        <TableCell>{formatDate(record.endDate)}</TableCell>
                        <TableCell>
                          <Badge variant={record.isActive ? 'success' : 'muted'}>{record.isActive ? 'ACTIVE' : 'INACTIVE'}</Badge>
                        </TableCell>
                        <TableCell>
                          <RecordActions>
                            <Button variant="outline" size="sm" onClick={() => openEdit(record)}>
                              Edit
                            </Button>
                            {!record.isActive ? (
                              <Button variant="outline" size="sm" onClick={() => void activateYear(record)} disabled={mutating}>
                                Activate
                              </Button>
                            ) : null}
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteRecord(record)}>
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </RecordActions>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <PaginationControls
                page={page}
                totalPages={totalPages}
                total={filteredYears.length}
                label="Academic years"
                onPageChange={setPage}
              />
            </>
          ) : null}
        </div>
      </SectionCard>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'create' ? 'Create Academic Year' : 'Edit Academic Year'}</DialogTitle>
            <DialogDescription>Pick a school-friendly year type and academic year value. The selected academic year is still sent to the backend as `name`.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <SelectField label="Year Type" value={form.yearType} onChange={(value) => setForm((current) => ({ ...current, yearType: value as (typeof ACADEMIC_YEAR_TYPE_OPTIONS)[number] }))} options={ACADEMIC_YEAR_TYPE_OPTIONS.map((item) => ({ label: item, value: item }))} placeholder="Select year type" />
            </div>
            <div>
              <SelectField label="Academic Year" value={form.academicYear} onChange={(value) => setForm((current) => ({ ...current, academicYear: value }))} options={ACADEMIC_YEAR_VALUE_OPTIONS.map((item) => ({ label: item, value: item }))} placeholder="Select academic year" />
              <FieldError message={formErrors.academicYear} />
            </div>
            <Input label="Start Date" type="date" value={form.startDate} onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))} error={formErrors.startDate} />
            <Input label="End Date" type="date" value={form.endDate} onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))} error={formErrors.endDate} />
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 accent-[var(--color-primary)]"
              />
              Set as active academic year
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void submitForm()} disabled={mutating}>
              {mutating ? 'Saving...' : dialogMode === 'create' ? 'Create Academic Year' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteRecord)} onOpenChange={(open) => !open && setDeleteRecord(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete academic year?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteRecord ? `This will permanently delete ${deleteRecord.name}. Active academic years cannot be deleted.` : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmDelete()} disabled={mutating}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

type SubjectFormState = {
  name: string;
  code: string;
  description: string;
};

const emptySubjectForm: SubjectFormState = {
  name: '',
  code: '',
  description: '',
};

function subjectFormFromRecord(record: SubjectRecord): SubjectFormState {
  return {
    name: record.name,
    code: record.code,
    description: record.description ?? '',
  };
}

function validateSubjectForm(form: SubjectFormState) {
  const errors: Partial<Record<keyof SubjectFormState, string>> = {};
  if (!form.name.trim()) errors.name = 'Name is required.';
  if (!form.code.trim()) errors.code = 'Code is required.';
  return errors;
}

export function SchoolAdminSubjectsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<SubjectFormState>(emptySubjectForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof SubjectFormState, string>>>({});
  const [editingRecord, setEditingRecord] = useState<SubjectRecord | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<SubjectRecord | null>(null);
  const [mutating, setMutating] = useState(false);

  const subjects = usePagedResource(
    () => academicsApi.listSubjects({ page, limit: PAGE_LIMIT, search: search || undefined }),
    [page, search],
  );

  const openCreate = () => {
    setDialogMode('create');
    setEditingRecord(null);
    setForm(emptySubjectForm);
    setFormErrors({});
    setDialogOpen(true);
  };

  const openEdit = (record: SubjectRecord) => {
    setDialogMode('edit');
    setEditingRecord(record);
    setForm(subjectFormFromRecord(record));
    setFormErrors({});
    setDialogOpen(true);
  };

  const submitForm = async () => {
    const validation = validateSubjectForm(form);
    setFormErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setMutating(true);
    try {
      const payload = compactObject({
        name: form.name.trim(),
        code: form.code.trim(),
        description: form.description.trim(),
      }) as SubjectFormPayload;

      if (dialogMode === 'create') {
        await academicsApi.createSubject(payload);
        toast.success('Subject created successfully.');
      } else if (editingRecord) {
        await academicsApi.updateSubject(editingRecord.id, payload);
        toast.success('Subject updated successfully.');
      }

      setDialogOpen(false);
      subjects.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteRecord) return;
    setMutating(true);
    try {
      await academicsApi.deleteSubject(deleteRecord.id);
      toast.success('Subject deleted successfully.');
      setDeleteRecord(null);
      subjects.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  return (
    <div className="space-y-6">
      <CrudPageHeader
        icon={<BookOpen className="h-7 w-7" />}
        title="Subjects"
        description="Live subject records with backend pagination, search, and create, edit, and delete actions."
        actionLabel="Create Subject"
        onAction={openCreate}
      />

      <SectionCard title="Subject Catalog" description="Replace the mock subject table with live backend subject data and counts.">
        <div className="space-y-6">
          <SearchToolbar
            search={searchInput}
            onSearchChange={setSearchInput}
            onSearchSubmit={() => {
              setPage(1);
              setSearch(searchInput.trim());
            }}
            onReset={() => {
              setSearchInput('');
              setSearch('');
              setPage(1);
            }}
          />

          {subjects.loading ? <LoadingState label="subjects" /> : null}
          {subjects.error ? <ErrorState error={subjects.error} onRetry={subjects.refetch} /> : null}
          {!subjects.loading && !subjects.error && (subjects.data?.items.length ?? 0) === 0 ? (
            <EmptyState title="No subjects found" description="Create the first subject or adjust the current search." />
          ) : null}

          {!subjects.loading && !subjects.error && subjects.data ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Teacher Assignments</TableHead>
                      <TableHead>Courses</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.data.items.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.name}</TableCell>
                        <TableCell>{record.code}</TableCell>
                        <TableCell className="max-w-sm">{record.description ?? '-'}</TableCell>
                        <TableCell>{record._count?.teacherAssignments ?? 0}</TableCell>
                        <TableCell>{record._count?.courses ?? 0}</TableCell>
                        <TableCell>
                          <RecordActions>
                            <Button variant="outline" size="sm" onClick={() => openEdit(record)}>
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteRecord(record)}>
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </RecordActions>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <PaginationControls
                page={subjects.data.meta.page}
                totalPages={subjects.data.meta.totalPages}
                total={subjects.data.meta.total}
                label="Subjects"
                onPageChange={setPage}
              />
            </>
          ) : null}
        </div>
      </SectionCard>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'create' ? 'Create Subject' : 'Edit Subject'}</DialogTitle>
            <DialogDescription>Use the real backend subject DTO fields with name, code, and optional description.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Input label="Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} error={formErrors.name} />
            <Input label="Code" value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))} error={formErrors.code} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void submitForm()} disabled={mutating}>
              {mutating ? 'Saving...' : dialogMode === 'create' ? 'Create Subject' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteRecord)} onOpenChange={(open) => !open && setDeleteRecord(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete subject?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteRecord ? `This will permanently delete ${deleteRecord.name} (${deleteRecord.code}).` : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmDelete()} disabled={mutating}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
