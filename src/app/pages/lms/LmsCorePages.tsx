import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { BookOpen, CheckCircle2, ClipboardCheck, PlayCircle, Trash2, Upload, Video } from 'lucide-react';
import { toast } from 'sonner';

import { academicsApi } from '../../api/academics.api';
import { normalizeApiError } from '../../api/client';
import { coursesApi } from '../../api/courses.api';
import { homeworkApi } from '../../api/homework.api';
import { lessonsApi } from '../../api/lessons.api';
import { parentsApi } from '../../api/parents.api';
import { quizzesApi } from '../../api/quizzes.api';
import { teachersApi } from '../../api/teachers.api';
import { videosApi } from '../../api/videos.api';
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

type SubjectOption = { id: string; name: string; code?: string };
type SectionOption = { id: string; name: string };
type ClassOption = { id: string; name: string; grade: string; sections?: SectionOption[] };
type TeacherOption = { id: string; userId: string; user: { fullName: string; email: string } };

type CourseRecord = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  subject?: SubjectOption | null;
  class?: { id: string; name: string; grade: string } | null;
  section?: { id: string; name: string } | null;
  teacher?: { id: string; user?: { fullName: string } | null } | null;
  _count?: { lessons?: number; videos?: number };
};

type LessonRecord = {
  id: string;
  title: string;
  description?: string | null;
  orderIndex: number;
};

type VideoRecord = {
  id: string;
  title: string;
  description?: string | null;
  fileUrl: string;
  fileName: string;
  processingStatus: string;
  lesson?: { id: string; title: string } | null;
  course?: { id: string; title: string } | null;
};

type HomeworkSubmission = {
  id: string;
  submissionText?: string | null;
  fileUrl?: string | null;
  status: string;
  submittedAt?: string | null;
  marks?: number | null;
  feedback?: string | null;
  student?: {
    user?: { fullName: string; email: string } | null;
    class?: { name: string } | null;
    section?: { name: string } | null;
  } | null;
};

type HomeworkRecord = {
  id: string;
  title: string;
  description?: string | null;
  dueDate: string;
  status: string;
  subject?: SubjectOption | null;
  class?: { id: string; name: string; grade: string } | null;
  section?: { id: string; name: string } | null;
  teacher?: { user?: { fullName: string } | null } | null;
  _count?: { submissions?: number };
  submissions?: HomeworkSubmission[];
};

type QuizQuestionRecord = {
  id: string;
  questionText: string;
  questionType: string;
  options?: Record<string, unknown> | unknown[] | null;
  correctAnswer?: Record<string, unknown> | unknown[] | string | number | boolean | null;
  marks: number;
  orderIndex: number;
};

type QuizRecord = {
  id: string;
  title: string;
  description?: string | null;
  totalMarks: number;
  durationMinutes: number;
  status: string;
  subject?: SubjectOption | null;
  class?: { id: string; name: string; grade: string } | null;
  section?: { id: string; name: string } | null;
  teacher?: { user?: { fullName: string } | null } | null;
  questions?: QuizQuestionRecord[];
  attempts?: Array<{ id: string; status: string; score?: number | null }>;
  _count?: { questions?: number; attempts?: number };
};

type QuizAttemptRecord = {
  id: string;
  score?: number | null;
  status: string;
  submittedAt?: string | null;
  answers?: Record<string, unknown> | null;
  quiz: QuizRecord;
  student?: { user?: { fullName: string } | null } | null;
};

type ChildHomeworkGroup = {
  studentProfileId: string;
  studentUserId: string;
  homework: HomeworkRecord[];
};

type ChildQuizResultsGroup = {
  studentProfileId: string;
  studentUserId: string;
  attempts: QuizAttemptRecord[];
};

type PagedResponse<T> = {
  items: T[];
  meta: { page: number; total: number; totalPages: number; limit: number };
};

type StatusVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'muted';

function compactObject<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (entry === undefined || entry === null) return false;
      if (typeof entry === 'string' && entry.trim() === '') return false;
      return true;
    }),
  ) as Partial<T>;
}

function formatDate(value?: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

function statusVariant(status: string): StatusVariant {
  if (['PUBLISHED', 'ACTIVE', 'COMPLETED', 'EVALUATED', 'GRADED'].includes(status)) return 'success';
  if (['DRAFT', 'UPLOADED', 'IN_PROGRESS', 'PROCESSING'].includes(status)) return 'warning';
  if (['FAILED', 'ARCHIVED', 'CLOSED'].includes(status)) return 'destructive';
  return 'secondary';
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

function ErrorBanner({ error, onRetry }: { error: ApiError | null; onRetry?: () => void }) {
  if (!error) return null;
  return (
    <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
      <div className="flex items-center justify-between gap-4">
        <span>{error.message}</span>
        {onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="rounded-3xl border-dashed border-slate-300 bg-slate-50/70">
      <CardContent className="flex flex-col items-center gap-3 px-6 py-10 text-center">
        <BookOpen className="h-10 w-10 text-primary" />
        <div>
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
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

function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select',
}: {
  label?: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      {label ? <label className="text-sm font-medium">{label}</label> : null}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-2xl border border-input bg-background px-3 text-sm outline-none"
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

function useRequest<T>(loader: () => Promise<T>, deps: readonly unknown[]) {
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
        if (!cancelled) setData(response);
      } catch (requestError) {
        if (!cancelled) setError(normalizeApiError(requestError));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [...deps, reloadToken]);

  return { data, loading, error, refetch };
}

function useLmsLookups() {
  const classes = useRequest(
    async () => ((await academicsApi.listClasses({ page: 1, limit: 100 })) as PagedResponse<ClassOption>).items,
    [],
  );
  const subjects = useRequest(
    async () => ((await academicsApi.listSubjects({ page: 1, limit: 100 })) as PagedResponse<SubjectOption>).items,
    [],
  );
  const teachers = useRequest(
    async () => ((await teachersApi.list({ page: 1, limit: 100 })) as PagedResponse<TeacherOption>).items,
    [],
  );

  return { classes, subjects, teachers };
}

type CourseFormState = {
  title: string;
  description: string;
  subjectId: string;
  classId: string;
  sectionId: string;
  teacherId: string;
};

const emptyCourseForm: CourseFormState = {
  title: '',
  description: '',
  subjectId: '',
  classId: '',
  sectionId: '',
  teacherId: '',
};

type LessonFormState = {
  title: string;
  description: string;
  orderIndex: string;
};

const emptyLessonForm: LessonFormState = {
  title: '',
  description: '',
  orderIndex: '1',
};

function CourseManagerPage({ scope }: { scope: 'school-admin' | 'teacher' | 'student' }) {
  const lookups = useLmsLookups();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [form, setForm] = useState<CourseFormState>(emptyCourseForm);
  const [editingCourse, setEditingCourse] = useState<CourseRecord | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseRecord | null>(null);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [lessonMode, setLessonMode] = useState<'create' | 'edit'>('create');
  const [lessonForm, setLessonForm] = useState<LessonFormState>(emptyLessonForm);
  const [editingLesson, setEditingLesson] = useState<LessonRecord | null>(null);
  const [deleteCourse, setDeleteCourse] = useState<CourseRecord | null>(null);
  const [deleteLesson, setDeleteLesson] = useState<LessonRecord | null>(null);
  const [mutating, setMutating] = useState(false);

  const courseQuery =
    scope === 'student'
      ? { page: 1, limit: 100, status: 'PUBLISHED' }
      : { page: 1, limit: 100 };

  const courses = useRequest(
    () => coursesApi.list(courseQuery) as Promise<PagedResponse<CourseRecord>>,
    [scope],
  );
  const lessons = useRequest(
    () =>
      selectedCourse
        ? (coursesApi.listLessons(selectedCourse.id) as Promise<LessonRecord[]>)
        : Promise.resolve([] as LessonRecord[]),
    [selectedCourse?.id],
  );
  const videos = useRequest(
    () =>
      selectedCourse
        ? (videosApi.list({ page: 1, limit: 100, courseId: selectedCourse.id }) as Promise<PagedResponse<VideoRecord>>)
        : Promise.resolve({ items: [], meta: { page: 1, total: 0, totalPages: 1, limit: 100 } } as PagedResponse<VideoRecord>),
    [selectedCourse?.id],
  );

  const classOptions = lookups.classes.data ?? [];
  const selectedSections = useMemo(
    () => classOptions.find((item) => item.id === form.classId)?.sections ?? [],
    [classOptions, form.classId],
  );

  const openCreate = () => {
    setDialogMode('create');
    setEditingCourse(null);
    setForm(emptyCourseForm);
    setDialogOpen(true);
  };

  const openEdit = (course: CourseRecord) => {
    setDialogMode('edit');
    setEditingCourse(course);
    setForm({
      title: course.title,
      description: course.description ?? '',
      subjectId: course.subject?.id ?? '',
      classId: course.class?.id ?? '',
      sectionId: course.section?.id ?? '',
      teacherId: course.teacher?.id ?? '',
    });
    setDialogOpen(true);
  };

  const submitCourse = async () => {
    setMutating(true);
    try {
      const payload = compactObject({
        title: form.title.trim(),
        description: form.description.trim(),
        subjectId: form.subjectId,
        classId: form.classId,
        sectionId: form.sectionId || undefined,
        teacherId: scope === 'school-admin' ? form.teacherId : undefined,
      });

      if (dialogMode === 'create') {
        await coursesApi.create(payload);
        toast.success('Course created successfully.');
      } else if (editingCourse) {
        await coursesApi.update(editingCourse.id, payload);
        toast.success('Course updated successfully.');
      }
      setDialogOpen(false);
      courses.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const publishCourse = async (course: CourseRecord) => {
    setMutating(true);
    try {
      await coursesApi.publish(course.id);
      toast.success('Course published successfully.');
      courses.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const confirmDeleteCourse = async () => {
    if (!deleteCourse) return;
    setMutating(true);
    try {
      await coursesApi.remove(deleteCourse.id);
      toast.success('Course deleted successfully.');
      setDeleteCourse(null);
      courses.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const openCreateLesson = () => {
    setLessonMode('create');
    setEditingLesson(null);
    setLessonForm({
      title: '',
      description: '',
      orderIndex: String((lessons.data?.length ?? 0) + 1),
    });
    setLessonDialogOpen(true);
  };

  const openEditLesson = (lesson: LessonRecord) => {
    setLessonMode('edit');
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      description: lesson.description ?? '',
      orderIndex: String(lesson.orderIndex),
    });
    setLessonDialogOpen(true);
  };

  const submitLesson = async () => {
    if (!selectedCourse) return;
    setMutating(true);
    try {
      const payload = {
        title: lessonForm.title.trim(),
        description: lessonForm.description.trim() || undefined,
        orderIndex: Number(lessonForm.orderIndex),
      };

      if (lessonMode === 'create') {
        await lessonsApi.create(selectedCourse.id, payload);
        toast.success('Lesson created successfully.');
      } else if (editingLesson) {
        await lessonsApi.update(editingLesson.id, payload);
        toast.success('Lesson updated successfully.');
      }
      setLessonDialogOpen(false);
      lessons.refetch();
      courses.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const confirmDeleteLesson = async () => {
    if (!deleteLesson) return;
    setMutating(true);
    try {
      await lessonsApi.remove(deleteLesson.id);
      toast.success('Lesson deleted successfully.');
      setDeleteLesson(null);
      lessons.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  return (
    <PageShell
      title={scope === 'student' ? 'Assigned Courses' : 'Courses'}
      description={
        scope === 'student'
          ? 'View published course content assigned to the current student.'
          : 'Manage real course records, publish them, and maintain lesson structure using the live backend APIs.'
      }
      badge={scope === 'student' ? 'Student Learning' : scope === 'teacher' ? 'Teacher LMS' : 'School Admin LMS'}
    >
      <Card className="rounded-[28px] border-white/70 bg-white/90 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{scope === 'student' ? 'Course Catalog' : 'Course Management'}</CardTitle>
            <CardDescription>Real API data only for courses, lessons, and linked videos.</CardDescription>
          </div>
          {scope !== 'student' ? (
            <Button onClick={openCreate}>Create Course</Button>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-6">
          {courses.loading ? <LoadingState label="courses" /> : null}
          <ErrorBanner error={courses.error} onRetry={courses.refetch} />
          {!courses.loading && !courses.error && (courses.data?.items.length ?? 0) === 0 ? (
            <EmptyState title="No courses found" description="Create the first course or publish one for learners to see." />
          ) : null}

          {!courses.loading && !courses.error && courses.data ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Lessons</TableHead>
                    <TableHead>Videos</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.data.items.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-xs text-muted-foreground">{course.description ?? 'No description'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {(course.class?.grade ?? '-') + (course.section?.name ? ` • ${course.section.name}` : '')}
                      </TableCell>
                      <TableCell>{course.subject?.name ?? '-'}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(course.status)}>{course.status}</Badge>
                      </TableCell>
                      <TableCell>{course._count?.lessons ?? 0}</TableCell>
                      <TableCell>{course._count?.videos ?? 0}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedCourse(course)}>
                            View
                          </Button>
                          {scope !== 'student' ? (
                            <>
                              <Button variant="outline" size="sm" onClick={() => openEdit(course)}>
                                Edit
                              </Button>
                              {course.status !== 'PUBLISHED' ? (
                                <Button variant="ghost" size="sm" onClick={() => void publishCourse(course)}>
                                  Publish
                                </Button>
                              ) : null}
                              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteCourse(course)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedCourse)} onOpenChange={(open) => !open && setSelectedCourse(null)}>
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{selectedCourse?.title ?? 'Course details'}</DialogTitle>
            <DialogDescription>Lessons and uploaded videos for the selected course.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Lessons</h3>
                {scope !== 'student' ? <Button size="sm" onClick={openCreateLesson}>Add Lesson</Button> : null}
              </div>
              {lessons.loading ? <LoadingState label="lessons" /> : null}
              {lessons.data?.length ? (
                <div className="space-y-3">
                  {lessons.data.map((lesson) => (
                    <div key={lesson.id} className="rounded-2xl border border-slate-200 px-4 py-3">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-medium">{lesson.orderIndex}. {lesson.title}</p>
                          <p className="text-sm text-muted-foreground">{lesson.description ?? 'No description'}</p>
                        </div>
                        {scope !== 'student' ? (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => openEditLesson(lesson)}>Edit</Button>
                            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteLesson(lesson)}>Delete</Button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : !lessons.loading ? (
                <EmptyState title="No lessons yet" description="Add the first lesson to start structuring this course." />
              ) : null}
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Videos</h3>
              {videos.loading ? <LoadingState label="videos" /> : null}
              {videos.data?.items.length ? (
                <div className="space-y-3">
                  {videos.data.items.map((video) => (
                    <div key={video.id} className="rounded-2xl border border-slate-200 px-4 py-3">
                      <p className="font-medium">{video.title}</p>
                      <p className="text-sm text-muted-foreground">{video.lesson?.title ?? 'Course video'}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge variant={statusVariant(video.processingStatus)}>{video.processingStatus}</Badge>
                        <a href={video.fileUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline">
                          Open file
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !videos.loading ? (
                <EmptyState title="No videos uploaded" description="Use the teacher upload route to attach videos to this course." />
              ) : null}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'create' ? 'Create Course' : 'Edit Course'}</DialogTitle>
            <DialogDescription>Use the live course API and preserve organization scoping on the backend.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
            <SelectField label="Subject" value={form.subjectId} onChange={(value) => setForm((current) => ({ ...current, subjectId: value }))} options={(lookups.subjects.data ?? []).map((item) => ({ label: item.name, value: item.id }))} />
            <SelectField label="Class" value={form.classId} onChange={(value) => setForm((current) => ({ ...current, classId: value, sectionId: '' }))} options={classOptions.map((item) => ({ label: `${item.grade} • ${item.name}`, value: item.id }))} />
            <SelectField label="Section (optional)" value={form.sectionId} onChange={(value) => setForm((current) => ({ ...current, sectionId: value }))} options={selectedSections.map((item) => ({ label: item.name, value: item.id }))} placeholder="All sections" />
            {scope === 'school-admin' ? (
              <SelectField label="Teacher" value={form.teacherId} onChange={(value) => setForm((current) => ({ ...current, teacherId: value }))} options={(lookups.teachers.data ?? []).map((item) => ({ label: item.user.fullName, value: item.id }))} />
            ) : null}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => void submitCourse()} disabled={mutating}>
              {mutating ? 'Saving...' : dialogMode === 'create' ? 'Create Course' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{lessonMode === 'create' ? 'Create Lesson' : 'Edit Lesson'}</DialogTitle>
            <DialogDescription>Manage lesson ordering directly inside the selected course.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Input label="Title" value={lessonForm.title} onChange={(event) => setLessonForm((current) => ({ ...current, title: event.target.value }))} />
            <Input label="Order Index" type="number" min="1" value={lessonForm.orderIndex} onChange={(event) => setLessonForm((current) => ({ ...current, orderIndex: event.target.value }))} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={lessonForm.description} onChange={(event) => setLessonForm((current) => ({ ...current, description: event.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLessonDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => void submitLesson()} disabled={mutating}>
              {mutating ? 'Saving...' : lessonMode === 'create' ? 'Create Lesson' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteCourse)} onOpenChange={(open) => !open && setDeleteCourse(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete course?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteCourse ? `This will permanently delete ${deleteCourse.title}.` : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmDeleteCourse()} disabled={mutating}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={Boolean(deleteLesson)} onOpenChange={(open) => !open && setDeleteLesson(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete lesson?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteLesson ? `This will permanently delete ${deleteLesson.title}.` : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmDeleteLesson()} disabled={mutating}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  );
}

export function SchoolAdminCoursesPage() {
  return <CourseManagerPage scope="school-admin" />;
}

export function TeacherCoursesPage() {
  return <CourseManagerPage scope="teacher" />;
}

export function StudentCoursesPage() {
  return <CourseManagerPage scope="student" />;
}

export function TeacherVideoUploadPage() {
  const lookups = useLmsLookups();
  const [courseId, setCourseId] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationSeconds, setDurationSeconds] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [mutating, setMutating] = useState(false);

  const courses = useRequest(
    () => coursesApi.list({ page: 1, limit: 100 }) as Promise<PagedResponse<CourseRecord>>,
    [],
  );
  const lessons = useRequest(
    () => (courseId ? (coursesApi.listLessons(courseId) as Promise<LessonRecord[]>) : Promise.resolve([] as LessonRecord[])),
    [courseId],
  );
  const videos = useRequest(
    () => videosApi.list({ page: 1, limit: 100 }) as Promise<PagedResponse<VideoRecord>>,
    [],
  );

  const submitUpload = async () => {
    if (!file || !courseId || !title.trim()) {
      toast.error('Select a course, title, and video file.');
      return;
    }

    setMutating(true);
    try {
      const payload = new FormData();
      payload.append('file', file);
      payload.append('courseId', courseId);
      if (lessonId) payload.append('lessonId', lessonId);
      payload.append('title', title.trim());
      if (description.trim()) payload.append('description', description.trim());
      if (durationSeconds) payload.append('durationSeconds', durationSeconds);

      await videosApi.upload(payload);
      toast.success('Video uploaded successfully.');
      setLessonId('');
      setTitle('');
      setDescription('');
      setDurationSeconds('');
      setFile(null);
      videos.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const queueProcessing = async (videoId: string) => {
    setMutating(true);
    try {
      await videosApi.process(videoId);
      toast.success('Video processing queued.');
      videos.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  return (
    <PageShell
      title="Upload Course Videos"
      description="Upload real video files and metadata, then queue processing for teacher-managed course content."
      badge="Teacher LMS"
    >
      <Card className="rounded-[28px] border-white/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>Upload Video</CardTitle>
          <CardDescription>Connects to the live `/videos/upload` endpoint with multipart form data.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <SelectField label="Course" value={courseId} onChange={(value) => { setCourseId(value); setLessonId(''); }} options={(courses.data?.items ?? []).map((item) => ({ label: item.title, value: item.id }))} />
          <SelectField label="Lesson (optional)" value={lessonId} onChange={setLessonId} options={(lessons.data ?? []).map((item) => ({ label: `${item.orderIndex}. ${item.title}`, value: item.id }))} placeholder="Course-level video" />
          <Input label="Title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <Input label="Duration Seconds" type="number" min="0" value={durationSeconds} onChange={(event) => setDurationSeconds(event.target.value)} />
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea value={description} onChange={(event) => setDescription(event.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="block w-full rounded-2xl border border-input bg-background px-3 py-3 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <Button onClick={() => void submitUpload()} disabled={mutating}>
              <Upload className="h-4 w-4" />
              {mutating ? 'Uploading...' : 'Upload Video'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[28px] border-white/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Videos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {videos.loading ? <LoadingState label="videos" /> : null}
          <ErrorBanner error={videos.error} onRetry={videos.refetch} />
          {videos.data?.items.length ? (
            <div className="space-y-3">
              {videos.data.items.map((video) => (
                <div key={video.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-3">
                  <div>
                    <p className="font-medium">{video.title}</p>
                    <p className="text-sm text-muted-foreground">{video.course?.title ?? '-'} • {video.lesson?.title ?? 'Course video'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusVariant(video.processingStatus)}>{video.processingStatus}</Badge>
                    <Button variant="outline" size="sm" onClick={() => void queueProcessing(video.id)}>
                      Process
                    </Button>
                    <a href={video.fileUrl} target="_blank" rel="noreferrer" className="text-sm text-primary underline">
                      Open
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : !videos.loading ? (
            <EmptyState title="No videos uploaded" description="Upload the first teaching video to start this workflow." />
          ) : null}
        </CardContent>
      </Card>
    </PageShell>
  );
}

type HomeworkFormState = {
  title: string;
  description: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  teacherId: string;
  dueDate: string;
};

const emptyHomeworkForm: HomeworkFormState = {
  title: '',
  description: '',
  classId: '',
  sectionId: '',
  subjectId: '',
  teacherId: '',
  dueDate: '',
};

function HomeworkManagerPage({ scope }: { scope: 'school-admin' | 'teacher' }) {
  const lookups = useLmsLookups();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [editingRecord, setEditingRecord] = useState<HomeworkRecord | null>(null);
  const [deleteRecord, setDeleteRecord] = useState<HomeworkRecord | null>(null);
  const [form, setForm] = useState<HomeworkFormState>(emptyHomeworkForm);
  const [mutating, setMutating] = useState(false);

  const homework = useRequest(
    () => homeworkApi.list({ page: 1, limit: 100 }) as Promise<PagedResponse<HomeworkRecord>>,
    [scope],
  );

  const selectedSections = useMemo(
    () => (lookups.classes.data ?? []).find((item) => item.id === form.classId)?.sections ?? [],
    [lookups.classes.data, form.classId],
  );

  const openCreate = () => {
    setDialogMode('create');
    setEditingRecord(null);
    setForm(emptyHomeworkForm);
    setDialogOpen(true);
  };

  const openEdit = (record: HomeworkRecord) => {
    setDialogMode('edit');
    setEditingRecord(record);
    setForm({
      title: record.title,
      description: record.description ?? '',
      classId: record.class?.id ?? '',
      sectionId: record.section?.id ?? '',
      subjectId: record.subject?.id ?? '',
      teacherId: '',
      dueDate: record.dueDate.slice(0, 16),
    });
    setDialogOpen(true);
  };

  const submitForm = async () => {
    setMutating(true);
    try {
      const payload = compactObject({
        title: form.title.trim(),
        description: form.description.trim(),
        classId: form.classId,
        sectionId: form.sectionId,
        subjectId: form.subjectId,
        teacherId: scope === 'school-admin' ? form.teacherId : undefined,
        dueDate: new Date(form.dueDate).toISOString(),
      });

      if (dialogMode === 'create') {
        await homeworkApi.create(payload);
        toast.success('Homework created successfully.');
      } else if (editingRecord) {
        await homeworkApi.update(editingRecord.id, payload);
        toast.success('Homework updated successfully.');
      }
      setDialogOpen(false);
      homework.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const publish = async (record: HomeworkRecord) => {
    setMutating(true);
    try {
      await homeworkApi.publish(record.id);
      toast.success('Homework published successfully.');
      homework.refetch();
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
      await homeworkApi.remove(deleteRecord.id);
      toast.success('Homework deleted successfully.');
      setDeleteRecord(null);
      homework.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  return (
    <PageShell
      title="Homework"
      description="Manage real homework records with create, edit, publish, and oversight using the live backend."
      badge={scope === 'teacher' ? 'Teacher LMS' : 'School Admin LMS'}
    >
      <Card className="rounded-[28px] border-white/70 bg-white/90 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Homework Management</CardTitle>
            <CardDescription>Real homework data, not the route mock fallback.</CardDescription>
          </div>
          <Button onClick={openCreate}>Create Homework</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {homework.loading ? <LoadingState label="homework" /> : null}
          <ErrorBanner error={homework.error} onRetry={homework.refetch} />
          {homework.data?.items.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submissions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {homework.data.items.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.title}</TableCell>
                      <TableCell>{(record.class?.grade ?? '-') + (record.section?.name ? ` • ${record.section.name}` : '')}</TableCell>
                      <TableCell>{record.subject?.name ?? '-'}</TableCell>
                      <TableCell>{formatDate(record.dueDate)}</TableCell>
                      <TableCell><Badge variant={statusVariant(record.status)}>{record.status}</Badge></TableCell>
                      <TableCell>{record._count?.submissions ?? 0}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEdit(record)}>Edit</Button>
                          {record.status !== 'PUBLISHED' ? <Button variant="ghost" size="sm" onClick={() => void publish(record)}>Publish</Button> : null}
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteRecord(record)}>Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : !homework.loading ? (
            <EmptyState title="No homework found" description="Create the first homework item for this organization." />
          ) : null}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'create' ? 'Create Homework' : 'Edit Homework'}</DialogTitle>
            <DialogDescription>Uses the real homework DTO and publish flow.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Title" value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
            <Input label="Due Date" type="datetime-local" value={form.dueDate} onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))} />
            <SelectField label="Class" value={form.classId} onChange={(value) => setForm((current) => ({ ...current, classId: value, sectionId: '' }))} options={(lookups.classes.data ?? []).map((item) => ({ label: `${item.grade} • ${item.name}`, value: item.id }))} />
            <SelectField label="Section" value={form.sectionId} onChange={(value) => setForm((current) => ({ ...current, sectionId: value }))} options={selectedSections.map((item) => ({ label: item.name, value: item.id }))} />
            <SelectField label="Subject" value={form.subjectId} onChange={(value) => setForm((current) => ({ ...current, subjectId: value }))} options={(lookups.subjects.data ?? []).map((item) => ({ label: item.name, value: item.id }))} />
            {scope === 'school-admin' ? <SelectField label="Teacher" value={form.teacherId} onChange={(value) => setForm((current) => ({ ...current, teacherId: value }))} options={(lookups.teachers.data ?? []).map((item) => ({ label: item.user.fullName, value: item.id }))} /> : null}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => void submitForm()} disabled={mutating}>
              {mutating ? 'Saving...' : dialogMode === 'create' ? 'Create Homework' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteRecord)} onOpenChange={(open) => !open && setDeleteRecord(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete homework?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteRecord ? `This will permanently delete ${deleteRecord.title}.` : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmDelete()} disabled={mutating}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  );
}

export function SchoolAdminHomeworkPage() {
  return <HomeworkManagerPage scope="school-admin" />;
}

export function TeacherHomeworkCreatePage() {
  return <HomeworkManagerPage scope="teacher" />;
}

export function TeacherHomeworkReviewPage() {
  const homework = useRequest(
    () => homeworkApi.list({ page: 1, limit: 100 }) as Promise<PagedResponse<HomeworkRecord>>,
    [],
  );
  const [selectedHomework, setSelectedHomework] = useState<HomeworkRecord | null>(null);
  const submissions = useRequest(
    () => (selectedHomework ? (homeworkApi.listSubmissions(selectedHomework.id) as Promise<HomeworkSubmission[]>) : Promise.resolve([] as HomeworkSubmission[])),
    [selectedHomework?.id],
  );
  const [gradeTarget, setGradeTarget] = useState<HomeworkSubmission | null>(null);
  const [marks, setMarks] = useState('');
  const [feedback, setFeedback] = useState('');
  const [mutating, setMutating] = useState(false);

  const submitGrade = async () => {
    if (!gradeTarget) return;
    setMutating(true);
    try {
      await homeworkApi.gradeSubmission(gradeTarget.id, compactObject({
        marks: marks ? Number(marks) : undefined,
        feedback: feedback.trim(),
      }));
      toast.success('Homework graded successfully.');
      setGradeTarget(null);
      setMarks('');
      setFeedback('');
      submissions.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  return (
    <PageShell
      title="Review Homework"
      description="Open real homework submissions and grade them using the backend grading workflow."
      badge="Teacher LMS"
    >
      <Card className="rounded-[28px] border-white/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>Homework Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {homework.loading ? <LoadingState label="homework" /> : null}
          <ErrorBanner error={homework.error} onRetry={homework.refetch} />
          {(homework.data?.items ?? []).map((record) => (
            <div key={record.id} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
              <div>
                <p className="font-medium">{record.title}</p>
                <p className="text-sm text-muted-foreground">{record.subject?.name ?? '-'} • {formatDate(record.dueDate)}</p>
              </div>
              <Button variant="outline" onClick={() => setSelectedHomework(record)}>View Submissions</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedHomework)} onOpenChange={(open) => !open && setSelectedHomework(null)}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedHomework?.title ?? 'Submissions'}</DialogTitle>
            <DialogDescription>Grade student homework submissions.</DialogDescription>
          </DialogHeader>
          {submissions.loading ? <LoadingState label="submissions" /> : null}
          <div className="space-y-3">
            {(submissions.data ?? []).map((submission) => (
              <div key={submission.id} className="rounded-2xl border border-slate-200 px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{submission.student?.user?.fullName ?? 'Student'}</p>
                    <p className="text-sm text-muted-foreground">{submission.submissionText ?? 'No text submitted'}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(submission.submittedAt)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusVariant(submission.status)}>{submission.status}</Badge>
                    <Button variant="outline" size="sm" onClick={() => setGradeTarget(submission)}>
                      Grade
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(gradeTarget)} onOpenChange={(open) => !open && setGradeTarget(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
            <DialogDescription>Supports both teacher and school-admin grading on the backend.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Input label="Marks" type="number" min="0" value={marks} onChange={(event) => setMarks(event.target.value)} />
            <div className="space-y-2">
              <label className="text-sm font-medium">Feedback</label>
              <Textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGradeTarget(null)}>Cancel</Button>
            <Button onClick={() => void submitGrade()} disabled={mutating}>{mutating ? 'Saving...' : 'Save Grade'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

export function StudentHomeworkPage() {
  const homework = useRequest(() => homeworkApi.list({ page: 1, limit: 100 }) as Promise<PagedResponse<HomeworkRecord>>, []);
  const [selectedHomework, setSelectedHomework] = useState<HomeworkRecord | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [mutating, setMutating] = useState(false);

  const submitHomework = async () => {
    if (!selectedHomework) return;
    setMutating(true);
    try {
      await homeworkApi.submit(selectedHomework.id, compactObject({
        submissionText: submissionText.trim(),
        fileUrl: fileUrl.trim(),
      }));
      toast.success('Homework submitted successfully.');
      setSelectedHomework(null);
      setSubmissionText('');
      setFileUrl('');
      homework.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  return (
    <PageShell
      title="Student Homework"
      description="View published assigned homework and submit work through the live backend submission endpoint."
      badge="Student Learning"
    >
      <Card className="rounded-[28px] border-white/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>Assigned Homework</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {homework.loading ? <LoadingState label="homework" /> : null}
          <ErrorBanner error={homework.error} onRetry={homework.refetch} />
          {(homework.data?.items ?? []).map((record) => (
            <div key={record.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-3">
              <div>
                <p className="font-medium">{record.title}</p>
                <p className="text-sm text-muted-foreground">{record.subject?.name ?? '-'} • Due {formatDate(record.dueDate)}</p>
              </div>
              <Button variant="outline" onClick={() => setSelectedHomework(record)}>Submit</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedHomework)} onOpenChange={(open) => !open && setSelectedHomework(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedHomework?.title ?? 'Submit homework'}</DialogTitle>
            <DialogDescription>Submit text or a file URL using the live homework submission API.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Submission Text</label>
              <Textarea value={submissionText} onChange={(event) => setSubmissionText(event.target.value)} />
            </div>
            <Input label="File URL (optional)" value={fileUrl} onChange={(event) => setFileUrl(event.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedHomework(null)}>Cancel</Button>
            <Button onClick={() => void submitHomework()} disabled={mutating}>{mutating ? 'Submitting...' : 'Submit Homework'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

export function ParentHomeworkPage() {
  const data = useRequest(() => parentsApi.getChildrenHomework() as Promise<ChildHomeworkGroup[]>, []);
  return (
    <PageShell
      title="Child Homework"
      description="View homework assigned to linked children through the real parent homework API."
      badge="Parent Portal"
    >
      <Card className="rounded-[28px] border-white/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>Homework Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.loading ? <LoadingState label="child homework" /> : null}
          <ErrorBanner error={data.error} onRetry={data.refetch} />
          {(data.data ?? []).map((group) => (
            <div key={group.studentProfileId} className="space-y-3">
              <p className="font-medium">Student ID: {group.studentUserId}</p>
              {group.homework.map((record) => (
                <div key={record.id} className="rounded-2xl border border-slate-200 px-4 py-3">
                  <p className="font-medium">{record.title}</p>
                  <p className="text-sm text-muted-foreground">{record.subject?.name ?? '-'} • Due {formatDate(record.dueDate)}</p>
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}

type QuizFormState = {
  title: string;
  description: string;
  classId: string;
  sectionId: string;
  subjectId: string;
  teacherId: string;
  totalMarks: string;
  durationMinutes: string;
};

const emptyQuizForm: QuizFormState = {
  title: '',
  description: '',
  classId: '',
  sectionId: '',
  subjectId: '',
  teacherId: '',
  totalMarks: '',
  durationMinutes: '',
};

type QuizQuestionFormState = {
  questionText: string;
  questionType: string;
  optionsText: string;
  correctAnswerText: string;
  marks: string;
  orderIndex: string;
};

const emptyQuizQuestionForm: QuizQuestionFormState = {
  questionText: '',
  questionType: 'MCQ',
  optionsText: '',
  correctAnswerText: '',
  marks: '1',
  orderIndex: '1',
};

function parseJsonInput(value: string) {
  if (!value.trim()) return undefined;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    throw new Error('Enter valid JSON for options/correct answer.');
  }
}

function QuizManagerPage({ scope }: { scope: 'school-admin' | 'teacher' }) {
  const lookups = useLmsLookups();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [editingQuiz, setEditingQuiz] = useState<QuizRecord | null>(null);
  const [deleteQuiz, setDeleteQuiz] = useState<QuizRecord | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizRecord | null>(null);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [quizForm, setQuizForm] = useState<QuizFormState>(emptyQuizForm);
  const [questionForm, setQuestionForm] = useState<QuizQuestionFormState>(emptyQuizQuestionForm);
  const [mutating, setMutating] = useState(false);

  const quizzes = useRequest(
    () => quizzesApi.list({ page: 1, limit: 100 }) as Promise<PagedResponse<QuizRecord>>,
    [scope],
  );
  const quizDetail = useRequest(
    () => (selectedQuiz ? (quizzesApi.getById(selectedQuiz.id) as Promise<QuizRecord>) : Promise.resolve(null as QuizRecord | null)),
    [selectedQuiz?.id],
  );

  const selectedSections = useMemo(
    () => (lookups.classes.data ?? []).find((item) => item.id === quizForm.classId)?.sections ?? [],
    [lookups.classes.data, quizForm.classId],
  );

  const openCreate = () => {
    setDialogMode('create');
    setEditingQuiz(null);
    setQuizForm(emptyQuizForm);
    setDialogOpen(true);
  };

  const openEdit = (quiz: QuizRecord) => {
    setDialogMode('edit');
    setEditingQuiz(quiz);
    setQuizForm({
      title: quiz.title,
      description: quiz.description ?? '',
      classId: quiz.class?.id ?? '',
      sectionId: quiz.section?.id ?? '',
      subjectId: quiz.subject?.id ?? '',
      teacherId: '',
      totalMarks: String(quiz.totalMarks),
      durationMinutes: String(quiz.durationMinutes),
    });
    setDialogOpen(true);
  };

  const submitQuiz = async () => {
    setMutating(true);
    try {
      const payload = compactObject({
        title: quizForm.title.trim(),
        description: quizForm.description.trim(),
        classId: quizForm.classId,
        sectionId: quizForm.sectionId,
        subjectId: quizForm.subjectId,
        teacherId: scope === 'school-admin' ? quizForm.teacherId : undefined,
        totalMarks: Number(quizForm.totalMarks),
        durationMinutes: Number(quizForm.durationMinutes),
      });

      if (dialogMode === 'create') {
        await quizzesApi.create(payload);
        toast.success('Quiz created successfully.');
      } else if (editingQuiz) {
        await quizzesApi.update(editingQuiz.id, payload);
        toast.success('Quiz updated successfully.');
      }
      setDialogOpen(false);
      quizzes.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const publishQuiz = async (quiz: QuizRecord) => {
    setMutating(true);
    try {
      await quizzesApi.publish(quiz.id);
      toast.success('Quiz published successfully.');
      quizzes.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  const submitQuestion = async () => {
    if (!selectedQuiz) return;
    setMutating(true);
    try {
      const payload = compactObject({
        questionText: questionForm.questionText.trim(),
        questionType: questionForm.questionType,
        options: parseJsonInput(questionForm.optionsText),
        correctAnswer: parseJsonInput(questionForm.correctAnswerText),
        marks: Number(questionForm.marks),
        orderIndex: Number(questionForm.orderIndex),
      });
      await quizzesApi.createQuestion(selectedQuiz.id, payload);
      toast.success('Quiz question created successfully.');
      setQuestionDialogOpen(false);
      setQuestionForm(emptyQuizQuestionForm);
      quizDetail.refetch();
      quizzes.refetch();
    } catch (error) {
      const normalized = error instanceof Error ? error.message : normalizeApiError(error).message;
      toast.error(normalized);
    } finally {
      setMutating(false);
    }
  };

  const confirmDeleteQuiz = async () => {
    if (!deleteQuiz) return;
    setMutating(true);
    try {
      await quizzesApi.remove(deleteQuiz.id);
      toast.success('Quiz deleted successfully.');
      setDeleteQuiz(null);
      quizzes.refetch();
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  return (
    <PageShell
      title="Quizzes"
      description="Create, edit, publish, and populate quizzes with live backend quiz and question APIs."
      badge={scope === 'teacher' ? 'Teacher LMS' : 'School Admin LMS'}
    >
      <Card className="rounded-[28px] border-white/70 bg-white/90 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Quiz Management</CardTitle>
            <CardDescription>Real quiz data for organization and teacher workflows.</CardDescription>
          </div>
          <Button onClick={openCreate}>Create Quiz</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {quizzes.loading ? <LoadingState label="quizzes" /> : null}
          <ErrorBanner error={quizzes.error} onRetry={quizzes.refetch} />
          {quizzes.data?.items.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quizzes.data.items.map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell>{quiz.title}</TableCell>
                      <TableCell>{quiz.subject?.name ?? '-'}</TableCell>
                      <TableCell>{quiz.durationMinutes} min</TableCell>
                      <TableCell><Badge variant={statusVariant(quiz.status)}>{quiz.status}</Badge></TableCell>
                      <TableCell>{quiz._count?.questions ?? quiz.questions?.length ?? 0}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedQuiz(quiz)}>Questions</Button>
                          <Button variant="outline" size="sm" onClick={() => openEdit(quiz)}>Edit</Button>
                          {quiz.status !== 'PUBLISHED' ? <Button variant="ghost" size="sm" onClick={() => void publishQuiz(quiz)}>Publish</Button> : null}
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteQuiz(quiz)}>Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : !quizzes.loading ? (
            <EmptyState title="No quizzes found" description="Create the first quiz for this class and subject." />
          ) : null}
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedQuiz)} onOpenChange={(open) => !open && setSelectedQuiz(null)}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedQuiz?.title ?? 'Quiz questions'}</DialogTitle>
            <DialogDescription>Manage quiz questions using the existing backend question endpoints.</DialogDescription>
          </DialogHeader>
          <div className="mb-4">
            <Button onClick={() => setQuestionDialogOpen(true)}>Add Question</Button>
          </div>
          {quizDetail.loading ? <LoadingState label="quiz questions" /> : null}
          <div className="space-y-3">
            {(quizDetail.data?.questions ?? []).map((question) => (
              <div key={question.id} className="rounded-2xl border border-slate-200 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{question.orderIndex}. {question.questionText}</p>
                    <p className="text-sm text-muted-foreground">{question.questionType} • {question.marks} marks</p>
                  </div>
                  <Badge variant="secondary">{question.questionType}</Badge>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{dialogMode === 'create' ? 'Create Quiz' : 'Edit Quiz'}</DialogTitle>
            <DialogDescription>Connects directly to the current quiz DTOs and publish flow.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Title" value={quizForm.title} onChange={(event) => setQuizForm((current) => ({ ...current, title: event.target.value }))} />
            <Input label="Duration Minutes" type="number" min="1" value={quizForm.durationMinutes} onChange={(event) => setQuizForm((current) => ({ ...current, durationMinutes: event.target.value }))} />
            <Input label="Total Marks" type="number" min="1" value={quizForm.totalMarks} onChange={(event) => setQuizForm((current) => ({ ...current, totalMarks: event.target.value }))} />
            <SelectField label="Class" value={quizForm.classId} onChange={(value) => setQuizForm((current) => ({ ...current, classId: value, sectionId: '' }))} options={(lookups.classes.data ?? []).map((item) => ({ label: `${item.grade} • ${item.name}`, value: item.id }))} />
            <SelectField label="Section" value={quizForm.sectionId} onChange={(value) => setQuizForm((current) => ({ ...current, sectionId: value }))} options={selectedSections.map((item) => ({ label: item.name, value: item.id }))} />
            <SelectField label="Subject" value={quizForm.subjectId} onChange={(value) => setQuizForm((current) => ({ ...current, subjectId: value }))} options={(lookups.subjects.data ?? []).map((item) => ({ label: item.name, value: item.id }))} />
            {scope === 'school-admin' ? <SelectField label="Teacher" value={quizForm.teacherId} onChange={(value) => setQuizForm((current) => ({ ...current, teacherId: value }))} options={(lookups.teachers.data ?? []).map((item) => ({ label: item.user.fullName, value: item.id }))} /> : null}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={quizForm.description} onChange={(event) => setQuizForm((current) => ({ ...current, description: event.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => void submitQuiz()} disabled={mutating}>
              {mutating ? 'Saving...' : dialogMode === 'create' ? 'Create Quiz' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={questionDialogOpen} onOpenChange={setQuestionDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Quiz Question</DialogTitle>
            <DialogDescription>Enter JSON for options and correct answers to match the current backend contract.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Input label="Question Text" value={questionForm.questionText} onChange={(event) => setQuestionForm((current) => ({ ...current, questionText: event.target.value }))} />
            <div className="grid gap-4 md:grid-cols-3">
              <SelectField label="Question Type" value={questionForm.questionType} onChange={(value) => setQuestionForm((current) => ({ ...current, questionType: value }))} options={[
                { label: 'MCQ', value: 'MCQ' },
                { label: 'TRUE_FALSE', value: 'TRUE_FALSE' },
                { label: 'SHORT_ANSWER', value: 'SHORT_ANSWER' },
                { label: 'LONG_ANSWER', value: 'LONG_ANSWER' },
              ]} />
              <Input label="Marks" type="number" min="1" value={questionForm.marks} onChange={(event) => setQuestionForm((current) => ({ ...current, marks: event.target.value }))} />
              <Input label="Order Index" type="number" min="1" value={questionForm.orderIndex} onChange={(event) => setQuestionForm((current) => ({ ...current, orderIndex: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Options JSON</label>
              <Textarea value={questionForm.optionsText} onChange={(event) => setQuestionForm((current) => ({ ...current, optionsText: event.target.value }))} placeholder='["A","B","C","D"]' />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Correct Answer JSON</label>
              <Textarea value={questionForm.correctAnswerText} onChange={(event) => setQuestionForm((current) => ({ ...current, correctAnswerText: event.target.value }))} placeholder='"A"' />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuestionDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => void submitQuestion()} disabled={mutating}>{mutating ? 'Saving...' : 'Add Question'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleteQuiz)} onOpenChange={(open) => !open && setDeleteQuiz(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteQuiz ? `This will permanently delete ${deleteQuiz.title}.` : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => void confirmDeleteQuiz()} disabled={mutating}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  );
}

export function SchoolAdminQuizzesPage() {
  return <QuizManagerPage scope="school-admin" />;
}

export function TeacherQuizzesCreatePage() {
  return <QuizManagerPage scope="teacher" />;
}

export function StudentQuizPage() {
  const navigate = useNavigate();
  const quizzes = useRequest(() => quizzesApi.list({ page: 1, limit: 100 }) as Promise<PagedResponse<QuizRecord>>, []);

  const startQuiz = async (quiz: QuizRecord) => {
    try {
      const attempt = await quizzesApi.start(quiz.id) as { id: string };
      navigate(`/student/quiz/attempt?quizId=${quiz.id}&attemptId=${attempt.id}`);
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    }
  };

  return (
    <PageShell
      title="Student Quizzes"
      description="View assigned published quizzes and start real attempts."
      badge="Student Learning"
    >
      <Card className="rounded-[28px] border-white/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>Assigned Quizzes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {quizzes.loading ? <LoadingState label="quizzes" /> : null}
          <ErrorBanner error={quizzes.error} onRetry={quizzes.refetch} />
          {(quizzes.data?.items ?? []).map((quiz) => (
            <div key={quiz.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-3">
              <div>
                <p className="font-medium">{quiz.title}</p>
                <p className="text-sm text-muted-foreground">{quiz.subject?.name ?? '-'} • {quiz.durationMinutes} min • {quiz.totalMarks} marks</p>
              </div>
              <Button onClick={() => void startQuiz(quiz)}>
                <PlayCircle className="h-4 w-4" />
                Start Quiz
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}

export function StudentQuizAttemptPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const quizId = searchParams.get('quizId');
  const attemptId = searchParams.get('attemptId');
  const quiz = useRequest(
    () => (quizId ? (quizzesApi.getById(quizId) as Promise<QuizRecord>) : Promise.resolve(null as QuizRecord | null)),
    [quizId],
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [mutating, setMutating] = useState(false);

  const submitAttempt = async () => {
    if (!attemptId) {
      toast.error('Quiz attempt is missing.');
      return;
    }
    setMutating(true);
    try {
      await quizzesApi.submitAttempt(attemptId, {
        answers: Object.fromEntries(Object.entries(answers).map(([key, value]) => [key, value.trim()])),
      });
      toast.success('Quiz submitted successfully.');
      navigate(`/student/quiz/result?attemptId=${attemptId}`);
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setMutating(false);
    }
  };

  return (
    <PageShell
      title="Quiz Attempt"
      description="Submit a real quiz attempt against the current backend attempt workflow."
      badge="Student Learning"
    >
      <Card className="rounded-[28px] border-white/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>{quiz.data?.title ?? 'Quiz Attempt'}</CardTitle>
          <CardDescription>{quiz.data?.durationMinutes ?? 0} minutes • {quiz.data?.totalMarks ?? 0} marks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {quiz.loading ? <LoadingState label="quiz" /> : null}
          <ErrorBanner error={quiz.error} onRetry={quiz.refetch} />
          {(quiz.data?.questions ?? []).map((question) => (
            <div key={question.id} className="rounded-2xl border border-slate-200 px-4 py-3">
              <p className="font-medium">{question.orderIndex}. {question.questionText}</p>
              <p className="text-xs text-muted-foreground">{question.questionType} • {question.marks} marks</p>
              <Input
                label="Answer"
                value={answers[question.id] ?? ''}
                onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                placeholder="Enter your answer"
              />
            </div>
          ))}
          <Button onClick={() => void submitAttempt()} disabled={mutating || !attemptId}>
            {mutating ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}

export function StudentQuizResultPage() {
  const [searchParams] = useSearchParams();
  const attemptId = searchParams.get('attemptId');
  const result = useRequest(
    () => (attemptId ? (quizzesApi.getAttemptResult(attemptId) as Promise<QuizAttemptRecord>) : Promise.resolve(null as QuizAttemptRecord | null)),
    [attemptId],
  );

  return (
    <PageShell
      title="Quiz Result"
      description="View the evaluated quiz attempt returned by the live backend result endpoint."
      badge="Student Learning"
    >
      <Card className="rounded-[28px] border-white/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>{result.data?.quiz.title ?? 'Result'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.loading ? <LoadingState label="quiz result" /> : null}
          <ErrorBanner error={result.error} onRetry={result.refetch} />
          {result.data ? (
            <div className="rounded-2xl border border-success/20 bg-success/5 px-4 py-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-medium">Score: {result.data.score ?? 0}</p>
                  <p className="text-sm text-muted-foreground">Status: {result.data.status} • Submitted: {formatDate(result.data.submittedAt)}</p>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </PageShell>
  );
}

export function ParentQuizResultsPage() {
  const results = useRequest(() => parentsApi.getChildrenQuizResults() as Promise<ChildQuizResultsGroup[]>, []);
  return (
    <PageShell
      title="Child Quiz Results"
      description="View linked children quiz attempts and scores from the real parent result API."
      badge="Parent Portal"
    >
      <Card className="rounded-[28px] border-white/70 bg-white/90 shadow-sm">
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {results.loading ? <LoadingState label="quiz results" /> : null}
          <ErrorBanner error={results.error} onRetry={results.refetch} />
          {(results.data ?? []).map((group) => (
            <div key={group.studentProfileId} className="space-y-3">
              <p className="font-medium">Student ID: {group.studentUserId}</p>
              {group.attempts.map((attempt) => (
                <div key={attempt.id} className="rounded-2xl border border-slate-200 px-4 py-3">
                  <p className="font-medium">{attempt.quiz.title}</p>
                  <p className="text-sm text-muted-foreground">{attempt.quiz.subject?.name ?? '-'} • Score {attempt.score ?? 0} • {formatDate(attempt.submittedAt)}</p>
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
}
