import {
  aiConversations,
  aiFeedbackRows,
  aiModuleCards,
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
  schoolAiUsageTable,
  sourceLibraryTable,
  superAdminAiModulesTable,
  superAdminAiUsageTable,
  weakTopics,
} from '../../data/aiMockData';

export type Role =
  | 'super-admin'
  | 'school-admin'
  | 'principal'
  | 'teacher'
  | 'student'
  | 'parent'
  | 'accountant';

export type Tone = 'primary' | 'success' | 'warning' | 'destructive' | 'secondary' | 'muted';
export type FieldType = 'text' | 'textarea' | 'select' | 'date' | 'toggle' | 'file';

export interface Metric {
  label: string;
  value: string;
  change?: string;
  tone?: Tone;
}

export interface DetailCard {
  title: string;
  description: string;
  value?: string;
  tag?: string;
  tone?: Tone;
}

export interface ActionItem {
  label: string;
  description: string;
  path?: string;
}

export interface ChartDatum {
  label: string;
  value: number;
}

export interface ChartConfig {
  title: string;
  description: string;
  data: ChartDatum[];
}

export interface TableData {
  columns: string[];
  rows: string[][];
}

export interface FormField {
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];
  helperText?: string;
}

export interface FormSection {
  title: string;
  description: string;
  fields: FormField[];
}

export interface TimelineItem {
  title: string;
  description: string;
  time: string;
}

export interface ScreenSpec {
  path: string;
  role: Role;
  label: string;
  title: string;
  description: string;
  nav: boolean;
  navLabel?: string;
  mobileNav?: boolean;
  metrics?: Metric[];
  quickActions?: ActionItem[];
  cards?: DetailCard[];
  checklist?: string[];
  chart?: ChartConfig;
  secondaryChart?: ChartConfig;
  table?: TableData;
  filters?: string[];
  form?: FormSection[];
  formSubmitLabel?: string;
  successMessage?: string;
  timeline?: TimelineItem[];
  tabs?: string[];
  emptyState?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  aiView?: string;
}

export interface RoleOption {
  role: Role;
  label: string;
  description: string;
  route: string;
}

export const brand = {
  name: 'iSparx School LMS',
  tagline:
    'A white-label SaaS platform for schools to manage learning, students, teachers, parents, attendance, homework, quizzes, fees, and reports.',
};

export const demoRoles: RoleOption[] = [
  {
    role: 'super-admin',
    label: 'iSparx Super Admin',
    description: 'Manage schools, subscriptions, billing, growth, and platform reports.',
    route: '/super-admin/dashboard',
  },
  {
    role: 'school-admin',
    label: 'School Admin',
    description: 'Set up academics, users, subjects, learning operations, and notices.',
    route: '/school-admin/dashboard',
  },
  {
    role: 'principal',
    label: 'Principal',
    description: 'Track student performance, attendance, teacher activity, and trends.',
    route: '/principal/dashboard',
  },
  {
    role: 'teacher',
    label: 'Teacher',
    description: 'Manage classes, courses, homework, quizzes, and attendance.',
    route: '/teacher/dashboard',
  },
  {
    role: 'student',
    label: 'Student',
    description: 'Continue learning, complete homework, attempt quizzes, and track progress.',
    route: '/student/home',
  },
  {
    role: 'parent',
    label: 'Parent',
    description: 'Monitor attendance, homework, quiz results, fees, and notices.',
    route: '/parent/home',
  },
  {
    role: 'accountant',
    label: 'Accountant',
    description: 'Track invoices, collected payments, pending fees, and reminders.',
    route: '/accountant/dashboard',
  },
];

const schools = [
  ['Green Valley Public School', 'greenvalley.isparxlearn.com', 'Ahmedabad', 'Ritika Nair', '+91 98765 40101', 'Premium', '1,200', 'Active', '31 Mar 2027'],
  ['Bright Future Academy', 'brightfuture.isparxlearn.com', 'Jaipur', 'Harish Meena', '+91 98765 40102', 'Standard', '800', 'Active', '15 Jan 2027'],
  ['Sunrise International School', 'sunrise.isparxlearn.com', 'Pune', 'Sneha Kulkarni', '+91 98765 40103', 'Enterprise', '2,500', 'Expiring Soon', '30 Sep 2026'],
];

const teachers = [
  ['Anita Verma', '+91 98900 10101', 'anita@greenvalley.edu', 'TCH-201', 'Mathematics', 'Class 8A', 'Enabled', 'Active'],
  ['Rajesh Singh', '+91 98900 10102', 'rajesh@greenvalley.edu', 'TCH-202', 'Science', 'Class 10B', 'Enabled', 'Active'],
  ['Meena Joshi', '+91 98900 10103', 'meena@greenvalley.edu', 'TCH-203', 'English', 'Class 6B', 'Pending', 'Active'],
  ['Karan Shah', '+91 98900 10104', 'karan@greenvalley.edu', 'TCH-204', 'Social Studies', 'Class 5A', 'Enabled', 'On Leave'],
];

const students = [
  ['Jitendra Sharma', 'STD-501', '12', 'Class 8', 'A', 'Rohit Sharma', 'Enabled', 'Active'],
  ['Priya Mehta', 'STD-502', '08', 'Class 8', 'A', 'Nisha Mehta', 'Enabled', 'Active'],
  ['Aarav Shah', 'STD-503', '03', 'Class 6', 'B', 'Manish Shah', 'Enabled', 'Active'],
  ['Riya Patel', 'STD-504', '21', 'Class 10', 'B', 'Kajal Patel', 'Pending', 'Active'],
  ['Neha Verma', 'STD-505', '10', 'Class 5', 'A', 'Anita Verma', 'Enabled', 'At Risk'],
];

const parents = [
  ['Rohit Sharma', 'Father', '+91 98111 00101', 'rohit@example.com', 'Jitendra Sharma', 'Class 8A', 'Enabled'],
  ['Nisha Mehta', 'Mother', '+91 98111 00102', 'nisha@example.com', 'Priya Mehta', 'Class 8A', 'Enabled'],
  ['Manish Shah', 'Father', '+91 98111 00103', 'manish@example.com', 'Aarav Shah', 'Class 6B', 'Enabled'],
  ['Kajal Patel', 'Mother', '+91 98111 00104', 'kajal@example.com', 'Riya Patel', 'Class 10B', 'Pending'],
];

const subjects = [
  ['Mathematics', 'MATH-08', 'Class 8A', 'Anita Verma', '12', 'Active'],
  ['Science', 'SCI-08', 'Class 8A', 'Rajesh Singh', '10', 'Active'],
  ['English', 'ENG-06', 'Class 6B', 'Meena Joshi', '9', 'Active'],
  ['Social Studies', 'SOC-05', 'Class 5A', 'Karan Shah', '11', 'Active'],
  ['Hindi', 'HIN-10', 'Class 10B', 'Rajesh Singh', '8', 'Draft'],
];

const homeworkRows = [
  ['Science Project', 'Class 8A', 'Science', '12 Jun 2026', '40', 'Assigned'],
  ['Math Assignment', 'Class 8A', 'Mathematics', '09 Jun 2026', '25', 'Review Pending'],
  ['English Essay', 'Class 6B', 'English', '13 Jun 2026', '30', 'Assigned'],
  ['History Worksheet', 'Class 5A', 'Social Studies', '10 Jun 2026', '20', 'Reviewed'],
];

const quizRows = [
  ['Science Chapter 5 Quiz', 'Class 8A', 'Science', '05 Jun 2026 10:00', '20', 'Live'],
  ['Mathematics Fractions Test', 'Class 6B', 'Mathematics', '07 Jun 2026 11:00', '25', 'Scheduled'],
  ['English Grammar Quiz', 'Class 5A', 'English', '02 Jun 2026 09:30', '15', 'Completed'],
];

const noticeRows = [
  ['Annual Day Announcement', 'All', '05 Jun 2026', 'School Admin', 'Published'],
  ['Holiday Notice', 'Students & Parents', '06 Jun 2026', 'Principal', 'Published'],
  ['Parent Meeting Notice', 'Parents', '08 Jun 2026', 'School Admin', 'Scheduled'],
  ['Exam Timetable Released', 'Students', '10 Jun 2026', 'Principal', 'Draft'],
];

const feeRows = [
  ['Jitendra Sharma', 'Class 8A', 'Rohit Sharma', 'Rs 50,000', '15 Jun 2026', 'Pending'],
  ['Priya Mehta', 'Class 8A', 'Nisha Mehta', 'Rs 50,000', '15 Jun 2026', 'Paid'],
  ['Aarav Shah', 'Class 6B', 'Manish Shah', 'Rs 45,000', '20 Jun 2026', 'Pending'],
  ['Riya Patel', 'Class 10B', 'Kajal Patel', 'Rs 58,000', '10 Jun 2026', 'Overdue'],
];

const billingRows = [
  ['Green Valley Public School', 'Premium', 'Rs 48,000', 'Paid', '30 Jun 2026', 'INV-401', 'Download Invoice'],
  ['Bright Future Academy', 'Standard', 'Rs 32,000', 'Pending', '18 Jun 2026', 'INV-402', 'Send Reminder'],
  ['Sunrise International School', 'Enterprise', 'Rs 86,000', 'Paid', '15 Jun 2026', 'INV-403', 'Download Invoice'],
];

const subscriptionRows = [
  ['Basic', '500 students / 30 teachers', '20 GB', '5 GB', 'No', 'Basic reports', 'Optional', 'Rs 9,999', 'Rs 99,999', 'Active'],
  ['Standard', '1,200 students / 80 teachers', '100 GB', '20 GB', 'Yes', 'Advanced reports', 'Optional', 'Rs 24,999', 'Rs 249,999', 'Popular'],
  ['Premium', '2,500 students / 150 teachers', '300 GB', '60 GB', 'Yes', 'Premium reports', 'Included', 'Rs 44,999', 'Rs 449,999', 'Active'],
  ['Enterprise', 'Unlimited', 'Custom', 'Custom', 'Yes', 'Executive dashboards', 'Included', 'Custom', 'Custom', 'Contact Sales'],
];

const receiptRows = [
  ['RCPT-301', 'Priya Mehta', 'Rs 50,000', '03 Jun 2026', 'Online', 'Downloaded'],
  ['RCPT-302', 'Green Valley Bulk Fee Drive', 'Rs 3,25,000', '02 Jun 2026', 'UPI', 'Shared'],
  ['RCPT-303', 'Jitendra Sharma', 'Rs 35,000', '28 May 2026', 'Bank Transfer', 'Downloaded'],
];

const reportRows = [
  ['Class 8A', '91%', '87%', '82%', 'Healthy'],
  ['Class 6B', '94%', '84%', '79%', 'Watch Homework'],
  ['Class 10B', '88%', '90%', '85%', 'Strong Quiz Output'],
  ['Class 5A', '96%', '81%', '78%', 'Needs Science Support'],
];

const studentHomeworkRows = [
  ['Science Project', 'Science', '12 Jun 2026', 'Pending', '-'],
  ['Math Assignment', 'Mathematics', '09 Jun 2026', 'Submitted', '-'],
  ['English Essay', 'English', '13 Jun 2026', 'Reviewed', '18/20'],
];

const parentHomeworkRows = [
  ['Science Project', 'Science', '12 Jun 2026', 'Pending', '-'],
  ['Math Assignment', 'Mathematics', '09 Jun 2026', 'Submitted', 'Good use of diagrams'],
  ['English Essay', 'English', '13 Jun 2026', 'Reviewed', 'Excellent vocabulary'],
];

const notificationCards: DetailCard[] = [
  {
    title: 'New video uploaded in Mathematics',
    description: 'Chapter 5 fractions recap is now available for Class 8A students.',
    tag: 'Student',
    tone: 'primary',
  },
  {
    title: 'Science homework reviewed',
    description: 'Your teacher added marks and feedback to Science Project submissions.',
    tag: 'Parent',
    tone: 'success',
  },
  {
    title: 'Attendance pending for Class 8A',
    description: 'Please submit attendance before 4 PM to notify students and parents.',
    tag: 'Teacher',
    tone: 'warning',
  },
  {
    title: 'Fee reminder scheduled',
    description: 'Three overdue invoices will be shared with parents at 6 PM today.',
    tag: 'School Admin',
    tone: 'destructive',
  },
];

const dashboardTimeline: TimelineItem[] = [
  {
    title: 'New school created',
    description: 'Bright Future Academy finished onboarding and received admin credentials.',
    time: '09:15 AM',
  },
  {
    title: 'Subscription activated',
    description: 'Sunrise International School renewed Enterprise access for another year.',
    time: '10:40 AM',
  },
  {
    title: 'Payment pending',
    description: 'Invoice INV-402 remains unpaid and is due in 14 days.',
    time: '12:10 PM',
  },
  {
    title: 'School suspended alert',
    description: 'No auto-suspension is active, but one sandbox school is marked for review.',
    time: '02:00 PM',
  },
];

const teacherActivity: TimelineItem[] = [
  {
    title: 'Student submitted homework',
    description: 'Priya Mehta submitted Math Assignment for Class 8A.',
    time: '08:55 AM',
  },
  {
    title: 'Quiz completed by students',
    description: '26 learners finished Science Chapter 5 Quiz.',
    time: '11:20 AM',
  },
  {
    title: 'Video watched by students',
    description: 'Fractions Revision crossed 78 percent completion today.',
    time: '01:45 PM',
  },
  {
    title: 'Attendance reminder',
    description: 'Class 6B attendance is still pending for one section.',
    time: '03:10 PM',
  },
];

const studentTimeline: TimelineItem[] = [
  {
    title: 'Continue Mathematics',
    description: 'Fractions revision video is 70 percent complete.',
    time: 'Today',
  },
  {
    title: 'Science Project due soon',
    description: 'Upload your workbook file before 12 Jun 2026.',
    time: '2 days left',
  },
  {
    title: 'Science Chapter 5 quiz',
    description: 'Starts tomorrow at 10 AM and lasts 30 minutes.',
    time: 'Tomorrow',
  },
];

const parentTimeline: TimelineItem[] = [
  {
    title: 'Attendance updated',
    description: 'Jitendra was present in all sessions today.',
    time: 'Today',
  },
  {
    title: 'Homework review posted',
    description: 'Math Assignment feedback was published by Anita Verma.',
    time: '1 hour ago',
  },
  {
    title: 'Fee reminder',
    description: 'Rs 5,000 remains pending before the June due date.',
    time: 'This week',
  },
];

const createSchoolForm: FormSection[] = [
  {
    title: 'School Details',
    description: 'Capture the school identity and main contact points.',
    fields: [
      { label: 'School name', type: 'text', placeholder: 'Green Valley Public School' },
      { label: 'School code', type: 'text', placeholder: 'GVPS-2026' },
      { label: 'Address', type: 'textarea', placeholder: '12 Knowledge Park, Navrangpura' },
      { label: 'City', type: 'text', placeholder: 'Ahmedabad' },
      { label: 'State', type: 'text', placeholder: 'Gujarat' },
      { label: 'Pincode', type: 'text', placeholder: '380009' },
      { label: 'Contact person', type: 'text', placeholder: 'Ritika Nair' },
      { label: 'Contact number', type: 'text', placeholder: '+91 98765 40101' },
      { label: 'Email', type: 'text', placeholder: 'admin@greenvalley.edu' },
    ],
  },
  {
    title: 'Branding',
    description: 'Prepare white-label branding placeholders for the school workspace.',
    fields: [
      { label: 'School logo', type: 'file', helperText: 'Placeholder upload for logo artwork.' },
      { label: 'Primary color', type: 'text', placeholder: '#0A4DFF' },
      { label: 'Branding preview', type: 'textarea', placeholder: 'Preview uses school logo, accent color, and subdomain.' },
    ],
  },
  {
    title: 'Subdomain',
    description: 'Reserve a school-specific URL under the iSparx platform.',
    fields: [
      { label: 'Subdomain', type: 'text', placeholder: 'greenvalley' },
      { label: 'Availability', type: 'text', placeholder: 'Available' },
    ],
  },
  {
    title: 'Subscription',
    description: 'Add plan limits, dates, and school activation details.',
    fields: [
      { label: 'Plan', type: 'select', options: ['Basic', 'Standard', 'Premium', 'Enterprise'] },
      { label: 'Student limit', type: 'text', placeholder: '1200' },
      { label: 'Teacher limit', type: 'text', placeholder: '80' },
      { label: 'Start date', type: 'date' },
      { label: 'End date', type: 'date' },
      { label: 'Payment status', type: 'select', options: ['Paid', 'Pending', 'Overdue'] },
      { label: 'Activate school', type: 'toggle' },
    ],
  },
  {
    title: 'Admin User',
    description: 'Create the first school admin account for setup handoff.',
    fields: [
      { label: 'School admin name', type: 'text', placeholder: 'Ritika Nair' },
      { label: 'Email', type: 'text', placeholder: 'ritika@greenvalley.edu' },
      { label: 'Mobile', type: 'text', placeholder: '+91 98765 40101' },
      { label: 'Send login credentials', type: 'toggle' },
    ],
  },
];

const academicYearForm: FormSection[] = [
  {
    title: 'Academic Year Setup',
    description: 'Define the current school cycle and mark the active year.',
    fields: [
      { label: 'Academic year name', type: 'text', placeholder: '2026-2027' },
      { label: 'Start date', type: 'date' },
      { label: 'End date', type: 'date' },
      { label: 'Make current', type: 'toggle' },
    ],
  },
];

const classSectionForm: FormSection[] = [
  {
    title: 'Add Class',
    description: 'Create class records before adding sections and students.',
    fields: [
      { label: 'Class name', type: 'text', placeholder: 'Class 8' },
      { label: 'Academic year', type: 'select', options: ['2025-2026', '2026-2027'] },
      { label: 'Status', type: 'select', options: ['Active', 'Draft'] },
    ],
  },
  {
    title: 'Add Section',
    description: 'Attach sections, teacher ownership, and capacity limits.',
    fields: [
      { label: 'Select class', type: 'select', options: ['Class 5', 'Class 6', 'Class 8', 'Class 10'] },
      { label: 'Section name', type: 'text', placeholder: 'A' },
      { label: 'Class teacher', type: 'select', options: ['Anita Verma', 'Rajesh Singh', 'Meena Joshi', 'Karan Shah'] },
      { label: 'Capacity', type: 'text', placeholder: '40' },
    ],
  },
];

const teacherForm: FormSection[] = [
  {
    title: 'Add Teacher',
    description: 'Capture staffing, subject ownership, and login readiness.',
    fields: [
      { label: 'Name', type: 'text', placeholder: 'Anita Verma' },
      { label: 'Mobile', type: 'text', placeholder: '+91 98900 10101' },
      { label: 'Email', type: 'text', placeholder: 'anita@greenvalley.edu' },
      { label: 'Employee ID', type: 'text', placeholder: 'TCH-201' },
      { label: 'Qualification', type: 'text', placeholder: 'M.Sc. Mathematics, B.Ed' },
      { label: 'Upload photo', type: 'file' },
      { label: 'Assign subject', type: 'select', options: ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'] },
      { label: 'Assign class', type: 'select', options: ['Class 5', 'Class 6', 'Class 8', 'Class 10'] },
      { label: 'Assign section', type: 'select', options: ['A', 'B'] },
      { label: 'Enable login', type: 'toggle' },
    ],
  },
];

const studentForm: FormSection[] = [
  {
    title: 'Student Details',
    description: 'Create the student identity and class placement record.',
    fields: [
      { label: 'Name', type: 'text', placeholder: 'Jitendra Sharma' },
      { label: 'Student ID', type: 'text', placeholder: 'STD-501' },
      { label: 'Roll number', type: 'text', placeholder: '12' },
      { label: 'DOB', type: 'date' },
      { label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
      { label: 'Mobile', type: 'text', placeholder: '+91 98111 00101' },
      { label: 'Class', type: 'select', options: ['Class 5', 'Class 6', 'Class 8', 'Class 10'] },
      { label: 'Section', type: 'select', options: ['A', 'B'] },
      { label: 'Photo', type: 'file' },
    ],
  },
  {
    title: 'Parent Details',
    description: 'Link the child to a parent account and optional login access.',
    fields: [
      { label: 'Parent name', type: 'text', placeholder: 'Rohit Sharma' },
      { label: 'Relation', type: 'select', options: ['Father', 'Mother', 'Guardian'] },
      { label: 'Mobile', type: 'text', placeholder: '+91 98111 00101' },
      { label: 'Email', type: 'text', placeholder: 'rohit@example.com' },
      { label: 'Enable parent login', type: 'toggle' },
    ],
  },
];

const subjectForm: FormSection[] = [
  {
    title: 'Add Subject',
    description: 'Create subject ownership for classes and teachers.',
    fields: [
      { label: 'Subject name', type: 'text', placeholder: 'Mathematics' },
      { label: 'Subject code', type: 'text', placeholder: 'MATH-08' },
      { label: 'Class', type: 'select', options: ['Class 5A', 'Class 6B', 'Class 8A', 'Class 10B'] },
      { label: 'Teacher', type: 'select', options: ['Anita Verma', 'Rajesh Singh', 'Meena Joshi', 'Karan Shah'] },
      { label: 'Description', type: 'textarea', placeholder: 'Number systems, fractions, decimals, and problem solving.' },
      { label: 'Status', type: 'select', options: ['Active', 'Draft'] },
    ],
  },
];

const noticeForm: FormSection[] = [
  {
    title: 'Create Notice',
    description: 'Publish announcements with audience targeting and notification support.',
    fields: [
      { label: 'Title', type: 'text', placeholder: 'Annual Day Announcement' },
      { label: 'Description', type: 'textarea', placeholder: 'Annual Day rehearsal will begin from Monday in the main auditorium.' },
      { label: 'Audience', type: 'select', options: ['All', 'Students', 'Parents', 'Teachers', 'School Admin'] },
      { label: 'Attachment', type: 'file' },
      { label: 'Publish date', type: 'date' },
      { label: 'Send notification', type: 'toggle' },
    ],
  },
];

const uploadVideoForm: FormSection[] = [
  {
    title: 'Upload Video',
    description: 'Assign structured video learning to the right class, section, and chapter.',
    fields: [
      { label: 'Class', type: 'select', options: ['Class 5A', 'Class 6B', 'Class 8A', 'Class 10B'] },
      { label: 'Section', type: 'select', options: ['A', 'B'] },
      { label: 'Subject', type: 'select', options: ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'] },
      { label: 'Chapter', type: 'text', placeholder: 'Fractions and Decimals' },
      { label: 'Video title', type: 'text', placeholder: 'Fractions Revision Session' },
      { label: 'Description', type: 'textarea', placeholder: 'Key revision concepts and solved examples for fractions.' },
      { label: 'Video upload or URL', type: 'file' },
      { label: 'Notes PDF', type: 'file' },
      { label: 'Due date', type: 'date' },
      { label: 'Notify students', type: 'toggle' },
    ],
  },
];

const homeworkForm: FormSection[] = [
  {
    title: 'Create Homework',
    description: 'Plan homework, due dates, marks, and notifications in one step.',
    fields: [
      { label: 'Homework title', type: 'text', placeholder: 'Science Project' },
      { label: 'Class', type: 'select', options: ['Class 5A', 'Class 6B', 'Class 8A', 'Class 10B'] },
      { label: 'Section', type: 'select', options: ['A', 'B'] },
      { label: 'Subject', type: 'select', options: ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'] },
      { label: 'Chapter', type: 'text', placeholder: 'Chapter 5' },
      { label: 'Description', type: 'textarea', placeholder: 'Build a working model and upload a photo with explanation.' },
      { label: 'Attachment', type: 'file' },
      { label: 'Due date', type: 'date' },
      { label: 'Total marks', type: 'text', placeholder: '40' },
      { label: 'Notify students', type: 'toggle' },
    ],
  },
];

const quizForm: FormSection[] = [
  {
    title: 'Quiz Setup',
    description: 'Define the quiz schedule, marks, and section audience.',
    fields: [
      { label: 'Title', type: 'text', placeholder: 'Science Chapter 5 Quiz' },
      { label: 'Class', type: 'select', options: ['Class 5A', 'Class 6B', 'Class 8A', 'Class 10B'] },
      { label: 'Section', type: 'select', options: ['A', 'B'] },
      { label: 'Subject', type: 'select', options: ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'] },
      { label: 'Chapter', type: 'text', placeholder: 'Chapter 5' },
      { label: 'Start date and time', type: 'date' },
      { label: 'End date and time', type: 'date' },
      { label: 'Duration', type: 'text', placeholder: '30 minutes' },
      { label: 'Total marks', type: 'text', placeholder: '20' },
      { label: 'Passing marks', type: 'text', placeholder: '8' },
    ],
  },
  {
    title: 'Question Builder',
    description: 'Static mock UI for question creation and correct answer selection.',
    fields: [
      { label: 'Question text', type: 'textarea', placeholder: 'Which process helps plants make food?' },
      { label: 'Option A', type: 'text', placeholder: 'Photosynthesis' },
      { label: 'Option B', type: 'text', placeholder: 'Respiration' },
      { label: 'Option C', type: 'text', placeholder: 'Digestion' },
      { label: 'Option D', type: 'text', placeholder: 'Condensation' },
      { label: 'Correct answer', type: 'select', options: ['Option A', 'Option B', 'Option C', 'Option D'] },
      { label: 'Explanation', type: 'textarea', placeholder: 'Photosynthesis uses sunlight, carbon dioxide, and water.' },
    ],
  },
];

const attendanceForm: FormSection[] = [
  {
    title: 'Mark Attendance',
    description: 'Capture attendance for one section and notify students and parents.',
    fields: [
      { label: 'Class', type: 'select', options: ['Class 5A', 'Class 6B', 'Class 8A', 'Class 10B'] },
      { label: 'Section', type: 'select', options: ['A', 'B'] },
      { label: 'Date', type: 'date' },
    ],
  },
];

const studentHomeworkSubmitForm: FormSection[] = [
  {
    title: 'Submit Homework',
    description: 'Upload the final answer file and send it for teacher review.',
    fields: [
      { label: 'Homework file', type: 'file', helperText: 'Supported files: PDF, JPG, PNG.' },
      { label: 'Student note', type: 'textarea', placeholder: 'Added project photos and handwritten explanation pages.' },
    ],
  },
];

const quizAttemptForm: FormSection[] = [
  {
    title: 'Quiz Attempt',
    description: 'Mock question flow with timer, previous, next, and final submission.',
    fields: [
      { label: 'Timer', type: 'text', placeholder: '24:18 remaining' },
      { label: 'Question 1', type: 'textarea', placeholder: 'Which fraction is equal to 0.5?' },
      { label: 'Option A', type: 'text', placeholder: '1/2' },
      { label: 'Option B', type: 'text', placeholder: '2/5' },
      { label: 'Option C', type: 'text', placeholder: '3/8' },
      { label: 'Option D', type: 'text', placeholder: '4/9' },
    ],
  },
];

const superAdminScreens: ScreenSpec[] = [
  {
    path: '/super-admin/dashboard',
    role: 'super-admin',
    label: 'Dashboard',
    title: 'iSparx Super Admin Dashboard',
    description: 'Monitor platform growth, active schools, revenue, and subscription health.',
    nav: true,
    metrics: [
      { label: 'Total Schools', value: '128', change: '+12 this month', tone: 'primary' },
      { label: 'Active Schools', value: '121', change: '94% healthy', tone: 'success' },
      { label: 'Inactive Schools', value: '7', change: '2 under review', tone: 'warning' },
      { label: 'Total Students', value: '42,580', change: '+1,440 learners', tone: 'secondary' },
      { label: 'Total Teachers', value: '2,960', change: '+126 teachers', tone: 'primary' },
      { label: 'Monthly Revenue', value: 'Rs 18.4L', change: '+9.8% vs last month', tone: 'success' },
      { label: 'Expiring Subscriptions', value: '14', change: '6 need action this week', tone: 'warning' },
    ],
    quickActions: [
      { label: 'Create New School', description: 'Onboard a school with subdomain, plan, and admin user.' },
      { label: 'Add Subscription Plan', description: 'Launch a new commercial package for schools.' },
      { label: 'View Billing', description: 'Track invoices, due dates, and reminders.' },
      { label: 'Export Report', description: 'Share platform performance with investors and stakeholders.' },
      { label: 'AI Modules', description: 'Control platform-wide AI feature availability across schools.' },
      { label: 'AI Usage', description: 'Monitor indexed sources, AI questions, costs, and failures.' },
    ],
    chart: {
      title: 'Monthly School Growth',
      description: 'New school creation across the last six months.',
      data: [
        { label: 'Jan', value: 8 },
        { label: 'Feb', value: 11 },
        { label: 'Mar', value: 13 },
        { label: 'Apr', value: 10 },
        { label: 'May', value: 15 },
        { label: 'Jun', value: 18 },
      ],
    },
    secondaryChart: {
      title: 'Subscription Revenue Trend',
      description: 'Recurring SaaS revenue by month in lakhs.',
      data: [
        { label: 'Jan', value: 10 },
        { label: 'Feb', value: 11 },
        { label: 'Mar', value: 13 },
        { label: 'Apr', value: 15 },
        { label: 'May', value: 17 },
        { label: 'Jun', value: 18 },
      ],
    },
    timeline: dashboardTimeline,
    cards: [
      { title: 'AI Platform Overview', description: 'Active AI Schools: 81 | Total AI Questions: 25,580', tone: 'primary' },
      { title: 'Sources Indexed', description: '142,410 approved learning sources are available to school AI layers.', tone: 'success' },
      { title: 'Estimated AI Cost', description: 'Projected platform cost this month: Rs 58,000', tone: 'warning' },
      { title: 'Failed Indexing Jobs', description: '12 source jobs need retry or source cleanup.', tone: 'destructive' },
    ],
  },
  {
    path: '/super-admin/schools',
    role: 'super-admin',
    label: 'Schools',
    title: 'Schools',
    description: 'Review school onboarding, plan limits, contact ownership, and subscription status.',
    nav: true,
    filters: ['Search', 'Active', 'Inactive', 'Expiring Soon', 'Plan'],
    table: {
      columns: ['School', 'Subdomain', 'City', 'Contact', 'Phone', 'Plan', 'Student Limit', 'Status', 'Expiry'],
      rows: schools,
    },
    cards: [
      { title: 'Portfolio Health', description: '121 active schools and 14 renewals due this quarter.', tone: 'success' },
      { title: 'Onboarding Queue', description: '5 new schools are in draft stage awaiting admin verification.', tone: 'warning' },
      { title: 'Subdomain Coverage', description: 'All live schools have branded placeholder domains configured.', tone: 'primary' },
    ],
  },
  {
    path: '/super-admin/schools/create',
    role: 'super-admin',
    label: 'Create School',
    title: 'Create New School',
    description: 'Set up a white-label school workspace with branding, plan, and first admin account.',
    nav: false,
    form: createSchoolForm,
    formSubmitLabel: 'Create School',
    successMessage: 'School created successfully. School Admin can now login and complete school setup.',
    cards: [
      { title: 'Subdomain Preview', description: 'greenvalley.isparxlearn.com', value: 'Available', tone: 'primary' },
      { title: 'Branding Preview', description: 'Logo placeholder, blue accent, and premium dashboard shell.', tone: 'secondary' },
      { title: 'Activation Readiness', description: 'Draft schools can be reviewed before sending credentials.', tone: 'warning' },
    ],
  },
  {
    path: '/super-admin/subscription-plans',
    role: 'super-admin',
    label: 'Subscription Plans',
    title: 'Subscription Plans',
    description: 'Compare pricing, limits, AI access, and report tiers for every school package.',
    nav: true,
    table: {
      columns: ['Plan', 'Limits', 'Storage', 'Video Upload', 'Parent App', 'Reports', 'AI Teacher', 'Monthly', 'Annual', 'Status'],
      rows: subscriptionRows,
    },
    cards: [
      { title: 'Basic', description: 'For small schools starting digital learning and attendance.', value: 'Rs 9,999 / month', tone: 'muted' },
      { title: 'Standard', description: 'Best fit for growing schools needing parent app and advanced reports.', value: 'Rs 24,999 / month', tone: 'primary' },
      { title: 'Premium', description: 'High-capacity plan with AI Teacher and deeper analytics included.', value: 'Rs 44,999 / month', tone: 'success' },
      { title: 'Enterprise', description: 'Custom SaaS setup for large school groups and investors.', value: 'Custom', tone: 'secondary' },
    ],
  },
  {
    path: '/super-admin/billing',
    role: 'super-admin',
    label: 'Billing',
    title: 'Billing',
    description: 'Track invoices, payment status, due dates, and reminder workflows across schools.',
    nav: true,
    table: {
      columns: ['School', 'Plan', 'Amount', 'Status', 'Due Date', 'Invoice', 'Action'],
      rows: billingRows,
    },
    cards: [
      { title: 'Collected This Month', description: 'Rs 16.2L received across auto-renewals and manual plans.', tone: 'success' },
      { title: 'Pending Payments', description: 'Rs 2.1L remains pending and is already in follow-up.', tone: 'warning' },
    ],
  },
  {
    path: '/super-admin/reports',
    role: 'super-admin',
    label: 'Reports',
    title: 'Platform Reports',
    description: 'Present operational, adoption, and commercial trends to internal teams and investors.',
    nav: true,
    chart: {
      title: 'Active Users Trend',
      description: 'Weekly active user volume across schools.',
      data: [
        { label: 'Week 1', value: 18000 },
        { label: 'Week 2', value: 20100 },
        { label: 'Week 3', value: 21500 },
        { label: 'Week 4', value: 22900 },
      ],
    },
    table: {
      columns: ['School Segment', 'Retention', 'ARPU', 'Support Tickets', 'Health'],
      rows: [
        ['Starter', '78%', 'Rs 8,400', '23', 'Stable'],
        ['Growth', '86%', 'Rs 18,700', '18', 'Healthy'],
        ['Premium', '91%', 'Rs 41,200', '11', 'Strong'],
      ],
    },
  },
  {
    path: '/super-admin/ai-modules',
    role: 'super-admin',
    label: 'AI Modules',
    title: 'AI Modules',
    description: 'Manage AI Learning Layer availability across all schools and plans.',
    nav: true,
    cards: aiModuleCards,
    table: superAdminAiModulesTable,
    aiView: 'super-admin-ai-modules',
  },
  {
    path: '/super-admin/ai-usage',
    role: 'super-admin',
    label: 'AI Usage',
    title: 'AI Usage',
    description: 'Monitor platform-wide AI activity, indexed content, adoption, and estimated cost.',
    nav: true,
    metrics: [
      { label: 'Total AI Questions Asked', value: '25,580', tone: 'primary' },
      { label: 'Total Sources Indexed', value: '142,410', tone: 'success' },
      { label: 'Active AI Schools', value: '81', tone: 'secondary' },
      { label: 'Estimated AI Cost', value: 'Rs 58,000', tone: 'warning' },
      { label: 'Most Used Module', value: 'Ask AI Tutor', tone: 'primary' },
      { label: 'Failed Indexing Jobs', value: '12', tone: 'destructive' },
    ],
    chart: {
      title: 'AI Usage Trend',
      description: 'Questions asked across the platform this week.',
      data: [
        { label: 'Mon', value: 3200 },
        { label: 'Tue', value: 3600 },
        { label: 'Wed', value: 3900 },
        { label: 'Thu', value: 4100 },
        { label: 'Fri', value: 4580 },
      ],
    },
    secondaryChart: {
      title: 'Cost Trend',
      description: 'Estimated weekly AI spend in rupees.',
      data: [
        { label: 'Mon', value: 7800 },
        { label: 'Tue', value: 9200 },
        { label: 'Wed', value: 10100 },
        { label: 'Thu', value: 11200 },
        { label: 'Fri', value: 12400 },
      ],
    },
    table: superAdminAiUsageTable,
    navLabel: 'AI Usage',
    aiView: 'super-admin-ai-usage',
  },
  {
    path: '/super-admin/settings',
    role: 'super-admin',
    label: 'Settings',
    title: 'Platform Settings',
    description: 'Review branding defaults, onboarding controls, support rules, and automation policies.',
    nav: true,
    cards: [
      { title: 'Default Brand Kit', description: 'Primary blue, light surfaces, and white-label logo placeholders.', tone: 'primary' },
      { title: 'Onboarding Policy', description: 'Admin credentials are shared only after payment or manual approval.', tone: 'warning' },
      { title: 'Notification Engine', description: 'Billing and subscription reminders fire daily at 6 PM.', tone: 'success' },
    ],
  },
];

const schoolAdminScreens: ScreenSpec[] = [
  {
    path: '/school-admin/dashboard',
    role: 'school-admin',
    label: 'Dashboard',
    title: 'School Admin Dashboard',
    description: 'Manage academic setup, operations, teachers, students, and daily learning readiness.',
    nav: true,
    metrics: [
      { label: 'Total Students', value: '1,248', change: '+24 this month', tone: 'primary' },
      { label: 'Total Teachers', value: '74', change: '4 pending approvals', tone: 'secondary' },
      { label: 'Total Classes', value: '26', change: 'Across 4 grade bands', tone: 'muted' },
      { label: 'Total Subjects', value: '42', change: '5 drafts', tone: 'primary' },
      { label: "Today's Attendance", value: '93%', change: '+2% vs yesterday', tone: 'success' },
      { label: 'Pending Homework', value: '18', change: '8 need review', tone: 'warning' },
      { label: 'Active Quizzes', value: '6', change: '2 live today', tone: 'secondary' },
      { label: 'Notices Published', value: '11', change: '3 scheduled', tone: 'primary' },
    ],
    checklist: [
      'Create Academic Year',
      'Create Classes',
      'Create Sections',
      'Add Teachers',
      'Add Students',
      'Add Parents',
      'Assign Subjects',
      'Start Learning Content',
    ],
    quickActions: [
      { label: 'Create Academic Year', description: 'Set the current cycle to 2026-2027.' },
      { label: 'Add Teacher', description: 'Invite the next faculty member with subject assignments.' },
      { label: 'Add Student', description: 'Enroll a learner and link a parent contact.' },
      { label: 'Add Subject', description: 'Attach chapters and teacher ownership.' },
      { label: 'Create Notice', description: 'Publish a school-wide announcement.' },
      { label: 'Source Library', description: 'Approve and index notes, worksheets, transcripts, and question banks.' },
      { label: 'AI Settings', description: 'Control student, teacher, parent, and rewards AI access.' },
      { label: 'AI Usage', description: 'Monitor questions asked, sources indexed, and module usage.' },
    ],
    chart: {
      title: 'Attendance Trend',
      description: 'Attendance pattern across the current week.',
      data: [
        { label: 'Mon', value: 91 },
        { label: 'Tue', value: 94 },
        { label: 'Wed', value: 92 },
        { label: 'Thu', value: 95 },
        { label: 'Fri', value: 93 },
      ],
    },
    secondaryChart: {
      title: 'Homework Submission Rate',
      description: 'Submission completion by class cluster.',
      data: [
        { label: 'Class 5', value: 78 },
        { label: 'Class 6', value: 84 },
        { label: 'Class 8', value: 89 },
        { label: 'Class 10', value: 81 },
      ],
    },
    cards: [
      { title: 'AI Learning Layer', description: 'Source Library, AI Settings, AI Usage, and Rewards Engine are active.', tone: 'primary' },
      { title: 'AI Tutor', description: 'Enabled for students using school-approved indexed content only.', tone: 'success' },
      { title: 'Teacher AI Tools', description: 'Lesson plans, quizzes, feedback, and homework generators are enabled.', tone: 'secondary' },
      { title: 'Indexed Sources', description: '42 approved sources are already available to the AI layer.', tone: 'warning' },
    ],
  },
  {
    path: '/school-admin/academic-years',
    role: 'school-admin',
    label: 'Academic Years',
    title: 'Academic Years',
    description: 'Manage the current school year and archive past sessions cleanly.',
    nav: true,
    cards: [
      { title: 'Current Academic Year', description: '2026-2027', value: '01 Apr 2026 - 31 Mar 2027', tone: 'success' },
      { title: 'Previous Academic Year', description: '2025-2026 remains available for archived reports.', tone: 'muted' },
    ],
    table: {
      columns: ['Academic Year', 'Start Date', 'End Date', 'Status', 'Actions'],
      rows: [
        ['2026-2027', '01 Apr 2026', '31 Mar 2027', 'Active', 'Edit'],
        ['2025-2026', '01 Apr 2025', '31 Mar 2026', 'Closed', 'View'],
        ['2024-2025', '01 Apr 2024', '31 Mar 2025', 'Archived', 'View'],
      ],
    },
    form: academicYearForm,
    formSubmitLabel: 'Save Academic Year',
    successMessage: 'Academic year saved successfully and is ready for class mapping.',
  },
  {
    path: '/school-admin/classes-sections',
    role: 'school-admin',
    label: 'Classes & Sections',
    title: 'Classes and Sections',
    description: 'Organize classes, sections, teacher ownership, capacity, and subject coverage.',
    nav: true,
    cards: [
      { title: 'Class 5', description: 'Sections A, B | 82 students | 6 subjects | Karan Shah', tone: 'primary' },
      { title: 'Class 6', description: 'Sections A, B | 88 students | 7 subjects | Meena Joshi', tone: 'secondary' },
      { title: 'Class 8', description: 'Sections A, B | 96 students | 8 subjects | Anita Verma', tone: 'success' },
      { title: 'Class 10', description: 'Sections A, B | 74 students | 9 subjects | Rajesh Singh', tone: 'warning' },
    ],
    form: classSectionForm,
    formSubmitLabel: 'Save Class Setup',
    successMessage: 'Class and section setup saved successfully.',
  },
  {
    path: '/school-admin/teachers',
    role: 'school-admin',
    label: 'Teachers',
    title: 'Teachers',
    description: 'Manage teacher records, login access, and academic assignments.',
    nav: true,
    table: {
      columns: ['Name', 'Mobile', 'Email', 'Employee ID', 'Subjects', 'Classes', 'Login', 'Status'],
      rows: teachers,
    },
    form: teacherForm,
    formSubmitLabel: 'Add Teacher',
    successMessage: 'Teacher profile saved and assigned to selected class sections.',
  },
  {
    path: '/school-admin/students',
    role: 'school-admin',
    label: 'Students',
    title: 'Students',
    description: 'Track admissions, parent links, class placement, and student access status.',
    nav: true,
    filters: ['Academic Year', 'Class', 'Section', 'Search'],
    table: {
      columns: ['Student Name', 'Student ID', 'Roll', 'Class', 'Section', 'Parent', 'Login', 'Status'],
      rows: students,
    },
    form: studentForm,
    formSubmitLabel: 'Add Student',
    successMessage: 'Student record created and linked to the selected parent contact.',
  },
  {
    path: '/school-admin/parents',
    role: 'school-admin',
    label: 'Parents',
    title: 'Parents',
    description: 'Monitor parent access, child links, and communication readiness.',
    nav: true,
    table: {
      columns: ['Parent Name', 'Relation', 'Mobile', 'Email', 'Linked Child', 'Class', 'Login'],
      rows: parents,
    },
  },
  {
    path: '/school-admin/subjects',
    role: 'school-admin',
    label: 'Subjects',
    title: 'Subjects',
    description: 'Assign teachers, subject codes, chapters, and status per class.',
    nav: true,
    table: {
      columns: ['Subject Name', 'Subject Code', 'Class', 'Assigned Teacher', 'Chapters', 'Status'],
      rows: subjects,
    },
    form: subjectForm,
    formSubmitLabel: 'Add Subject',
    successMessage: 'Subject added successfully and is ready for course content.',
  },
  {
    path: '/school-admin/courses',
    role: 'school-admin',
    label: 'Courses',
    title: 'Courses',
    description: 'Review the current learning content catalog across subjects and classes.',
    nav: true,
    cards: [
      { title: 'Mathematics', description: '12 chapters | 28 videos | 84% published', tone: 'primary' },
      { title: 'Science', description: '10 chapters | 22 videos | 78% published', tone: 'success' },
      { title: 'English', description: '9 chapters | 16 videos | 66% published', tone: 'secondary' },
      { title: 'Social Studies', description: '11 chapters | 18 videos | 72% published', tone: 'warning' },
    ],
  },
  {
    path: '/school-admin/homework',
    role: 'school-admin',
    label: 'Homework',
    title: 'Homework',
    description: 'Monitor school-wide homework creation, submission load, and review backlog.',
    nav: true,
    table: {
      columns: ['Homework', 'Class', 'Subject', 'Due Date', 'Marks', 'Status'],
      rows: homeworkRows,
    },
  },
  {
    path: '/school-admin/quizzes',
    role: 'school-admin',
    label: 'Quizzes',
    title: 'Quizzes',
    description: 'Review quiz readiness, scheduling, and completion across sections.',
    nav: true,
    table: {
      columns: ['Quiz', 'Class', 'Subject', 'Schedule', 'Marks', 'Status'],
      rows: quizRows,
    },
  },
  {
    path: '/school-admin/attendance',
    role: 'school-admin',
    label: 'Attendance',
    title: 'Attendance',
    description: 'See attendance progress and identify gaps before parent notifications go out.',
    nav: true,
    chart: {
      title: 'Class-wise Student Count',
      description: 'Enrollment mix aligned to attendance review.',
      data: [
        { label: 'Class 5', value: 82 },
        { label: 'Class 6', value: 88 },
        { label: 'Class 8', value: 96 },
        { label: 'Class 10', value: 74 },
      ],
    },
    cards: [
      { title: 'Present Today', description: '1,161 students marked present.', tone: 'success' },
      { title: 'Late Arrivals', description: '28 students were marked late today.', tone: 'warning' },
      { title: 'Leave Requests', description: '12 approved leave entries pending review.', tone: 'secondary' },
    ],
  },
  {
    path: '/school-admin/notices',
    role: 'school-admin',
    label: 'Notices',
    title: 'Notices',
    description: 'Publish notices for selected audiences with static attachments and notifications.',
    nav: true,
    table: {
      columns: ['Notice Title', 'Audience', 'Date', 'Posted By', 'Status'],
      rows: noticeRows,
    },
    form: noticeForm,
    formSubmitLabel: 'Publish Notice',
    successMessage: 'Notice prepared successfully and queued for audience notifications.',
  },
  {
    path: '/school-admin/reports',
    role: 'school-admin',
    label: 'Reports',
    title: 'School Reports',
    description: 'View student performance, attendance, homework completion, and teacher activity.',
    nav: true,
    filters: ['Class', 'Section', 'Subject', 'Date Range'],
    chart: {
      title: 'Quiz Performance Summary',
      description: 'Average scores by class group.',
      data: [
        { label: 'Class 5', value: 78 },
        { label: 'Class 6', value: 81 },
        { label: 'Class 8', value: 87 },
        { label: 'Class 10', value: 85 },
      ],
    },
    table: {
      columns: ['Class', 'Attendance %', 'Average Quiz %', 'Homework %', 'Health'],
      rows: reportRows,
    },
  },
  {
    path: '/school-admin/source-library',
    role: 'school-admin',
    label: 'Source Library',
    title: 'Source Library',
    description: 'Upload and manage school-approved content used by AI Tutor and Teacher AI Tools.',
    nav: true,
    metrics: [
      { label: 'Total Sources', value: `${aiSources.length}`, tone: 'primary' },
      { label: 'Indexed Sources', value: `${aiSources.filter((source) => source.status === 'Indexed').length}`, tone: 'success' },
      { label: 'Processing', value: `${aiSources.filter((source) => ['Extracting', 'Chunking', 'Embedding'].includes(source.status)).length}`, tone: 'warning' },
      { label: 'Failed', value: `${aiSources.filter((source) => source.status === 'Failed').length}`, tone: 'destructive' },
    ],
    form: [
      {
        title: 'Upload Source',
        description: 'Add a file, map it to a class and subject, and assign it to AI modules.',
        fields: [
          { label: 'Source file', type: 'file', helperText: 'Supported files: PDF, DOCX, TXT, PPTX' },
          { label: 'Select Class', type: 'select', options: ['Class 5A', 'Class 6B', 'Class 8A', 'Class 10B'] },
          { label: 'Select Subject', type: 'select', options: ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'] },
          { label: 'Select Chapter', type: 'text', placeholder: 'Fractions' },
          { label: 'Assign to AI Modules', type: 'text', placeholder: 'Ask AI Tutor, Smart Practice' },
        ],
      },
    ],
    formSubmitLabel: 'Upload Source',
    successMessage: 'Source uploaded successfully. Processing pipeline started in frontend demo mode.',
    table: sourceLibraryTable,
    aiView: 'source-library',
  },
  {
    path: '/school-admin/ai-settings',
    role: 'school-admin',
    label: 'AI Settings',
    title: 'AI Settings',
    description: 'Configure AI access and safety controls for your school.',
    nav: true,
    cards: [
      { title: 'Current AI Plan', description: 'Standard AI | Monthly question limit: 25,000 | Sources limit: 500', tone: 'primary' },
      { title: 'Student Access Status', description: 'Enabled for approved classes with citations visible.', tone: 'success' },
      { title: 'Safety Guardrails', description: 'Answers restricted to uploaded and indexed school-approved content.', tone: 'warning' },
    ],
    aiView: 'school-ai-settings',
  },
  {
    path: '/school-admin/ai-usage',
    role: 'school-admin',
    label: 'AI Usage',
    title: 'AI Usage',
    description: 'View AI usage within your school across students, teachers, parents, and rewards.',
    nav: true,
    metrics: [
      { label: 'AI Questions This Month', value: '8,420', tone: 'primary' },
      { label: 'Active AI Students', value: '468', tone: 'success' },
      { label: 'Indexed Sources', value: '42', tone: 'secondary' },
      { label: 'Teacher AI Generations', value: '312', tone: 'warning' },
      { label: 'Parent Summaries Viewed', value: '184', tone: 'primary' },
      { label: 'Rewards Issued', value: '2,940', tone: 'success' },
    ],
    chart: {
      title: 'AI Usage By Module',
      description: 'Most-used school AI modules this month.',
      data: [
        { label: 'Ask AI Tutor', value: 3400 },
        { label: 'Smart Practice', value: 1820 },
        { label: 'Teacher Tools', value: 960 },
        { label: 'Rewards', value: 1240 },
      ],
    },
    secondaryChart: {
      title: 'AI Questions By Subject',
      description: 'Subject demand across student conversations.',
      data: [
        { label: 'Math', value: 1800 },
        { label: 'Science', value: 1400 },
        { label: 'English', value: 920 },
        { label: 'Social', value: 600 },
      ],
    },
    table: schoolAiUsageTable,
    aiView: 'school-ai-usage',
  },
  {
    path: '/school-admin/settings',
    role: 'school-admin',
    label: 'Settings',
    title: 'School Settings',
    description: 'Manage academic defaults, notices, branding placeholders, and staff access policy.',
    nav: true,
    cards: [
      { title: 'School Branding', description: 'Logo placeholder, color accent, and letterhead preview available.', tone: 'primary' },
      { title: 'Current Academic Year', description: '2026-2027 is live for all class operations.', tone: 'success' },
      { title: 'Access Governance', description: 'Teachers and parents receive credentials only after approval.', tone: 'warning' },
    ],
  },
];

const principalScreens: ScreenSpec[] = [
  {
    path: '/principal/dashboard',
    role: 'principal',
    label: 'Dashboard',
    title: 'Principal Dashboard',
    description: 'Track read-only school performance, teaching activity, and low-performing cohorts.',
    nav: true,
    metrics: [
      { label: 'Total Students', value: '1,248', tone: 'primary' },
      { label: 'Total Teachers', value: '74', tone: 'secondary' },
      { label: 'Attendance Today', value: '93%', tone: 'success' },
      { label: 'Average Quiz Score', value: '86%', tone: 'primary' },
      { label: 'Homework Completion', value: '82%', tone: 'success' },
      { label: 'Low Performing Students', value: '46', tone: 'warning' },
      { label: 'Top Performing Classes', value: 'Class 8A', tone: 'secondary' },
    ],
    quickActions: [
      { label: 'View Reports', description: 'Open performance snapshots across classes and subjects.' },
      { label: 'Send Notice', description: 'Share a leadership update with students, staff, or parents.' },
      { label: 'View Low Performing Students', description: 'Identify support opportunities quickly.' },
    ],
    chart: {
      title: 'Class-wise Performance',
      description: 'Average academic health by class.',
      data: [
        { label: 'Class 5A', value: 78 },
        { label: 'Class 6B', value: 84 },
        { label: 'Class 8A', value: 89 },
        { label: 'Class 10B', value: 86 },
      ],
    },
    secondaryChart: {
      title: 'Monthly Attendance',
      description: 'Attendance trend at school level.',
      data: [
        { label: 'Jan', value: 90 },
        { label: 'Feb', value: 92 },
        { label: 'Mar', value: 93 },
        { label: 'Apr', value: 94 },
        { label: 'May', value: 92 },
      ],
    },
    cards: [
      { title: 'AI Insights', description: 'Fractions, grammar tenses, and light reflection are the top weak topics this week.', tone: 'primary' },
    ],
  },
  {
    path: '/principal/student-reports',
    role: 'principal',
    label: 'Student Reports',
    title: 'Student Reports',
    description: 'Review academic outcomes and identify learners needing intervention.',
    nav: true,
    table: {
      columns: ['Class', 'Attendance %', 'Average Quiz %', 'Homework %', 'Health'],
      rows: reportRows,
    },
  },
  {
    path: '/principal/teacher-reports',
    role: 'principal',
    label: 'Teacher Reports',
    title: 'Teacher Reports',
    description: 'Check teacher distribution, coverage, and learning delivery activity.',
    nav: true,
    table: {
      columns: ['Name', 'Mobile', 'Email', 'Employee ID', 'Subjects', 'Classes', 'Login', 'Status'],
      rows: teachers,
    },
  },
  {
    path: '/principal/attendance-reports',
    role: 'principal',
    label: 'Attendance Reports',
    title: 'Attendance Reports',
    description: 'Review attendance summaries and identify sections with sustained dips.',
    nav: true,
    chart: {
      title: 'Attendance by Class',
      description: 'Current monthly school attendance.',
      data: [
        { label: 'Class 5A', value: 96 },
        { label: 'Class 6B', value: 94 },
        { label: 'Class 8A', value: 91 },
        { label: 'Class 10B', value: 88 },
      ],
    },
  },
  {
    path: '/principal/quiz-reports',
    role: 'principal',
    label: 'Quiz Reports',
    title: 'Quiz Reports',
    description: 'Compare quiz output and spotlight sections needing support.',
    nav: true,
    table: {
      columns: ['Quiz', 'Class', 'Subject', 'Schedule', 'Marks', 'Status'],
      rows: quizRows,
    },
  },
  {
    path: '/principal/homework-reports',
    role: 'principal',
    label: 'Homework Reports',
    title: 'Homework Reports',
    description: 'Review homework volume, timely submissions, and feedback consistency.',
    nav: true,
    table: {
      columns: ['Homework', 'Class', 'Subject', 'Due Date', 'Marks', 'Status'],
      rows: homeworkRows,
    },
  },
  {
    path: '/principal/notices',
    role: 'principal',
    label: 'Notices',
    title: 'Leadership Notices',
    description: 'Review school announcements and communication cadence.',
    nav: true,
    table: {
      columns: ['Notice Title', 'Audience', 'Date', 'Posted By', 'Status'],
      rows: noticeRows,
    },
  },
];

const teacherScreens: ScreenSpec[] = [
  {
    path: '/teacher/dashboard',
    role: 'teacher',
    label: 'Dashboard',
    title: 'Teacher Dashboard',
    description: 'Manage class delivery, content publishing, reviews, quizzes, and attendance.',
    nav: true,
    metrics: [
      { label: 'My Classes', value: '4', tone: 'primary' },
      { label: 'Videos Uploaded', value: '28', tone: 'secondary' },
      { label: 'Homework Assigned', value: '14', tone: 'primary' },
      { label: 'Homework To Review', value: '8', tone: 'warning' },
      { label: 'Active Quizzes', value: '3', tone: 'success' },
      { label: 'Attendance Pending', value: '1', tone: 'warning' },
    ],
    quickActions: [
      { label: 'Upload Video', description: 'Assign a lesson with notes and due date.' },
      { label: 'Create Homework', description: 'Publish a new assignment with marks and due date.' },
      { label: 'Create Quiz', description: 'Launch a scheduled quiz with MCQs.' },
      { label: 'Mark Attendance', description: 'Submit attendance and notify students.' },
      { label: 'Source Library', description: 'Upload notes and question banks for the AI Learning Layer.' },
      { label: 'Generate Lesson Plan', description: 'Prepare a structured class flow from approved sources.' },
      { label: 'Generate Quiz', description: 'Create AI-powered MCQ drafts from indexed content.' },
      { label: 'AI Feedback', description: 'Review AI-assisted observations for student submissions.' },
    ],
    timeline: teacherActivity,
    cards: [
      { title: 'AI Teaching Assistant', description: 'Source Library, AI Tools, Quiz Generator, and AI Feedback are ready.', tone: 'primary' },
      { title: 'Indexed Sources', description: '12 teacher-approved sources are already usable by AI tools.', tone: 'success' },
    ],
  },
  {
    path: '/teacher/classes',
    role: 'teacher',
    label: 'My Classes',
    title: 'My Classes',
    description: 'Review assigned classes, sections, strengths, and students needing support.',
    nav: true,
    cards: [
      { title: 'Class 8A', description: '32 students | Mathematics lead | 89% engagement', tone: 'primary' },
      { title: 'Class 6B', description: '28 students | English mentor | 81% engagement', tone: 'secondary' },
      { title: 'Class 10B', description: '22 students | Science support | 85% engagement', tone: 'success' },
    ],
  },
  {
    path: '/teacher/courses',
    role: 'teacher',
    label: 'Courses',
    title: 'Course Content',
    description: 'Manage the subject list, chapter progression, and assigned video assets.',
    nav: true,
    cards: [
      { title: 'Mathematics', description: 'Fractions and Decimals | 6 videos | 78% completion', tone: 'primary' },
      { title: 'Science', description: 'Chapter 5 Energy | 4 videos | 65% completion', tone: 'success' },
      { title: 'English', description: 'Essay Writing | 3 videos | 74% completion', tone: 'secondary' },
    ],
  },
  {
    path: '/teacher/videos/upload',
    role: 'teacher',
    label: 'Upload Videos',
    title: 'Upload Video',
    description: 'Attach a learning video, notes, and student notifications in one workflow.',
    nav: true,
    form: uploadVideoForm,
    formSubmitLabel: 'Save and Assign',
    successMessage: 'Video assigned successfully. Students can now continue learning from the course page.',
    cards: [
      { title: 'Preview Card', description: 'Fractions Revision Session | Class 8A | Notes attached | Notify students on', tone: 'primary' },
    ],
  },
  {
    path: '/teacher/homework/create',
    role: 'teacher',
    label: 'Homework',
    title: 'Create Homework',
    description: 'Create homework with attachments, due dates, and marks allocation.',
    nav: true,
    form: homeworkForm,
    formSubmitLabel: 'Create Homework',
    successMessage: 'Homework created successfully and shared with the selected students.',
  },
  {
    path: '/teacher/homework/review',
    role: 'teacher',
    label: 'Homework Review',
    title: 'Homework Review',
    description: 'Review student submissions, marks, feedback, and resubmission decisions.',
    nav: false,
    filters: ['Class', 'Section', 'Subject', 'Homework', 'Status'],
    table: {
      columns: ['Student', 'Roll No', 'Submitted File', 'Submitted Date', 'Status', 'Marks', 'Feedback'],
      rows: [
        ['Priya Mehta', '08', 'math-assignment.pdf', '08 Jun 2026', 'Submitted', 'Pending', 'Need review'],
        ['Jitendra Sharma', '12', 'science-project.jpg', '09 Jun 2026', 'Reviewed', '18/20', 'Good explanation'],
        ['Aarav Shah', '03', 'essay.doc', '07 Jun 2026', 'Late', 'Pending', 'Awaiting review'],
      ],
    },
    cards: [
      { title: 'Review Workflow', description: 'Preview the file, enter marks, add feedback, and request resubmission if needed.', tone: 'warning' },
    ],
  },
  {
    path: '/teacher/quizzes/create',
    role: 'teacher',
    label: 'Quizzes',
    title: 'Create Quiz',
    description: 'Prepare scheduled quizzes, MCQs, marks, and passing rules.',
    nav: true,
    form: quizForm,
    formSubmitLabel: 'Publish Quiz',
    successMessage: 'Quiz published successfully and scheduled for the selected class.',
  },
  {
    path: '/teacher/attendance',
    role: 'teacher',
    label: 'Attendance',
    title: 'Attendance',
    description: 'Mark section attendance and update learner visibility for today.',
    nav: true,
    form: attendanceForm,
    formSubmitLabel: 'Submit Attendance',
    successMessage: 'Attendance saved successfully. Students and parents can now view it.',
    table: {
      columns: ['Roll Number', 'Student Name', 'Present', 'Absent', 'Late', 'Leave'],
      rows: [
        ['08', 'Priya Mehta', 'Yes', '-', '-', '-'],
        ['12', 'Jitendra Sharma', 'Yes', '-', '-', '-'],
        ['03', 'Aarav Shah', '-', 'Yes', '-', '-'],
        ['21', 'Riya Patel', '-', '-', 'Yes', '-'],
      ],
    },
  },
  {
    path: '/teacher/student-performance',
    role: 'teacher',
    label: 'Student Performance',
    title: 'Student Performance',
    description: 'Compare attendance, video completion, homework status, and quiz averages.',
    nav: true,
    table: {
      columns: ['Student Name', 'Attendance %', 'Video Completion %', 'Homework Submitted', 'Average Quiz Score', 'Remarks'],
      rows: [
        ['Priya Mehta', '97%', '88%', '6/6', '91%', 'Consistent and proactive'],
        ['Jitendra Sharma', '95%', '81%', '5/6', '88%', 'Strong momentum'],
        ['Aarav Shah', '89%', '72%', '4/6', '79%', 'Needs more practice'],
        ['Riya Patel', '86%', '77%', '5/6', '83%', 'Late submissions noticed'],
      ],
    },
  },
  {
    path: '/teacher/notices',
    role: 'teacher',
    label: 'Notices',
    title: 'Teacher Notices',
    description: 'Review school notices and publish class-level updates.',
    nav: true,
    table: {
      columns: ['Notice Title', 'Audience', 'Date', 'Posted By', 'Status'],
      rows: noticeRows,
    },
  },
  {
    path: '/teacher/source-library',
    role: 'teacher',
    label: 'Source Library',
    title: 'Source Library',
    description: 'Upload and manage school-approved content used by AI Tutor and Teacher AI Tools.',
    nav: true,
    metrics: [
      { label: 'Total Sources', value: `${aiSources.length}`, tone: 'primary' },
      { label: 'Indexed Sources', value: `${aiSources.filter((source) => source.status === 'Indexed').length}`, tone: 'success' },
      { label: 'Processing', value: `${aiSources.filter((source) => ['Extracting', 'Chunking', 'Embedding'].includes(source.status)).length}`, tone: 'warning' },
      { label: 'Failed', value: `${aiSources.filter((source) => source.status === 'Failed').length}`, tone: 'destructive' },
    ],
    form: [
      {
        title: 'Upload Source',
        description: 'Add notes, worksheets, transcripts, or question banks for AI use.',
        fields: [
          { label: 'Source file', type: 'file', helperText: 'Supported files: PDF, DOCX, TXT, PPTX' },
          { label: 'Select Class', type: 'select', options: ['Class 5A', 'Class 6B', 'Class 8A', 'Class 10B'] },
          { label: 'Select Subject', type: 'select', options: ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'] },
          { label: 'Select Chapter', type: 'text', placeholder: 'Fractions' },
          { label: 'Assign to AI Modules', type: 'text', placeholder: 'AI Tutor, Quiz Generator' },
        ],
      },
    ],
    formSubmitLabel: 'Upload Source',
    successMessage: 'Source uploaded successfully for review and indexing.',
    table: sourceLibraryTable,
    aiView: 'source-library',
  },
  {
    path: '/teacher/ai-tools',
    role: 'teacher',
    label: 'AI Tools',
    title: 'Teacher AI Tools',
    description: 'Generate lesson plans, quizzes, homework, worksheets, rubrics, and feedback summaries.',
    nav: true,
    cards: aiTeacherTools.map((tool, index) => ({
      title: tool.name,
      description: tool.description,
      tone: index % 2 === 0 ? 'primary' : 'secondary',
    })),
    aiView: 'teacher-ai-tools',
  },
  {
    path: '/teacher/ai-quiz-generator',
    role: 'teacher',
    label: 'AI Quiz Generator',
    title: 'AI Quiz Generator',
    description: 'Generate MCQs from indexed school-approved sources.',
    nav: true,
    form: [
      {
        title: 'Quiz Generation Setup',
        description: 'Pick source, chapter, difficulty, and question settings.',
        fields: [
          { label: 'Class', type: 'select', options: ['Class 5A', 'Class 6B', 'Class 8A', 'Class 10B'] },
          { label: 'Section', type: 'select', options: ['A', 'B'] },
          { label: 'Subject', type: 'select', options: ['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi'] },
          { label: 'Chapter', type: 'text', placeholder: 'Fractions' },
          { label: 'Source', type: 'select', options: aiSources.map((source) => source.title) },
          { label: 'Number of questions', type: 'text', placeholder: '10' },
          { label: 'Difficulty', type: 'select', options: ['Easy', 'Medium', 'Hard'] },
          { label: 'Question type', type: 'select', options: ['MCQ', 'Short answer', 'Mixed'] },
          { label: 'Marks', type: 'text', placeholder: '20' },
        ],
      },
    ],
    formSubmitLabel: 'Generate Quiz',
    successMessage: 'AI quiz draft generated successfully in demo mode.',
    aiView: 'teacher-ai-quiz-generator',
  },
  {
    path: '/teacher/ai-feedback',
    role: 'teacher',
    label: 'AI Feedback',
    title: 'AI Feedback',
    description: 'Review AI-assisted observations, suggested marks, and feedback drafts.',
    nav: true,
    table: {
      columns: ['Student', 'Submission', 'AI Observation', 'Suggested Marks', 'Feedback', 'Action'],
      rows: aiFeedbackRows,
    },
    aiView: 'teacher-ai-feedback',
  },
  {
    path: '/teacher/profile',
    role: 'teacher',
    label: 'Profile',
    title: 'Teacher Profile',
    description: 'View assigned classes, contact details, and current workload.',
    nav: true,
    cards: [
      { title: 'Anita Verma', description: 'Mathematics lead | Classes 8A, 8B | 7 years experience', tone: 'primary' },
      { title: 'Workload Snapshot', description: '14 homework items, 3 active quizzes, 28 uploaded videos.', tone: 'secondary' },
    ],
  },
];

const studentScreens: ScreenSpec[] = [
  {
    path: '/student/home',
    role: 'student',
    label: 'Home',
    title: 'Student Home',
    description: 'Continue learning, monitor pending work, and stay on top of attendance and quiz progress.',
    nav: true,
    mobileNav: true,
    heroTitle: 'Hello Jitendra',
    heroSubtitle: 'Class 8A | Learning streak: 15 days',
    metrics: [
      { label: 'Attendance', value: '95%', tone: 'success' },
      { label: 'Quiz Score', value: '88%', tone: 'primary' },
      { label: 'Homework Due', value: '2', tone: 'warning' },
      { label: 'Learning Streak', value: '15 Days', tone: 'secondary' },
    ],
    timeline: studentTimeline,
    cards: [
      { title: 'Continue Learning', description: 'Mathematics, Science, English are ready to resume.', tone: 'primary' },
      { title: 'Pending Homework', description: 'Science Project and Math Assignment need attention.', tone: 'warning' },
      { title: 'Announcements', description: 'Annual Day and Holiday Notice are the latest updates.', tone: 'secondary' },
      { title: 'Ask AI Tutor', description: 'Ask doubts from your school-approved notes.', tone: 'primary' },
      { title: 'AI Study Coach', description: 'Get today’s personalized study plan.', tone: 'success' },
      { title: 'Smart Practice', description: 'Practice weak topics recommended by AI.', tone: 'warning' },
      { title: 'Rewards', description: 'View points, badges, streaks, and motivation.', tone: 'secondary' },
    ],
  },
  {
    path: '/student/courses',
    role: 'student',
    label: 'Courses',
    title: 'Courses',
    description: 'Browse subjects, track progress, and continue from the next chapter.',
    nav: true,
    mobileNav: true,
    cards: [
      { title: 'Mathematics', description: 'Teacher: Anita Verma | 12 chapters | 74% progress', tone: 'primary' },
      { title: 'Science', description: 'Teacher: Rajesh Singh | 10 chapters | 68% progress', tone: 'success' },
      { title: 'English', description: 'Teacher: Meena Joshi | 9 chapters | 71% progress', tone: 'secondary' },
      { title: 'Social Studies', description: 'Teacher: Karan Shah | 11 chapters | 63% progress', tone: 'warning' },
      { title: 'Hindi', description: 'Teacher: Rajesh Singh | 8 chapters | 57% progress', tone: 'muted' },
    ],
  },
  {
    path: '/student/chapters',
    role: 'student',
    label: 'Chapters',
    title: 'Subject Chapters',
    description: 'View chapter progress, notes availability, and where to continue next.',
    nav: false,
    cards: [
      { title: 'Fractions and Decimals', description: '4 videos | Notes available | Continue learning', tone: 'primary' },
      { title: 'Force and Motion', description: '3 videos | Notes available | Start chapter', tone: 'success' },
      { title: 'Essay Writing Basics', description: '2 videos | Notes available | Completed', tone: 'secondary' },
    ],
  },
  {
    path: '/student/video-learning',
    role: 'student',
    label: 'Video Learning',
    title: 'Video Learning',
    description: 'Watch the lesson, download notes, mark completion, and move to the next video.',
    nav: false,
    cards: [
      { title: 'Video Player Placeholder', description: 'Fractions Revision Session | Mathematics | Anita Verma', tone: 'primary' },
      { title: 'Description', description: 'Key solved examples, concept recap, notes download, and practice MCQs.', tone: 'secondary' },
      { title: 'Points Reward', description: 'Marking this video complete earns 20 learning points.', tone: 'success' },
    ],
  },
  {
    path: '/student/homework',
    role: 'student',
    label: 'Homework',
    title: 'Homework',
    description: 'Track pending, submitted, and reviewed homework in a mobile-friendly list.',
    nav: true,
    mobileNav: true,
    tabs: ['Pending', 'Submitted', 'Reviewed'],
    table: {
      columns: ['Homework', 'Subject', 'Due Date', 'Status', 'Marks'],
      rows: studentHomeworkRows,
    },
  },
  {
    path: '/student/homework/detail',
    role: 'student',
    label: 'Homework Detail',
    title: 'Homework Detail',
    description: 'Open a homework item, read instructions, and upload the final answer file.',
    nav: false,
    form: studentHomeworkSubmitForm,
    formSubmitLabel: 'Submit Homework',
    successMessage: 'Homework submitted successfully. Your teacher will review it soon.',
    cards: [
      { title: 'Science Project', description: 'Teacher: Rajesh Singh | Due: 12 Jun 2026 | Download assignment brief', tone: 'primary' },
    ],
  },
  {
    path: '/student/quiz',
    role: 'student',
    label: 'Quiz',
    title: 'Quiz List',
    description: 'View upcoming, live, and attempted quizzes with clear status handling.',
    nav: true,
    mobileNav: true,
    tabs: ['Upcoming', 'Live', 'Attempted'],
    table: {
      columns: ['Subject', 'Title', 'Date/Time', 'Duration', 'Marks', 'Status'],
      rows: [
        ['Science', 'Science Chapter 5 Quiz', '05 Jun 2026 10:00', '30 min', '20', 'Live'],
        ['Mathematics', 'Fractions Test', '07 Jun 2026 11:00', '25 min', '25', 'Upcoming'],
        ['English', 'Grammar Quiz', '02 Jun 2026 09:30', '20 min', '15', 'Attempted'],
      ],
    },
  },
  {
    path: '/student/quiz/attempt',
    role: 'student',
    label: 'Quiz Attempt',
    title: 'Quiz Attempt',
    description: 'Use a timer-based screen to answer MCQs and confirm final submission.',
    nav: false,
    form: quizAttemptForm,
    formSubmitLabel: 'Submit Quiz',
    successMessage: 'Quiz submitted successfully. Your result is now ready to review.',
    cards: [
      { title: 'Submit Confirmation', description: 'Are you sure you want to submit this quiz?', tone: 'warning' },
    ],
  },
  {
    path: '/student/quiz/result',
    role: 'student',
    label: 'Quiz Result',
    title: 'Quiz Result',
    description: 'See the score breakdown, time taken, and overall performance message.',
    nav: false,
    cards: [
      { title: 'Score', description: '17 / 20 | 85% | Correct answers: 17 | Wrong answers: 3', tone: 'success' },
      { title: 'Time Taken', description: '22 minutes | Performance: Strong work on concept recall.', tone: 'primary' },
      { title: 'Next Step', description: 'Review answers and revisit the notes for the missed concepts.', tone: 'secondary' },
    ],
  },
  {
    path: '/student/attendance',
    role: 'student',
    label: 'Attendance',
    title: 'Attendance',
    description: 'Review attendance percentage and monthly presence summary.',
    nav: false,
    cards: [
      { title: 'Attendance Summary', description: '95% attendance | Present: 22 | Absent: 1 | Late: 1 | Leave: 0', tone: 'success' },
    ],
  },
  {
    path: '/student/announcements',
    role: 'student',
    label: 'Announcements',
    title: 'Announcements',
    description: 'Read the latest school and class notices in one scrollable feed.',
    nav: false,
    table: {
      columns: ['Notice Title', 'Audience', 'Date', 'Posted By', 'Status'],
      rows: noticeRows,
    },
  },
  {
    path: '/student/documents',
    role: 'student',
    label: 'Documents',
    title: 'Documents',
    description: 'Access notes, assignments, circulars, and exam timetable files.',
    nav: false,
    cards: [
      { title: 'Notes', description: 'Mathematics notes packet for Fractions and Decimals.', tone: 'primary' },
      { title: 'Assignments', description: 'Science Project worksheet and Math practice sheet.', tone: 'warning' },
      { title: 'Circulars', description: 'Holiday notice and Annual Day event circular.', tone: 'secondary' },
      { title: 'Exam Timetable', description: 'Download the term exam schedule PDF placeholder.', tone: 'success' },
    ],
  },
  {
    path: '/student/gamification',
    role: 'student',
    label: 'Gamification',
    title: 'Gamification',
    description: 'Track class rank, points, streaks, and learning achievement badges.',
    nav: false,
    cards: [
      { title: 'Class Rank', description: 'Rank 4 | 1,280 learning points | 15-day streak', tone: 'primary' },
      { title: 'Achievement Badges', description: 'Fast Learner, Homework Star, Quiz Champion, 7-Day Streak', tone: 'success' },
      { title: 'Weekly Activity', description: '5 videos completed, 2 homework submissions, 1 quiz attempt', tone: 'secondary' },
    ],
  },
  {
    path: '/student/ask-ai',
    role: 'student',
    label: 'Ask AI Tutor',
    title: 'Ask AI Tutor',
    description: 'Answers are based on your school-approved notes and chapters.',
    nav: false,
    aiView: 'student-ask-ai',
  },
  {
    path: '/student/ai-study-coach',
    role: 'student',
    label: 'AI Study Coach',
    title: 'AI Study Coach',
    description: 'Get a personalized study plan based on your mock performance and weak topics.',
    nav: false,
    cards: [
      { title: 'Today’s AI Recommendation', description: 'You are strong in homework completion but need more practice in Fractions. Start with 5 MCQs and then watch the revision video.', tone: 'primary' },
      { title: 'Motivation Message', description: motivationMessages[4], tone: 'success' },
    ],
    aiView: 'student-ai-study-coach',
  },
  {
    path: '/student/smart-practice',
    role: 'student',
    label: 'Smart Practice',
    title: 'Smart Practice',
    description: 'Practice weak topics recommended by AI and earn extra points.',
    nav: false,
    aiView: 'student-smart-practice',
  },
  {
    path: '/student/rewards',
    role: 'student',
    label: 'Rewards',
    title: 'Student Rewards',
    description: 'Track learning points, badges, streaks, class rank, and AI motivation.',
    nav: false,
    metrics: [
      { label: 'Points', value: `${rewardSummary.totalPoints}`, tone: 'primary' },
      { label: 'Current Streak', value: `${rewardSummary.currentStreak} days`, tone: 'success' },
      { label: 'Class Rank', value: rewardSummary.classRank, tone: 'warning' },
      { label: 'Badges Earned', value: `${rewardSummary.badgesEarned}`, tone: 'secondary' },
    ],
    aiView: 'student-rewards',
  },
  {
    path: '/student/profile',
    role: 'student',
    label: 'Profile',
    title: 'Student Profile',
    description: 'View learner details, class information, and current academic snapshot.',
    nav: true,
    mobileNav: true,
    cards: [
      { title: 'Jitendra Sharma', description: 'Class 8A | Roll No 12 | Student ID STD-501', tone: 'primary' },
      { title: 'Academic Snapshot', description: 'Attendance 95% | Quiz average 88% | Homework due 2', tone: 'secondary' },
    ],
  },
];

const parentScreens: ScreenSpec[] = [
  {
    path: '/parent/home',
    role: 'parent',
    label: 'Home',
    title: 'Parent Home',
    description: 'Monitor your child’s attendance, homework, quiz performance, fees, and school notices.',
    nav: true,
    mobileNav: true,
    heroTitle: 'Hello Parent',
    heroSubtitle: 'Child: Jitendra Sharma | Class 8A',
    metrics: [
      { label: 'Attendance', value: '95%', tone: 'success' },
      { label: 'Homework Pending', value: '2', tone: 'warning' },
      { label: 'Average Quiz Score', value: '88%', tone: 'primary' },
      { label: 'Fees Pending', value: 'Rs 5,000', tone: 'destructive' },
      { label: 'Notices', value: '3', tone: 'secondary' },
    ],
    timeline: parentTimeline,
    cards: [
      { title: 'Recent Homework', description: 'Science Project is pending and Math Assignment was reviewed.', tone: 'warning' },
      { title: 'Recent Quiz Result', description: 'Science Chapter 5 Quiz scored 85 percent.', tone: 'success' },
      { title: 'School Notices', description: 'Annual Day and Holiday Notice were recently published.', tone: 'secondary' },
      { title: 'AI Progress Summary', description: 'Understand your child’s performance in simple language.', tone: 'primary' },
      { title: 'Rewards Summary', description: 'See points, badges, streaks, and motivation progress.', tone: 'success' },
      { title: 'Weak Topics', description: 'Fractions and grammar tenses need extra attention this week.', tone: 'warning' },
      { title: 'Recommended Parent Action', description: 'Encourage 15 minutes of Mathematics practice before Friday.', tone: 'secondary' },
    ],
  },
  {
    path: '/parent/attendance',
    role: 'parent',
    label: 'Attendance',
    title: 'Parent Attendance',
    description: 'Track monthly attendance percentage, absent dates, and leave patterns.',
    nav: true,
    mobileNav: true,
    cards: [
      { title: 'Attendance Calendar', description: 'Present days 22 | Absent 1 | Late 1 | Leave 0', tone: 'success' },
    ],
  },
  {
    path: '/parent/homework',
    role: 'parent',
    label: 'Homework',
    title: 'Parent Homework',
    description: 'Review child homework status, marks, and teacher feedback.',
    nav: true,
    mobileNav: true,
    table: {
      columns: ['Title', 'Subject', 'Due Date', 'Status', 'Feedback'],
      rows: parentHomeworkRows,
    },
  },
  {
    path: '/parent/quiz-results',
    role: 'parent',
    label: 'Quiz',
    title: 'Quiz Results',
    description: 'See subject-wise scores, percentage, and performance messages.',
    nav: true,
    mobileNav: true,
    cards: [
      { title: 'Science Chapter 5 Quiz', description: 'Score 17/20 | 85% | Strong science understanding', tone: 'success' },
      { title: 'Mathematics Fractions Test', description: 'Upcoming on 07 Jun 2026 at 11:00 AM', tone: 'primary' },
    ],
  },
  {
    path: '/parent/fees',
    role: 'parent',
    label: 'Fees',
    title: 'Parent Fees',
    description: 'Track total fees, paid amount, pending dues, and receipt downloads.',
    nav: false,
    cards: [
      { title: 'Fee Summary', description: 'Total Rs 50,000 | Paid Rs 35,000 | Pending Rs 15,000', tone: 'destructive' },
      { title: 'Due Date', description: '15 Jun 2026 | Payment status: Pending | Download receipt placeholder', tone: 'warning' },
    ],
  },
  {
    path: '/parent/notices',
    role: 'parent',
    label: 'Notices',
    title: 'Parent Notices',
    description: 'See school notices, fee reminders, and holiday communication.',
    nav: false,
    table: {
      columns: ['Notice Title', 'Audience', 'Date', 'Posted By', 'Status'],
      rows: noticeRows,
    },
  },
  {
    path: '/parent/notifications',
    role: 'parent',
    label: 'Notifications',
    title: 'Parent Notifications',
    description: 'Stay current on attendance, homework reviews, results, and fee reminders.',
    nav: false,
    cards: notificationCards,
  },
  {
    path: '/parent/ai-progress',
    role: 'parent',
    label: 'AI Progress Summary',
    title: 'AI Progress Summary',
    description: 'Understand your child’s learning progress in simple non-technical language.',
    nav: false,
    cards: parentAiSummaryCards,
    aiView: 'parent-ai-progress',
  },
  {
    path: '/parent/rewards-summary',
    role: 'parent',
    label: 'Rewards Summary',
    title: 'Rewards Summary',
    description: 'See points, badges, streaks, class rank, and motivation status for your child.',
    nav: false,
    metrics: [
      { label: 'Total Points', value: `${rewardSummary.totalPoints}`, tone: 'primary' },
      { label: 'Current Streak', value: `${rewardSummary.currentStreak} days`, tone: 'success' },
      { label: 'Class Rank', value: rewardSummary.classRank, tone: 'warning' },
      { label: 'Badges Earned', value: `${rewardSummary.badgesEarned}`, tone: 'secondary' },
    ],
    aiView: 'parent-rewards-summary',
  },
  {
    path: '/parent/profile',
    role: 'parent',
    label: 'More',
    title: 'Parent Profile',
    description: 'View linked child information, contact details, and quick links to more tools.',
    nav: true,
    mobileNav: true,
    cards: [
      { title: 'Profile', description: 'Rohit Sharma | Linked child: Jitendra Sharma | Parent login enabled', tone: 'primary' },
      { title: 'More Links', description: 'Fees, Notices, Notifications, and receipts are available from this area.', tone: 'secondary' },
    ],
  },
];

const accountantScreens: ScreenSpec[] = [
  {
    path: '/accountant/dashboard',
    role: 'accountant',
    label: 'Dashboard',
    title: 'Accountant Dashboard',
    description: 'Track fee collection, overdue accounts, receipts, and payment follow-up.',
    nav: true,
    metrics: [
      { label: 'Total Fees', value: 'Rs 2.4Cr', tone: 'primary' },
      { label: 'Collected Fees', value: 'Rs 1.9Cr', tone: 'success' },
      { label: 'Pending Fees', value: 'Rs 42L', tone: 'warning' },
      { label: 'Overdue Payments', value: 'Rs 11L', tone: 'destructive' },
      { label: 'Receipts Generated', value: '842', tone: 'secondary' },
    ],
    cards: [
      { title: 'Collection Health', description: '79 percent collection achieved for the current cycle.', tone: 'success' },
      { title: 'Next Due Batch', description: 'Class 8A fee reminders are due this Friday.', tone: 'warning' },
      { title: 'Receipt Queue', description: '18 manual receipts require download or resend action.', tone: 'secondary' },
    ],
  },
  {
    path: '/accountant/fee-invoices',
    role: 'accountant',
    label: 'Fee Invoices',
    title: 'Fee Invoices',
    description: 'Review student-wise invoices, due dates, and fee status.',
    nav: true,
    table: {
      columns: ['Student', 'Class', 'Parent', 'Fee Amount', 'Due Date', 'Status'],
      rows: feeRows,
    },
  },
  {
    path: '/accountant/payments',
    role: 'accountant',
    label: 'Payments',
    title: 'Payments',
    description: 'Track recent collections and available payment methods.',
    nav: true,
    table: {
      columns: ['School', 'Plan', 'Amount', 'Status', 'Due Date', 'Invoice', 'Action'],
      rows: billingRows,
    },
  },
  {
    path: '/accountant/pending-fees',
    role: 'accountant',
    label: 'Pending Fees',
    title: 'Pending Fees',
    description: 'Identify parents who need payment reminders or escalations.',
    nav: true,
    table: {
      columns: ['Student', 'Class', 'Parent', 'Fee Amount', 'Due Date', 'Status'],
      rows: feeRows.filter((row) => row[5] !== 'Paid'),
    },
  },
  {
    path: '/accountant/receipts',
    role: 'accountant',
    label: 'Receipts',
    title: 'Receipts',
    description: 'Manage generated receipts and sharing status.',
    nav: true,
    table: {
      columns: ['Receipt', 'Student', 'Amount', 'Date', 'Method', 'Status'],
      rows: receiptRows,
    },
  },
  {
    path: '/accountant/reports',
    role: 'accountant',
    label: 'Reports',
    title: 'Finance Reports',
    description: 'Compare school-level fee health and account collection trends.',
    nav: true,
    chart: {
      title: 'Monthly Collection',
      description: 'Fees collected in lakhs over five months.',
      data: [
        { label: 'Feb', value: 28 },
        { label: 'Mar', value: 34 },
        { label: 'Apr', value: 39 },
        { label: 'May', value: 41 },
        { label: 'Jun', value: 43 },
      ],
    },
    table: {
      columns: ['Class', 'Attendance %', 'Average Quiz %', 'Homework %', 'Health'],
      rows: reportRows,
    },
  },
  {
    path: '/accountant/reminders',
    role: 'accountant',
    label: 'Reminders',
    title: 'Reminders',
    description: 'Prepare targeted reminders for pending and overdue fee accounts.',
    nav: true,
    cards: [
      { title: 'Due This Week', description: '34 invoices should receive soft reminders today.', tone: 'warning' },
      { title: 'Overdue Accounts', description: '11 accounts need direct follow-up and receipt history review.', tone: 'destructive' },
      { title: 'Scheduled Messages', description: 'Parents receive evening reminders with fee summary placeholders.', tone: 'secondary' },
    ],
  },
];

export const roleScreens: Record<Role, ScreenSpec[]> = {
  'super-admin': superAdminScreens,
  'school-admin': schoolAdminScreens,
  principal: principalScreens,
  teacher: teacherScreens,
  student: studentScreens,
  parent: parentScreens,
  accountant: accountantScreens,
};

export const allScreens = Object.values(roleScreens).flat();

export const fullRouteList = [
  '/',
  '/login',
  '/otp',
  '/role-detection',
  '/request-demo',
  '/invite/accept/:token',
  ...allScreens.map((screen) => screen.path),
];
