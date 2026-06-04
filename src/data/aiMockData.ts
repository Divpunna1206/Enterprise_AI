type Tone = 'primary' | 'success' | 'warning' | 'destructive' | 'secondary' | 'muted';

type DetailCard = {
  title: string;
  description: string;
  value?: string;
  tag?: string;
  tone?: Tone;
};

type TableData = {
  columns: string[];
  rows: string[][];
};

export const aiSources = [
  {
    id: 'SRC-101',
    title: 'Mathematics Chapter 5 Fractions Notes',
    type: 'PDF',
    className: 'Class 8A',
    subject: 'Mathematics',
    chapter: 'Fractions',
    uploadedBy: 'Anita Verma',
    uploadedAt: '04 Jun 2026, 09:30',
    lastIndexed: '04 Jun 2026, 10:15',
    size: '2.4 MB',
    status: 'Indexed',
    chunksCount: 42,
    citationsCount: 18,
    usedInModules: ['Ask AI Tutor', 'Smart Practice', 'AI Quiz Generator'],
  },
  {
    id: 'SRC-102',
    title: 'Science Chapter 3 Light and Reflection PDF',
    type: 'PDF',
    className: 'Class 8A',
    subject: 'Science',
    chapter: 'Light Reflection',
    uploadedBy: 'Rajesh Singh',
    uploadedAt: '03 Jun 2026, 11:15',
    lastIndexed: '04 Jun 2026, 09:10',
    size: '3.1 MB',
    status: 'Indexed',
    chunksCount: 38,
    citationsCount: 16,
    usedInModules: ['Ask AI Tutor', 'AI Study Coach'],
  },
  {
    id: 'SRC-103',
    title: 'English Grammar Worksheet',
    type: 'Worksheet',
    className: 'Class 6B',
    subject: 'English',
    chapter: 'Grammar Tenses',
    uploadedBy: 'Meena Joshi',
    uploadedAt: '02 Jun 2026, 12:45',
    lastIndexed: '03 Jun 2026, 08:40',
    size: '1.1 MB',
    status: 'Chunking',
    chunksCount: 21,
    citationsCount: 9,
    usedInModules: ['Smart Practice'],
  },
  {
    id: 'SRC-104',
    title: 'Social Studies Revision Notes',
    type: 'DOCX',
    className: 'Class 5A',
    subject: 'Social Studies',
    chapter: 'Map Reading',
    uploadedBy: 'Karan Shah',
    uploadedAt: '04 Jun 2026, 08:05',
    lastIndexed: 'Pending',
    size: '1.8 MB',
    status: 'Extracting',
    chunksCount: 0,
    citationsCount: 0,
    usedInModules: ['Teacher AI Tools'],
  },
  {
    id: 'SRC-105',
    title: 'Class 8 Question Bank',
    type: 'Question Bank',
    className: 'Class 8A',
    subject: 'Mixed',
    chapter: 'Revision',
    uploadedBy: 'School Admin',
    uploadedAt: '01 Jun 2026, 03:15',
    lastIndexed: '04 Jun 2026, 07:45',
    size: '4.2 MB',
    status: 'Indexed',
    chunksCount: 65,
    citationsCount: 28,
    usedInModules: ['Ask AI Tutor', 'AI Quiz Generator', 'Smart Practice'],
  },
  {
    id: 'SRC-106',
    title: 'Mathematics Video Transcript - Fractions',
    type: 'Video Transcript',
    className: 'Class 8A',
    subject: 'Mathematics',
    chapter: 'Fractions',
    uploadedBy: 'Anita Verma',
    uploadedAt: '04 Jun 2026, 01:20',
    lastIndexed: '04 Jun 2026, 01:45',
    size: '860 KB',
    status: 'Embedding',
    chunksCount: 14,
    citationsCount: 6,
    usedInModules: ['Ask AI Tutor', 'AI Study Coach'],
  },
  {
    id: 'SRC-107',
    title: 'Science Worksheet - Reflection Practice',
    type: 'Worksheet',
    className: 'Class 8A',
    subject: 'Science',
    chapter: 'Reflection Practice',
    uploadedBy: 'Rajesh Singh',
    uploadedAt: '31 May 2026, 04:40',
    lastIndexed: 'Failed',
    size: '920 KB',
    status: 'Failed',
    chunksCount: 0,
    citationsCount: 0,
    usedInModules: ['Smart Practice'],
  },
];

export const sourceLibraryTable: TableData = {
  columns: ['Source Title', 'Type', 'Class', 'Subject', 'Chapter', 'Status', 'Uploaded By', 'Last Indexed', 'Size', 'Actions'],
  rows: aiSources.map((source) => [
    source.title,
    source.type,
    source.className,
    source.subject,
    source.chapter,
    source.status,
    source.uploadedBy,
    source.lastIndexed,
    source.size,
    'View / Re-index / Use / Remove',
  ]),
};

export const sourcePipelineStages = ['Uploaded', 'Extracted', 'Chunked', 'Embedded', 'Indexed'];

export const aiConversations = [
  {
    question: 'Explain fractions in simple language.',
    answer:
      'Based on your Mathematics Chapter 5 notes, a fraction represents a part of a whole. If a pizza is divided into 4 equal slices and you eat 1 slice, you ate 1/4 of the pizza.',
    confidence: 94,
    citations: [
      'Mathematics Chapter 5 Fractions Notes, Page 4, Confidence 94%',
      'Class 8 Question Bank, Page 11, Confidence 88%',
    ],
    recommendations: ['Watch revision video', 'Practice 5 MCQs', 'Download notes', 'Ask follow-up'],
  },
  {
    question: 'Give me 5 practice questions from Chapter 5.',
    answer:
      'Here are five fraction practice prompts drawn from your approved sources: add 1/2 + 1/4, compare 3/8 and 1/2, convert 6/12 to simplest form, find 3/4 of 20, and identify an equivalent fraction for 2/3.',
    confidence: 91,
    citations: [
      'Class 8 Question Bank, Page 11, Confidence 91%',
      'Mathematics Chapter 5 Fractions Notes, Page 6, Confidence 86%',
    ],
    recommendations: ['Practice 5 MCQs', 'Retake quiz', 'Ask AI Tutor'],
  },
  {
    question: 'Summarize today’s Science lesson.',
    answer:
      'Today’s science lesson focused on light reflection. Reflection happens when light bounces off a surface, and the angle of incidence equals the angle of reflection.',
    confidence: 89,
    citations: [
      'Science Chapter 3 Light and Reflection PDF, Page 3, Confidence 89%',
      'Science Worksheet - Reflection Practice, Page 1, Confidence 80%',
    ],
    recommendations: ['Download notes', 'Practice 5 MCQs', 'Watch revision video'],
  },
];

export const aiTeacherTools = [
  {
    name: 'Lesson Plan Generator',
    description: 'Turn approved chapter notes into structured lesson plans.',
    outputTitle: 'Generated Lesson Plan',
    outputLines: [
      'Duration: 45 minutes',
      'Learning Objectives: Understand fraction basics and equivalent fractions.',
      'Warm-up: Use pizza slice examples to introduce the topic.',
      'Main Explanation: Define numerator and denominator with board examples.',
      'Guided Practice: Solve 5 fraction comparison questions together.',
      'Homework: Worksheet 5A with 10 MCQs and 2 word problems.',
    ],
  },
  {
    name: 'Quiz Generator',
    description: 'Generate MCQs from indexed notes and question banks.',
    outputTitle: 'Generated Quiz',
    outputLines: [
      '10 MCQs generated from Fractions chapter notes.',
      'Each question includes options, correct answer, and explanation.',
      'Difficulty mix: 4 easy, 4 medium, 2 hard.',
      'Suggested marks: 20',
    ],
  },
  {
    name: 'Homework Generator',
    description: 'Draft assignments based on class, chapter, and source.',
    outputTitle: 'Generated Homework',
    outputLines: [
      'Title: Fractions Home Practice',
      'Instructions: Solve all questions and show full steps.',
      'Questions: 8 practice items and 2 application problems.',
      'Marks: 25',
      'Suggested due date: 2 days from assignment.',
    ],
  },
  {
    name: 'Worksheet Generator',
    description: 'Prepare printable revision sheets from approved content.',
    outputTitle: 'Generated Worksheet',
    outputLines: [
      'Worksheet theme: Light Reflection quick revision.',
      'Includes 6 MCQs, 3 short answers, and 1 diagram prompt.',
      'Suggested use: pre-quiz revision or after-class reinforcement.',
    ],
  },
  {
    name: 'Rubric Generator',
    description: 'Create assessment rubrics for projects and homework.',
    outputTitle: 'Generated Rubric',
    outputLines: [
      'Criteria: Concept clarity, steps shown, neatness, application.',
      'Scoring bands: Excellent / Good / Developing / Needs Support.',
      'Best for project review and detailed homework evaluation.',
    ],
  },
  {
    name: 'Feedback Summary',
    description: 'Summarize common mistakes and next teaching actions.',
    outputTitle: 'Feedback Summary',
    outputLines: [
      'Students struggling: 8 in Class 8A',
      'Common mistakes: Missing fraction simplification steps.',
      'Suggested revision topic: Equivalent fractions',
      'Recommended next class activity: 10-minute board drill with peer checking.',
    ],
  },
];

export const aiQuizPreview = [
  'Q1. What is 1/2 + 1/4? Options: A 1/4 B 2/4 C 3/4 D 4/4. Correct: C. Explanation: Convert to common denominator.',
  'Q2. Which fraction is equivalent to 2/3? Options: A 3/6 B 4/6 C 2/6 D 5/6. Correct: B. Explanation: Multiply numerator and denominator by 2.',
  'Q3. Which is greater: 3/8 or 1/2? Correct: 1/2. Explanation: 1/2 = 4/8.',
];

export const aiFeedbackRows = [
  ['Jitendra Sharma', 'Fractions Homework', 'Good understanding but calculation steps missing', '18/25', 'Show all steps while solving fraction addition', 'Review'],
  ['Priya Mehta', 'Science Worksheet', 'Strong concept clarity, minor diagram labeling issue', '22/25', 'Label reflected ray more clearly', 'Apply Feedback'],
  ['Aarav Shah', 'Grammar Worksheet', 'Repeated tense confusion across three answers', '15/25', 'Revise present vs past tense forms', 'Send to Student'],
];

export const rewardSummary = {
  totalPoints: 1250,
  currentStreak: 15,
  classRank: '4th',
  weeklyActivities: 12,
  badgesEarned: 4,
  nextBadge: 'Consistency Hero',
};

export const rewardRules = [
  '+20 points for watching a video',
  '+25 points for submitting homework',
  '+30 points for scoring above 80% in quiz',
  '+50 bonus points for 7-day streak',
  '+10 points for daily login',
  '+15 points for completing smart practice',
];

export const rewardBadges = [
  'Fast Learner',
  'Homework Star',
  'Quiz Champion',
  '7-Day Streak',
  'Comeback Learner',
  'Consistency Hero',
  'Smart Practice Pro',
  'AI Explorer',
];

export const rewardTimeline = [
  { title: 'Watched Science video', points: '+20 points', date: 'Today' },
  { title: 'Submitted Math homework', points: '+25 points', date: 'Yesterday' },
  { title: 'Scored 88% in quiz', points: '+30 points', date: 'This week' },
  { title: 'Maintained streak', points: '+10 points', date: 'This week' },
];

export const motivationMessages = [
  'Great job, Jitendra! You completed your homework before the deadline.',
  'You are improving in Science. Try one more practice quiz to strengthen Chapter 5.',
  'Don’t worry about today’s score. AI recommends revising the Fractions video and attempting 5 MCQs.',
  'You maintained a 15-day learning streak. Keep going!',
  'You improved your quiz score by 12% this week. Excellent progress!',
];

export const weakTopics = ['Fractions', 'Grammar Tenses', 'Light Reflection', 'Map Reading'];

export const recommendedActions = ['Watch revision video', 'Practice 5 MCQs', 'Download notes', 'Ask AI Tutor', 'Retake quiz', 'Complete smart practice'];

export const superAdminAiUsageTable: TableData = {
  columns: ['School', 'AI Questions', 'Sources Indexed', 'Active Students', 'Estimated Cost', 'AI Plan', 'Status'],
  rows: [
    ['Green Valley Public School', '8,420', '42', '468', 'Rs 18,400', 'Standard AI', 'Active'],
    ['Bright Future Academy', '5,210', '31', '312', 'Rs 12,100', 'Starter AI', 'Active'],
    ['Sunrise International School', '11,950', '67', '590', 'Rs 27,500', 'Premium AI', 'Active'],
  ],
};

export const schoolAiUsageTable: TableData = {
  columns: ['Student/Teacher', 'Role', 'Module', 'Activity', 'Date', 'Status'],
  rows: [
    ['Jitendra Sharma', 'Student', 'Ask AI Tutor', 'Asked 3 questions on Fractions', '04 Jun 2026', 'Completed'],
    ['Anita Verma', 'Teacher', 'AI Quiz Generator', 'Generated Class 8A quiz draft', '04 Jun 2026', 'Completed'],
    ['Rohit Sharma', 'Parent', 'AI Progress Summary', 'Viewed weekly summary', '03 Jun 2026', 'Viewed'],
    ['Rajesh Singh', 'Teacher', 'Source Library', 'Uploaded Science reflection PDF', '03 Jun 2026', 'Indexed'],
  ],
};

export const superAdminAiModulesTable: TableData = {
  columns: ['School', 'AI Plan', 'Enabled Modules', 'Active Users', 'Monthly Usage', 'Status'],
  rows: [
    ['Green Valley Public School', 'Standard AI', '6 modules', '612', '8,420 actions', 'Active'],
    ['Bright Future Academy', 'Starter AI', '4 modules', '398', '5,210 actions', 'Active'],
    ['Sunrise International School', 'Premium AI', '8 modules', '904', '11,950 actions', 'Active'],
  ],
};

export const aiModuleCards: DetailCard[] = [
  { title: 'AI Tutor', description: 'School-approved answers with citations for students.', value: '118 schools', tone: 'primary' },
  { title: 'Source Library', description: 'Curated notes, worksheets, and transcripts for RAG.', value: '142K sources', tone: 'success' },
  { title: 'Teacher AI Tools', description: 'Lesson plans, homework, quizzes, feedback, and rubrics.', value: '96 schools', tone: 'secondary' },
  { title: 'Smart Practice', description: 'Weak-topic MCQ practice and instant feedback.', value: '73 schools', tone: 'warning' },
  { title: 'Rewards Engine', description: 'Points, streaks, badges, and motivation nudges.', value: '81 schools', tone: 'primary' },
  { title: 'Parent AI Summary', description: 'Simple progress explanation for non-technical parents.', value: '64 schools', tone: 'secondary' },
];

export const parentAiSummaryCards: DetailCard[] = [
  { title: 'Strengths', description: 'Homework submitted on time, strong Science quiz score, 15-day learning streak.', tone: 'success' },
  { title: 'Needs Attention', description: 'Fractions practice needed and grammar tense revision recommended.', tone: 'warning' },
  { title: 'AI Recommendation', description: 'Encourage 15 minutes of Mathematics practice each day this week.', tone: 'primary' },
  { title: 'Recommended Parent Action', description: 'Ask your child to complete the Fractions Smart Practice activity before Friday.', tone: 'secondary' },
];
