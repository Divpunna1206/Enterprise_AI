import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle2, School } from 'lucide-react';

import { onboardingApi } from '../../api/onboarding.api';
import { normalizeApiError } from '../../api/client';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/textarea';
import type { ApiError } from '../../types/api.types';
import type { RequestDemoPayload, RequestDemoResponse } from '../../types/onboarding.types';

type DemoFormState = {
  schoolName: string;
  contactPersonName: string;
  email: string;
  phone: string;
  city: string;
  studentCount: string;
  message: string;
};

type DemoFormErrors = Partial<Record<keyof DemoFormState, string>>;

const initialState: DemoFormState = {
  schoolName: '',
  contactPersonName: '',
  email: '',
  phone: '',
  city: '',
  studentCount: '',
  message: '',
};

function validateDemoForm(form: DemoFormState) {
  const errors: DemoFormErrors = {};

  if (!form.schoolName.trim()) errors.schoolName = 'School name is required.';
  if (!form.contactPersonName.trim()) errors.contactPersonName = 'Contact person name is required.';
  if (!form.email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Enter a valid email.';
  if (!form.phone.trim()) errors.phone = 'Phone is required.';
  if (!form.city.trim()) errors.city = 'City is required.';
  if (!form.studentCount.trim()) errors.studentCount = 'Student count is required.';
  else if (!Number.isFinite(Number(form.studentCount)) || Number(form.studentCount) <= 0) {
    errors.studentCount = 'Enter a valid student count.';
  }
  if (!form.message.trim()) errors.message = 'Tell us a bit about the school need.';

  return errors;
}

export function RequestDemoPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<DemoFormState>(initialState);
  const [errors, setErrors] = useState<DemoFormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [result, setResult] = useState<RequestDemoResponse | null>(null);

  const updateField = (key: keyof DemoFormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = async () => {
    const nextErrors = validateDemoForm(form);
    setErrors(nextErrors);
    setApiError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setStatus('submitting');

    try {
      const payload: RequestDemoPayload = {
        schoolName: form.schoolName.trim(),
        contactPersonName: form.contactPersonName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        studentCount: Number(form.studentCount),
        message: form.message.trim(),
      };

      const response = await onboardingApi.requestDemo(payload);
      setResult(response);
      setForm(initialState);
      setStatus('success');
    } catch (error) {
      setApiError(normalizeApiError(error));
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#eef4ff_0%,#f8fbff_50%,#ffffff_100%)] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <Card className="overflow-hidden rounded-[36px] border-white/70 bg-white/90 shadow-2xl shadow-slate-200/70">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-slate-950 p-8 text-white">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10">
                <School className="h-7 w-7 text-secondary" />
              </div>
              <div className="mt-8 space-y-4">
                <Badge variant="secondary" className="w-fit">
                  School Onboarding
                </Badge>
                <h1 className="text-4xl font-semibold">Request a demo for your school</h1>
                <p className="text-sm leading-6 text-white/75">
                  This flow is public for school interest only. Teacher, student, parent, and accountant accounts are still
                  created privately by a School Admin after onboarding.
                </p>
              </div>
              <div className="mt-8 space-y-3">
                {[
                  'Public demo request for school buyers',
                  'No public signup for staff or learners',
                  'Routes directly into admin-led onboarding',
                ].map((item) => (
                  <div key={item} className="rounded-2xl bg-white/8 px-4 py-3 text-sm text-white/85">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <CardContent className="space-y-6 p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-primary">Request Demo</p>
                  <h2 className="mt-2 text-3xl font-semibold">Share your school details</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We’ll use this request to qualify the organization and prepare a guided onboarding path.
                  </p>
                </div>
                <Button variant="outline" onClick={() => navigate('/')}>
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="School Name"
                  value={form.schoolName}
                  onChange={(event) => updateField('schoolName', event.target.value)}
                  error={errors.schoolName}
                />
                <Input
                  label="Contact Person"
                  value={form.contactPersonName}
                  onChange={(event) => updateField('contactPersonName', event.target.value)}
                  error={errors.contactPersonName}
                />
                <Input
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  error={errors.email}
                />
                <Input
                  label="Phone"
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  error={errors.phone}
                />
                <Input
                  label="City"
                  value={form.city}
                  onChange={(event) => updateField('city', event.target.value)}
                  error={errors.city}
                />
                <Input
                  label="Student Count"
                  type="number"
                  min="1"
                  value={form.studentCount}
                  onChange={(event) => updateField('studentCount', event.target.value)}
                  error={errors.studentCount}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={form.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  className={errors.message ? 'border-destructive focus-visible:ring-destructive/20' : undefined}
                  placeholder="Tell us about your current school setup, rollout timeline, or demo goals."
                />
                {errors.message ? <p className="text-sm text-destructive">{errors.message}</p> : null}
              </div>

              {apiError ? (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {apiError.message}
                </div>
              ) : null}

              {status === 'success' && result ? (
                <div className="rounded-2xl border border-success/20 bg-success/5 px-4 py-4 text-sm text-success">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4" />
                    <div>
                      <p className="font-medium">{result.message}</p>
                      <p className="mt-1 text-success/80">Reference ID: {result.requestId}</p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Button onClick={handleSubmit} disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Submitting...' : 'Submit Demo Request'}
                </Button>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Go to Login
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
