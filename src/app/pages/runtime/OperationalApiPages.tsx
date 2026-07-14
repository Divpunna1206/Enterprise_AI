import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { toast } from 'sonner';

import { academicsApi } from '../../api/academics.api';
import { aiApi } from '../../api/ai.api';
import { attendanceApi } from '../../api/attendance.api';
import { billingApi } from '../../api/billing.api';
import { normalizeApiError } from '../../api/client';
import { organizationsApi } from '../../api/organizations.api';
import { parentsApi } from '../../api/parents.api';
import { progressApi } from '../../api/progress.api';
import { reportsApi } from '../../api/reports.api';
import { studentsApi } from '../../api/students.api';
import { usersApi } from '../../api/users.api';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import type { ApiError } from '../../types/api.types';
import type {
  AccountantReportsResponse,
  AiModuleRecord,
  AiSettingRecord,
  AiUsageLogRecord,
  AttendanceSessionRecord,
  ChildProgressRecord,
  GenericObject,
  HomeworkReportRecord,
  InvoiceRecord,
  OrganizationListItem,
  ParentAttendanceRecord,
  ParentFeeRecord,
  PaymentRecord,
  PlanRecord,
  QuizReportRecord,
  SchoolSummaryReport,
  SourceLibraryItem,
  StudentPerformanceReportRow,
  StudentSubjectProgress,
  SubscriptionRecord,
  TeacherPerformanceReportRow,
} from '../../types/runtime-data.types';

type LoadState<T> = {
  data: T | null;
  error: ApiError | null;
  loading: boolean;
  refetch: () => void;
};

type Column<T> = {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
};

function useAsyncData<T>(loader: () => Promise<T>, deps: readonly unknown[]): LoadState<T> {
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

  return { data, error, loading, refetch };
}

function statusVariant(value?: string) {
  const normalized = (value ?? '').toLowerCase();
  if (
    normalized.includes('active') ||
    normalized.includes('paid') ||
    normalized.includes('success') ||
    normalized.includes('completed') ||
    normalized.includes('indexed')
  ) {
    return 'success' as const;
  }
  if (
    normalized.includes('pending') ||
    normalized.includes('draft') ||
    normalized.includes('issued') ||
    normalized.includes('uploaded') ||
    normalized.includes('processing')
  ) {
    return 'warning' as const;
  }
  if (
    normalized.includes('failed') ||
    normalized.includes('overdue') ||
    normalized.includes('inactive') ||
    normalized.includes('cancel')
  ) {
    return 'destructive' as const;
  }
  return 'secondary' as const;
}

function formatLabel(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value?: string | null) {
  if (!value) return '-';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
}

function formatNumber(value: unknown) {
  if (typeof value === 'number') return value.toLocaleString();
  if (typeof value === 'string') return value;
  return '0';
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toLocaleString();
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.map((item) => formatValue(item)).join(', ');
  if (typeof value === 'object') {
    const objectValue = value as Record<string, unknown>;
    if ('name' in objectValue && typeof objectValue.name === 'string') return objectValue.name;
    if ('fullName' in objectValue && typeof objectValue.fullName === 'string') return objectValue.fullName;
    if ('title' in objectValue && typeof objectValue.title === 'string') return objectValue.title;
    return JSON.stringify(objectValue);
  }
  return String(value);
}

function RenderValue({ value }: { value: unknown }) {
  if (typeof value === 'string' && value.length < 32) {
    const looksLikeStatus =
      /active|inactive|pending|draft|paid|overdue|success|failed|completed|indexed|cancel/i.test(
        value,
      );
    if (looksLikeStatus) {
      return <Badge variant={statusVariant(value)}>{value}</Badge>;
    }
  }

  return <>{formatValue(value)}</>;
}

function PageShell({
  title,
  description,
  badge,
  children,
}: {
  title: string;
  description: string;
  badge: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] border-white/70 bg-white/90 shadow-sm">
        <CardHeader>
          <Badge variant="primary" className="w-fit">
            {badge}
          </Badge>
          <CardTitle className="mt-3 text-3xl">{title}</CardTitle>
          <CardDescription className="mt-2 max-w-3xl text-sm">{description}</CardDescription>
        </CardHeader>
      </Card>
      {children}
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
    <Card className="rounded-[28px] border-white/70 bg-white/90 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription className="mt-2">{description}</CardDescription> : null}
        </div>
        {aside}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-primary">
      Loading {label}...
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: ApiError; onRetry: () => void }) {
  return (
    <div className="space-y-4 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-4">
      <p className="text-sm text-destructive">{error.message}</p>
      <Button variant="outline" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-8 text-center">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function MetricGrid({ metrics }: { metrics: Array<{ label: string; value: unknown }> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="rounded-3xl border-white/70 bg-white">
          <CardContent className="space-y-2 p-5">
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p className="text-2xl font-semibold text-foreground">{formatValue(metric.value)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ObjectSummary({
  title,
  data,
}: {
  title: string;
  data: GenericObject;
}) {
  const entries = Object.entries(data);
  if (entries.length === 0) {
    return <EmptyState title={`No ${title.toLowerCase()} available`} description="The backend returned an empty object." />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {entries.map(([key, value]) => (
        <Card key={key} className="rounded-3xl border-white/70 bg-white">
          <CardContent className="space-y-2 p-5">
            <p className="text-sm text-muted-foreground">{formatLabel(key)}</p>
            <div className="text-sm font-medium text-foreground">
              <RenderValue value={value} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DataTable<T>({
  columns,
  rows,
  emptyTitle,
  emptyDescription,
}: {
  columns: Column<T>[];
  rows: T[];
  emptyTitle: string;
  emptyDescription: string;
}) {
  if (rows.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.key}>{column.render(row)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function QueryToolbar({
  search,
  onSearchChange,
  onSearchSubmit,
  onReset,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="w-full md:max-w-sm">
        <Input
          label="Search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search records"
        />
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onSearchSubmit}>
          Search
        </Button>
        <Button variant="ghost" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}

function UnsupportedBackendPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <PageShell
      title={title}
      description={description}
      badge="Backend Required"
    >
      <SectionCard title="Backend API Required">
        <EmptyState
          title="No supported backend API for this route"
          description="The old frontend demo data has not been reused here. This route needs a backend endpoint or role support before it can be made live."
        />
      </SectionCard>
    </PageShell>
  );
}

function OrganizationsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const organizations = useAsyncData(
    () => organizationsApi.list({ page: 1, limit: 25, search: search || undefined }),
    [search],
  );

  return (
    <PageShell
      title="Schools"
      description="Live organization data from the backend replaces the previous super-admin demo table."
      badge="Super Admin"
    >
      <SectionCard title="Organization Directory" description="Search and review the organizations visible to the super admin.">
        <div className="space-y-6">
          <QueryToolbar
            search={searchInput}
            onSearchChange={setSearchInput}
            onSearchSubmit={() => setSearch(searchInput.trim())}
            onReset={() => {
              setSearchInput('');
              setSearch('');
            }}
          />
          {organizations.loading ? <LoadingState label="organizations" /> : null}
          {organizations.error ? <ErrorState error={organizations.error} onRetry={organizations.refetch} /> : null}
          {organizations.data ? (
            <DataTable<OrganizationListItem>
              columns={[
                { key: 'name', header: 'School', render: (item) => item.name },
                { key: 'slug', header: 'Slug', render: (item) => item.slug },
                { key: 'city', header: 'City', render: (item) => item.city ?? '-' },
                { key: 'status', header: 'Status', render: (item) => <Badge variant={statusVariant(item.status)}>{item.status ?? 'UNKNOWN'}</Badge> },
                { key: 'plan', header: 'Active Plan', render: (item) => item.activePlan?.name ?? '-' },
                { key: 'updatedAt', header: 'Updated', render: (item) => formatDate(item.updatedAt) },
              ]}
              rows={organizations.data.items}
              emptyTitle="No organizations found"
              emptyDescription="The backend returned no organizations for the current filters."
            />
          ) : null}
        </div>
      </SectionCard>
    </PageShell>
  );
}

function PlanManagementPage() {
  const plans = useAsyncData(() => billingApi.listPlans({ page: 1, limit: 50 }), []);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const togglePlan = async (planId: string) => {
    setTogglingId(planId);
    try {
      await billingApi.togglePlan(planId);
      toast.success('Plan status updated.');
      plans.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <PageShell
      title="Subscription Plans"
      description="Live plan records now back this route, with status toggles using the existing backend contract."
      badge="Super Admin"
    >
      <SectionCard title="Plans" description="Current plans from the backend.">
        {plans.loading ? <LoadingState label="plans" /> : null}
        {plans.error ? <ErrorState error={plans.error} onRetry={plans.refetch} /> : null}
        {plans.data ? (
          <DataTable<PlanRecord>
            columns={[
              { key: 'name', header: 'Plan', render: (item) => item.name },
              { key: 'description', header: 'Description', render: (item) => item.description ?? '-' },
              { key: 'studentLimit', header: 'Student Limit', render: (item) => formatValue(item.studentLimit) },
              { key: 'teacherLimit', header: 'Teacher Limit', render: (item) => formatValue(item.teacherLimit) },
              { key: 'isActive', header: 'Status', render: (item) => <Badge variant={item.isActive ? 'success' : 'destructive'}>{item.isActive ? 'ACTIVE' : 'INACTIVE'}</Badge> },
              {
                key: 'actions',
                header: 'Actions',
                render: (item) => (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={togglingId === item.id}
                    onClick={() => void togglePlan(item.id)}
                  >
                    {togglingId === item.id ? 'Updating...' : item.isActive ? 'Disable' : 'Enable'}
                  </Button>
                ),
              },
            ]}
            rows={plans.data.items}
            emptyTitle="No plans found"
            emptyDescription="No subscription plans are available yet."
          />
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

function SuperAdminBillingPage() {
  const subscriptions = useAsyncData(() => billingApi.listSubscriptions({ page: 1, limit: 10 }), []);
  const invoices = useAsyncData(() => billingApi.listInvoices({ page: 1, limit: 10 }), []);
  const payments = useAsyncData(() => billingApi.listPayments({ page: 1, limit: 10 }), []);

  return (
    <PageShell
      title="Billing"
      description="Live subscriptions, invoices, and payments replace the old static super-admin billing table."
      badge="Super Admin"
    >
      <SectionCard title="Subscriptions" description="Recent subscriptions across the platform.">
        {subscriptions.loading ? <LoadingState label="subscriptions" /> : null}
        {subscriptions.error ? <ErrorState error={subscriptions.error} onRetry={subscriptions.refetch} /> : null}
        {subscriptions.data ? (
          <DataTable<SubscriptionRecord>
            columns={[
              { key: 'plan', header: 'Plan', render: (item) => item.plan?.name ?? '-' },
              { key: 'organization', header: 'Organization', render: (item) => item.organization?.name ?? '-' },
              { key: 'status', header: 'Status', render: (item) => <Badge variant={statusVariant(item.status)}>{item.status ?? 'UNKNOWN'}</Badge> },
              { key: 'startDate', header: 'Start Date', render: (item) => formatDate(item.startDate) },
              { key: 'endDate', header: 'End Date', render: (item) => formatDate(item.endDate) },
            ]}
            rows={subscriptions.data.items}
            emptyTitle="No subscriptions found"
            emptyDescription="The backend returned no subscriptions."
          />
        ) : null}
      </SectionCard>

      <SectionCard title="Invoices" description="Recent platform invoices.">
        {invoices.loading ? <LoadingState label="invoices" /> : null}
        {invoices.error ? <ErrorState error={invoices.error} onRetry={invoices.refetch} /> : null}
        {invoices.data ? (
          <DataTable<InvoiceRecord>
            columns={[
              { key: 'invoiceNumber', header: 'Invoice', render: (item) => item.invoiceNumber ?? item.id },
              { key: 'organization', header: 'Organization', render: (item) => item.organization?.name ?? item.subscription?.plan?.name ?? '-' },
              { key: 'amount', header: 'Amount', render: (item) => formatValue(item.totalAmount) },
              { key: 'status', header: 'Status', render: (item) => <Badge variant={statusVariant(item.status)}>{item.status ?? 'UNKNOWN'}</Badge> },
              { key: 'dueDate', header: 'Due Date', render: (item) => formatDate(item.dueDate) },
            ]}
            rows={invoices.data.items}
            emptyTitle="No invoices found"
            emptyDescription="The backend returned no invoices."
          />
        ) : null}
      </SectionCard>

      <SectionCard title="Payments" description="Recent payment activity.">
        {payments.loading ? <LoadingState label="payments" /> : null}
        {payments.error ? <ErrorState error={payments.error} onRetry={payments.refetch} /> : null}
        {payments.data ? (
          <DataTable<PaymentRecord>
            columns={[
              { key: 'id', header: 'Payment', render: (item) => item.id },
              { key: 'amount', header: 'Amount', render: (item) => formatValue(item.amount) },
              { key: 'status', header: 'Status', render: (item) => <Badge variant={statusVariant(item.status)}>{item.status ?? 'UNKNOWN'}</Badge> },
              { key: 'gateway', header: 'Gateway', render: (item) => item.gateway ?? '-' },
              { key: 'createdAt', header: 'Created', render: (item) => formatDate(item.createdAt) },
            ]}
            rows={payments.data.items}
            emptyTitle="No payments found"
            emptyDescription="The backend returned no payments."
          />
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

function AttendanceOverviewPage({ role }: { role: 'school-admin' | 'teacher' }) {
  const classSummary = useAsyncData(() => attendanceApi.getClassSummary(), [role]);
  const sessions = useAsyncData(() => attendanceApi.listSessions({ page: 1, limit: 20 }), [role]);

  return (
    <PageShell
      title="Attendance"
      description="This route now reads attendance summaries and sessions from the backend instead of demo data."
      badge={role === 'teacher' ? 'Teacher' : 'School Admin'}
    >
      <SectionCard title="Class Summary" description="Current attendance summary payload from the backend.">
        {classSummary.loading ? <LoadingState label="attendance summary" /> : null}
        {classSummary.error ? <ErrorState error={classSummary.error} onRetry={classSummary.refetch} /> : null}
        {classSummary.data ? <ObjectSummary title="Attendance Summary" data={classSummary.data} /> : null}
      </SectionCard>
      <SectionCard title="Attendance Sessions" description="Recent attendance sessions.">
        {sessions.loading ? <LoadingState label="attendance sessions" /> : null}
        {sessions.error ? <ErrorState error={sessions.error} onRetry={sessions.refetch} /> : null}
        {sessions.data ? (
          <DataTable<AttendanceSessionRecord>
            columns={[
              { key: 'date', header: 'Date', render: (item) => formatDate(item.date) },
              { key: 'class', header: 'Class', render: (item) => item.class?.name ?? '-' },
              { key: 'section', header: 'Section', render: (item) => item.section?.name ?? '-' },
              { key: 'teacher', header: 'Teacher', render: (item) => item.teacher?.user?.fullName ?? '-' },
              { key: 'status', header: 'Status', render: (item) => <Badge variant={statusVariant(item.status)}>{item.status ?? 'UNKNOWN'}</Badge> },
              { key: 'records', header: 'Records', render: (item) => formatValue(item._count?.records) },
            ]}
            rows={sessions.data.items}
            emptyTitle="No attendance sessions found"
            emptyDescription="The backend returned no attendance sessions."
          />
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

function StudentAttendanceView() {
  const attendance = useAsyncData(() => studentsApi.getMyAttendance(), []);

  return (
    <PageShell
      title="Attendance"
      description="Student attendance now comes from the backend attendance API."
      badge="Student"
    >
      <SectionCard title="My Attendance">
        {attendance.loading ? <LoadingState label="student attendance" /> : null}
        {attendance.error ? <ErrorState error={attendance.error} onRetry={attendance.refetch} /> : null}
        {attendance.data ? <ObjectSummary title="Student Attendance" data={attendance.data} /> : null}
      </SectionCard>
    </PageShell>
  );
}

function ParentAttendanceView() {
  const attendance = useAsyncData(() => parentsApi.getChildrenAttendance(), []);

  return (
    <PageShell
      title="Child Attendance"
      description="Parent attendance now uses linked-child attendance data from the backend."
      badge="Parent"
    >
      <SectionCard title="Children Attendance">
        {attendance.loading ? <LoadingState label="children attendance" /> : null}
        {attendance.error ? <ErrorState error={attendance.error} onRetry={attendance.refetch} /> : null}
        {attendance.data ? (
          <DataTable<ParentAttendanceRecord>
            columns={[
              { key: 'studentId', header: 'Student', render: (item) => item.fullName ?? item.studentId ?? '-' },
              { key: 'summary', header: 'Summary', render: (item) => <RenderValue value={item.summary ?? item.attendance ?? item} /> },
            ]}
            rows={attendance.data}
            emptyTitle="No child attendance found"
            emptyDescription="No attendance records are linked to this parent account."
          />
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

function SourceLibraryPage({ role }: { role: 'school-admin' | 'teacher' }) {
  const canManage = role === 'school-admin' || role === 'teacher';
  const sources = useAsyncData(() => aiApi.listSourceLibrary({ page: 1, limit: 25 }), [role]);
  const classes = useAsyncData(
    async () => (await academicsApi.listClasses({ page: 1, limit: 100 })).items,
    [],
  );
  const subjects = useAsyncData(
    async () => (await academicsApi.listSubjects({ page: 1, limit: 100 })).items,
    [],
  );
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('PDF');
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [mutating, setMutating] = useState(false);

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      toast.error('Select a file and enter a title.');
      return;
    }

    const payload = new FormData();
    payload.append('file', file);
    payload.append('title', title.trim());
    payload.append('type', type);
    if (classId) payload.append('classId', classId);
    if (subjectId) payload.append('subjectId', subjectId);

    setMutating(true);
    try {
      await aiApi.uploadSourceLibraryItem(payload);
      toast.success('Source uploaded successfully.');
      setFile(null);
      setTitle('');
      setClassId('');
      setSubjectId('');
      sources.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const handleReindex = async (sourceId: string) => {
    setMutating(true);
    try {
      await aiApi.reindexSourceLibraryItem(sourceId);
      toast.success('Reindex job queued.');
      sources.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const handleDelete = async (sourceId: string) => {
    setMutating(true);
    try {
      await aiApi.deleteSourceLibraryItem(sourceId);
      toast.success('Source deleted.');
      sources.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  return (
    <PageShell
      title="Source Library"
      description="Live source-library upload and listing replace the previous localStorage-backed demo flow."
      badge={role === 'teacher' ? 'Teacher AI' : 'School Admin AI'}
    >
      {canManage ? (
        <SectionCard title="Upload Source" description="Upload a school-approved source to the backend source library.">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="h-11 w-full rounded-2xl border border-input bg-background px-3 text-sm outline-none"
              >
                {['PDF', 'DOCX', 'PPTX', 'TXT', 'VIDEO', 'WEB_LINK', 'MANUAL_TEXT', 'WORKSHEET', 'QUESTION_BANK', 'TRANSCRIPT'].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <select
                value={classId}
                onChange={(event) => setClassId(event.target.value)}
                className="h-11 w-full rounded-2xl border border-input bg-background px-3 text-sm outline-none"
              >
                <option value="">All classes</option>
                {(classes.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.grade} - {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <select
                value={subjectId}
                onChange={(event) => setSubjectId(event.target.value)}
                className="h-11 w-full rounded-2xl border border-input bg-background px-3 text-sm outline-none"
              >
                <option value="">All subjects</option>
                {(subjects.data ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Source File</label>
              <input
                type="file"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="block w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={() => void handleUpload()} disabled={mutating}>
              {mutating ? 'Uploading...' : 'Upload Source'}
            </Button>
          </div>
        </SectionCard>
      ) : null}

      <SectionCard title="Sources" description="Source-library items from the backend.">
        {sources.loading ? <LoadingState label="source library" /> : null}
        {sources.error ? <ErrorState error={sources.error} onRetry={sources.refetch} /> : null}
        {sources.data ? (
          <DataTable<SourceLibraryItem>
            columns={[
              { key: 'title', header: 'Title', render: (item) => item.title },
              { key: 'type', header: 'Type', render: (item) => item.type },
              { key: 'class', header: 'Class', render: (item) => item.class?.name ?? '-' },
              { key: 'subject', header: 'Subject', render: (item) => item.subject?.name ?? '-' },
              { key: 'status', header: 'Status', render: (item) => <Badge variant={statusVariant(item.status)}>{item.status ?? 'UNKNOWN'}</Badge> },
              { key: 'uploadedBy', header: 'Uploaded By', render: (item) => item.uploadedBy?.fullName ?? '-' },
              { key: 'createdAt', header: 'Created', render: (item) => formatDate(item.createdAt) },
              {
                key: 'actions',
                header: 'Actions',
                render: (item) => (
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" disabled={mutating} onClick={() => void handleReindex(item.id)}>
                      Reindex
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" disabled={mutating} onClick={() => void handleDelete(item.id)}>
                      Delete
                    </Button>
                  </div>
                ),
              },
            ]}
            rows={sources.data.items}
            emptyTitle="No sources found"
            emptyDescription="Upload the first source to begin indexing approved content."
          />
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

function AiSettingsPage() {
  const settings = useAsyncData(() => aiApi.getSettings(), []);
  const [formState, setFormState] = useState<AiSettingRecord | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings.data) {
      setFormState(settings.data);
    }
  }, [settings.data]);

  const updateBoolean = (key: keyof AiSettingRecord, checked: boolean) => {
    setFormState((current) => (current ? { ...current, [key]: checked } : current));
  };

  const handleSave = async () => {
    if (!formState) return;
    setSaving(true);
    try {
      await aiApi.updateSettings({
        aiEnabled: formState.aiEnabled,
        studentAskAiEnabled: formState.studentAskAiEnabled,
        teacherAiToolsEnabled: formState.teacherAiToolsEnabled,
        parentAiSummaryEnabled: formState.parentAiSummaryEnabled,
        maxDailyAiRequestsPerStudent: Number(formState.maxDailyAiRequestsPerStudent),
        safetyLevel: formState.safetyLevel,
        sourceOnlyMode: formState.sourceOnlyMode,
        ageAppropriateOutput: formState.ageAppropriateOutput,
        teacherReviewRequired: formState.teacherReviewRequired,
        promptInjectionProtection: formState.promptInjectionProtection,
        showCitations: formState.showCitations,
        aiDisclaimer: formState.aiDisclaimer,
      });
      toast.success('AI settings updated.');
      settings.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell
      title="AI Settings"
      description="This route now reads and updates real organization AI settings."
      badge="School Admin AI"
    >
      <SectionCard title="Organization AI Controls">
        {settings.loading ? <LoadingState label="AI settings" /> : null}
        {settings.error ? <ErrorState error={settings.error} onRetry={settings.refetch} /> : null}
        {formState ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['aiEnabled', 'Enable AI'],
                ['studentAskAiEnabled', 'Enable Student Ask AI'],
                ['teacherAiToolsEnabled', 'Enable Teacher AI Tools'],
                ['parentAiSummaryEnabled', 'Enable Parent AI Summary'],
                ['sourceOnlyMode', 'Restrict to Approved Sources'],
                ['ageAppropriateOutput', 'Age Appropriate Output'],
                ['teacherReviewRequired', 'Teacher Review Required'],
                ['promptInjectionProtection', 'Prompt Injection Protection'],
                ['showCitations', 'Show Citations'],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(formState[key as keyof AiSettingRecord])}
                    onChange={(event) => updateBoolean(key as keyof AiSettingRecord, event.target.checked)}
                    className="h-4 w-4"
                  />
                  {label}
                </label>
              ))}
              <Input
                label="Max Daily Requests Per Student"
                type="number"
                value={String(formState.maxDailyAiRequestsPerStudent)}
                onChange={(event) =>
                  setFormState((current) =>
                    current
                      ? {
                          ...current,
                          maxDailyAiRequestsPerStudent: Number(event.target.value || 0),
                        }
                      : current,
                  )
                }
              />
              <Input
                label="Safety Level"
                value={String(formState.safetyLevel)}
                onChange={(event) =>
                  setFormState((current) =>
                    current ? { ...current, safetyLevel: event.target.value } : current,
                  )
                }
              />
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">AI Disclaimer</label>
                <textarea
                  value={String(formState.aiDisclaimer)}
                  onChange={(event) =>
                    setFormState((current) =>
                      current ? { ...current, aiDisclaimer: event.target.value } : current,
                    )
                  }
                  className="min-h-[120px] w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>
            <Button onClick={() => void handleSave()} disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

function AiUsagePage({ role }: { role: 'super-admin' | 'school-admin' }) {
  const usage = useAsyncData(() => aiApi.getUsage({ page: 1, limit: 25 }), [role]);

  return (
    <PageShell
      title="AI Usage"
      description="Live AI usage logs replace the former static AI usage cards and tables."
      badge={role === 'super-admin' ? 'Super Admin AI' : 'School Admin AI'}
    >
      <SectionCard title="Usage Logs" description="Recent AI usage records visible for this role.">
        {usage.loading ? <LoadingState label="AI usage" /> : null}
        {usage.error ? <ErrorState error={usage.error} onRetry={usage.refetch} /> : null}
        {usage.data ? (
          <DataTable<AiUsageLogRecord>
            columns={[
              { key: 'type', header: 'Type', render: (item) => item.type ?? '-' },
              { key: 'action', header: 'Action', render: (item) => item.action ?? '-' },
              { key: 'user', header: 'User', render: (item) => item.user?.fullName ?? item.user?.email ?? '-' },
              { key: 'job', header: 'Job Status', render: (item) => item.job?.status ?? '-' },
              { key: 'createdAt', header: 'Created', render: (item) => formatDate(item.createdAt) },
            ]}
            rows={usage.data.items}
            emptyTitle="No AI usage logs found"
            emptyDescription="The backend returned no AI usage rows."
          />
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

function AiModulesPage() {
  const modules = useAsyncData(() => aiApi.listModules(), []);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleToggle = async (moduleId: string) => {
    setUpdatingId(moduleId);
    try {
      await aiApi.toggleModule(moduleId);
      toast.success('AI module updated.');
      modules.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <PageShell
      title="AI Modules"
      description="Platform AI modules now come from the backend instead of `aiMockData.ts`."
      badge="Super Admin AI"
    >
      <SectionCard title="Modules">
        {modules.loading ? <LoadingState label="AI modules" /> : null}
        {modules.error ? <ErrorState error={modules.error} onRetry={modules.refetch} /> : null}
        {modules.data ? (
          <DataTable<AiModuleRecord>
            columns={[
              { key: 'name', header: 'Module', render: (item) => item.name },
              { key: 'key', header: 'Key', render: (item) => item.key },
              { key: 'description', header: 'Description', render: (item) => item.description ?? '-' },
              { key: 'isEnabled', header: 'Status', render: (item) => <Badge variant={item.isEnabled ? 'success' : 'destructive'}>{item.isEnabled ? 'ENABLED' : 'DISABLED'}</Badge> },
              {
                key: 'actions',
                header: 'Actions',
                render: (item) => (
                  <Button size="sm" variant="outline" disabled={updatingId === item.id} onClick={() => void handleToggle(item.id)}>
                    {updatingId === item.id ? 'Updating...' : item.isEnabled ? 'Disable' : 'Enable'}
                  </Button>
                ),
              },
            ]}
            rows={modules.data}
            emptyTitle="No AI modules found"
            emptyDescription="The backend returned no AI modules."
          />
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

function SchoolAdminReportsPage() {
  const summary = useAsyncData(() => reportsApi.getSchoolSummary(), []);
  const attendance = useAsyncData(() => reportsApi.getAttendance(), []);
  const quizzes = useAsyncData(() => reportsApi.getQuiz(), []);
  const homework = useAsyncData(() => reportsApi.getHomework(), []);

  return (
    <PageShell
      title="Reports"
      description="School reports now use the live reports APIs instead of demo charts and rows."
      badge="School Admin"
    >
      <SectionCard title="School Summary">
        {summary.loading ? <LoadingState label="school summary" /> : null}
        {summary.error ? <ErrorState error={summary.error} onRetry={summary.refetch} /> : null}
        {summary.data ? (
          <MetricGrid
            metrics={Object.entries((summary.data as SchoolSummaryReport).metrics).map(([label, value]) => ({
              label: formatLabel(label),
              value,
            }))}
          />
        ) : null}
      </SectionCard>
      <SectionCard title="Attendance Sessions">
        {attendance.loading ? <LoadingState label="attendance report" /> : null}
        {attendance.error ? <ErrorState error={attendance.error} onRetry={attendance.refetch} /> : null}
        {attendance.data ? (
          <DataTable<AttendanceSessionRecord>
            columns={[
              { key: 'date', header: 'Date', render: (item) => formatDate(item.date) },
              { key: 'class', header: 'Class', render: (item) => item.class?.name ?? '-' },
              { key: 'section', header: 'Section', render: (item) => item.section?.name ?? '-' },
              { key: 'status', header: 'Status', render: (item) => <Badge variant={statusVariant(item.status)}>{item.status ?? 'UNKNOWN'}</Badge> },
            ]}
            rows={attendance.data}
            emptyTitle="No attendance report rows"
            emptyDescription="No attendance report rows were returned."
          />
        ) : null}
      </SectionCard>
      <SectionCard title="Quiz Report">
        {quizzes.loading ? <LoadingState label="quiz report" /> : null}
        {quizzes.error ? <ErrorState error={quizzes.error} onRetry={quizzes.refetch} /> : null}
        {quizzes.data ? (
          <DataTable<QuizReportRecord>
            columns={[
              { key: 'title', header: 'Quiz', render: (item) => item.title ?? '-' },
              { key: 'subject', header: 'Subject', render: (item) => item.subject?.name ?? '-' },
              { key: 'status', header: 'Status', render: (item) => <Badge variant={statusVariant(item.status)}>{item.status ?? 'UNKNOWN'}</Badge> },
              { key: 'attempts', header: 'Attempts', render: (item) => formatValue(item._count?.attempts) },
            ]}
            rows={quizzes.data}
            emptyTitle="No quizzes found"
            emptyDescription="No quiz report rows were returned."
          />
        ) : null}
      </SectionCard>
      <SectionCard title="Homework Report">
        {homework.loading ? <LoadingState label="homework report" /> : null}
        {homework.error ? <ErrorState error={homework.error} onRetry={homework.refetch} /> : null}
        {homework.data ? (
          <DataTable<HomeworkReportRecord>
            columns={[
              { key: 'title', header: 'Homework', render: (item) => item.title ?? '-' },
              { key: 'subject', header: 'Subject', render: (item) => item.subject?.name ?? '-' },
              { key: 'dueDate', header: 'Due Date', render: (item) => formatDate(item.dueDate) },
              { key: 'submissions', header: 'Submissions', render: (item) => formatValue(item._count?.submissions) },
            ]}
            rows={homework.data}
            emptyTitle="No homework report rows"
            emptyDescription="No homework report rows were returned."
          />
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

function StudentPerformanceReportsPage() {
  const report = useAsyncData(() => reportsApi.getStudentPerformance(), []);

  return (
    <PageShell title="Student Reports" description="Principal student reports now use the live reports API." badge="Principal">
      <SectionCard title="Student Performance">
        {report.loading ? <LoadingState label="student performance" /> : null}
        {report.error ? <ErrorState error={report.error} onRetry={report.refetch} /> : null}
        {report.data ? (
          <DataTable<StudentPerformanceReportRow>
            columns={[
              { key: 'fullName', header: 'Student', render: (item) => item.fullName },
              { key: 'studentId', header: 'User ID', render: (item) => item.studentId },
              { key: 'summary', header: 'Summary', render: (item) => <RenderValue value={item.summary} /> },
            ]}
            rows={report.data}
            emptyTitle="No student performance data"
            emptyDescription="The backend returned no student performance rows."
          />
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

function TeacherPerformanceReportsPage() {
  const report = useAsyncData(() => reportsApi.getTeacherPerformance(), []);

  return (
    <PageShell title="Teacher Reports" description="Principal teacher reports now use the live reports API." badge="Principal">
      <SectionCard title="Teacher Performance">
        {report.loading ? <LoadingState label="teacher performance" /> : null}
        {report.error ? <ErrorState error={report.error} onRetry={report.refetch} /> : null}
        {report.data ? (
          <DataTable<TeacherPerformanceReportRow>
            columns={[
              { key: 'fullName', header: 'Teacher', render: (item) => item.fullName },
              { key: 'teacherId', header: 'User ID', render: (item) => item.teacherId },
              { key: 'summary', header: 'Summary', render: (item) => <RenderValue value={item.summary} /> },
            ]}
            rows={report.data}
            emptyTitle="No teacher performance data"
            emptyDescription="The backend returned no teacher performance rows."
          />
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

function AttendanceReportsPage() {
  const report = useAsyncData(() => reportsApi.getAttendance(), []);

  return (
    <PageShell title="Attendance Reports" description="Principal attendance reports now use the live reports API." badge="Principal">
      <SectionCard title="Attendance Report">
        {report.loading ? <LoadingState label="attendance report" /> : null}
        {report.error ? <ErrorState error={report.error} onRetry={report.refetch} /> : null}
        {report.data ? (
          <DataTable<AttendanceSessionRecord>
            columns={[
              { key: 'date', header: 'Date', render: (item) => formatDate(item.date) },
              { key: 'class', header: 'Class', render: (item) => item.class?.name ?? '-' },
              { key: 'teacher', header: 'Teacher', render: (item) => item.teacher?.user?.fullName ?? '-' },
              { key: 'status', header: 'Status', render: (item) => <Badge variant={statusVariant(item.status)}>{item.status ?? 'UNKNOWN'}</Badge> },
            ]}
            rows={report.data}
            emptyTitle="No attendance rows"
            emptyDescription="The backend returned no attendance rows."
          />
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

function QuizReportsPage() {
  const report = useAsyncData(() => reportsApi.getQuiz(), []);

  return (
    <PageShell title="Quiz Reports" description="Principal quiz reports now use the live reports API." badge="Principal">
      <SectionCard title="Quiz Report">
        {report.loading ? <LoadingState label="quiz report" /> : null}
        {report.error ? <ErrorState error={report.error} onRetry={report.refetch} /> : null}
        {report.data ? (
          <DataTable<QuizReportRecord>
            columns={[
              { key: 'title', header: 'Quiz', render: (item) => item.title ?? '-' },
              { key: 'subject', header: 'Subject', render: (item) => item.subject?.name ?? '-' },
              { key: 'questions', header: 'Questions', render: (item) => formatValue(item._count?.questions) },
              { key: 'attempts', header: 'Attempts', render: (item) => formatValue(item._count?.attempts) },
            ]}
            rows={report.data}
            emptyTitle="No quiz rows"
            emptyDescription="The backend returned no quiz rows."
          />
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

function HomeworkReportsPage() {
  const report = useAsyncData(() => reportsApi.getHomework(), []);

  return (
    <PageShell title="Homework Reports" description="Principal homework reports now use the live reports API." badge="Principal">
      <SectionCard title="Homework Report">
        {report.loading ? <LoadingState label="homework report" /> : null}
        {report.error ? <ErrorState error={report.error} onRetry={report.refetch} /> : null}
        {report.data ? (
          <DataTable<HomeworkReportRecord>
            columns={[
              { key: 'title', header: 'Homework', render: (item) => item.title ?? '-' },
              { key: 'subject', header: 'Subject', render: (item) => item.subject?.name ?? '-' },
              { key: 'dueDate', header: 'Due Date', render: (item) => formatDate(item.dueDate) },
              { key: 'submissions', header: 'Submissions', render: (item) => formatValue(item._count?.submissions) },
            ]}
            rows={report.data}
            emptyTitle="No homework rows"
            emptyDescription="The backend returned no homework rows."
          />
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

function TeacherStudentPerformancePage() {
  const { user } = useAuth();
  const summary = useAsyncData(
    () => (user ? progressApi.getTeacherSummary(user.id) : Promise.resolve({} as GenericObject)),
    [user?.id],
  );

  return (
    <PageShell
      title="Student Performance"
      description="Teacher performance insights now come from the backend progress API."
      badge="Teacher"
    >
      <SectionCard title="Teacher Summary">
        {summary.loading ? <LoadingState label="teacher progress" /> : null}
        {summary.error ? <ErrorState error={summary.error} onRetry={summary.refetch} /> : null}
        {summary.data ? <ObjectSummary title="Teacher Progress" data={summary.data} /> : null}
      </SectionCard>
    </PageShell>
  );
}

function UserProfilePage({
  role,
  includeProgress = false,
  includeChildrenProgress = false,
}: {
  role: 'teacher' | 'student' | 'parent';
  includeProgress?: boolean;
  includeChildrenProgress?: boolean;
}) {
  const profile = useAsyncData(() => usersApi.getProfile(), [role]);
  const myProgress = useAsyncData(
    () => (includeProgress ? progressApi.getMyProgress() : Promise.resolve(null)),
    [includeProgress],
  );
  const childrenProgress = useAsyncData(
    () => (includeChildrenProgress ? progressApi.getChildrenProgress() : Promise.resolve([] as ChildProgressRecord[])),
    [includeChildrenProgress],
  );

  return (
    <PageShell
      title="Profile"
      description="This profile route now uses the backend user profile API."
      badge={formatLabel(role)}
    >
      <SectionCard title="User Profile">
        {profile.loading ? <LoadingState label="profile" /> : null}
        {profile.error ? <ErrorState error={profile.error} onRetry={profile.refetch} /> : null}
        {profile.data ? (
          <ObjectSummary
            title="User Profile"
            data={{
              fullName: profile.data.fullName,
              email: profile.data.email,
              phone: profile.data.phone,
              role: profile.data.role,
              organizationId: profile.data.organizationId,
              avatarUrl: profile.data.profile?.avatarUrl,
              gender: profile.data.profile?.gender,
              dateOfBirth: profile.data.profile?.dateOfBirth,
              address: profile.data.profile?.address,
            }}
          />
        ) : null}
      </SectionCard>

      {includeProgress ? (
        <SectionCard title="Progress Snapshot">
          {myProgress.loading ? <LoadingState label="progress" /> : null}
          {myProgress.error ? <ErrorState error={myProgress.error} onRetry={myProgress.refetch} /> : null}
          {myProgress.data ? <ObjectSummary title="Progress Snapshot" data={myProgress.data as GenericObject} /> : null}
        </SectionCard>
      ) : null}

      {includeChildrenProgress ? (
        <SectionCard title="Linked Children Progress">
          {childrenProgress.loading ? <LoadingState label="children progress" /> : null}
          {childrenProgress.error ? <ErrorState error={childrenProgress.error} onRetry={childrenProgress.refetch} /> : null}
          {childrenProgress.data ? (
            <DataTable<ChildProgressRecord>
              columns={[
                { key: 'fullName', header: 'Child', render: (item) => item.fullName },
                { key: 'studentId', header: 'Student ID', render: (item) => item.studentId },
                { key: 'summary', header: 'Summary', render: (item) => <RenderValue value={item.summary} /> },
              ]}
              rows={childrenProgress.data}
              emptyTitle="No linked children"
              emptyDescription="The backend returned no linked child progress."
            />
          ) : null}
        </SectionCard>
      ) : null}
    </PageShell>
  );
}

function ParentFeesPage() {
  const fees = useAsyncData(() => billingApi.getParentChildrenFees(), []);
  const invoices = useAsyncData(() => billingApi.getParentInvoices(), []);

  return (
    <PageShell
      title="Fees"
      description="Parent fee data now uses the live billing endpoints instead of static cards."
      badge="Parent"
    >
      <SectionCard title="Children Fee Summary">
        {fees.loading ? <LoadingState label="children fees" /> : null}
        {fees.error ? <ErrorState error={fees.error} onRetry={fees.refetch} /> : null}
        {fees.data ? (
          <DataTable<ParentFeeRecord>
            columns={[
              { key: 'studentName', header: 'Student', render: (item) => item.studentName ?? '-' },
              { key: 'className', header: 'Class', render: (item) => `${item.className ?? '-'} ${item.sectionName ?? ''}`.trim() },
              { key: 'pendingInvoices', header: 'Pending Invoices', render: (item) => formatValue(item.pendingInvoices) },
              { key: 'totalPendingAmount', header: 'Pending Amount', render: (item) => formatValue(item.totalPendingAmount) },
            ]}
            rows={fees.data}
            emptyTitle="No child fee summaries found"
            emptyDescription="The backend returned no child fee data."
          />
        ) : null}
      </SectionCard>

      <SectionCard title="Invoices">
        {invoices.loading ? <LoadingState label="parent invoices" /> : null}
        {invoices.error ? <ErrorState error={invoices.error} onRetry={invoices.refetch} /> : null}
        {invoices.data ? (
          <DataTable<InvoiceRecord>
            columns={[
              { key: 'invoiceNumber', header: 'Invoice', render: (item) => item.invoiceNumber ?? item.id },
              { key: 'amount', header: 'Amount', render: (item) => formatValue(item.totalAmount) },
              { key: 'status', header: 'Status', render: (item) => <Badge variant={statusVariant(item.status)}>{item.status ?? 'UNKNOWN'}</Badge> },
              { key: 'dueDate', header: 'Due Date', render: (item) => formatDate(item.dueDate) },
            ]}
            rows={invoices.data}
            emptyTitle="No invoices found"
            emptyDescription="The backend returned no parent invoices."
          />
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

function ParentAiProgressPage() {
  const progress = useAsyncData(() => progressApi.getChildrenProgress(), []);

  return (
    <PageShell
      title="AI Progress Summary"
      description="This route now shows live child progress data instead of hardcoded AI summary cards."
      badge="Parent"
    >
      <SectionCard title="Children Progress">
        {progress.loading ? <LoadingState label="children progress" /> : null}
        {progress.error ? <ErrorState error={progress.error} onRetry={progress.refetch} /> : null}
        {progress.data ? (
          <DataTable<ChildProgressRecord>
            columns={[
              { key: 'fullName', header: 'Child', render: (item) => item.fullName },
              { key: 'studentId', header: 'Student ID', render: (item) => item.studentId },
              { key: 'summary', header: 'Summary', render: (item) => <RenderValue value={item.summary} /> },
            ]}
            rows={progress.data}
            emptyTitle="No progress data found"
            emptyDescription="The backend returned no child progress rows."
          />
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

function AccountantInvoicesView() {
  const invoices = useAsyncData(() => billingApi.getAccountantFeeInvoices({ page: 1, limit: 25 }), []);

  return (
    <PageShell title="Fee Invoices" description="Accountant invoice data now uses the live backend API." badge="Accountant">
      <SectionCard title="Invoices">
        {invoices.loading ? <LoadingState label="fee invoices" /> : null}
        {invoices.error ? <ErrorState error={invoices.error} onRetry={invoices.refetch} /> : null}
        {invoices.data ? (
          <DataTable<InvoiceRecord>
            columns={[
              { key: 'invoiceNumber', header: 'Invoice', render: (item) => item.invoiceNumber ?? item.id },
              { key: 'plan', header: 'Plan', render: (item) => item.subscription?.plan?.name ?? '-' },
              { key: 'amount', header: 'Amount', render: (item) => formatValue(item.totalAmount) },
              { key: 'status', header: 'Status', render: (item) => <Badge variant={statusVariant(item.status)}>{item.status ?? 'UNKNOWN'}</Badge> },
              { key: 'dueDate', header: 'Due Date', render: (item) => formatDate(item.dueDate) },
            ]}
            rows={invoices.data.items}
            emptyTitle="No fee invoices found"
            emptyDescription="The backend returned no fee invoices."
          />
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

function AccountantPaymentsView() {
  const payments = useAsyncData(() => billingApi.getAccountantPayments({ page: 1, limit: 25 }), []);

  return (
    <PageShell title="Payments" description="Accountant payment data now uses the live backend API." badge="Accountant">
      <SectionCard title="Payments">
        {payments.loading ? <LoadingState label="payments" /> : null}
        {payments.error ? <ErrorState error={payments.error} onRetry={payments.refetch} /> : null}
        {payments.data ? (
          <DataTable<PaymentRecord>
            columns={[
              { key: 'id', header: 'Payment ID', render: (item) => item.id },
              { key: 'amount', header: 'Amount', render: (item) => formatValue(item.amount) },
              { key: 'status', header: 'Status', render: (item) => <Badge variant={statusVariant(item.status)}>{item.status ?? 'UNKNOWN'}</Badge> },
              { key: 'gateway', header: 'Gateway', render: (item) => item.gateway ?? '-' },
              { key: 'createdAt', header: 'Created', render: (item) => formatDate(item.createdAt) },
            ]}
            rows={payments.data.items}
            emptyTitle="No payments found"
            emptyDescription="The backend returned no payment rows."
          />
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

function AccountantPendingFeesView() {
  const invoices = useAsyncData(() => billingApi.getAccountantPendingFees(), []);

  return (
    <PageShell title="Pending Fees" description="Pending fee data now uses the live backend API." badge="Accountant">
      <SectionCard title="Pending Fee Invoices">
        {invoices.loading ? <LoadingState label="pending fees" /> : null}
        {invoices.error ? <ErrorState error={invoices.error} onRetry={invoices.refetch} /> : null}
        {invoices.data ? (
          <DataTable<InvoiceRecord>
            columns={[
              { key: 'invoiceNumber', header: 'Invoice', render: (item) => item.invoiceNumber ?? item.id },
              { key: 'amount', header: 'Amount', render: (item) => formatValue(item.totalAmount) },
              { key: 'status', header: 'Status', render: (item) => <Badge variant={statusVariant(item.status)}>{item.status ?? 'UNKNOWN'}</Badge> },
              { key: 'dueDate', header: 'Due Date', render: (item) => formatDate(item.dueDate) },
            ]}
            rows={invoices.data}
            emptyTitle="No pending fee invoices found"
            emptyDescription="The backend returned no pending fee invoices."
          />
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

function AccountantReceiptsView() {
  const receipts = useAsyncData(() => billingApi.getAccountantReceipts(), []);

  return (
    <PageShell title="Receipts" description="Receipt data now uses the live backend API." badge="Accountant">
      <SectionCard title="Successful Payments">
        {receipts.loading ? <LoadingState label="receipts" /> : null}
        {receipts.error ? <ErrorState error={receipts.error} onRetry={receipts.refetch} /> : null}
        {receipts.data ? (
          <DataTable<PaymentRecord>
            columns={[
              { key: 'id', header: 'Receipt', render: (item) => item.id },
              { key: 'amount', header: 'Amount', render: (item) => formatValue(item.amount) },
              { key: 'invoice', header: 'Invoice', render: (item) => item.invoice?.invoiceNumber ?? item.invoice?.id ?? '-' },
              { key: 'status', header: 'Status', render: (item) => <Badge variant={statusVariant(item.status)}>{item.status ?? 'UNKNOWN'}</Badge> },
              { key: 'createdAt', header: 'Created', render: (item) => formatDate(item.createdAt) },
            ]}
            rows={receipts.data}
            emptyTitle="No receipts found"
            emptyDescription="The backend returned no receipts."
          />
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

function AccountantReportsView() {
  const reports = useAsyncData(() => billingApi.getAccountantReports(), []);

  const totals = useMemo(
    () =>
      reports.data
        ? Object.entries((reports.data as AccountantReportsResponse).totals).map(([label, value]) => ({
            label: formatLabel(label),
            value,
          }))
        : [],
    [reports.data],
  );

  return (
    <PageShell title="Finance Reports" description="Finance report data now uses the live backend API." badge="Accountant">
      <SectionCard title="Totals">
        {reports.loading ? <LoadingState label="accountant reports" /> : null}
        {reports.error ? <ErrorState error={reports.error} onRetry={reports.refetch} /> : null}
        {reports.data ? <MetricGrid metrics={totals} /> : null}
      </SectionCard>
      {reports.data ? (
        <>
          <SectionCard title="By Invoice Status">
            <ObjectSummary title="Invoice Status Breakdown" data={(reports.data as AccountantReportsResponse).byInvoiceStatus} />
          </SectionCard>
          <SectionCard title="By Payment Status">
            <ObjectSummary title="Payment Status Breakdown" data={(reports.data as AccountantReportsResponse).byPaymentStatus} />
          </SectionCard>
        </>
      ) : null}
    </PageShell>
  );
}

function AccountantRemindersView() {
  const pendingFees = useAsyncData(() => billingApi.getAccountantPendingFees(), []);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const sendReminders = async () => {
    setSending(true);
    try {
      const response = await billingApi.sendAccountantReminders(
        message.trim() ? { message: message.trim() } : {},
      );
      toast.success(`${response.message} Recipients: ${response.recipients}.`);
      pendingFees.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <PageShell title="Reminders" description="Reminder sending now uses the live backend billing reminder endpoint." badge="Accountant">
      <SectionCard title="Send Billing Reminders" description="Send reminders to parents with pending or overdue invoices.">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Optional message override</label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-[120px] w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm outline-none"
              placeholder="Leave blank to use the backend default message."
            />
          </div>
          <Button onClick={() => void sendReminders()} disabled={sending}>
            {sending ? 'Sending...' : 'Send Reminders'}
          </Button>
        </div>
      </SectionCard>
      <SectionCard title="Pending Invoices">
        {pendingFees.loading ? <LoadingState label="pending invoices" /> : null}
        {pendingFees.error ? <ErrorState error={pendingFees.error} onRetry={pendingFees.refetch} /> : null}
        {pendingFees.data ? (
          <DataTable<InvoiceRecord>
            columns={[
              { key: 'invoiceNumber', header: 'Invoice', render: (item) => item.invoiceNumber ?? item.id },
              { key: 'amount', header: 'Amount', render: (item) => formatValue(item.totalAmount) },
              { key: 'status', header: 'Status', render: (item) => <Badge variant={statusVariant(item.status)}>{item.status ?? 'UNKNOWN'}</Badge> },
              { key: 'dueDate', header: 'Due Date', render: (item) => formatDate(item.dueDate) },
            ]}
            rows={pendingFees.data}
            emptyTitle="No pending invoices"
            emptyDescription="There are no pending or overdue invoices right now."
          />
        ) : null}
      </SectionCard>
    </PageShell>
  );
}

export function SuperAdminSchoolsPage() {
  return <OrganizationsPage />;
}

export function SuperAdminSubscriptionPlansPage() {
  return <PlanManagementPage />;
}

export function SuperAdminBillingPageRoute() {
  return <SuperAdminBillingPage />;
}

export function SuperAdminReportsPage() {
  return (
    <UnsupportedBackendPage
      title="Reports"
      description="There is no super-admin reports endpoint or supported role access for the current reports module."
    />
  );
}

export function SuperAdminAiModulesPage() {
  return <AiModulesPage />;
}

export function SuperAdminAiUsagePage() {
  return <AiUsagePage role="super-admin" />;
}

export function SchoolAdminAttendancePage() {
  return <AttendanceOverviewPage role="school-admin" />;
}

export function TeacherAttendancePage() {
  return <AttendanceOverviewPage role="teacher" />;
}

export function SchoolAdminReportsPageRoute() {
  return <SchoolAdminReportsPage />;
}

export function SchoolAdminSourceLibraryPage() {
  return <SourceLibraryPage role="school-admin" />;
}

export function TeacherSourceLibraryPage() {
  return <SourceLibraryPage role="teacher" />;
}

export function SchoolAdminAiSettingsPage() {
  return <AiSettingsPage />;
}

export function SchoolAdminAiUsagePage() {
  return <AiUsagePage role="school-admin" />;
}

export function PrincipalStudentReportsPage() {
  return <StudentPerformanceReportsPage />;
}

export function PrincipalTeacherReportsPage() {
  return <TeacherPerformanceReportsPage />;
}

export function PrincipalAttendanceReportsPage() {
  return <AttendanceReportsPage />;
}

export function PrincipalQuizReportsPage() {
  return <QuizReportsPage />;
}

export function PrincipalHomeworkReportsPage() {
  return <HomeworkReportsPage />;
}

export function TeacherStudentPerformancePageRoute() {
  return <TeacherStudentPerformancePage />;
}

export function TeacherProfilePage() {
  return <UserProfilePage role="teacher" />;
}

export function StudentAttendancePageRoute() {
  return <StudentAttendanceView />;
}

export function StudentProfilePage() {
  return <UserProfilePage role="student" includeProgress />;
}

export function ParentAttendancePageRoute() {
  return <ParentAttendanceView />;
}

export function ParentFeesPageRoute() {
  return <ParentFeesPage />;
}

export function ParentAiProgressPageRoute() {
  return <ParentAiProgressPage />;
}

export function ParentProfilePage() {
  return <UserProfilePage role="parent" includeChildrenProgress />;
}

export function AccountantFeeInvoicesPage() {
  return <AccountantInvoicesView />;
}

export function AccountantPaymentsPage() {
  return <AccountantPaymentsView />;
}

export function AccountantPendingFeesPage() {
  return <AccountantPendingFeesView />;
}

export function AccountantReceiptsPage() {
  return <AccountantReceiptsView />;
}

export function AccountantReportsPageRoute() {
  return <AccountantReportsView />;
}

export function AccountantRemindersPage() {
  return <AccountantRemindersView />;
}
