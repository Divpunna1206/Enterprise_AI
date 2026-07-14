# Integration Report

## Scope completed in this pass

This pass implemented the shared frontend integration foundation plus the first live backend slice:

- API client architecture under `src/app/api/`
- Auth session management under `src/app/auth/`
- Shared hooks under `src/app/hooks/`
- Shared API/auth/dashboard typing under `src/app/types/`
- Real backend login integration
- Auth session restore using stored tokens
- Access-token injection for API calls
- One-time refresh-token retry on `401`
- Logout on refresh failure
- Role-based route protection
- Backend-driven role redirect
- Live backend dashboard integration for:
  - `SUPER_ADMIN`
  - `SCHOOL_ADMIN`
  - `PRINCIPAL`
  - `TEACHER`
  - `STUDENT`
  - `PARENT`
  - `ACCOUNTANT`

## Files changed

- `package.json`
- `package-lock.json`
- `src/app/App.tsx`
- `src/app/lms/LmsApp.tsx`
- `src/vite-env.d.ts`
- `src/app/api/client.ts`
- `src/app/api/auth.api.ts`
- `src/app/api/users.api.ts`
- `src/app/api/organizations.api.ts`
- `src/app/api/academics.api.ts`
- `src/app/api/teachers.api.ts`
- `src/app/api/students.api.ts`
- `src/app/api/parents.api.ts`
- `src/app/api/courses.api.ts`
- `src/app/api/lessons.api.ts`
- `src/app/api/videos.api.ts`
- `src/app/api/homework.api.ts`
- `src/app/api/quizzes.api.ts`
- `src/app/api/attendance.api.ts`
- `src/app/api/progress.api.ts`
- `src/app/api/reports.api.ts`
- `src/app/api/dashboards.api.ts`
- `src/app/api/ai.api.ts`
- `src/app/api/billing.api.ts`
- `src/app/api/notifications.api.ts`
- `src/app/auth/AuthContext.tsx`
- `src/app/auth/ProtectedRoute.tsx`
- `src/app/auth/roleRoutes.ts`
- `src/app/hooks/useAuth.ts`
- `src/app/hooks/useDashboard.ts`
- `src/app/hooks/usePaginatedApi.ts`
- `src/app/hooks/useApiMutation.ts`
- `src/app/types/api.types.ts`
- `src/app/types/auth.types.ts`
- `src/app/types/user.types.ts`
- `src/app/types/academic.types.ts`
- `src/app/types/dashboard.types.ts`
- `src/app/types/billing.types.ts`

## APIs connected

### Live in UI

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`
- `GET /api/v1/dashboards/super-admin`
- `GET /api/v1/dashboards/school-admin`
- `GET /api/v1/dashboards/principal`
- `GET /api/v1/dashboards/teacher`
- `GET /api/v1/dashboards/student`
- `GET /api/v1/dashboards/parent`
- `GET /api/v1/dashboards/accountant`

### Wrapped for future integration

- Organizations
- Academic years
- Classes and sections
- Subjects
- Teachers
- Students
- Parents
- Courses
- Lessons
- Videos
- Homework
- Quizzes
- Attendance
- Progress
- Reports
- AI
- Billing
- Notifications placeholder

## Hardcoded sources removed

No global mock files were deleted in this pass.

### Mock usage removed from live slices

- Login no longer uses hardcoded authenticated state.
- Role selection no longer chooses a fake user role.
- Dashboard routes no longer render mock business metrics after authentication.

### Mock usage intentionally retained

- `src/app/lms/mockData.ts`
- `src/data/aiMockData.ts`

These remain in use for non-integrated screens and for route/layout metadata.

## Remaining unsupported or still-mock-backed screens

- School management CRUD screens
- LMS course, lesson, homework, quiz, and video pages
- Attendance workflow pages
- Progress and reports pages beyond dashboard-level summaries
- AI content generation and source-library pages
- Billing detail pages and accountant data tables
- Notice, announcement, notification, and document screens
- Profile edit screens

## Backend mismatches found

- The original frontend OTP flow does not match the implemented backend auth module.
  - Backend supports email/password login and refresh.
  - OTP UI remains present but is now explicitly marked unavailable.
- Notifications endpoints are not implemented in the backend inventory.
- Notice/announcement/document routes still have no confirmed backend modules.

## Small backend fixes made

None.

## Verification run

- Frontend build: passed on June 8, 2026 via `npm.cmd run build`
- Backend build: passed on June 8, 2026 via `npm.cmd run build`
- Frontend standalone typecheck: not available as a dedicated script/config in this project
- Browser console inspection: not run in this pass
- Network inspection: not run in this pass
- Seeded-role login verification in browser: not run interactively in this pass

## Test accounts

Default seeded password unless overridden at seed time:

- `superadmin@enterprise-ai.school` / `ChangeMe123!`
- `admin@greenfield.demo.school` / `ChangeMe123!`
- `principal@greenfield.demo.school` / `ChangeMe123!`
- `accounts@greenfield.demo.school` / `ChangeMe123!`
- `teacher.ananya@greenfield.demo.school` / `ChangeMe123!`
- `teacher.rohan@greenfield.demo.school` / `ChangeMe123!`
- `parent.kapoor@greenfield.demo.school` / `ChangeMe123!`
- `parent.iyer@greenfield.demo.school` / `ChangeMe123!`
- `student.aisha@greenfield.demo.school` / `ChangeMe123!`
- `student.vihaan@greenfield.demo.school` / `ChangeMe123!`
- `student.sana@greenfield.demo.school` / `ChangeMe123!`
- `student.arjun@greenfield.demo.school` / `ChangeMe123!`
- `student.diya@greenfield.demo.school` / `ChangeMe123!`

## Known limitations

- The shared API layer is broader than the currently wired UI slice; many modules are prepared but not yet connected to page components.
- Dashboard quick-action descriptions are frontend-generated from backend paths because the dashboard payload currently returns `label` and `path`, not descriptive text.
- Dashboard charts are still empty where the backend returns empty chart arrays.
- Some dashboard-adjacent static elements remain in the UI if they are route/layout chrome rather than API-backed business records.

## Recommended next slice

Wire the school-admin management screens next in this order:

1. teachers
2. students
3. parents
4. classes and sections
5. academic years
6. subjects

That sequence reuses the new auth/api foundation and replaces the highest-volume mock tables first.

---

## Onboarding expansion completed on June 9, 2026

This pass moved the platform from basic auth/dashboard access toward intermediate SaaS onboarding for schools:

- Added a public request-demo flow at `/request-demo`
- Added protected super-admin school creation at `/super-admin/schools/create`
- Added invite validation and password setup at `/invite/accept/:token`
- Added typed onboarding API wrappers under `src/app/api/onboarding.api.ts`
- Added shared onboarding request/response types under `src/app/types/onboarding.types.ts`
- Updated auth typing so `INVITED` users are represented correctly in the frontend

### Onboarding APIs wired in UI

- `POST /api/v1/onboarding/request-demo`
- `POST /api/v1/onboarding/create-school-with-admin`
- `GET /api/v1/onboarding/invitations/:token`
- `POST /api/v1/onboarding/invitations/:token/accept`

### Frontend files added or updated for onboarding

- `src/app/api/onboarding.api.ts`
- `src/app/types/onboarding.types.ts`
- `src/app/types/auth.types.ts`
- `src/app/pages/onboarding/RequestDemoPage.tsx`
- `src/app/pages/onboarding/CreateSchoolPage.tsx`
- `src/app/pages/onboarding/AcceptInvitePage.tsx`
- `src/app/lms/LmsApp.tsx`
- `src/app/lms/mockData.ts`

### Product-rule enforcement in this slice

- No public signup route was added for teachers, students, parents, or accountants.
- The super-admin flow only creates the organization plus the first invited `SCHOOL_ADMIN`.
- The invite flow activates only the invited account after password setup.
