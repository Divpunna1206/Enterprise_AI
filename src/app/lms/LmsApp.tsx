import { FormEvent, ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router';
import {
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  CalendarCheck2,
  ChartColumn,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  CircleDollarSign,
  ClipboardCheck,
  CreditCard,
  FileBarChart2,
  FileCheck2,
  FileText,
  GalleryVerticalEnd,
  GraduationCap,
  Home,
  Layers3,
  LayoutGrid,
  Library,
  LockKeyhole,
  LogOut,
  NotebookPen,
  PlayCircle,
  Receipt,
  School,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  UserSquare2,
  Wallet,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { StatCard } from '../components/ui/StatCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import {
  ChartConfig,
  DetailCard,
  FormField,
  FormSection,
  Role,
  ScreenSpec,
  allScreens,
  brand,
  demoRoles,
  fullRouteList,
  roleScreens,
} from './mockData';

type TableRowsByPath = Record<string, string[][]>;
type CardsByPath = Record<string, DetailCard[]>;

interface DemoSession {
  isAuthenticated: boolean;
  activeRole: Role | null;
}

interface DemoAppContextValue {
  cardsByPath: CardsByPath;
  session: DemoSession;
  tableRowsByPath: TableRowsByPath;
  logout: () => void;
  openAction: (label: string, currentPath?: string) => void;
  setAuthenticated: (value: boolean) => void;
  setRole: (role: Role) => void;
  submitForm: (screen: ScreenSpec, formData: FormData) => void;
}

const DEMO_STORAGE_KEY = 'isparx-lms-demo-state-v1';

const actionRouteMap: Record<string, string> = {
  'Create New School': '/super-admin/schools/create',
  'Add Subscription Plan': '/super-admin/subscription-plans',
  'View Billing': '/super-admin/billing',
  'Export Report': '/super-admin/reports',
  'Create Academic Year': '/school-admin/academic-years',
  'Add Teacher': '/school-admin/teachers',
  'Add Student': '/school-admin/students',
  'Add Subject': '/school-admin/subjects',
  'Create Notice': '/school-admin/notices',
  'View Reports': '/principal/student-reports',
  'Send Notice': '/principal/notices',
  'View Low Performing Students': '/principal/student-reports',
  'Upload Video': '/teacher/videos/upload',
  'Create Homework': '/teacher/homework/create',
  'Create Quiz': '/teacher/quizzes/create',
  'Mark Attendance': '/teacher/attendance',
};

const DemoAppContext = createContext<DemoAppContextValue | null>(null);

function makeDefaultTableRowsByPath(): TableRowsByPath {
  return allScreens.reduce<TableRowsByPath>((accumulator, screen) => {
    if (screen.table) {
      accumulator[screen.path] = screen.table.rows.map((row) => [...row]);
    }
    return accumulator;
  }, {});
}

function makeDefaultCardsByPath(): CardsByPath {
  return allScreens.reduce<CardsByPath>((accumulator, screen) => {
    if (screen.cards) {
      accumulator[screen.path] = screen.cards.map((card) => ({ ...card }));
    }
    return accumulator;
  }, {});
}

function normalizeKey(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function readText(formData: FormData, label: string, fallback = '-') {
  const value = formData.get(label);
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
}

function readBool(formData: FormData, label: string) {
  return formData.get(label) !== null;
}

function resolveActionRoute(label: string, currentPath?: string) {
  if (actionRouteMap[label]) return actionRouteMap[label];
  if (currentPath && currentPath.includes('/dashboard')) {
    const base = currentPath.replace(/\/dashboard$/, '');
    const normalized = normalizeKey(label);
    if (normalized.includes('teacher')) return `${base}/teachers`;
    if (normalized.includes('student')) return `${base}/students`;
    if (normalized.includes('subject')) return `${base}/subjects`;
    if (normalized.includes('notice')) return `${base}/notices`;
    if (normalized.includes('report')) return `${base}/reports`;
  }
  return currentPath ?? '/role-detection';
}

function useDemoApp() {
  const context = useContext(DemoAppContext);
  if (!context) {
    throw new Error('Demo app context is missing.');
  }
  return context;
}

const roleMeta: Record<
  Role,
  {
    label: string;
    basePath: string;
    schoolName?: string;
    topbarNote?: string;
    mobile: boolean;
  }
> = {
  'super-admin': {
    label: 'iSparx Super Admin',
    basePath: '/super-admin',
    topbarNote: 'Platform owner workspace',
    mobile: false,
  },
  'school-admin': {
    label: 'School Admin',
    basePath: '/school-admin',
    schoolName: 'Green Valley Public School',
    topbarNote: 'Current academic year: 2026-2027',
    mobile: false,
  },
  principal: {
    label: 'Principal',
    basePath: '/principal',
    schoolName: 'Green Valley Public School',
    topbarNote: 'Read-only insight workspace',
    mobile: false,
  },
  teacher: {
    label: 'Teacher',
    basePath: '/teacher',
    schoolName: 'Green Valley Public School',
    topbarNote: 'Assigned teaching workspace',
    mobile: false,
  },
  student: {
    label: 'Student',
    basePath: '/student',
    schoolName: 'Green Valley Public School',
    topbarNote: 'Mobile learning experience',
    mobile: true,
  },
  parent: {
    label: 'Parent',
    basePath: '/parent',
    schoolName: 'Green Valley Public School',
    topbarNote: 'Mobile family companion',
    mobile: true,
  },
  accountant: {
    label: 'Accountant',
    basePath: '/accountant',
    schoolName: 'Green Valley Public School',
    topbarNote: 'Finance operations workspace',
    mobile: false,
  },
};

function DemoAppProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [tableRowsByPath, setTableRowsByPath] = useState<TableRowsByPath>(() => makeDefaultTableRowsByPath());
  const [cardsByPath, setCardsByPath] = useState<CardsByPath>(() => makeDefaultCardsByPath());
  const [session, setSession] = useState<DemoSession>({ isAuthenticated: false, activeRole: null });

  useEffect(() => {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<{
        cardsByPath: CardsByPath;
        session: DemoSession;
        tableRowsByPath: TableRowsByPath;
      }>;

      if (parsed.tableRowsByPath) {
        setTableRowsByPath({ ...makeDefaultTableRowsByPath(), ...parsed.tableRowsByPath });
      }
      if (parsed.cardsByPath) {
        setCardsByPath({ ...makeDefaultCardsByPath(), ...parsed.cardsByPath });
      }
      if (parsed.session) {
        setSession(parsed.session);
      }
    } catch {
      window.localStorage.removeItem(DEMO_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      DEMO_STORAGE_KEY,
      JSON.stringify({
        cardsByPath,
        session,
        tableRowsByPath,
      }),
    );
  }, [cardsByPath, session, tableRowsByPath]);

  const logout = () => {
    setSession({ isAuthenticated: false, activeRole: null });
    navigate('/login');
  };

  const setAuthenticated = (value: boolean) => {
    setSession((current) => ({ ...current, isAuthenticated: value }));
  };

  const setRole = (role: Role) => {
    setSession({ isAuthenticated: true, activeRole: role });
  };

  const openAction = (label: string, currentPath?: string) => {
    navigate(resolveActionRoute(label, currentPath));
  };

  const submitForm = (screen: ScreenSpec, formData: FormData) => {
    const path = screen.path;

    if (path === '/super-admin/schools/create') {
      const schoolName = readText(formData, 'School name', 'New Demo School');
      const subdomain = readText(formData, 'Subdomain', schoolName.toLowerCase().replace(/\s+/g, ''));
      const city = readText(formData, 'City');
      const contactPerson = readText(formData, 'Contact person');
      const contactNumber = readText(formData, 'Contact number');
      const plan = readText(formData, 'Plan', 'Standard');
      const studentLimit = readText(formData, 'Student limit', '500');
      const status = readBool(formData, 'Activate school') ? 'Active' : 'Draft';
      const expiry = readText(formData, 'End date', '31 Mar 2027');

      setTableRowsByPath((current) => ({
        ...current,
        '/super-admin/schools': [
          [schoolName, `${subdomain}.isparxlearn.com`, city, contactPerson, contactNumber, plan, studentLimit, status, expiry],
          ...(current['/super-admin/schools'] ?? []),
        ],
        '/super-admin/billing': [
          [schoolName, plan, 'Rs 0', 'Pending', expiry, `INV-${Date.now().toString().slice(-4)}`, 'Send Reminder'],
          ...(current['/super-admin/billing'] ?? []),
        ],
      }));
      return;
    }

    if (path === '/school-admin/academic-years') {
      const year = readText(formData, 'Academic year name', '2026-2027');
      const startDate = readText(formData, 'Start date', '01 Apr 2026');
      const endDate = readText(formData, 'End date', '31 Mar 2027');
      const status = readBool(formData, 'Make current') ? 'Active' : 'Draft';

      setTableRowsByPath((current) => ({
        ...current,
        '/school-admin/academic-years': [
          [year, startDate, endDate, status, 'Edit'],
          ...(current['/school-admin/academic-years'] ?? []),
        ],
      }));
      return;
    }

    if (path === '/school-admin/classes-sections') {
      const className = readText(formData, 'Class name', readText(formData, 'Select class', 'Class'));
      const sectionName = readText(formData, 'Section name', 'A');
      const teacher = readText(formData, 'Class teacher', 'Teacher TBD');
      const capacity = readText(formData, 'Capacity', '40');

      setCardsByPath((current) => ({
        ...current,
        '/school-admin/classes-sections': [
          {
            title: className,
            description: `Section ${sectionName} | Capacity ${capacity} | Class teacher ${teacher}`,
            tone: 'primary',
          },
          ...(current['/school-admin/classes-sections'] ?? []),
        ],
      }));
      return;
    }

    if (path === '/school-admin/teachers') {
      const name = readText(formData, 'Name', 'New Teacher');
      const mobile = readText(formData, 'Mobile');
      const email = readText(formData, 'Email');
      const employeeId = readText(formData, 'Employee ID', `TCH-${Date.now().toString().slice(-3)}`);
      const subject = readText(formData, 'Assign subject');
      const schoolClass = readText(formData, 'Assign class');
      const section = readText(formData, 'Assign section');
      const login = readBool(formData, 'Enable login') ? 'Enabled' : 'Pending';

      const row = [name, mobile, email, employeeId, subject, `${schoolClass}${section !== '-' ? ` ${section}` : ''}`.trim(), login, 'Active'];
      setTableRowsByPath((current) => ({
        ...current,
        '/school-admin/teachers': [row, ...(current['/school-admin/teachers'] ?? [])],
        '/principal/teacher-reports': [row, ...(current['/principal/teacher-reports'] ?? [])],
      }));
      return;
    }

    if (path === '/school-admin/students') {
      const studentName = readText(formData, 'Name', 'New Student');
      const studentId = readText(formData, 'Student ID', `STD-${Date.now().toString().slice(-3)}`);
      const rollNumber = readText(formData, 'Roll number', '-');
      const schoolClass = readText(formData, 'Class');
      const section = readText(formData, 'Section', 'A');
      const parentName = readText(formData, 'Parent name', 'Parent TBD');
      const parentRelation = readText(formData, 'Relation', 'Guardian');
      const parentMobile = readText(formData, 'Mobile');
      const parentEmail = readText(formData, 'Email');
      const parentLogin = readBool(formData, 'Enable parent login') ? 'Enabled' : 'Pending';

      setTableRowsByPath((current) => ({
        ...current,
        '/school-admin/students': [
          [studentName, studentId, rollNumber, schoolClass, section, parentName, 'Enabled', 'Active'],
          ...(current['/school-admin/students'] ?? []),
        ],
        '/school-admin/parents': [
          [parentName, parentRelation, parentMobile, parentEmail, studentName, `${schoolClass}${section}`, parentLogin],
          ...(current['/school-admin/parents'] ?? []),
        ],
      }));
      return;
    }

    if (path === '/school-admin/subjects') {
      const subjectName = readText(formData, 'Subject name', 'New Subject');
      const subjectCode = readText(formData, 'Subject code', `SUB-${Date.now().toString().slice(-3)}`);
      const schoolClass = readText(formData, 'Class');
      const teacher = readText(formData, 'Teacher');
      const status = readText(formData, 'Status', 'Active');

      setTableRowsByPath((current) => ({
        ...current,
        '/school-admin/subjects': [
          [subjectName, subjectCode, schoolClass, teacher, '0', status],
          ...(current['/school-admin/subjects'] ?? []),
        ],
      }));
      return;
    }

    if (path === '/school-admin/notices' || path === '/teacher/notices') {
      const title = readText(formData, 'Title', 'New Notice');
      const audience = readText(formData, 'Audience', 'All');
      const publishDate = readText(formData, 'Publish date', 'Today');
      const postedBy = path.includes('/teacher/') ? 'Teacher' : 'School Admin';

      const row = [title, audience, publishDate, postedBy, 'Published'];
      setTableRowsByPath((current) => ({
        ...current,
        '/school-admin/notices': [row, ...(current['/school-admin/notices'] ?? [])],
        '/teacher/notices': [row, ...(current['/teacher/notices'] ?? [])],
        '/principal/notices': [row, ...(current['/principal/notices'] ?? [])],
        '/student/announcements': [row, ...(current['/student/announcements'] ?? [])],
        '/parent/notices': [row, ...(current['/parent/notices'] ?? [])],
      }));
      return;
    }

    if (path === '/teacher/videos/upload') {
      const subject = readText(formData, 'Subject', 'Subject');
      const teacher = 'Teacher';
      const chapter = readText(formData, 'Chapter', 'New Chapter');
      const title = readText(formData, 'Video title', 'New Video');

      setCardsByPath((current) => ({
        ...current,
        '/teacher/courses': [
          {
            title: subject,
            description: `${chapter} | ${title} | 0% completion`,
            tone: 'primary',
          },
          ...(current['/teacher/courses'] ?? []),
        ],
        '/student/courses': [
          {
            title: subject,
            description: `Teacher: ${teacher} | New chapter added | Continue button ready`,
            tone: 'primary',
          },
          ...(current['/student/courses'] ?? []),
        ],
      }));
      return;
    }

    if (path === '/teacher/homework/create') {
      const title = readText(formData, 'Homework title', 'New Homework');
      const schoolClass = readText(formData, 'Class');
      const subject = readText(formData, 'Subject');
      const dueDate = readText(formData, 'Due date', 'This week');
      const marks = readText(formData, 'Total marks', '20');

      setTableRowsByPath((current) => ({
        ...current,
        '/school-admin/homework': [[title, schoolClass, subject, dueDate, marks, 'Assigned'], ...(current['/school-admin/homework'] ?? [])],
        '/principal/homework-reports': [[title, schoolClass, subject, dueDate, marks, 'Assigned'], ...(current['/principal/homework-reports'] ?? [])],
        '/student/homework': [[title, subject, dueDate, 'Pending', '-'], ...(current['/student/homework'] ?? [])],
        '/parent/homework': [[title, subject, dueDate, 'Pending', '-'], ...(current['/parent/homework'] ?? [])],
      }));
      return;
    }

    if (path === '/teacher/quizzes/create') {
      const title = readText(formData, 'Title', 'New Quiz');
      const schoolClass = readText(formData, 'Class');
      const subject = readText(formData, 'Subject');
      const schedule = readText(formData, 'Start date and time', 'Tomorrow');
      const marks = readText(formData, 'Total marks', '20');

      setTableRowsByPath((current) => ({
        ...current,
        '/school-admin/quizzes': [[title, schoolClass, subject, schedule, marks, 'Scheduled'], ...(current['/school-admin/quizzes'] ?? [])],
        '/principal/quiz-reports': [[title, schoolClass, subject, schedule, marks, 'Scheduled'], ...(current['/principal/quiz-reports'] ?? [])],
        '/student/quiz': [[subject, title, schedule, readText(formData, 'Duration', '30 min'), marks, 'Upcoming'], ...(current['/student/quiz'] ?? [])],
      }));

      setCardsByPath((current) => ({
        ...current,
        '/parent/quiz-results': [
          {
            title,
            description: `Upcoming on ${schedule} | Subject: ${subject}`,
            tone: 'primary',
          },
          ...(current['/parent/quiz-results'] ?? []),
        ],
      }));
      return;
    }

    if (path === '/student/homework/detail') {
      setTableRowsByPath((current) => ({
        ...current,
        '/student/homework': (current['/student/homework'] ?? []).map((row, index) =>
          index === 0 ? [row[0], row[1], row[2], 'Submitted', row[4]] : row,
        ),
        '/parent/homework': (current['/parent/homework'] ?? []).map((row, index) =>
          index === 0 ? [row[0], row[1], row[2], 'Submitted', 'Awaiting review'] : row,
        ),
      }));
      return;
    }

    if (path === '/student/quiz/attempt') {
      setCardsByPath((current) => ({
        ...current,
        '/student/quiz/result': [
          {
            title: 'Latest Attempt',
            description: 'Score 15 / 20 | Result generated from the latest frontend demo submission.',
            tone: 'success',
          },
          ...(current['/student/quiz/result'] ?? []),
        ],
      }));
    }
  };

  const value: DemoAppContextValue = {
    cardsByPath,
    session,
    tableRowsByPath,
    logout,
    openAction,
    setAuthenticated,
    setRole,
    submitForm,
  };

  return <DemoAppContext.Provider value={value}>{children}</DemoAppContext.Provider>;
}

function iconForPath(path: string) {
  if (path.includes('dashboard') || path.endsWith('/home')) return Home;
  if (path.includes('school')) return School;
  if (path.includes('subscription') || path.includes('plan')) return Layers3;
  if (path.includes('billing') || path.includes('payment')) return Wallet;
  if (path.includes('report')) return FileBarChart2;
  if (path.includes('setting')) return Settings;
  if (path.includes('academic')) return CalendarCheck2;
  if (path.includes('class')) return LayoutGrid;
  if (path.includes('teacher')) return Briefcase;
  if (path.includes('student')) return GraduationCap;
  if (path.includes('parent')) return Users;
  if (path.includes('subject')) return Library;
  if (path.includes('course')) return BookOpen;
  if (path.includes('video')) return PlayCircle;
  if (path.includes('homework')) return NotebookPen;
  if (path.includes('quiz')) return FileCheck2;
  if (path.includes('attendance')) return ClipboardCheck;
  if (path.includes('notice') || path.includes('announcement') || path.includes('notification')) return Bell;
  if (path.includes('invoice') || path.includes('receipt') || path.includes('fee')) return Receipt;
  if (path.includes('profile')) return UserSquare2;
  return FileText;
}

function toneBadgeVariant(tone?: DetailCard['tone']) {
  if (tone === 'success') return 'success';
  if (tone === 'warning') return 'warning';
  if (tone === 'destructive') return 'destructive';
  if (tone === 'secondary') return 'secondary';
  if (tone === 'primary') return 'primary';
  return 'muted';
}

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
        <GraduationCap className="h-6 w-6" />
      </div>
      <div>
        <p className="text-lg font-semibold text-foreground">{brand.name}</p>
        <p className="text-xs text-muted-foreground">White-label SaaS school platform</p>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: Role }) {
  return <Badge variant="secondary">{roleMeta[role].label}</Badge>;
}

function StatusBadge({ label }: { label: string }) {
  const normalized = label.toLowerCase();
  const variant =
    normalized.includes('active') || normalized.includes('paid') || normalized.includes('reviewed')
      ? 'success'
      : normalized.includes('pending') || normalized.includes('expiring') || normalized.includes('late')
        ? 'warning'
        : normalized.includes('overdue') || normalized.includes('inactive')
          ? 'destructive'
          : normalized.includes('live') || normalized.includes('published')
            ? 'primary'
            : 'muted';
  return <Badge variant={variant}>{label}</Badge>;
}

function PageHeader({
  title,
  description,
  role,
  actions,
  currentPath,
  hasForm,
}: {
  title: string;
  description: string;
  role: Role;
  actions?: ScreenSpec['quickActions'];
  currentPath?: string;
  hasForm?: boolean;
}) {
  const { openAction } = useDemoApp();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="space-y-2">
        <RoleBadge role={role} />
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="max-w-3xl text-sm text-muted-foreground md:text-base">{description}</p>
        </div>
      </div>
      {actions && actions.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {actions.slice(0, 2).map((action) => (
            <Button key={action.label} variant="outline" onClick={() => openAction(action.label, currentPath)}>
              {action.label}
            </Button>
          ))}
          {hasForm ? (
            <Button
              onClick={() => {
                document.getElementById('form-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              Create New
            </Button>
          ) : null}
        </div>
      ) : null}
      {(!actions || actions.length === 0) && hasForm ? (
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => {
              document.getElementById('form-workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            Create New
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function SectionCard({
  id,
  title,
  description,
  children,
  aside,
}: {
  id?: string;
  title: string;
  description?: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <Card id={id} className="overflow-hidden rounded-3xl border-white/60 bg-white/90 shadow-sm shadow-slate-200/60 backdrop-blur">
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

function QuickActionCard({
  label,
  description,
  currentPath,
}: {
  label: string;
  description: string;
  currentPath?: string;
}) {
  const { openAction } = useDemoApp();

  return (
    <Card className="rounded-3xl border-primary/10 bg-gradient-to-br from-primary/5 to-white transition-transform hover:-translate-y-0.5">
      <CardHeader>
        <CardTitle className="text-base">{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button variant="ghost" className="px-0 text-primary" onClick={() => openAction(label, currentPath)}>
          Open action
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}

function SearchFilterBar({ filters }: { filters: string[] }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          className="h-10 w-full rounded-2xl border border-input bg-background pl-9 pr-3 text-sm outline-none ring-0"
          placeholder="Search records"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Badge key={filter} variant="muted" className="rounded-full px-3 py-1.5">
            {filter}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function DataTable({ table }: { table: NonNullable<ScreenSpec['table']> }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100">
      <Table>
        <TableHeader>
          <TableRow>
            {table.columns.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.rows.map((row, rowIndex) => (
            <TableRow key={`${row[0]}-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <TableCell key={`${cell}-${cellIndex}`}>
                  {cellIndex === row.length - 1 &&
                  ['Active', 'Inactive', 'Pending', 'Paid', 'Overdue', 'Live', 'Published', 'Reviewed', 'Draft', 'Expiring Soon', 'Completed', 'Submitted'].some((label) =>
                    cell.includes(label),
                  ) ? (
                    <StatusBadge label={cell} />
                  ) : (
                    cell
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="rounded-3xl border-dashed border-slate-300 bg-slate-50/70">
      <CardContent className="flex flex-col items-center gap-3 px-6 py-10 text-center">
        <GalleryVerticalEnd className="h-10 w-10 text-primary" />
        <div>
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationCard({ card }: { card: DetailCard }) {
  return (
    <Card className="rounded-3xl border-white/70 bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">{card.title}</CardTitle>
            <CardDescription className="mt-1">{card.description}</CardDescription>
          </div>
          {card.tag ? <Badge variant={toneBadgeVariant(card.tone)}>{card.tag}</Badge> : null}
        </div>
      </CardHeader>
    </Card>
  );
}

function AttendanceCalendar() {
  const days = Array.from({ length: 30 }, (_, index) => {
    if ([6, 13, 20, 27].includes(index)) return 'warning';
    if ([8].includes(index)) return 'destructive';
    if ([15].includes(index)) return 'secondary';
    return 'success';
  });

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((tone, index) => (
        <div
          key={index}
          className={`flex h-10 items-center justify-center rounded-xl text-xs font-medium ${
            tone === 'success'
              ? 'bg-success/10 text-success'
              : tone === 'warning'
                ? 'bg-warning/10 text-warning'
                : tone === 'destructive'
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-secondary/10 text-secondary'
          }`}
        >
          {index + 1}
        </div>
      ))}
    </div>
  );
}

function ReportChartCard({ chart }: { chart: ChartConfig }) {
  const max = Math.max(...chart.data.map((item) => item.value), 1);

  return (
    <SectionCard title={chart.title} description={chart.description}>
      <div className="space-y-4">
        {chart.data.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{item.label}</span>
              <span className="text-muted-foreground">{item.value}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                style={{ width: `${(item.value / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function FileUploadBox({ label, helperText }: { label: string; helperText?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-foreground">{label}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {helperText ?? 'Upload progress placeholder with future backend integration.'}
          </p>
        </div>
        <Badge variant="primary">Upload</Badge>
      </div>
    </div>
  );
}

function renderField(field: FormField) {
  if (field.type === 'textarea') {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">{field.label}</label>
        <textarea
          name={field.label}
          className="min-h-28 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm outline-none"
          placeholder={field.placeholder}
        />
      </div>
    );
  }

  if (field.type === 'select') {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">{field.label}</label>
        <select
          name={field.label}
          defaultValue=""
          className="h-11 w-full rounded-2xl border border-input bg-background px-3 text-sm outline-none"
        >
          <option value="" disabled>
            Select option
          </option>
          {field.options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === 'toggle') {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-foreground">{field.label}</p>
          <p className="text-xs text-muted-foreground">
            {field.helperText ?? 'This toggle stays local until backend access control is connected.'}
          </p>
        </div>
        <input
          name={field.label}
          type="checkbox"
          className="h-5 w-5 rounded border border-slate-300 accent-[var(--color-primary)]"
        />
      </div>
    );
  }

  if (field.type === 'file') {
    return <FileUploadBox label={field.label} helperText={field.helperText} />;
  }

  return (
    <Input
      name={field.label}
      label={field.label}
      type={field.type === 'date' ? 'date' : 'text'}
      placeholder={field.placeholder}
    />
  );
}

function ConfirmModal({
  open,
  title,
  description,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4">
      <Card className="w-full max-w-md rounded-3xl">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Keep Reviewing
          </Button>
          <Button className="flex-1" onClick={onConfirm}>
            Confirm Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function InteractiveForm({
  screen,
}: {
  screen: ScreenSpec;
}) {
  const navigate = useNavigate();
  const { submitForm } = useDemoApp();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const requiredValue = Array.from(formData.entries()).find(([, value]) => String(value).trim() !== '');

    if (!requiredValue) {
      setError('Please fill at least one key field to continue the demo flow.');
      setSuccess(false);
      return;
    }

    setError('');
    if (screen.path === '/student/quiz/attempt') {
      setPendingFormData(formData);
      setConfirmOpen(true);
      return;
    }
    submitForm(screen, formData);
    setSuccess(true);
  };

  const confirmSubmit = () => {
    setConfirmOpen(false);
    if (pendingFormData) {
      submitForm(screen, pendingFormData);
      setPendingFormData(null);
    }
    setSuccess(true);
    if (screen.path === '/student/quiz/attempt') {
      navigate('/student/quiz/result');
    }
  };

  if (!screen.form || screen.form.length === 0) return null;

  return (
    <>
      <SectionCard
        id="form-workspace"
        title="Form Workspace"
        description="Frontend-only static form flow with mock validation, upload placeholders, and success states."
        aside={<Badge variant="muted">Backend ready structure</Badge>}
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          {screen.form.map((section) => (
            <div key={section.title} className="space-y-4 rounded-3xl border border-slate-100 bg-slate-50/60 p-5">
              <div>
                <h3 className="text-base font-semibold">{section.title}</h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {section.fields.map((field) => (
                  <div
                    key={`${section.title}-${field.label}`}
                    className={field.type === 'textarea' || field.type === 'file' ? 'md:col-span-2' : undefined}
                  >
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {error ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}
          {success && screen.successMessage ? (
            <div className="rounded-2xl border border-success/20 bg-success/5 px-4 py-3 text-sm text-success">
              {screen.successMessage}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="button" variant="outline">
              Save Draft
            </Button>
            <Button type="submit">{screen.formSubmitLabel ?? 'Save Changes'}</Button>
          </div>
        </form>
      </SectionCard>
      <ConfirmModal
        open={confirmOpen}
        title="Submit Quiz?"
        description="Are you sure you want to submit this quiz?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmSubmit}
      />
    </>
  );
}

function WorkspacePage({ screen }: { screen: ScreenSpec }) {
  const { cardsByPath, tableRowsByPath } = useDemoApp();
  const resolvedScreen = useMemo(
    () => ({
      ...screen,
      cards: cardsByPath[screen.path] ?? screen.cards,
      table: screen.table
        ? {
            ...screen.table,
            rows: tableRowsByPath[screen.path] ?? screen.table.rows,
          }
        : undefined,
    }),
    [cardsByPath, screen, tableRowsByPath],
  );

  const hasCharts = Boolean(resolvedScreen.chart || resolvedScreen.secondaryChart);
  const showAttendanceCalendar =
    resolvedScreen.path.includes('/attendance') ||
    resolvedScreen.path === '/student/home' ||
    resolvedScreen.path === '/parent/home';

  return (
    <div className="space-y-6">
      {resolvedScreen.heroTitle ? (
        <Card className="overflow-hidden rounded-[28px] border-none bg-gradient-to-br from-primary via-[#1f6bff] to-secondary text-white shadow-xl shadow-primary/20">
          <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <Badge variant="secondary" className="bg-white/15 text-white border-white/20">
                Personalized Workspace
              </Badge>
              <h2 className="text-3xl font-semibold">{resolvedScreen.heroTitle}</h2>
              <p className="max-w-2xl text-sm text-white/80">{resolvedScreen.heroSubtitle}</p>
            </div>
            <div className="rounded-3xl bg-white/10 px-4 py-3 text-sm text-white/80 backdrop-blur">
              {resolvedScreen.description}
            </div>
          </CardContent>
        </Card>
      ) : null}

      <PageHeader
        title={resolvedScreen.title}
        description={resolvedScreen.description}
        role={resolvedScreen.role}
        actions={resolvedScreen.quickActions}
        currentPath={resolvedScreen.path}
        hasForm={Boolean(resolvedScreen.form)}
      />

      {resolvedScreen.metrics && resolvedScreen.metrics.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {resolvedScreen.metrics.map((metric) => (
            <StatCard
              key={metric.label}
              title={metric.label}
              value={metric.value}
              change={metric.change}
              changeType={
                metric.tone === 'destructive'
                  ? 'negative'
                  : metric.tone === 'success'
                    ? 'positive'
                    : 'neutral'
              }
              icon={ChartColumn}
              iconColor={
                metric.tone === 'success'
                  ? 'text-success'
                  : metric.tone === 'warning'
                    ? 'text-warning'
                    : metric.tone === 'secondary'
                      ? 'text-secondary'
                      : 'text-primary'
              }
            />
          ))}
        </div>
      ) : null}

      {resolvedScreen.quickActions && resolvedScreen.quickActions.length > 0 ? (
        <SectionCard title="Quick Actions" description="Common actions that explain how this role moves through the system.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {resolvedScreen.quickActions.map((action) => (
              <QuickActionCard key={action.label} label={action.label} description={action.description} currentPath={resolvedScreen.path} />
            ))}
          </div>
        </SectionCard>
      ) : null}

      {resolvedScreen.checklist && resolvedScreen.checklist.length > 0 ? (
        <SectionCard title="Setup Checklist" description="A practical onboarding flow for non-technical school owners and admins.">
          <div className="grid gap-3 md:grid-cols-2">
            {resolvedScreen.checklist.map((item, index) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </div>
                <p className="text-sm font-medium text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}

      {resolvedScreen.cards && resolvedScreen.cards.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resolvedScreen.cards.map((card) =>
            card.tag ? (
              <NotificationCard key={`${card.title}-${card.description}`} card={card} />
            ) : (
              <Card key={`${card.title}-${card.description}`} className="rounded-3xl border-white/70 bg-white shadow-sm">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{card.title}</CardTitle>
                      <CardDescription className="mt-1">{card.description}</CardDescription>
                    </div>
                    {card.value ? <Badge variant={toneBadgeVariant(card.tone)}>{card.value}</Badge> : null}
                  </div>
                </CardHeader>
              </Card>
            ),
          )}
        </div>
      ) : null}

      {hasCharts ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {resolvedScreen.chart ? <ReportChartCard chart={resolvedScreen.chart} /> : null}
          {resolvedScreen.secondaryChart ? <ReportChartCard chart={resolvedScreen.secondaryChart} /> : null}
        </div>
      ) : null}

      {showAttendanceCalendar ? (
        <SectionCard
          title="Attendance Calendar"
          description="Reusable attendance state for student, parent, teacher, and admin views."
          aside={<Badge variant="muted">Present / Late / Absent / Leave</Badge>}
        >
          <AttendanceCalendar />
        </SectionCard>
      ) : null}

      {resolvedScreen.filters && resolvedScreen.filters.length > 0 ? (
        <SectionCard title="Filters" description="Static filter controls ready for API wiring later.">
          <SearchFilterBar filters={resolvedScreen.filters} />
        </SectionCard>
      ) : null}

      {resolvedScreen.table ? (
        <SectionCard title="Data View" description="Realistic placeholder data with role-specific actions and statuses.">
          <DataTable table={resolvedScreen.table} />
        </SectionCard>
      ) : null}

      {resolvedScreen.tabs && resolvedScreen.tabs.length > 0 ? (
        <SectionCard title="Tabs" description="Preview the main content buckets users switch between most often.">
          <div className="flex flex-wrap gap-2">
            {resolvedScreen.tabs.map((tab, index) => (
              <Badge key={tab} variant={index === 0 ? 'primary' : 'muted'} className="rounded-full px-4 py-2">
                {tab}
              </Badge>
            ))}
          </div>
        </SectionCard>
      ) : null}

      {resolvedScreen.form ? <InteractiveForm screen={resolvedScreen} /> : null}

      {resolvedScreen.timeline && resolvedScreen.timeline.length > 0 ? (
        <SectionCard title="Recent Activity" description="Recent updates, signals, and next steps for this role.">
          <div className="space-y-4">
            {resolvedScreen.timeline.map((item) => (
              <div key={`${item.title}-${item.time}`} className="flex gap-4 rounded-2xl border border-slate-100 p-4">
                <div className="mt-1 h-3 w-3 rounded-full bg-primary" />
                <div className="flex-1">
                  <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{item.time}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : null}

      {!resolvedScreen.table && !resolvedScreen.cards && !resolvedScreen.metrics && !resolvedScreen.form && !resolvedScreen.chart ? (
        <EmptyState title="No content configured yet." description={resolvedScreen.emptyState ?? 'This route is ready for backend data later.'} />
      ) : null}
    </div>
  );
}

function sidebarItemsForRole(role: Role) {
  return roleScreens[role].filter((screen) => screen.nav);
}

function mobileItemsForRole(role: Role) {
  return roleScreens[role].filter((screen) => screen.mobileNav);
}

function DesktopRoleLayout({ role }: { role: Role }) {
  const { logout } = useDemoApp();
  const location = useLocation();
  const screens = sidebarItemsForRole(role);
  const current = roleScreens[role].find((screen) => location.pathname === screen.path);
  const meta = roleMeta[role];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(10,77,255,0.12),_transparent_28%),linear-gradient(180deg,#f7faff_0%,#f2f6ff_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <aside className="hidden w-72 shrink-0 rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-sm shadow-slate-200/60 backdrop-blur lg:flex lg:flex-col">
          <BrandMark />
          <div className="mt-6 rounded-3xl bg-slate-50 p-4">
            <p className="text-sm font-medium text-foreground">{meta.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{meta.schoolName ?? meta.topbarNote}</p>
          </div>
          <nav className="mt-6 flex-1 space-y-1">
            {screens.map((screen) => {
              const Icon = iconForPath(screen.path);
              const active = location.pathname === screen.path;
              return (
                <Link
                  key={screen.path}
                  to={screen.path}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/15'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{screen.navLabel ?? screen.label}</span>
                </Link>
              );
            })}
          </nav>
          <Button variant="ghost" className="justify-start" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <header className="sticky top-4 z-20 rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-sm shadow-slate-200/60 backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{meta.schoolName ?? meta.label}</p>
                <p className="text-sm text-muted-foreground">{current?.title ?? meta.topbarNote}</p>
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    className="h-10 w-full min-w-56 rounded-2xl border border-input bg-background pl-9 pr-3 text-sm outline-none"
                    placeholder="Search dashboards, reports, or records"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-2.5">
                    <Bell className="h-5 w-5 text-slate-700" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                      4
                    </span>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                    {meta.label}
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main className="pb-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function MobileRoleLayout({ role }: { role: Role }) {
  const { logout } = useDemoApp();
  const location = useLocation();
  const items = mobileItemsForRole(role);
  const current = roleScreens[role].find((screen) => location.pathname === screen.path);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef4ff_0%,#f7faff_42%,#ffffff_100%)] pb-24">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <header className="sticky top-0 z-20 border-b border-white/70 bg-white/90 px-4 py-4 backdrop-blur">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-primary">{roleMeta[role].label}</p>
              <h1 className="mt-1 text-lg font-semibold text-foreground">{current?.title ?? roleMeta[role].label}</h1>
              <p className="text-sm text-muted-foreground">{roleMeta[role].schoolName}</p>
            </div>
            <div className="relative rounded-2xl bg-slate-50 p-2.5">
              <Bell className="h-5 w-5 text-slate-700" />
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                5
              </span>
            </div>
          </div>
          <Button variant="ghost" className="mt-3 justify-start px-0 text-sm text-slate-600" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </header>
        <main className="flex-1 px-4 py-4">
          <Outlet />
        </main>
        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-white/70 bg-white/95 px-3 py-3 backdrop-blur">
          <div className="mx-auto grid max-w-md grid-cols-5 gap-2">
            {items.map((screen) => {
              const Icon = iconForPath(screen.path);
              const active = location.pathname === screen.path;
              return (
                <Link
                  key={screen.path}
                  to={screen.path}
                  className={`flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-center text-[11px] ${
                    active ? 'bg-primary/10 text-primary' : 'text-slate-500'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{screen.navLabel ?? screen.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

function RoleLayout({ role }: { role: Role }) {
  return roleMeta[role].mobile ? <MobileRoleLayout role={role} /> : <DesktopRoleLayout role={role} />;
}

function RequireDemoAuth({ children }: { children: ReactNode }) {
  const { session } = useDemoApp();

  if (!session.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function LandingPage() {
  const navigate = useNavigate();

  const platformFlow = [
    'iSparx creates school',
    'School Admin sets up academics',
    'Teachers manage learning',
    'Students learn and submit work',
    'Parents track progress',
    'School gets reports',
  ];

  const features = [
    'Multi-school SaaS',
    'Role-based dashboards',
    'Homework and quiz management',
    'Attendance tracking',
    'Parent app',
    'Fee tracking',
    'Reports',
    'Future AI Teacher',
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(10,77,255,0.12),_transparent_26%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_48%,#ffffff_100%)] text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex flex-col gap-4 rounded-[32px] border border-white/70 bg-white/90 px-5 py-4 shadow-sm shadow-slate-200/60 backdrop-blur md:flex-row md:items-center md:justify-between">
          <BrandMark />
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button onClick={() => navigate('/role-detection')}>View Demo</Button>
          </div>
        </nav>

        <section className="grid gap-8 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <Badge variant="primary" className="rounded-full px-4 py-1.5">
              Client-presentation ready school SaaS frontend
            </Badge>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-slate-900 md:text-6xl">
                {brand.name}
              </h1>
              <p className="max-w-3xl text-lg text-slate-600 md:text-xl">{brand.tagline}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/role-detection')}>
                View Demo
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="rounded-3xl border-none bg-white/90">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Schools</p>
                  <p className="mt-2 text-3xl font-semibold">128</p>
                </CardContent>
              </Card>
              <Card className="rounded-3xl border-none bg-white/90">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Students</p>
                  <p className="mt-2 text-3xl font-semibold">42.5K</p>
                </CardContent>
              </Card>
              <Card className="rounded-3xl border-none bg-white/90">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground">Roles</p>
                  <p className="mt-2 text-3xl font-semibold">7</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="overflow-hidden rounded-[36px] border-none bg-slate-950 text-white shadow-2xl shadow-primary/15">
            <CardContent className="space-y-6 p-6">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="border-white/10 bg-white/10 text-white">
                  How Platform Works
                </Badge>
                <Sparkles className="h-5 w-5 text-secondary" />
              </div>
              <div className="space-y-4">
                {platformFlow.map((step, index) => (
                  <div key={step} className="flex items-center gap-4 rounded-3xl bg-white/5 px-4 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1 text-sm text-white/85">{step}</div>
                    {index < platformFlow.length - 1 ? <ChevronRight className="h-4 w-4 text-white/50" /> : <CheckCircle2 className="h-4 w-4 text-secondary" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6 py-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-semibold">Role Cards</h2>
              <p className="text-muted-foreground">Every stakeholder gets a dashboard that matches their real-world workflow.</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {demoRoles.map((role) => (
              <Card key={role.role} className="rounded-3xl border-white/70 bg-white/90">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <RoleBadge role={role.role} />
                    {(() => {
                      const Icon = iconForPath(role.route);
                      return <Icon className="h-5 w-5 text-primary" />;
                    })()}
                  </div>
                  <CardTitle className="text-xl">{role.label}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-6 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <SectionCard
            title="Platform Features"
            description="A white-label LMS that clearly communicates the full operating model to schools and investors."
          >
            <div className="grid gap-3 md:grid-cols-2">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">{feature}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <Card className="rounded-[32px] border-white/70 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">What the demo already shows</CardTitle>
              <CardDescription>
                Common login, role detection, role-specific layouts, multi-school SaaS operations, and backend-ready static data.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {[
                'Super Admin SaaS flow',
                'School Admin setup flow',
                'Teacher learning management flow',
                'Student mobile learning flow',
                'Parent child monitoring flow',
                'Principal reports flow',
                'Accountant fee management flow',
                'Reusable LMS UI components',
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const { setAuthenticated } = useDemoApp();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#eef4ff_0%,#f8fbff_50%,#ffffff_100%)] p-4">
      <Card className="w-full max-w-5xl overflow-hidden rounded-[36px] border-white/70 bg-white/90 shadow-2xl shadow-slate-200/80">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-slate-950 p-8 text-white">
            <BrandMark />
            <div className="mt-10 space-y-4">
              <h1 className="text-4xl font-semibold">Common Login</h1>
              <p className="text-white/80">
                Use one entry point for school owners, principals, teachers, students, parents, and accountants.
              </p>
            </div>
            <div className="mt-8 space-y-3">
              {[
                'Password or OTP mock verification',
                'Role detection after login',
                'Frontend-only demo role access',
                'Backend-ready route structure',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/8 px-4 py-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <CardContent className="space-y-6 p-8">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-primary">Login</p>
              <h2 className="mt-2 text-3xl font-semibold">Access the school workspace</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                No real authentication is connected yet. This demo keeps the UI and navigation ready for later backend integration.
              </p>
            </div>
            <div className="grid gap-4">
              <Input label="Email / Mobile / Student ID" placeholder="principal@greenvalley.edu or +91 98765 40101" />
              <Input label="Password (optional)" type="password" placeholder="Enter password if available" />
              <Input label="School code (optional)" placeholder="GVPS-2026" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  setAuthenticated(true);
                  navigate('/otp');
                }}
              >
                <LockKeyhole className="h-4 w-4" />
                Login with OTP
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAuthenticated(true);
                  navigate('/role-detection');
                }}
              >
                Continue
              </Button>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-muted-foreground">
              Demo note: school code can later map users to the correct subdomain and tenant context.
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

function OtpPage() {
  const navigate = useNavigate();
  const { setAuthenticated } = useDemoApp();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#eef4ff_0%,#ffffff_100%)] p-4">
      <Card className="w-full max-w-xl rounded-[36px] border-white/70 bg-white/95 shadow-xl shadow-slate-200/70">
        <CardHeader>
          <Badge variant="primary" className="w-fit">
            OTP Verification
          </Badge>
          <CardTitle className="text-3xl">Enter the 6-digit OTP</CardTitle>
          <CardDescription>
            Static OTP screen for the frontend demo. In production, the backend will verify the code and detect the role automatically.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                className="h-14 rounded-2xl border border-input bg-background text-center text-xl font-semibold outline-none"
                maxLength={1}
              />
            ))}
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-muted-foreground">
            <span>Resend OTP</span>
            <span>00:45</span>
          </div>
          <div className="flex gap-3">
            <Button
              className="flex-1"
              onClick={() => {
                setAuthenticated(true);
                navigate('/role-detection');
              }}
            >
              Verify
            </Button>
            <Button variant="outline" className="flex-1">
              Resend OTP
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RoleDetectionPage() {
  const navigate = useNavigate();
  const { setRole } = useDemoApp();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setChecking(false), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef4ff_0%,#ffffff_100%)] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <Card className="rounded-[36px] border-white/70 bg-white/90 shadow-xl shadow-slate-200/70">
          <CardContent className="space-y-8 p-8">
            <div className="space-y-3 text-center">
              <Badge variant="secondary" className="mx-auto w-fit">
                Demo Role Access
              </Badge>
              <h1 className="text-4xl font-semibold">Checking your role and opening your dashboard...</h1>
              <p className="text-muted-foreground">
                For frontend demo only. In production, the backend will automatically identify the role.
              </p>
            </div>

            {checking ? (
              <div className="mx-auto flex max-w-xl items-center gap-4 rounded-3xl border border-primary/15 bg-primary/5 px-5 py-4">
                <div className="h-10 w-10 animate-pulse rounded-2xl bg-primary/20" />
                <div>
                  <p className="font-medium text-foreground">Role detection in progress</p>
                  <p className="text-sm text-muted-foreground">Preparing a role-aware route and dashboard shell.</p>
                </div>
              </div>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {demoRoles.map((role) => (
                <Card
                  key={role.role}
                  className="cursor-pointer rounded-3xl border-white/70 bg-white transition-transform hover:-translate-y-1"
                  onClick={() => {
                    setRole(role.role);
                    navigate(role.route);
                  }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <RoleBadge role={role.role} />
                      {(() => {
                        const Icon = iconForPath(role.route);
                        return <Icon className="h-5 w-5 text-primary" />;
                      })()}
                    </div>
                    <CardTitle className="text-xl">{role.label}</CardTitle>
                    <CardDescription>{role.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ScreenRoute({ screen }: { screen: ScreenSpec }) {
  return <WorkspacePage screen={screen} />;
}

function renderRoleRoutes(role: Role) {
  const screens = roleScreens[role];
  const basePath = roleMeta[role].basePath;
  const defaultRelative = screens[0].path.replace(`${basePath}/`, '');

  return (
    <Route
      path={basePath}
      element={
        <RequireDemoAuth>
          <RoleLayout role={role} />
        </RequireDemoAuth>
      }
    >
      <Route index element={<Navigate to={defaultRelative} replace />} />
      {screens.map((screen) => (
        <Route key={screen.path} path={screen.path.replace(`${basePath}/`, '')} element={<ScreenRoute screen={screen} />} />
      ))}
    </Route>
  );
}

function RouteAuditPage() {
  const routes = useMemo(() => fullRouteList, []);

  return (
    <SectionCard
      title="Route Coverage"
      description="All required routes are present in the frontend route tree."
      aside={<Badge variant="success">{routes.length} routes</Badge>}
    >
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {routes.map((route) => (
          <div key={route} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {route}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function AppFooterAudit() {
  const location = useLocation();
  if (location.pathname !== '/super-admin/settings') return null;
  return (
    <div className="mt-6">
      <RouteAuditPage />
    </div>
  );
}

function AppFrame() {
  return (
    <DemoAppProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/role-detection" element={<RoleDetectionPage />} />
        {renderRoleRoutes('super-admin')}
        {renderRoleRoutes('school-admin')}
        {renderRoleRoutes('principal')}
        {renderRoleRoutes('teacher')}
        {renderRoleRoutes('student')}
        {renderRoleRoutes('parent')}
        {renderRoleRoutes('accountant')}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AppFooterAudit />
    </DemoAppProvider>
  );
}

export function LmsApp() {
  return (
    <BrowserRouter>
      <AppFrame />
    </BrowserRouter>
  );
}
