# School Admin CRUD Integration Report

## Scope completed on June 9, 2026

This pass replaced the mock school-admin management screens with live backend CRUD integrations for:

- `/school-admin/teachers`
- `/school-admin/students`
- `/school-admin/parents`
- `/school-admin/classes-sections`
- `/school-admin/academic-years`
- `/school-admin/subjects`

The implementation preserved the existing app shell and visual language, avoided unrelated screen changes, and used the real backend request and response shapes from the audited Nest DTOs and services.

## Backend DTO audit completed first

The frontend wiring was based on the existing backend DTOs and service return shapes for:

- Teachers:
  - `CreateTeacherDto`
  - `UpdateTeacherDto`
  - `QueryTeachersDto`
  - `AssignSubjectClassDto`
- Students:
  - `CreateStudentDto`
  - `UpdateStudentDto`
  - `QueryStudentsDto`
- Parents:
  - `CreateParentDto`
  - `UpdateParentDto`
  - `QueryParentsDto`
  - `LinkStudentDto`
- Classes and sections:
  - `CreateClassDto`
  - `UpdateClassDto`
  - `QueryClassesDto`
  - `CreateSectionDto`
  - `UpdateSectionDto`
- Academic years:
  - `CreateAcademicYearDto`
  - `UpdateAcademicYearDto`
- Subjects:
  - `CreateSubjectDto`
  - `UpdateSubjectDto`
  - `QuerySubjectsDto`

## Real API behaviors honored

- Teacher, student, and parent `:id` routes use the user id expected by the backend.
- Teacher list data comes from `TeacherProfile` records with nested `user` and `teacherAssignments`.
- Student list data comes from `StudentProfile` records with nested `user`, `class`, `section`, `academicYear`, and `_count.parentLinks`.
- Parent list data comes from `User` records with nested `parentStudentLinks`.
- Class list data comes from paginated class records with nested `academicYear`, `sections`, and `_count`.
- Academic years are returned as an unpaginated array, so search/filter/pagination were implemented client-side for that screen only.
- Subject list data comes from paginated subject records with `_count`.

## APIs connected in UI

- Teachers:
  - `GET /api/v1/teachers`
  - `POST /api/v1/teachers`
  - `PATCH /api/v1/teachers/:id`
  - `DELETE /api/v1/teachers/:id`
  - `POST /api/v1/teachers/:id/assign-subject-class`
- Students:
  - `GET /api/v1/students`
  - `POST /api/v1/students`
  - `PATCH /api/v1/students/:id`
  - `DELETE /api/v1/students/:id`
- Parents:
  - `GET /api/v1/parents`
  - `POST /api/v1/parents`
  - `PATCH /api/v1/parents/:id`
  - `DELETE /api/v1/parents/:id`
  - `POST /api/v1/parents/:id/link-student`
- Classes and sections:
  - `GET /api/v1/classes`
  - `POST /api/v1/classes`
  - `PATCH /api/v1/classes/:id`
  - `DELETE /api/v1/classes/:id`
  - `POST /api/v1/classes/:id/sections`
  - `PATCH /api/v1/sections/:id`
  - `DELETE /api/v1/sections/:id`
- Academic years:
  - `GET /api/v1/academic-years`
  - `POST /api/v1/academic-years`
  - `PATCH /api/v1/academic-years/:id`
  - `PATCH /api/v1/academic-years/:id/activate`
  - `DELETE /api/v1/academic-years/:id`
- Subjects:
  - `GET /api/v1/subjects`
  - `POST /api/v1/subjects`
  - `PATCH /api/v1/subjects/:id`
  - `DELETE /api/v1/subjects/:id`

## Screen behavior added

- Real backend table data replaced mock fallback on all six target routes.
- Create and edit dialogs were added for all six screen groups.
- Delete confirmation dialogs were added for all destructive actions.
- Status actions were added where available:
  - Teachers: activate/deactivate via `PATCH /teachers/:id`
  - Students: activate/deactivate via `PATCH /students/:id`
  - Parents: activate/deactivate via `PATCH /parents/:id`
  - Academic years: activate via `PATCH /academic-years/:id/activate`
- Relationship actions were added where available:
  - Teacher subject/class assignment
  - Parent-to-student linking
- Pagination was added for paginated backend endpoints.
- Search and filters were added using live backend query parameters where supported.
- Academic-year search/filter/pagination were implemented client-side because the backend endpoint is unpaginated and has no query DTO.
- Loading states, empty states, inline validation, and success/error toasts were added.

## Files added or updated

- Added:
  - `src/app/pages/school-admin/SchoolAdminCrudPages.tsx`
  - `src/app/types/school-admin.types.ts`
  - `SCHOOL_ADMIN_CRUD_INTEGRATION_REPORT.md`
- Updated:
  - `src/app/api/teachers.api.ts`
  - `src/app/api/students.api.ts`
  - `src/app/api/parents.api.ts`
  - `src/app/api/academics.api.ts`
  - `src/app/lms/LmsApp.tsx`

## Mock fallback removal

The targeted routes no longer render the generic mock-backed `WorkspacePage`. They are overridden with live school-admin CRUD route components, which removes the previous mock table fallback for these screens.

## Verification

- Frontend build:
  - Passed on June 9, 2026 via `npm.cmd run build`
- Build note:
  - Vite reported a chunk-size warning for the main bundle after minification, but the build succeeded.

## Known limitations

- Parent unlinking exists in the backend but was not added in this pass because it was outside the requested action list.
- Academic-year filtering is client-side because the backend endpoint does not expose pagination or search parameters.
- Lookup selects use current live data fetched from related endpoints, with page size capped to the backend max of `100`.
