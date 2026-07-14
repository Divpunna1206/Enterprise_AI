# Backend API Inventory For Frontend Integration

This inventory was built from the NestJS source in `Backend_Enterprise_AI/backend/src`.

## Confirmed backend runtime details

- Global API prefix: `/api/v1`
- Swagger UI: `/api/docs`
- Health check: `/api/health`
- Validation: global `ValidationPipe` with `whitelist`, `transform`, and `forbidNonWhitelisted`
- CORS: enabled against the configured frontend origin

## Frontend baseline

- `Design_Enterprise_AI/src` currently has no live `fetch` or `axios` service layer.
- The LMS app is mock-driven through:
  - `src/app/lms/mockData.ts`
  - `src/data/aiMockData.ts`
- Existing routes should stay intact.
- Mock data should remain available as a fallback during gradual API integration.

## Source-backed route inventory

All routes below are relative to `/api/v1`.

### Auth

- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`
- `POST /auth/logout`
- `POST /auth/change-password`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

### Dashboards

- `GET /dashboards/super-admin`
- `GET /dashboards/school-admin`
- `GET /dashboards/principal`
- `GET /dashboards/teacher`
- `GET /dashboards/student`
- `GET /dashboards/parent`
- `GET /dashboards/accountant`

### Super Admin

- Organizations:
  - `GET /organizations`
  - `POST /organizations`
  - `GET /organizations/:id`
  - `PATCH /organizations/:id`
  - `PATCH /organizations/:id/status`
  - `GET /organizations/:id/dashboard-summary`
- Plans:
  - `GET /plans`
  - `POST /plans`
  - `PATCH /plans/:id`
  - `PATCH /plans/:id/toggle`
  - `DELETE /plans/:id`
- Subscriptions:
  - `GET /subscriptions`
  - `POST /subscriptions`
  - `GET /subscriptions/:id`
  - `PATCH /subscriptions/:id`
  - `PATCH /subscriptions/:id/cancel`
  - `GET /organizations/:id/subscription`
- Billing and reports:
  - `GET /reports/school-summary`
  - `GET /reports/ai-usage`
  - `GET /reports/export/csv`
  - `GET /reports/export/pdf`
- AI platform controls:
  - `GET /ai/modules`
  - `PATCH /ai/modules/:id/toggle`
  - `GET /ai/usage`

### School Admin

- Academic years:
  - `GET /academic-years`
  - `POST /academic-years`
  - `PATCH /academic-years/:id`
  - `PATCH /academic-years/:id/activate`
  - `DELETE /academic-years/:id`
- Classes and sections:
  - `GET /classes`
  - `POST /classes`
  - `GET /classes/:id`
  - `PATCH /classes/:id`
  - `DELETE /classes/:id`
  - `POST /classes/:id/sections`
  - `PATCH /sections/:id`
  - `DELETE /sections/:id`
  - `GET /classes/:id/students`
  - `GET /classes/:id/teachers`
- Teachers:
  - `GET /teachers`
  - `POST /teachers`
  - `GET /teachers/:id`
  - `PATCH /teachers/:id`
  - `DELETE /teachers/:id`
  - `POST /teachers/:id/assign-subject-class`
  - `GET /teachers/:id/classes`
- Students:
  - `GET /students`
  - `POST /students`
  - `GET /students/:id`
  - `PATCH /students/:id`
  - `DELETE /students/:id`
  - `GET /students/:id/parents`
  - `GET /students/:id/performance-summary`
- Parents:
  - `GET /parents`
  - `POST /parents`
  - `GET /parents/:id`
  - `PATCH /parents/:id`
  - `DELETE /parents/:id`
  - `POST /parents/:id/link-student`
  - `DELETE /parents/:id/unlink-student/:studentId`
  - `GET /parents/:id/children`
- Subjects:
  - `GET /subjects`
  - `POST /subjects`
  - `PATCH /subjects/:id`
  - `DELETE /subjects/:id`
- Courses and lessons:
  - `GET /courses`
  - `POST /courses`
  - `GET /courses/:id`
  - `PATCH /courses/:id`
  - `DELETE /courses/:id`
  - `PATCH /courses/:id/publish`
  - `GET /courses/:id/lessons`
  - `POST /courses/:courseId/lessons`
  - `PATCH /lessons/:id`
  - `DELETE /lessons/:id`
  - `PATCH /lessons/reorder`
- Homework:
  - `GET /homework`
  - `POST /homework`
  - `GET /homework/:id`
  - `PATCH /homework/:id`
  - `DELETE /homework/:id`
  - `PATCH /homework/:id/publish`
  - `GET /homework/:id/submissions`
  - `PATCH /homework/submissions/:submissionId/grade`
- Quizzes:
  - `GET /quizzes`
  - `POST /quizzes`
  - `GET /quizzes/:id`
  - `PATCH /quizzes/:id`
  - `DELETE /quizzes/:id`
  - `PATCH /quizzes/:id/publish`
  - `POST /quizzes/:id/questions`
  - `PATCH /quiz-questions/:id`
  - `DELETE /quiz-questions/:id`
- Attendance:
  - `POST /attendance/sessions`
  - `GET /attendance/sessions`
  - `GET /attendance/sessions/:id`
  - `POST /attendance/sessions/:id/records`
  - `PATCH /attendance/records/:id`
  - `PATCH /attendance/sessions/:id/submit`
  - `GET /attendance/class-summary`
- Reports:
  - `GET /reports/student-performance`
  - `GET /reports/teacher-performance`
  - `GET /reports/attendance`
  - `GET /reports/quiz`
  - `GET /reports/homework`
- Source library:
  - `GET /source-library`
  - `POST /source-library/upload`
  - `GET /source-library/:id`
  - `PATCH /source-library/:id`
  - `DELETE /source-library/:id`
  - `POST /source-library/:id/reindex`
  - `GET /source-library/:id/status`
- AI org controls:
  - `GET /ai/settings`
  - `PATCH /ai/settings`
  - `GET /ai/usage`

### Principal

- Dashboard:
  - `GET /dashboards/principal`
- Reports:
  - `GET /reports/student-performance`
  - `GET /reports/teacher-performance`
  - `GET /reports/attendance`
  - `GET /reports/quiz`
  - `GET /reports/homework`
- AI settings read access:
  - `GET /ai/settings`

### Teacher

- Dashboard:
  - `GET /dashboards/teacher`
- Classes:
  - `GET /classes`
  - `GET /classes/:id/students`
  - `GET /classes/:id/teachers`
- Courses and lessons:
  - `GET /courses`
  - `GET /courses/:id`
  - `GET /courses/:id/lessons`
  - `POST /courses/:courseId/lessons`
  - `PATCH /lessons/:id`
  - `DELETE /lessons/:id`
  - `PATCH /lessons/reorder`
- Videos:
  - `POST /videos/upload`
  - `GET /videos`
  - `GET /videos/:id`
  - `PATCH /videos/:id`
  - `DELETE /videos/:id`
  - `POST /videos/:id/process`
  - `GET /videos/:id/processing-status`
- Homework:
  - `GET /homework`
  - `POST /homework`
  - `GET /homework/:id/submissions`
  - `PATCH /homework/submissions/:submissionId/grade`
- Quizzes:
  - `GET /quizzes`
  - `POST /quizzes`
  - `POST /quizzes/:id/questions`
- Attendance:
  - `POST /attendance/sessions`
  - `GET /attendance/sessions`
  - `GET /attendance/sessions/:id`
  - `POST /attendance/sessions/:id/records`
  - `PATCH /attendance/records/:id`
  - `PATCH /attendance/sessions/:id/submit`
  - `GET /attendance/class-summary`
- Student performance:
  - `GET /progress/class/:classId/summary`
  - `GET /progress/student/:studentId/summary`
  - `GET /progress/student/:studentId/subjects`
- Source library:
  - `GET /source-library`
  - `POST /source-library/upload`
  - `GET /source-library/:id`
  - `PATCH /source-library/:id`
  - `DELETE /source-library/:id`
  - `POST /source-library/:id/reindex`
  - `GET /source-library/:id/status`
- AI tools:
  - `POST /ai/summary`
  - `POST /ai/worksheet`
  - `POST /ai/quiz`
  - `POST /ai/course-outline`
  - `POST /ai/feedback`
  - `GET /ai/jobs/:jobId`
- Profile:
  - `GET /users/me/profile`
  - `PATCH /users/me/profile`

### Student

- Dashboard:
  - `GET /dashboards/student`
- Courses and learning:
  - `GET /courses`
  - `GET /courses/:id`
  - `GET /courses/:id/lessons`
  - `GET /videos`
  - `GET /videos/:id`
- Homework:
  - `GET /students/me/homework`
  - `POST /homework/:id/submit`
- Quizzes:
  - `GET /students/me/quizzes`
  - `POST /quizzes/:id/start`
  - `POST /quiz-attempts/:attemptId/submit`
  - `GET /quiz-attempts/:attemptId/result`
- Attendance:
  - `GET /students/me/attendance`
- Progress:
  - `GET /students/me/progress`
- Rewards:
  - `GET /students/me/rewards`
- AI:
  - `POST /ai/ask`
  - `POST /ai/study-coach`
  - `POST /ai/quiz`
  - `GET /ai/jobs/:jobId`
  - `GET /ai/usage`
- Profile:
  - `GET /users/me/profile`
  - `PATCH /users/me/profile`

### Parent

- Dashboard:
  - `GET /dashboards/parent`
- Attendance:
  - `GET /parents/me/children-attendance`
- Homework:
  - `GET /parents/me/children-homework`
- Quiz results:
  - `GET /parents/me/children-quiz-results`
- Fees and billing:
  - `GET /parents/me/children-fees`
  - `GET /parents/me/invoices`
  - `POST /parents/me/pay-invoice/:invoiceId`
- Progress:
  - `GET /parents/me/children-progress`
- Rewards:
  - `GET /parents/me/children-rewards`
- Profile:
  - `GET /users/me/profile`
  - `PATCH /users/me/profile`

### Accountant

- `GET /dashboards/accountant`
- `GET /accountant/dashboard`
- `GET /accountant/fee-invoices`
- `GET /accountant/payments`
- `GET /accountant/pending-fees`
- `GET /accountant/receipts`
- `GET /accountant/reports`
- `POST /accountant/reminders/send`

## Frontend route to backend module mapping

### Strong direct matches

- `/super-admin/dashboard` -> `GET /dashboards/super-admin`
- `/super-admin/schools` -> `GET /organizations`
- `/super-admin/schools/create` -> `POST /organizations`
- `/super-admin/subscription-plans` -> `GET|POST|PATCH|DELETE /plans`
- `/super-admin/billing` -> `GET /subscriptions`, `GET /organizations/:id/subscription`, `GET /reports/school-summary`
- `/super-admin/reports` -> `GET /reports/school-summary`, `GET /reports/export/csv`, `GET /reports/export/pdf`
- `/super-admin/ai-modules` -> `GET /ai/modules`, `PATCH /ai/modules/:id/toggle`
- `/super-admin/ai-usage` -> `GET /ai/usage`
- `/school-admin/dashboard` -> `GET /dashboards/school-admin`
- `/school-admin/academic-years` -> `GET|POST|PATCH|DELETE /academic-years`
- `/school-admin/classes-sections` -> `GET|POST|PATCH|DELETE /classes`, `POST /classes/:id/sections`, `PATCH|DELETE /sections/:id`
- `/school-admin/teachers` -> `GET|POST|PATCH|DELETE /teachers`
- `/school-admin/students` -> `GET|POST|PATCH|DELETE /students`
- `/school-admin/parents` -> `GET|POST|PATCH|DELETE /parents`
- `/school-admin/subjects` -> `GET|POST|PATCH|DELETE /subjects`
- `/school-admin/courses` -> `GET|POST|PATCH|DELETE /courses`
- `/school-admin/homework` -> `GET|POST|PATCH|DELETE /homework`
- `/school-admin/quizzes` -> `GET|POST|PATCH|DELETE /quizzes`
- `/school-admin/attendance` -> `GET /attendance/sessions`, `POST /attendance/sessions`, `GET /attendance/class-summary`
- `/school-admin/reports` -> `GET /reports/student-performance`, `GET /reports/teacher-performance`, `GET /reports/attendance`, `GET /reports/quiz`, `GET /reports/homework`
- `/school-admin/source-library` -> `GET /source-library`, `POST /source-library/upload`
- `/school-admin/ai-settings` -> `GET|PATCH /ai/settings`
- `/school-admin/ai-usage` -> `GET /ai/usage`
- `/principal/dashboard` -> `GET /dashboards/principal`
- `/principal/student-reports` -> `GET /reports/student-performance`
- `/principal/teacher-reports` -> `GET /reports/teacher-performance`
- `/principal/attendance-reports` -> `GET /reports/attendance`
- `/principal/quiz-reports` -> `GET /reports/quiz`
- `/principal/homework-reports` -> `GET /reports/homework`
- `/teacher/dashboard` -> `GET /dashboards/teacher`
- `/teacher/classes` -> `GET /classes`
- `/teacher/courses` -> `GET /courses`
- `/teacher/videos/upload` -> `POST /videos/upload`
- `/teacher/homework/create` -> `POST /homework`
- `/teacher/homework/review` -> `GET /homework/:id/submissions`, `PATCH /homework/submissions/:submissionId/grade`
- `/teacher/quizzes/create` -> `POST /quizzes`, `POST /quizzes/:id/questions`
- `/teacher/attendance` -> `GET|POST /attendance/sessions`, `POST /attendance/sessions/:id/records`
- `/teacher/student-performance` -> `GET /progress/class/:classId/summary`, `GET /progress/student/:studentId/summary`
- `/teacher/source-library` -> `GET /source-library`, `POST /source-library/upload`
- `/teacher/ai-tools` -> `POST /ai/summary`, `POST /ai/worksheet`, `POST /ai/course-outline`
- `/teacher/ai-quiz-generator` -> `POST /ai/quiz`, `GET /ai/jobs/:jobId`
- `/teacher/ai-feedback` -> `POST /ai/feedback`, `GET /ai/jobs/:jobId`
- `/teacher/profile` -> `GET|PATCH /users/me/profile`
- `/student/home` -> `GET /dashboards/student`
- `/student/courses` -> `GET /courses`
- `/student/chapters` -> `GET /courses/:id/lessons`
- `/student/video-learning` -> `GET /videos`
- `/student/homework` -> `GET /students/me/homework`
- `/student/quiz` -> `GET /students/me/quizzes`
- `/student/quiz/attempt` -> `POST /quizzes/:id/start`, `POST /quiz-attempts/:attemptId/submit`
- `/student/quiz/result` -> `GET /quiz-attempts/:attemptId/result`
- `/student/attendance` -> `GET /students/me/attendance`
- `/student/ask-ai` -> `POST /ai/ask`, `GET /ai/jobs/:jobId`
- `/student/ai-study-coach` -> `POST /ai/study-coach`, `GET /ai/jobs/:jobId`
- `/student/smart-practice` -> likely `POST /ai/quiz` plus quiz result endpoints
- `/student/rewards` -> `GET /students/me/rewards`
- `/student/profile` -> `GET|PATCH /users/me/profile`
- `/parent/home` -> `GET /dashboards/parent`
- `/parent/attendance` -> `GET /parents/me/children-attendance`
- `/parent/homework` -> `GET /parents/me/children-homework`
- `/parent/quiz-results` -> `GET /parents/me/children-quiz-results`
- `/parent/fees` -> `GET /parents/me/children-fees`, `GET /parents/me/invoices`, `POST /parents/me/pay-invoice/:invoiceId`
- `/parent/ai-progress` -> `GET /parents/me/children-progress`
- `/parent/rewards-summary` -> `GET /parents/me/children-rewards`
- `/parent/profile` -> `GET|PATCH /users/me/profile`
- `/accountant/dashboard` -> `GET /accountant/dashboard` or `GET /dashboards/accountant`
- `/accountant/fee-invoices` -> `GET /accountant/fee-invoices`
- `/accountant/payments` -> `GET /accountant/payments`
- `/accountant/pending-fees` -> `GET /accountant/pending-fees`
- `/accountant/receipts` -> `GET /accountant/receipts`
- `/accountant/reports` -> `GET /accountant/reports`
- `/accountant/reminders` -> `POST /accountant/reminders/send`

### No clear backend match yet

- `/school-admin/notices`
- `/principal/notices`
- `/teacher/notices`
- `/student/announcements`
- `/student/documents`
- `/parent/notices`
- `/parent/notifications`
- `/super-admin/settings`
- `/school-admin/settings`

These routes should remain mock-backed unless a later backend module is added or a small compatibility endpoint is intentionally introduced.

## Safe integration rules for the next step

- Create any new API client code inside `Design_Enterprise_AI` only.
- Keep the current route structure unchanged.
- Preserve mock tables/cards/forms as fallback state if an API request is unavailable, unauthorized, or still being wired.
- Do not infer payload shapes from screen labels alone; confirm DTOs and service responses for each screen before binding forms or tables.
- Prefer additive integration:
  - read-only dashboard/table screens first
  - detail views next
  - create/update forms after DTO confirmation
  - file uploads and async AI jobs after the base auth flow is working
