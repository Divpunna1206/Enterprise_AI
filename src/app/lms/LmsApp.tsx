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
  Bot,
  BookOpen,
  Brain,
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
  Flame,
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
  ShieldPlus,
  Sparkles,
  Users,
  UserSquare2,
  Eye,
  EyeOff,
  Wallet,
} from 'lucide-react';
import { AiCitationCard } from '../components/ai/AiCitationCard';
import { AiSafetyNote } from '../components/ai/AiSafetyNote';
import { AiSettingsToggleCard } from '../components/ai/AiSettingsToggleCard';
import { ParentAiSummaryCard } from '../components/ai/ParentAiSummaryCard';
import { RewardBadgeCard } from '../components/ai/RewardBadgeCard';
import { SourcePipeline } from '../components/ai/SourcePipeline';
import { SourceStatusBadge } from '../components/ai/SourceStatusBadge';
import { TeacherAiToolCard } from '../components/ai/TeacherAiToolCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { StatCard } from '../components/ui/StatCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { appRoleToPlatformRole, platformRoleToAppRole, roleRoutes } from '../auth/roleRoutes';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import { AcceptInvitePage } from '../pages/onboarding/AcceptInvitePage';
import { CreateSchoolPage } from '../pages/onboarding/CreateSchoolPage';
import { RequestDemoPage } from '../pages/onboarding/RequestDemoPage';
import {
  SchoolAdminAcademicYearsPage,
  SchoolAdminClassesSectionsPage,
  SchoolAdminParentsPage,
  SchoolAdminStudentsPage,
  SchoolAdminSubjectsPage,
  SchoolAdminTeachersPage,
} from '../pages/school-admin/SchoolAdminCrudPages';
import {
  ParentHomeworkPage,
  ParentQuizResultsPage,
  SchoolAdminCoursesPage,
  SchoolAdminHomeworkPage,
  SchoolAdminQuizzesPage,
  StudentCoursesPage,
  StudentHomeworkPage,
  StudentQuizAttemptPage,
  StudentQuizPage,
  StudentQuizResultPage,
  TeacherCoursesPage,
  TeacherHomeworkCreatePage,
  TeacherHomeworkReviewPage,
  TeacherQuizzesCreatePage,
  TeacherVideoUploadPage,
} from '../pages/lms/LmsCorePages';
import {
  AccountantFeeInvoicesPage,
  AccountantPaymentsPage,
  AccountantPendingFeesPage,
  AccountantReceiptsPage,
  AccountantRemindersPage,
  AccountantReportsPageRoute,
  ParentAiProgressPageRoute,
  ParentAttendancePageRoute,
  ParentFeesPageRoute,
  ParentProfilePage,
  PrincipalAttendanceReportsPage,
  PrincipalHomeworkReportsPage,
  PrincipalQuizReportsPage,
  PrincipalStudentReportsPage,
  PrincipalTeacherReportsPage,
  SchoolAdminAiSettingsPage,
  SchoolAdminAiUsagePage,
  SchoolAdminAttendancePage,
  SchoolAdminReportsPageRoute,
  SchoolAdminSourceLibraryPage,
  StudentAttendancePageRoute,
  StudentProfilePage,
  SuperAdminAiModulesPage,
  SuperAdminAiUsagePage,
  SuperAdminBillingPageRoute,
  SuperAdminReportsPage,
  SuperAdminSchoolsPage,
  SuperAdminSubscriptionPlansPage,
  TeacherAttendancePage,
  TeacherProfilePage,
  TeacherSourceLibraryPage,
  TeacherStudentPerformancePageRoute,
} from '../pages/runtime/OperationalApiPages';
import { Toaster as Sonner } from 'sonner';
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
import {
  aiConversations,
  aiFeedbackRows,
  aiQuizPreview,
  aiSources,
  aiTeacherTools,
  motivationMessages,
  parentAiSummaryCards,
  recommendedActions,
  rewardBadges,
  rewardRules,
  rewardSummary,
  rewardTimeline,
  sourcePipelineStages,
  weakTopics,
} from '../../data/aiMockData';

type TableRowsByPath = Record<string, string[][]>;
type CardsByPath = Record<string, DetailCard[]>;

interface DemoAppContextValue {
  cardsByPath: CardsByPath;
  tableRowsByPath: TableRowsByPath;
  logout: () => void;
  openAction: (label: string, currentPath?: string, actionPath?: string) => void;
  submitForm: (screen: ScreenSpec, formData: FormData) => void;
}

const DEMO_STORAGE_KEY = 'isparx-lms-demo-state-v2';
const isSuperAdminSignupEnabled =
  (import.meta.env.VITE_SUPER_ADMIN_SIGNUP_ENABLED ?? 'false').toLowerCase() ===
  'true';

const passwordStrengthPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,}$/;
const phonePattern = /^\+?[1-9]\d{7,14}$/;

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getPasswordRequirementStates(password: string) {
  return [
    {
      label: 'At least 10 characters',
      met: password.length >= 10,
    },
    {
      label: 'One uppercase letter',
      met: /[A-Z]/.test(password),
    },
    {
      label: 'One lowercase letter',
      met: /[a-z]/.test(password),
    },
    {
      label: 'One number',
      met: /\d/.test(password),
    },
    {
      label: 'One special character',
      met: /[^A-Za-z\d]/.test(password),
    },
  ];
}

const actionRouteMap: Record<string, string> = {
  'Create New School': '/super-admin/schools/create',
  'Create School': '/super-admin/schools/create',
  'View Schools': '/super-admin/schools',
  Schools: '/super-admin/schools',
  'Add Subscription Plan': '/super-admin/subscription-plans',
  'Subscription Plans': '/super-admin/subscription-plans',
  'View Billing': '/super-admin/billing',
  Billing: '/super-admin/billing',
  'Export Report': '/super-admin/reports',
  Reports: '/super-admin/reports',
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
  'AI Modules': '/super-admin/ai-modules',
  Settings: '/super-admin/settings',
  'Generate Lesson Plan': '/teacher/ai-tools',
  'Generate Quiz': '/teacher/ai-quiz-generator',
  'AI Feedback': '/teacher/ai-feedback',
  'Ask AI Tutor': '/student/ask-ai',
  'AI Study Coach': '/student/ai-study-coach',
  'Smart Practice': '/student/smart-practice',
  Rewards: '/student/rewards',
  'AI Progress Summary': '/parent/ai-progress',
  'Rewards Summary': '/parent/rewards-summary',
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
  if (label === 'AI Usage') {
    if (currentPath?.startsWith('/school-admin')) return '/school-admin/ai-usage';
    return '/super-admin/ai-usage';
  }
  if (label === 'AI Settings') {
    return '/school-admin/ai-settings';
  }
  if (label === 'Source Library') {
    if (currentPath?.startsWith('/teacher')) return '/teacher/source-library';
    return '/school-admin/source-library';
  }
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

function formatLabel(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizeDashboardValue(value: unknown) {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.join(', ');
  return JSON.stringify(value);
}

function getDashboardRoute(role: Role) {
  return roleRoutes[appRoleToPlatformRole[role]];
}

function isDashboardRoute(path: string, role: Role) {
  return path === getDashboardRoute(role);
}

function mapDashboardTable(rows: Array<Record<string, unknown>>) {
  if (rows.length === 0) return undefined;

  const keys = Object.keys(rows[0]);
  return {
    columns: keys.map(formatLabel),
    rows: rows.map((row) => keys.map((key) => normalizeDashboardValue(row[key]))),
  };
}

function describeDashboardAction(path: string) {
  return `Open ${path.replace(/^\//, '').replace(/\//g, ' / ')}`;
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
  const { logout: authLogout } = useAuth();
  const [tableRowsByPath, setTableRowsByPath] = useState<TableRowsByPath>(() => makeDefaultTableRowsByPath());
  const [cardsByPath, setCardsByPath] = useState<CardsByPath>(() => makeDefaultCardsByPath());

  useEffect(() => {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<{
        cardsByPath: CardsByPath;
        tableRowsByPath: TableRowsByPath;
      }>;

      if (parsed.tableRowsByPath) {
        setTableRowsByPath({ ...makeDefaultTableRowsByPath(), ...parsed.tableRowsByPath });
      }
      if (parsed.cardsByPath) {
        setCardsByPath({ ...makeDefaultCardsByPath(), ...parsed.cardsByPath });
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
        tableRowsByPath,
      }),
    );
  }, [cardsByPath, tableRowsByPath]);

  const logout = () => {
    void authLogout().finally(() => {
      navigate('/login');
    });
  };

  const openAction = (label: string, currentPath?: string, actionPath?: string) => {
    navigate(actionPath ?? resolveActionRoute(label, currentPath));
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

    if (path === '/teacher/ai-quiz-generator') {
      const title = `${readText(formData, 'Subject', 'Mathematics')} AI Quiz`;
      const schoolClass = readText(formData, 'Class', 'Class 8A');
      const subject = readText(formData, 'Subject', 'Mathematics');
      const schedule = 'Generated in demo mode';
      const marks = readText(formData, 'Marks', '20');

      setTableRowsByPath((current) => ({
        ...current,
        '/school-admin/quizzes': [[title, schoolClass, subject, schedule, marks, 'Draft'], ...(current['/school-admin/quizzes'] ?? [])],
        '/principal/quiz-reports': [[title, schoolClass, subject, schedule, marks, 'Draft'], ...(current['/principal/quiz-reports'] ?? [])],
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
    tableRowsByPath,
    logout,
    openAction,
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
      <div className="flex h-12 w-12 -rotate-6 items-center justify-center rounded-[16px] border-[3px] border-border bg-primary text-primary-foreground shadow-[6px_6px_0_0_var(--color-border)]">
        <GraduationCap className="h-6 w-6" />
      </div>
      <div>
        <p className="text-lg font-extrabold tracking-[-0.04em] text-foreground">{brand.name}</p>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-hover">Enterprise AI School Platform</p>
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
      : normalized.includes('pending') || normalized.includes('expiring') || normalized.includes('late') || normalized.includes('chunk') || normalized.includes('extract') || normalized.includes('embed')
        ? 'warning'
        : normalized.includes('overdue') || normalized.includes('inactive') || normalized.includes('failed')
          ? 'destructive'
          : normalized.includes('live') || normalized.includes('published') || normalized.includes('uploaded')
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
    <div className="page-header">
      <div className="page-title space-y-2">
        <RoleBadge role={role} />
        <div>
          <h1 className="text-4xl font-extrabold tracking-[-0.05em] text-foreground md:text-5xl">{title}</h1>
          <p className="max-w-3xl text-sm text-muted-foreground md:text-base">{description}</p>
        </div>
      </div>
      {actions && actions.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {actions.slice(0, 2).map((action) => (
            <Button key={action.label} variant="outline" onClick={() => openAction(action.label, currentPath, action.path)}>
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
    <Card id={id} className="overflow-hidden bg-white">
      <CardHeader className="border-b-[3px] border-border bg-accent/60">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
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
  path,
}: {
  label: string;
  description: string;
  currentPath?: string;
  path?: string;
}) {
  const { openAction } = useDemoApp();

  return (
    <Card className="bg-white transition-transform hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-base">{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button variant="outline" className="text-primary" onClick={() => openAction(label, currentPath, path)}>
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
        <Search className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
        <input
          className="h-12 w-full rounded-[18px] border-[2px] border-input bg-background pl-11 pr-4 text-sm font-medium shadow-[4px_4px_0_0_var(--color-border)] outline-none"
          placeholder="Search records"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Badge key={filter} variant="muted" className="px-3 py-1.5">
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
                  {['Active', 'Inactive', 'Pending', 'Paid', 'Overdue', 'Live', 'Published', 'Reviewed', 'Draft', 'Expiring Soon', 'Completed', 'Submitted', 'Uploaded', 'Extracting', 'Chunking', 'Embedding', 'Indexed', 'Failed', 'Scheduled', 'Viewed'].some((label) =>
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

type AiChatMessage = {
  role: 'assistant' | 'user';
  text: string;
  meta: (typeof aiConversations)[number];
};

function AiExperienceSection({ screen }: { screen: ScreenSpec }) {
  const [settings, setSettings] = useState({
    aiTutor: true,
    teacherTools: true,
    parentSummary: true,
    smartPractice: true,
    rewards: true,
    citations: true,
    restrictedSources: true,
    followUps: true,
    parentNotify: false,
  });
  const [selectedTool, setSelectedTool] = useState(aiTeacherTools[0].name);
  const [messages, setMessages] = useState([
    { role: 'assistant' , text: aiConversations[0].answer, meta: aiConversations[0] },
  ]);
  const [draftQuestion, setDraftQuestion] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  if (!screen.aiView) return null;

  if (screen.aiView === 'source-library') {
    return (
      <div className="space-y-6">
        <SectionCard
          title="Indexing Pipeline"
          description="Teacher or school admin uploads content, the AI layer processes it, and only approved indexed sources become usable."
          aside={<SourceStatusBadge status="Indexed" />}
        >
          <SourcePipeline stages={sourcePipelineStages} activeStage="Indexed" />
        </SectionCard>
        <SectionCard title="Latest Source Jobs" description="Frontend-only preview of processing status across recently uploaded learning content.">
          <div className="space-y-3">
            {aiSources.slice(0, 4).map((source) => (
              <div key={source.id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-slate-900">{source.title}</p>
                  <p className="text-slate-500">{source.subject} | {source.chapter}</p>
                </div>
                <SourceStatusBadge status={source.status} />
              </div>
            ))}
          </div>
        </SectionCard>
        <AiSafetyNote
          lines={[
            'Only approved and indexed sources are used by Student AI Tutor.',
            'Student AI access is controlled by school settings.',
            'Sources and citations are shown for transparency.',
          ]}
        />
      </div>
    );
  }

  if (screen.aiView === 'school-ai-settings') {
    const items = [
      ['Enable AI Tutor for Students', 'Allow students to ask questions from school-approved sources only.', 'aiTutor'],
      ['Enable Teacher AI Tools', 'Turn on lesson plan, homework, quiz, and rubric generation.', 'teacherTools'],
      ['Enable Parent AI Summary', 'Show simple AI-written progress summaries to parents.', 'parentSummary'],
      ['Enable Smart Practice', 'Allow weak-topic MCQ recommendations and practice loops.', 'smartPractice'],
      ['Enable Rewards Engine', 'Award points, streaks, and badges for learning actions.', 'rewards'],
      ['Show Citations in AI Answers', 'Always show source references and confidence for transparency.', 'citations'],
      ['Restrict AI Answers to Uploaded Sources Only', 'Prevent answers outside approved indexed material.', 'restrictedSources'],
      ['Allow Students to Ask Follow-up Questions', 'Enable follow-up conversation inside Ask AI Tutor.', 'followUps'],
      ['Notify Parents About AI Progress', 'Share AI progress summary and motivation updates with parents.', 'parentNotify'],
    ] as const;

    return (
      <div className="space-y-6">
        <SectionCard title="AI Controls" description="Static local-state toggles for school AI access and safety settings.">
          <div className="grid gap-4 lg:grid-cols-2">
            {items.map(([label, description, key]) => (
              <AiSettingsToggleCard
                key={label}
                label={label}
                description={description}
                checked={settings[key]}
                onChange={(checked) => setSettings((current) => ({ ...current, [key]: checked }))}
              />
            ))}
          </div>
        </SectionCard>
        <AiSafetyNote
          lines={[
            'AI answers are restricted to school-approved indexed sources.',
            'Citations are shown for transparency.',
            'Teachers can review content before assigning it to students.',
          ]}
        />
      </div>
    );
  }

  if (screen.aiView === 'student-ask-ai') {
    const latestMeta = messages[messages.length - 1]?.meta ?? aiConversations[0];

    return (
      <div className="space-y-6">
        <SectionCard title="Suggested Questions" description="Try one of these school-approved prompts to preview the AI tutor flow.">
          <div className="flex flex-wrap gap-2">
            {aiConversations.map((conversation) => (
              <Button
                key={conversation.question}
                variant="outline"
                onClick={() => {
                  setDraftQuestion(conversation.question);
                }}
              >
                {conversation.question}
              </Button>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="AI Tutor Chat" description="Frontend-only chat flow with static answers, citations, confidence, and next steps.">
          <div className="mb-4 flex items-center gap-2 text-sm text-primary">
            <Bot className="h-4 w-4" />
            AI Learning Layer conversation
          </div>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm ${
                    message.role === 'user' ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-4">
            <div className="rounded-3xl border border-primary/15 bg-primary/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">AI Confidence</p>
                  <p className="text-sm text-slate-600">Confidence score for the current answer.</p>
                </div>
                <Badge variant="success">{latestMeta.confidence}%</Badge>
              </div>
            </div>
            <div className="grid gap-3">
              {latestMeta.citations.map((citation) => (
                <AiCitationCard key={citation} citation={citation} />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {latestMeta.recommendations.map((item) => (
                <Badge key={item} variant="secondary" className="rounded-full px-3 py-2">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <input
              value={draftQuestion}
              onChange={(event) => setDraftQuestion(event.target.value)}
              placeholder="Ask your question..."
              className="h-11 flex-1 rounded-2xl border border-input bg-background px-4 text-sm outline-none"
            />
            <Button
              onClick={() => {
                const question = draftQuestion.trim();
                if (!question) return;
                const matched = aiConversations.find((conversation) =>
                  normalizeKey(conversation.question).includes(normalizeKey(question)) ||
                  normalizeKey(question).includes(normalizeKey(conversation.question)),
                );
                const response = matched ?? aiConversations[0];
                setMessages((current) => [
                  ...current,
                  { role: 'user', text: question, meta: response },
                  { role: 'assistant', text: response.answer, meta: response },
                ]);
                setDraftQuestion('');
              }}
            >
              Send
            </Button>
          </div>
        </SectionCard>
        <AiSafetyNote
          lines={[
            'Answer generated from school-approved sources.',
            'AI may make mistakes. Please verify with your teacher.',
            'Sources and citations are shown for transparency.',
          ]}
        />
      </div>
    );
  }

  if (screen.aiView === 'student-ai-study-coach') {
    return (
      <div className="space-y-6">
        <SectionCard title="Weak Topics" description="Topics the AI study coach wants the student to revisit this week.">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {weakTopics.map((topic) => (
              <Card key={topic} className="rounded-3xl border-white/70 bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-warning" />
                    <span className="font-medium text-slate-900">{topic}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Recommended Learning Path" description="A simple AI-guided sequence based on the student’s current needs.">
          <div className="space-y-3">
            {recommendedActions.slice(0, 5).map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                  {index + 1}
                </div>
                {step}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    );
  }

  if (screen.aiView === 'student-smart-practice') {
    const correctAnswer = 'C. 3/4';
    return (
      <div className="space-y-6">
        <SectionCard title="Recommended Practice" description="Topic-based MCQ practice with instant feedback and points earned.">
          <div className="grid gap-4 md:grid-cols-2">
            <Badge variant="primary" className="rounded-full px-4 py-2">Topic: Fractions</Badge>
            <Badge variant="secondary" className="rounded-full px-4 py-2">Difficulty: Medium</Badge>
          </div>
          <Card className="mt-4 rounded-3xl border-white/70 bg-white">
            <CardContent className="space-y-4 p-5">
              <div>
                <p className="text-sm text-slate-500">Question</p>
                <p className="mt-1 font-medium text-slate-900">What is 1/2 + 1/4?</p>
              </div>
              <div className="grid gap-3">
                {['A. 1/4', 'B. 2/4', 'C. 3/4', 'D. 4/4'].map((option) => (
                  <Button key={option} variant={selectedAnswer === option ? 'primary' : 'outline'} onClick={() => setSelectedAnswer(option)}>
                    {option}
                  </Button>
                ))}
              </div>
              {selectedAnswer ? (
                <div className={`rounded-2xl px-4 py-3 text-sm ${selectedAnswer === correctAnswer ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                  {selectedAnswer === correctAnswer
                    ? 'Correct! You earned 5 points.'
                    : 'Not correct. Review the fraction addition rule and try again.'}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </SectionCard>
      </div>
    );
  }

  if (screen.aiView === 'student-rewards') {
    return (
      <div className="space-y-6">
        <SectionCard title="Badges Earned" description="Visible motivation and progress markers driven by activity and improvement.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {rewardBadges.slice(0, 6).map((badge, index) => (
              <RewardBadgeCard key={badge} badge={badge} earned={index < rewardSummary.badgesEarned} />
            ))}
          </div>
        </SectionCard>
        <SectionCard title="AI Motivation Card" description={motivationMessages[4]}>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Flame className="h-5 w-5 text-warning" />
              Next reward target: Complete 2 more videos to unlock {rewardSummary.nextBadge}.
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-warning to-primary" />
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Reward Timeline" description="Recent actions that generated motivation points and streak progress.">
          <div className="space-y-3">
            {rewardTimeline.map((item) => (
              <div key={item.title} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                <span className="text-slate-700">{item.title}</span>
                <div className="flex items-center gap-3">
                  <Badge variant="success">{item.points}</Badge>
                  <span className="text-slate-500">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Reward Rules" description="How the rewards engine awards learning points in the frontend demo.">
          <div className="grid gap-3 md:grid-cols-2">
            {rewardRules.map((rule) => (
              <div key={rule} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {rule}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    );
  }

  if (screen.aiView === 'teacher-ai-tools') {
    const activeTool = aiTeacherTools.find((tool) => tool.name === selectedTool) ?? aiTeacherTools[0];

    return (
      <div className="space-y-6">
        <SectionCard title="AI Tool Modules" description="Choose one AI tool to preview the static generated teaching output.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {aiTeacherTools.map((tool) => (
              <TeacherAiToolCard
                key={tool.name}
                title={tool.name}
                description={tool.description}
                onSelect={() => setSelectedTool(tool.name)}
              />
            ))}
          </div>
        </SectionCard>
        <SectionCard title={activeTool.outputTitle} description="Preview of the generated output panel for the selected AI tool.">
          <div className="space-y-3">
            {activeTool.outputLines.map((line) => (
              <div key={line} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {line}
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="outline">Copy</Button>
            <Button variant="outline">Download</Button>
            <Button variant="outline">Save as Draft</Button>
            <Button>Assign to Class</Button>
          </div>
        </SectionCard>
      </div>
    );
  }

  if (screen.aiView === 'teacher-ai-quiz-generator') {
    return (
      <SectionCard title="Generated Quiz Preview" description="Static AI-generated quiz preview from uploaded sources.">
        <div className="space-y-3">
          {aiQuizPreview.map((item) => (
            <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {item}
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="outline">Regenerate</Button>
          <Button variant="outline">Edit Questions</Button>
          <Button variant="outline">Save Draft</Button>
          <Button>Publish Quiz</Button>
        </div>
      </SectionCard>
    );
  }

  if (screen.aiView === 'teacher-ai-feedback') {
    return (
      <SectionCard title="AI Feedback Actions" description="Review AI observations, then edit or apply the suggested feedback.">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-3xl border-white/70 bg-white">
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Submissions reviewed</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{aiFeedbackRows.length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-white/70 bg-white">
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Common mistakes detected</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">3 patterns</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl border-white/70 bg-white">
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">Suggested revision topic</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">Fractions steps</p>
            </CardContent>
          </Card>
        </div>
      </SectionCard>
    );
  }

  if (screen.aiView === 'parent-ai-progress') {
    return (
      <SectionCard title="Recent AI Insights" description="Explain progress simply so parents know what to encourage next.">
        <div className="grid gap-4 md:grid-cols-2">
          {parentAiSummaryCards.map((item) => (
            <ParentAiSummaryCard key={item.title} title={item.title} description={item.description} />
          ))}
        </div>
      </SectionCard>
    );
  }

  if (screen.aiView === 'parent-rewards-summary') {
    return (
      <div className="space-y-6">
        <SectionCard title="Motivation Summary" description={`Jitendra has earned ${rewardSummary.totalPoints} learning points, ${rewardSummary.badgesEarned} badges, and maintained a ${rewardSummary.currentStreak}-day streak.`}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {rewardBadges.slice(0, 4).map((badge) => (
              <RewardBadgeCard key={badge} badge={badge} earned />
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Reward Timeline" description="What recently improved your child’s rewards and motivation score.">
          <div className="space-y-3">
            {rewardTimeline.map((item) => (
              <div key={item.title} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                {item.title} | {item.points} | {item.date}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    );
  }

  return null;
}

function DashboardLoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="rounded-3xl border-white/70 bg-white shadow-sm">
            <CardContent className="space-y-3 p-6">
              <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
              <div className="h-8 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
            </CardContent>
          </Card>
        ))}
      </div>
      <SectionCard title="Loading dashboard" description="Fetching live dashboard data from the backend.">
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function DashboardErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <SectionCard title="Dashboard unavailable" description="The dashboard API returned an error.">
      <div className="space-y-4">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {message}
        </div>
        <Button onClick={onRetry}>Retry</Button>
      </div>
    </SectionCard>
  );
}

function useResolvedDashboardScreen(screen: ScreenSpec) {
  const isDashboardScreen = isDashboardRoute(screen.path, screen.role);
  const { data, error, loading, refetch } = useDashboard(appRoleToPlatformRole[screen.role], isDashboardScreen);

  if (!isDashboardScreen) {
    return {
      dashboardError: null,
      dashboardLoading: false,
      isDashboardScreen: false,
      refetchDashboard: refetch,
      screen,
    };
  }

  const firstTable = data?.tables[0];
  const mappedTable = firstTable ? mapDashboardTable(firstTable.rows) : undefined;

  return {
    dashboardError: error,
    dashboardLoading: loading,
    isDashboardScreen: true,
    refetchDashboard: refetch,
    screen: {
      ...screen,
      heroTitle: undefined,
      heroSubtitle: undefined,
      metrics: data?.metrics.length
        ? data.metrics.map((metric) => ({
          label: metric.label,
          value: normalizeDashboardValue(metric.value),
          tone: 'primary',
        }))
        : undefined,
      quickActions: data?.quickActions.length
        ? data.quickActions.map((action) => ({
          label: action.label,
          description: describeDashboardAction(action.path),
          path: action.path,
        }))
        : undefined,
      cards: undefined,
      chart: undefined,
      secondaryChart: undefined,
      table: mappedTable,
      timeline: data?.recentActivities.length
        ? data.recentActivities.map((activity) => ({
          title: activity.title,
          description: formatLabel(activity.type),
          time: activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Recently',
        }))
        : undefined,
      checklist: undefined,
      filters: undefined,
      tabs: undefined,
      form: undefined,
      aiView: undefined,
      emptyState: 'No live dashboard data is available yet.',
    } satisfies ScreenSpec,
  };
}

function WorkspacePage({ screen }: { screen: ScreenSpec }) {
  const { cardsByPath, tableRowsByPath } = useDemoApp();
  const { openAction } = useDemoApp();
  const {
    dashboardError,
    dashboardLoading,
    isDashboardScreen,
    refetchDashboard,
    screen: dashboardScreen,
  } = useResolvedDashboardScreen(screen);
  const resolvedScreen = useMemo(
    () =>
      isDashboardScreen
        ? dashboardScreen
        : {
            ...dashboardScreen,
            cards: cardsByPath[dashboardScreen.path] ?? dashboardScreen.cards,
            table: dashboardScreen.table
              ? {
                  ...dashboardScreen.table,
                  rows: tableRowsByPath[dashboardScreen.path] ?? dashboardScreen.table.rows,
                }
              : undefined,
          },
    [cardsByPath, dashboardScreen, isDashboardScreen, tableRowsByPath],
  );

  const hasCharts = Boolean(resolvedScreen.chart || resolvedScreen.secondaryChart);
  const showAttendanceCalendar =
    !isDashboardScreen &&
    (resolvedScreen.path.includes('/attendance') ||
      resolvedScreen.path === '/student/home' ||
      resolvedScreen.path === '/parent/home');

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

      <AiExperienceSection screen={resolvedScreen} />

      {isDashboardScreen && dashboardLoading ? <DashboardLoadingState /> : null}
      {isDashboardScreen && dashboardError ? (
        <DashboardErrorState message={dashboardError.message} onRetry={refetchDashboard} />
      ) : null}

      {!dashboardLoading && !dashboardError && resolvedScreen.metrics && resolvedScreen.metrics.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {resolvedScreen.metrics.map((metric) => (
            <StatCard
              key={metric.label}
              title={metric.label}
              value={metric.value}
              change={'change' in metric ? metric.change : undefined}
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

      {!dashboardLoading && !dashboardError && resolvedScreen.quickActions && resolvedScreen.quickActions.length > 0 ? (
        <SectionCard title="Quick Actions" description="Common actions that explain how this role moves through the system.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {resolvedScreen.quickActions.map((action) => (
              <QuickActionCard
                key={action.label}
                label={action.label}
                description={action.description}
                currentPath={resolvedScreen.path}
                path={action.path}
              />
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

      {!dashboardLoading && !dashboardError && resolvedScreen.cards && resolvedScreen.cards.length > 0 ? (
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
                <CardContent className="pt-0">
                  <Button variant="ghost" className="px-0 text-primary" onClick={() => openAction(card.title, resolvedScreen.path)}>
                    Open
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ),
          )}
        </div>
      ) : null}

      {!dashboardLoading && !dashboardError && hasCharts ? (
        <div className="grid gap-6 xl:grid-cols-2">
          {resolvedScreen.chart ? <ReportChartCard chart={resolvedScreen.chart} /> : null}
          {resolvedScreen.secondaryChart ? <ReportChartCard chart={resolvedScreen.secondaryChart} /> : null}
        </div>
      ) : null}

      {!dashboardLoading && !dashboardError && showAttendanceCalendar ? (
        <SectionCard
          title="Attendance Calendar"
          description="Reusable attendance state for student, parent, teacher, and admin views."
          aside={<Badge variant="muted">Present / Late / Absent / Leave</Badge>}
        >
          <AttendanceCalendar />
        </SectionCard>
      ) : null}

      {!dashboardLoading && !dashboardError && resolvedScreen.filters && resolvedScreen.filters.length > 0 ? (
        <SectionCard title="Filters" description="Static filter controls ready for API wiring later.">
          <SearchFilterBar filters={resolvedScreen.filters} />
        </SectionCard>
      ) : null}

      {!dashboardLoading && !dashboardError && resolvedScreen.table ? (
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

      {!dashboardLoading && !dashboardError && resolvedScreen.form ? <InteractiveForm screen={resolvedScreen} /> : null}

      {!dashboardLoading && !dashboardError && resolvedScreen.timeline && resolvedScreen.timeline.length > 0 ? (
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

      {!dashboardLoading &&
      !dashboardError &&
      !resolvedScreen.table &&
      !resolvedScreen.cards &&
      !resolvedScreen.metrics &&
      !resolvedScreen.form &&
      !resolvedScreen.chart &&
      !resolvedScreen.quickActions &&
      !resolvedScreen.timeline &&
      !resolvedScreen.checklist ? (
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
    <div className="dashboard-shell app-grid">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <aside className="hidden w-72 shrink-0 rounded-[32px] border-[3px] border-border bg-white p-5 shadow-[10px_10px_0_0_var(--color-border)] lg:flex lg:flex-col">
          <BrandMark />
          <div className="mt-6 rounded-[24px] border-[3px] border-border bg-accent px-4 py-4">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-foreground">{meta.label}</p>
            <p className="mt-2 text-sm font-medium text-muted-foreground">{meta.schoolName ?? meta.topbarNote}</p>
          </div>
          <nav className="mt-6 flex-1 space-y-1">
            {screens.map((screen) => {
              const Icon = iconForPath(screen.path);
              const active = location.pathname === screen.path;
              return (
                <Link
                  key={screen.path}
                  to={screen.path}
                  className={`flex items-center gap-3 rounded-[20px] border-[2px] px-4 py-3 text-sm font-bold transition ${
                    active
                      ? 'border-border bg-primary text-primary-foreground shadow-[5px_5px_0_0_var(--color-border)]'
                      : 'border-transparent text-foreground hover:border-border hover:bg-accent hover:shadow-[5px_5px_0_0_var(--color-border)]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{screen.navLabel ?? screen.label}</span>
                </Link>
              );
            })}
          </nav>
          <Button variant="outline" className="justify-start" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <header className="sticky top-4 z-20 rounded-[28px] border-[3px] border-border bg-white p-4 shadow-[8px_8px_0_0_var(--color-border)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-primary-hover">{meta.schoolName ?? meta.label}</p>
                <p className="text-base font-bold text-foreground">{current?.title ?? meta.topbarNote}</p>
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                  <input
                    className="h-12 w-full min-w-56 rounded-[18px] border-[2px] border-input bg-background pl-11 pr-4 text-sm font-medium shadow-[4px_4px_0_0_var(--color-border)] outline-none"
                    placeholder="Search dashboards, reports, or records"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative rounded-[18px] border-[2px] border-border bg-warning p-2.5 shadow-[4px_4px_0_0_var(--color-border)]">
                    <Bell className="h-5 w-5 text-foreground" />
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-border bg-white px-1 text-[10px] font-semibold text-foreground">
                      4
                    </span>
                  </div>
                  <div className="rounded-full border-[2px] border-border bg-accent px-4 py-2 text-sm font-bold text-foreground shadow-[4px_4px_0_0_var(--color-border)]">
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
    <div className="dashboard-shell app-grid pb-24">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <header className="sticky top-0 z-20 border-b-[3px] border-border bg-white px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-primary-hover">{roleMeta[role].label}</p>
              <h1 className="mt-1 text-xl font-extrabold tracking-[-0.04em] text-foreground">{current?.title ?? roleMeta[role].label}</h1>
              <p className="text-sm text-muted-foreground">{roleMeta[role].schoolName}</p>
            </div>
            <div className="relative rounded-[18px] border-[2px] border-border bg-warning p-2.5 shadow-[4px_4px_0_0_var(--color-border)]">
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-border bg-white px-1 text-[10px] font-semibold text-foreground">
                5
              </span>
            </div>
          </div>
          <Button variant="outline" className="mt-3 justify-start text-sm" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </header>
        <main className="dashboard-main flex-1 px-4 py-4">
          <Outlet />
        </main>
        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t-[3px] border-border bg-white px-3 py-3">
          <div className="mx-auto grid max-w-md grid-cols-5 gap-2">
            {items.map((screen) => {
              const Icon = iconForPath(screen.path);
              const active = location.pathname === screen.path;
              return (
                <Link
                  key={screen.path}
                  to={screen.path}
                  className={`flex flex-col items-center gap-1 rounded-[18px] border-[2px] px-2 py-2 text-center text-[11px] font-bold ${
                    active ? 'border-border bg-primary text-primary-foreground shadow-[4px_4px_0_0_var(--color-border)]' : 'border-transparent text-muted-foreground'
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

function LandingPage() {
  const navigate = useNavigate();

  const trustCards = [
    {
      title: 'Role-Based LMS',
      description: 'Separate workspaces keep platform owners, schools, staff, learners, and families focused on the right tasks.',
      icon: ShieldCheck,
      tone: 'warning' as const,
    },
    {
      title: 'AI-Ready Workflows',
      description: 'Academic operations and classroom support are designed to grow into source-based, review-aware AI features.',
      icon: Brain,
      tone: 'primary' as const,
    },
    {
      title: 'Backend-Connected Foundation',
      description: 'The product direction is aligned to protected routes, API workflows, school setup, and real SaaS operations.',
      icon: Layers3,
      tone: 'secondary' as const,
    },
  ];

  const roleCards = [
    {
      title: 'Super Admin',
      description: 'Manages schools, subscriptions, platform settings, onboarding flows, and overall SaaS governance.',
      icon: ShieldPlus,
    },
    {
      title: 'School Admin',
      description: 'Owns academic setup, teachers, students, parents, classes, sections, and daily school operations.',
      icon: Building2,
    },
    {
      title: 'Principal',
      description: 'Monitors academic performance, attendance health, teacher activity, and school-wide reporting.',
      icon: School,
    },
    {
      title: 'Teacher',
      description: 'Creates courses, manages homework, quizzes, video lessons, classroom attendance, and feedback loops.',
      icon: NotebookPen,
    },
    {
      title: 'Student',
      description: 'Learns from courses, submits work, attempts quizzes, tracks progress, and uses guided AI support.',
      icon: GraduationCap,
    },
    {
      title: 'Parent',
      description: 'Views progress, homework, notices, fees, and family-facing summaries from a simple companion portal.',
      icon: Users,
    },
    {
      title: 'Accountant',
      description: 'Handles invoices, fee reminders, payments, receipts, and finance reporting for the institution.',
      icon: CreditCard,
    },
  ];

  const operations = [
    'Academic years',
    'Classes and sections',
    'Subjects',
    'Teachers',
    'Students',
    'Parents',
    'Courses',
    'Homework',
    'Quizzes',
    'Attendance',
    'Notices',
    'Reports',
  ];

  const aiTools = [
    {
      title: 'AI Quiz Generation',
      description: 'Generate structured quiz drafts from lesson goals and source material for faster assessment prep.',
      icon: Sparkles,
    },
    {
      title: 'AI Lesson Assistance',
      description: 'Support teachers with lesson ideas, worksheet outlines, and planning helpers inside classroom workflows.',
      icon: BookOpen,
    },
    {
      title: 'AI Feedback Summary',
      description: 'Turn classroom performance signals into concise, review-friendly summaries for staff and leadership.',
      icon: FileText,
    },
    {
      title: 'Student AI Tutor',
      description: 'Offer guided explanations, study prompts, and revision help within protected learner experiences.',
      icon: Bot,
    },
    {
      title: 'Parent AI Progress Summary',
      description: 'Share clear family-facing updates that simplify academic progress, gaps, and next steps.',
      icon: Home,
    },
    {
      title: 'Source-Based Answers',
      description: 'Ground AI responses against uploaded school resources so teams can move toward safer, traceable outputs.',
      icon: Library,
    },
    {
      title: 'Rewards and Motivation',
      description: 'Encourage momentum through badges, streaks, appreciation moments, and positive learner reinforcement.',
      icon: Flame,
    },
  ];

  const dashboardCards = [
    {
      title: 'School Admin Dashboard',
      description: 'Academic setup, staffing, class management, and operational oversight in one command center.',
      icon: LayoutGrid,
    },
    {
      title: 'Teacher Workspace',
      description: 'Course delivery, homework review, quiz creation, attendance, and classroom AI support.',
      icon: NotebookPen,
    },
    {
      title: 'Student Learning',
      description: 'Course access, submissions, quiz attempts, progress tracking, and learner-friendly guidance.',
      icon: PlayCircle,
    },
    {
      title: 'Parent Portal',
      description: 'Progress snapshots, notices, homework visibility, fees, and family communication touchpoints.',
      icon: Users,
    },
    {
      title: 'Reports and Analytics',
      description: 'Leadership visibility into attendance, performance, academic activity, and school operations.',
      icon: FileBarChart2,
    },
    {
      title: 'AI Tools',
      description: 'A growing layer for quiz drafting, summaries, tutor support, and source-aware assistance.',
      icon: Brain,
    },
  ];

  const reasons = [
    'Role-based access for every stakeholder',
    'Multi-school SaaS architecture',
    'Secure authentication and protected routes',
    'Clean academic workflows for real schools',
    'API-connected backend foundation',
    'Scalable modules for future growth',
  ];

  const architectureCards = [
    {
      title: 'React Frontend',
      description: 'Role-aware interfaces and polished school workflows for admins, teachers, students, parents, and finance teams.',
      icon: LayoutGrid,
    },
    {
      title: 'Backend APIs',
      description: 'A modular backend foundation handles auth, CRUD operations, reporting, and domain services.',
      icon: Briefcase,
    },
    {
      title: 'Role-Based Auth',
      description: 'Protected routes and backend-driven access keep each user inside the right workspace.',
      icon: LockKeyhole,
    },
    {
      title: 'PostgreSQL and Prisma',
      description: 'Structured academic, billing, user, and AI-related data are modeled for long-term SaaS growth.',
      icon: GalleryVerticalEnd,
    },
    {
      title: 'AI Service Layer',
      description: 'The platform direction supports AI generation, source workflows, and future review and moderation steps.',
      icon: Bot,
    },
    {
      title: 'Future-Ready SaaS Structure',
      description: 'The product is positioned to expand into multi-branch education groups and advanced operational modules.',
      icon: Layers3,
    },
  ];

  return (
    <div className="app-grid landing-page min-h-screen text-foreground">
      <div className="shell px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex flex-col gap-4 rounded-[32px] border border-slate-200/80 bg-white/90 px-5 py-4 shadow-[0_24px_60px_rgba(8,42,54,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between">
          <BrandMark />
          <div className="hidden items-center gap-8 text-sm font-extrabold uppercase tracking-[0.16em] text-foreground lg:flex">
            <a href="#features">Features</a>
            <a href="#roles">Roles</a>
            <a href="#ai-tools">AI Tools</a>
            <a href="#architecture">Architecture</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button variant="outline" onClick={() => navigate('/request-demo')}>Book Demo</Button>
            <Button onClick={() => navigate('/role-detection')}>Start Demo</Button>
          </div>
        </nav>

        <section className="grid gap-8 py-14 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-18">
          <div className="space-y-7">
            <Badge variant="warning" className="px-4 py-1.5">
              Modern School SaaS
            </Badge>
            <div className="space-y-4">
              <h1 className="landing-hero-title max-w-5xl text-[#1e293b]">
                Modern School LMS with AI-Powered Learning Workflows
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
                Manage academics, teachers, students, parents, courses, homework, quizzes, attendance, reports, fees,
                and AI learning tools from one secure role-based platform.
              </p>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Built for schools, coaching institutes, and multi-branch education organizations.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" variant="outline" onClick={() => navigate('/request-demo')}>
                Book Demo
              </Button>
              <Button size="lg" onClick={() => navigate('/role-detection')}>
                Start Demo
              </Button>
              <Button size="lg" variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {trustCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Card key={card.title} className="landing-trust-card">
                    <CardContent className="p-5">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-base font-bold text-slate-900">{card.title}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="landing-hero-panel overflow-hidden border border-slate-200/80 bg-white/95">
            <CardContent className="space-y-6 p-6 md:p-8">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-warning text-foreground">
                  School Workflow View
                </Badge>
                <Sparkles className="h-5 w-5 text-warning" />
              </div>
              <div className="grid gap-3">
                {[
                  {
                    title: 'School setup and onboarding',
                    description: 'Launch schools, assign admin access, and prepare academic structures with operational control.',
                    icon: Building2,
                  },
                  {
                    title: 'Academic and classroom workflows',
                    description: 'Move from classes and subjects to courses, homework, quizzes, attendance, and reports.',
                    icon: ClipboardCheck,
                  },
                  {
                    title: 'Family and finance visibility',
                    description: 'Connect parent progress tracking, notices, fee operations, and communication touchpoints.',
                    icon: CreditCard,
                  },
                  {
                    title: 'AI-enhanced teaching and learning',
                    description: 'Add structured AI support for lesson assistance, tutor experiences, and source-aware outputs.',
                    icon: Brain,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 shadow-[0_14px_30px_rgba(15,23,42,0.06)]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary-hover">{item.title}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#effcfb_0%,#ffffff_100%)] p-5">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-hover">Client-ready positioning</p>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Present one platform for leadership, operations, teachers, students, parents, and finance teams without changing the
                  route structure or the backend-connected product direction already in place.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="features" className="space-y-6 py-8 md:py-10">
          <div className="max-w-3xl">
            <p className="section-label">School Operations</p>
            <h2 className="mt-3">Run daily school operations from one coordinated academic system.</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              The platform is designed for real institutions that need structured academic setup, role clarity, classroom execution,
              and administrative visibility without switching between disconnected tools.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {operations.map((item, index) => {
              const tone =
                index % 4 === 0
                  ? 'bg-[#fff7e7]'
                  : index % 4 === 1
                    ? 'bg-[#effcfb]'
                    : index % 4 === 2
                      ? 'bg-[#f5f3ff]'
                      : 'bg-white';
              return (
                <Card key={item} className={`border border-slate-200/80 ${tone} shadow-[0_18px_42px_rgba(15,23,42,0.05)]`}>
                  <CardHeader>
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-primary">
                      {index % 3 === 0 ? (
                        <CalendarCheck2 className="h-5 w-5" />
                      ) : index % 3 === 1 ? (
                        <Users className="h-5 w-5" />
                      ) : (
                        <BookOpen className="h-5 w-5" />
                      )}
                    </div>
                    <CardTitle className="text-xl">{item}</CardTitle>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="roles" className="space-y-6 py-8 md:py-10">
          <div className="max-w-3xl">
            <p className="section-label">Role-Based Platform</p>
            <h2 className="mt-3">Every stakeholder gets a purposeful workspace.</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              From platform owners to parents, each role is meant to see the right dashboards, tools, and responsibilities
              without clutter or permission confusion.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {roleCards.map((role) => {
              const Icon = role.icon;
              return (
                <Card key={role.title} className="border border-slate-200/80 bg-white shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="rounded-[18px] bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary-hover">
                        Role Workspace
                      </div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-slate-200 bg-slate-50 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <CardTitle className="text-xl">{role.title}</CardTitle>
                    <CardDescription className="text-sm leading-6 text-slate-600">{role.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="ai-tools" className="space-y-6 py-8 md:py-10">
          <div className="max-w-3xl">
            <p className="section-label">AI Learning Tools</p>
            <h2 className="mt-3">Bring classroom support and academic workflows into one AI-ready product layer.</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              AI features should strengthen teaching, simplify review, support learners responsibly, and help families stay informed.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {aiTools.map((tool, index) => {
              const Icon = tool.icon;
              const tone =
                index % 3 === 0
                  ? 'bg-[#effcfb]'
                  : index % 3 === 1
                    ? 'bg-[#fff7e7]'
                    : 'bg-white';
              return (
                <Card key={tool.title} className={`border border-slate-200/80 ${tone} shadow-[0_18px_42px_rgba(15,23,42,0.05)]`}>
                  <CardHeader>
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl">{tool.title}</CardTitle>
                    <CardDescription className="text-sm leading-6 text-slate-600">{tool.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="space-y-6 py-8 md:py-10">
          <div className="max-w-3xl">
            <p className="section-label">Dashboard Preview</p>
            <h2 className="mt-3">Preview the operational surfaces schools expect from a modern LMS.</h2>
            <p className="mt-3 text-base leading-7 text-slate-600">
              The website should help buyers understand that the platform already thinks in terms of school operations,
              teaching workflows, learner journeys, family visibility, and analytics.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {dashboardCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.title} className="border border-slate-200/80 bg-white shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
                  <CardHeader>
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl">{card.title}</CardTitle>
                    <CardDescription className="text-sm leading-6 text-slate-600">{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 py-8 md:py-10 lg:grid-cols-[0.95fr_1.05fr]">
          <SectionCard
            title="Why Schools Choose This Platform"
            description="The product direction combines practical school operations with a scalable SaaS foundation."
          >
            <div className="grid gap-3">
              {reasons.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-[20px] border border-slate-200 bg-white px-4 py-4 shadow-[0_12px_24px_rgba(15,23,42,0.05)]"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary-hover" />
                  <p className="text-sm font-semibold text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <Card id="architecture" className="border border-slate-200/80 bg-white shadow-[0_24px_60px_rgba(8,42,54,0.08)]">
            <CardHeader>
              <CardTitle className="text-2xl">Architecture</CardTitle>
              <CardDescription className="text-sm leading-6 text-slate-600">
                The platform is structured to connect a modern React frontend, protected backend APIs, role-aware access,
                data persistence, and an expandable AI service layer.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {architectureCards.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-[22px] border border-slate-200 bg-slate-50/70 px-4 py-4 shadow-[0_10px_22px_rgba(15,23,42,0.04)]"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-[16px] bg-white text-primary shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary-hover">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </section>

        <section className="py-10">
          <Card className="overflow-hidden border border-slate-200/80 bg-[linear-gradient(135deg,#082a36_0%,#0f4d5c_52%,#1d7d84_100%)] text-white shadow-[0_28px_70px_rgba(8,42,54,0.22)]">
            <CardContent className="grid gap-8 p-8 md:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="space-y-4">
                <Badge variant="warning" className="w-fit bg-warning text-foreground">
                  Final CTA
                </Badge>
                <h2 className="max-w-3xl text-white">Ready to modernize your school operations?</h2>
                <p className="max-w-2xl text-sm leading-7 text-white/78 md:text-base">
                  Explore the role-based product experience, review the academic workflow direction, and start planning a
                  school LMS that is ready for operational growth and AI-supported learning.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" variant="outline" onClick={() => navigate('/request-demo')}>
                  Request Demo
                </Button>
                <Button size="lg" onClick={() => navigate('/login')}>
                  Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <footer className="flex flex-col gap-3 py-8 text-sm font-semibold text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>{brand.name} for schools, coaching institutes, and AI-first learning teams.</p>
          <div className="flex gap-4">
            <button type="button" onClick={() => navigate('/request-demo')}>Contact Sales</button>
            <button type="button" onClick={() => navigate('/login')}>Login</button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const { error, login, status } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleLogin = async () => {
    setLocalError('');

    if (!email.trim() || !password.trim()) {
      setLocalError('Enter both email and password.');
      return;
    }

    try {
      await login({
        email: email.trim(),
        password,
      });
      navigate('/role-detection');
    } catch {
      // Error state is rendered from auth context.
    }
  };

  return (
    <div className="auth-shell flex items-center justify-center">
      <Card className="auth-card-grid w-full max-w-6xl overflow-hidden">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="auth-highlight p-8 md:p-10 text-white">
            <BrandMark />
            <div className="auth-copy mt-10 space-y-4">
              <Badge variant="warning" className="w-fit">Unified Access</Badge>
              <h1 className="text-4xl font-extrabold tracking-[-0.05em]">Common Login</h1>
              <p className="max-w-lg text-white/80">
                Use one entry point for school owners, principals, teachers, students, parents, and accountants with backend-driven role access.
              </p>
            </div>
            <div className="mt-8 space-y-3">
              {[
                'Email and password verification',
                'Role detection after login',
                'Refresh token retry on 401',
                'Protected backend route structure',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-[20px] border-[2px] border-white bg-white/8 px-4 py-3 text-sm shadow-[4px_4px_0_0_#ffffff]">
                  <CheckCircle2 className="h-4 w-4 text-warning" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <CardContent className="space-y-6 p-8 md:p-10">
            <div>
              <p className="section-label">Login</p>
              <h2 className="mt-3 text-3xl font-extrabold">Access the school workspace</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in with a seeded backend account. Your role and route access come from the API.
              </p>
            </div>
            <div className="grid gap-4">
              <Input
                label="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="principal@greenfield.demo.school"
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="ChangeMe123!"
              />
            </div>
            {localError ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {localError}
              </div>
            ) : null}
            {error ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error.message}
              </div>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleLogin} disabled={status === 'loading'}>
                <LockKeyhole className="h-4 w-4" />
                {status === 'loading' ? 'Signing In...' : 'Login'}
              </Button>
              {isSuperAdminSignupEnabled ? (
                <Button variant="outline" onClick={() => navigate('/super-admin/signup')}>
                  Create platform administrator
                </Button>
              ) : null}
              <Button variant="outline" onClick={() => navigate('/')}>
                Back
              </Button>
            </div>
            <div className="rounded-[20px] border-[2px] border-border bg-accent px-4 py-3 text-sm font-medium text-muted-foreground shadow-[4px_4px_0_0_var(--color-border)]">
              Seeded example: `principal@greenfield.demo.school` / `ChangeMe123!`
            </div>
            {isSuperAdminSignupEnabled ? (
              <div className="rounded-[20px] border-[2px] border-border bg-white px-4 py-3 text-sm font-medium text-muted-foreground shadow-[4px_4px_0_0_var(--color-border)]">
                Super Admin signup is enabled only for controlled setup. Once a Super Admin exists,
                the backend will block additional public signups.
              </div>
            ) : null}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

function SuperAdminSignupPage() {
  const navigate = useNavigate();
  const { error, signupSuperAdmin, status } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const passwordRequirements = getPasswordRequirementStates(password);

  const validateForm = () => {
    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedFullName || !trimmedEmail || !password || !confirmPassword) {
      return 'Enter full name, email, password, and confirm password.';
    }

    if (trimmedFullName.length < 2 || trimmedFullName.length > 120) {
      return 'Full name must be between 2 and 120 characters.';
    }

    if (!isValidEmail(trimmedEmail)) {
      return 'Enter a valid email address.';
    }

    if (trimmedPhone && !phonePattern.test(trimmedPhone)) {
      return 'Phone must be a valid international number with 8 to 15 digits.';
    }

    if (!passwordStrengthPattern.test(password)) {
      return 'Password must include uppercase, lowercase, number, and special character.';
    }

    if (password !== confirmPassword) {
      return 'Confirm password must match password.';
    }

    return null;
  };

  const handleSignup = async () => {
    setLocalError('');
    setSuccessMessage('');

    if (!isSuperAdminSignupEnabled) {
      setLocalError('Super Admin signup is disabled in this environment.');
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    try {
      const result = await signupSuperAdmin({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
        confirmPassword,
      });

      if (result.mode === 'authenticated') {
        navigate('/super-admin/dashboard', { replace: true });
        return;
      }

      setSuccessMessage(result.message || 'Account created successfully. Please sign in.');
      window.setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1200);
    } catch {
      // Error state is rendered from auth context.
    }
  };

  return (
    <div className="auth-shell flex items-center justify-center">
      <Card className="auth-card-grid w-full max-w-6xl overflow-hidden">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="auth-highlight p-8 md:p-10 text-white">
            <BrandMark />
            <div className="auth-copy mt-10 space-y-4">
              <Badge variant="warning" className="w-fit">Initial Setup</Badge>
              <h1 className="text-4xl font-extrabold tracking-[-0.05em]">Platform Administrator Signup</h1>
              <p className="text-white/80">
                Use this only during initial platform setup. The backend requires the signup flag to
                be enabled and allows just the first Super Admin account.
              </p>
            </div>
            <div className="mt-8 space-y-3">
              {[
                'Public endpoint is environment-gated',
                'Creates only the initial SUPER_ADMIN',
                'Uses the existing auth session flow',
                'Audit log entry is created on success',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-[20px] border-[2px] border-white bg-white/8 px-4 py-3 text-sm shadow-[4px_4px_0_0_#ffffff]">
                  <CheckCircle2 className="h-4 w-4 text-warning" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <CardContent className="space-y-6 p-8 md:p-10">
            <div>
              <p className="section-label">Platform Setup</p>
              <h2 className="mt-3 text-3xl font-extrabold">Create the first platform administrator</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                This flow reuses the current auth session handling and routes you into the existing
                Super Admin dashboard on success.
              </p>
            </div>
            <div className="grid gap-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Platform Owner"
              />
              <Input
                label="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="owner@example.com"
              />
              <Input
                label="Phone (optional)"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+919999999999"
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Input
                    className="pr-12"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="StrongPassword123!"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="grid gap-2 rounded-[20px] border-[2px] border-border bg-accent px-4 py-3 text-sm shadow-[4px_4px_0_0_var(--color-border)]">
                {passwordRequirements.map((requirement) => (
                  <div
                    key={requirement.label}
                    className={
                      requirement.met
                        ? 'flex items-center gap-2 text-emerald-700'
                        : 'flex items-center gap-2 text-muted-foreground'
                    }
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {requirement.label}
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <Input
                    className="pr-12"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="StrongPassword123!"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    aria-label={
                      showConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            {localError ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {localError}
              </div>
            ) : null}
            {error ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error.message}
              </div>
            ) : null}
            {successMessage ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleSignup}
                disabled={status === 'loading' || !isSuperAdminSignupEnabled}
              >
                <ShieldPlus className="h-4 w-4" />
                {status === 'loading' ? 'Creating...' : 'Create platform administrator'}
              </Button>
              <Button variant="outline" onClick={() => navigate('/login')}>
                Back to Login
              </Button>
            </div>
            <div className="rounded-[20px] border-[2px] border-border bg-white px-4 py-3 text-sm font-medium text-muted-foreground shadow-[4px_4px_0_0_var(--color-border)]">
              Enable `VITE_SUPER_ADMIN_SIGNUP_ENABLED=true` in the frontend and
              `SUPER_ADMIN_SIGNUP_ENABLED=true` in the backend only for initial setup.
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

function OtpPage() {
  const navigate = useNavigate();

  return (
    <div className="auth-shell flex items-center justify-center">
      <Card className="w-full max-w-xl bg-white">
        <CardHeader>
          <Badge variant="primary" className="w-fit">
            OTP Verification
          </Badge>
          <CardTitle className="text-3xl">Enter the 6-digit OTP</CardTitle>
          <CardDescription>
            OTP login is not exposed by the current backend. Use the email and password login flow for seeded users.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                className="h-14 rounded-[18px] border-[2px] border-input bg-background text-center text-xl font-extrabold shadow-[4px_4px_0_0_var(--color-border)] outline-none"
                maxLength={1}
              />
            ))}
          </div>
          <div className="flex items-center justify-between rounded-[20px] border-[2px] border-border bg-accent px-4 py-3 text-sm font-medium text-muted-foreground shadow-[4px_4px_0_0_var(--color-border)]">
            <span>Resend OTP</span>
            <span>00:45</span>
          </div>
          <div className="flex gap-3">
            <Button className="flex-1" onClick={() => navigate('/login')}>
              Back to Login
            </Button>
            <Button variant="outline" className="flex-1">
              Unavailable
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RoleDetectionPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login', { replace: true });
      return;
    }

    const timer = window.setTimeout(() => {
      setChecking(false);
      navigate(roleRoutes[user.role], { replace: true });
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [isAuthenticated, navigate, user]);

  if (!user) {
    return null;
  }

  return (
    <div className="auth-shell px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <Card className="bg-white">
          <CardContent className="space-y-8 p-8">
            <div className="space-y-3 text-center">
              <Badge variant="secondary" className="mx-auto w-fit">
                Role Detection
              </Badge>
              <h1 className="text-4xl font-extrabold tracking-[-0.05em]">Checking your role and opening your dashboard...</h1>
              <p className="text-muted-foreground">
                Your role is coming from the authenticated backend user record.
              </p>
            </div>

            <div className="mx-auto flex max-w-xl items-center gap-4 rounded-[24px] border-[3px] border-border bg-accent px-5 py-4 shadow-[6px_6px_0_0_var(--color-border)]">
              <div className="h-10 w-10 animate-pulse rounded-[16px] border-2 border-border bg-primary/30" />
              <div>
                <p className="font-bold text-foreground">{user.fullName}</p>
                <p className="text-sm font-medium text-muted-foreground">{roleMeta[platformRoleToAppRole[user.role]].label}</p>
              </div>
            </div>

            {checking ? (
              <div className="mx-auto flex max-w-xl items-center gap-4 rounded-[24px] border-[3px] border-border bg-white px-5 py-4 shadow-[6px_6px_0_0_var(--color-border)]">
                <div className="h-10 w-10 animate-pulse rounded-[16px] border-2 border-border bg-warning/60" />
                <div>
                  <p className="font-bold text-foreground">Role detection in progress</p>
                  <p className="text-sm text-muted-foreground">Preparing a role-aware route and dashboard shell.</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground">
                Redirecting to {roleRoutes[user.role]}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ScreenRoute({ screen }: { screen: ScreenSpec }) {
  if (screen.path === '/super-admin/schools') {
    return <SuperAdminSchoolsPage />;
  }

  if (screen.path === '/super-admin/subscription-plans') {
    return <SuperAdminSubscriptionPlansPage />;
  }

  if (screen.path === '/super-admin/billing') {
    return <SuperAdminBillingPageRoute />;
  }

  if (screen.path === '/super-admin/reports') {
    return <SuperAdminReportsPage />;
  }

  if (screen.path === '/super-admin/ai-modules') {
    return <SuperAdminAiModulesPage />;
  }

  if (screen.path === '/super-admin/ai-usage') {
    return <SuperAdminAiUsagePage />;
  }

  if (screen.path === '/school-admin/courses') {
    return <SchoolAdminCoursesPage />;
  }

  if (screen.path === '/school-admin/homework') {
    return <SchoolAdminHomeworkPage />;
  }

  if (screen.path === '/school-admin/quizzes') {
    return <SchoolAdminQuizzesPage />;
  }

  if (screen.path === '/school-admin/attendance') {
    return <SchoolAdminAttendancePage />;
  }

  if (screen.path === '/school-admin/reports') {
    return <SchoolAdminReportsPageRoute />;
  }

  if (screen.path === '/school-admin/source-library') {
    return <SchoolAdminSourceLibraryPage />;
  }

  if (screen.path === '/school-admin/ai-settings') {
    return <SchoolAdminAiSettingsPage />;
  }

  if (screen.path === '/school-admin/ai-usage') {
    return <SchoolAdminAiUsagePage />;
  }

  if (screen.path === '/school-admin/teachers') {
    return <SchoolAdminTeachersPage />;
  }

  if (screen.path === '/school-admin/students') {
    return <SchoolAdminStudentsPage />;
  }

  if (screen.path === '/school-admin/parents') {
    return <SchoolAdminParentsPage />;
  }

  if (screen.path === '/school-admin/classes-sections') {
    return <SchoolAdminClassesSectionsPage />;
  }

  if (screen.path === '/school-admin/academic-years') {
    return <SchoolAdminAcademicYearsPage />;
  }

  if (screen.path === '/school-admin/subjects') {
    return <SchoolAdminSubjectsPage />;
  }

  if (screen.path === '/principal/student-reports') {
    return <PrincipalStudentReportsPage />;
  }

  if (screen.path === '/principal/teacher-reports') {
    return <PrincipalTeacherReportsPage />;
  }

  if (screen.path === '/principal/attendance-reports') {
    return <PrincipalAttendanceReportsPage />;
  }

  if (screen.path === '/principal/quiz-reports') {
    return <PrincipalQuizReportsPage />;
  }

  if (screen.path === '/principal/homework-reports') {
    return <PrincipalHomeworkReportsPage />;
  }

  if (screen.path === '/teacher/courses') {
    return <TeacherCoursesPage />;
  }

  if (screen.path === '/teacher/videos/upload') {
    return <TeacherVideoUploadPage />;
  }

  if (screen.path === '/teacher/homework/create') {
    return <TeacherHomeworkCreatePage />;
  }

  if (screen.path === '/teacher/homework/review') {
    return <TeacherHomeworkReviewPage />;
  }

  if (screen.path === '/teacher/quizzes/create') {
    return <TeacherQuizzesCreatePage />;
  }

  if (screen.path === '/teacher/attendance') {
    return <TeacherAttendancePage />;
  }

  if (screen.path === '/teacher/student-performance') {
    return <TeacherStudentPerformancePageRoute />;
  }

  if (screen.path === '/teacher/source-library') {
    return <TeacherSourceLibraryPage />;
  }

  if (screen.path === '/teacher/profile') {
    return <TeacherProfilePage />;
  }

  if (screen.path === '/student/courses') {
    return <StudentCoursesPage />;
  }

  if (screen.path === '/student/homework') {
    return <StudentHomeworkPage />;
  }

  if (screen.path === '/student/quiz') {
    return <StudentQuizPage />;
  }

  if (screen.path === '/student/quiz/attempt') {
    return <StudentQuizAttemptPage />;
  }

  if (screen.path === '/student/quiz/result') {
    return <StudentQuizResultPage />;
  }

  if (screen.path === '/student/attendance') {
    return <StudentAttendancePageRoute />;
  }

  if (screen.path === '/student/profile') {
    return <StudentProfilePage />;
  }

  if (screen.path === '/parent/homework') {
    return <ParentHomeworkPage />;
  }

  if (screen.path === '/parent/quiz-results') {
    return <ParentQuizResultsPage />;
  }

  if (screen.path === '/parent/attendance') {
    return <ParentAttendancePageRoute />;
  }

  if (screen.path === '/parent/fees') {
    return <ParentFeesPageRoute />;
  }

  if (screen.path === '/parent/ai-progress') {
    return <ParentAiProgressPageRoute />;
  }

  if (screen.path === '/parent/profile') {
    return <ParentProfilePage />;
  }

  if (screen.path === '/accountant/fee-invoices') {
    return <AccountantFeeInvoicesPage />;
  }

  if (screen.path === '/accountant/payments') {
    return <AccountantPaymentsPage />;
  }

  if (screen.path === '/accountant/pending-fees') {
    return <AccountantPendingFeesPage />;
  }

  if (screen.path === '/accountant/receipts') {
    return <AccountantReceiptsPage />;
  }

  if (screen.path === '/accountant/reports') {
    return <AccountantReportsPageRoute />;
  }

  if (screen.path === '/accountant/reminders') {
    return <AccountantRemindersPage />;
  }

  return <WorkspacePage screen={screen} />;
}

function renderRoleRoutes(role: Role) {
  const screens = roleScreens[role];
  const basePath = roleMeta[role].basePath;
  const defaultRelative = screens[0].path.replace(`${basePath}/`, '');
  const customRoutePaths = role === 'super-admin' ? new Set(['/super-admin/schools/create']) : new Set<string>();
  const routedScreens = screens.filter((screen) => !customRoutePaths.has(screen.path));

  return (
    <Route
      path={basePath}
      element={
        <ProtectedRoute allowedRoles={[appRoleToPlatformRole[role]]}>
          <RoleLayout role={role} />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to={defaultRelative} replace />} />
      {role === 'super-admin' ? <Route path="schools/create" element={<CreateSchoolPage />} /> : null}
      {routedScreens.map((screen) => (
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
        <Route path="/super-admin/signup" element={<SuperAdminSignupPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/role-detection" element={<RoleDetectionPage />} />
        <Route path="/request-demo" element={<RequestDemoPage />} />
        <Route path="/invite/accept/:token" element={<AcceptInvitePage />} />
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
      <Sonner position="top-right" richColors />
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
