import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { onboardingApi } from '../../api/onboarding.api';
import { normalizeApiError } from '../../api/client';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import type { ApiError } from '../../types/api.types';
import type {
  CreateSchoolWithAdminPayload,
  CreateSchoolWithAdminResponse,
} from '../../types/onboarding.types';

type SchoolFormState = {
  organizationName: string;
  slug: string;
  domain: string;
  city: string;
  state: string;
  country: string;
  organizationPhone: string;
  organizationEmail: string;
  adminFullName: string;
  adminEmail: string;
  adminPhone: string;
};

type SchoolFormErrors = Partial<Record<keyof SchoolFormState, string>>;

const initialState: SchoolFormState = {
  organizationName: '',
  slug: '',
  domain: '',
  city: '',
  state: '',
  country: '',
  organizationPhone: '',
  organizationEmail: '',
  adminFullName: '',
  adminEmail: '',
  adminPhone: '',
};

function validateSchoolForm(form: SchoolFormState) {
  const errors: SchoolFormErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!form.organizationName.trim()) errors.organizationName = 'Organization name is required.';
  if (!form.slug.trim()) errors.slug = 'Slug is required.';
  else if (!/^[a-z0-9-]+$/.test(form.slug.trim())) {
    errors.slug = 'Use lowercase letters, numbers, and hyphens only.';
  }
  if (!form.domain.trim()) errors.domain = 'Domain is required.';
  if (!form.city.trim()) errors.city = 'City is required.';
  if (!form.state.trim()) errors.state = 'State is required.';
  if (!form.country.trim()) errors.country = 'Country is required.';
  if (!form.organizationPhone.trim()) errors.organizationPhone = 'School phone is required.';
  if (!form.organizationEmail.trim()) errors.organizationEmail = 'School email is required.';
  else if (!emailPattern.test(form.organizationEmail.trim())) errors.organizationEmail = 'Enter a valid school email.';
  if (!form.adminFullName.trim()) errors.adminFullName = 'Admin full name is required.';
  if (!form.adminEmail.trim()) errors.adminEmail = 'Admin email is required.';
  else if (!emailPattern.test(form.adminEmail.trim())) errors.adminEmail = 'Enter a valid admin email.';
  if (!form.adminPhone.trim()) errors.adminPhone = 'Admin phone is required.';

  return errors;
}

export function CreateSchoolPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<SchoolFormState>(initialState);
  const [errors, setErrors] = useState<SchoolFormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [result, setResult] = useState<CreateSchoolWithAdminResponse | null>(null);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const inviteLink = result?.invitation.inviteLink ?? null;

  const updateField = (key: keyof SchoolFormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = async () => {
    const nextErrors = validateSchoolForm(form);
    setErrors(nextErrors);
    setApiError(null);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setStatus('submitting');

    try {
      const payload: CreateSchoolWithAdminPayload = {
        organization: {
          name: form.organizationName.trim(),
          slug: form.slug.trim().toLowerCase(),
          domain: form.domain.trim().toLowerCase(),
          city: form.city.trim(),
          state: form.state.trim(),
          country: form.country.trim(),
          phone: form.organizationPhone.trim(),
          email: form.organizationEmail.trim(),
        },
        admin: {
          fullName: form.adminFullName.trim(),
          email: form.adminEmail.trim(),
          phone: form.adminPhone.trim(),
        },
      };

      const response = await onboardingApi.createSchoolWithAdmin(payload);
      setResult(response);
      setForm(initialState);
      setErrors({});
      setApiError(null);
      setCopyState('idle');
      setStatus('success');
      toast.success('School created successfully.');
    } catch (error) {
      setApiError(normalizeApiError(error));
      setStatus('idle');
    }
  };

  const handleCopyInviteLink = async () => {
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      setCopyState('failed');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] border-white/70 bg-white/90 shadow-sm">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Badge variant="primary" className="w-fit">
              Super Admin Onboarding
            </Badge>
            <CardTitle className="mt-3 text-3xl">Create school and invite the first School Admin</CardTitle>
            <CardDescription className="mt-2 max-w-3xl text-sm">
              This creates the organization privately, sets the School Admin user to `INVITED`, and returns a development invite link.
              Teachers, students, parents, and accountants are still created only by the School Admin.
            </CardDescription>
          </div>
          <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-primary">
            Protected action for `SUPER_ADMIN`
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[28px] border-white/70 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle>School profile</CardTitle>
            <CardDescription>Set the organization identity and the first admin contact in one step.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Organization Name"
                value={form.organizationName}
                onChange={(event) => updateField('organizationName', event.target.value)}
                error={errors.organizationName}
              />
              <Input
                label="Slug"
                value={form.slug}
                onChange={(event) => updateField('slug', event.target.value)}
                error={errors.slug}
                placeholder="greenfield-public-school"
              />
              <Input
                label="Domain"
                value={form.domain}
                onChange={(event) => updateField('domain', event.target.value)}
                error={errors.domain}
                placeholder="greenfield.demo.school"
              />
              <Input
                label="City"
                value={form.city}
                onChange={(event) => updateField('city', event.target.value)}
                error={errors.city}
              />
              <Input
                label="State"
                value={form.state}
                onChange={(event) => updateField('state', event.target.value)}
                error={errors.state}
              />
              <Input
                label="Country"
                value={form.country}
                onChange={(event) => updateField('country', event.target.value)}
                error={errors.country}
              />
              <Input
                label="School Phone"
                value={form.organizationPhone}
                onChange={(event) => updateField('organizationPhone', event.target.value)}
                error={errors.organizationPhone}
              />
              <Input
                label="School Email"
                type="email"
                value={form.organizationEmail}
                onChange={(event) => updateField('organizationEmail', event.target.value)}
                error={errors.organizationEmail}
              />
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="text-lg font-semibold">School Admin invite</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The admin receives invite-only access and sets their password from the generated link.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Input
                  label="Admin Full Name"
                  value={form.adminFullName}
                  onChange={(event) => updateField('adminFullName', event.target.value)}
                  error={errors.adminFullName}
                />
                <Input
                  label="Admin Email"
                  type="email"
                  value={form.adminEmail}
                  onChange={(event) => updateField('adminEmail', event.target.value)}
                  error={errors.adminEmail}
                />
                <Input
                  label="Admin Phone"
                  value={form.adminPhone}
                  onChange={(event) => updateField('adminPhone', event.target.value)}
                  error={errors.adminPhone}
                />
              </div>
            </div>

            {apiError ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {apiError.message}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleSubmit} disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Creating School...' : 'Create School'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setForm(initialState);
                  setErrors({});
                  setApiError(null);
                }}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[28px] border-white/70 bg-white/90 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Product rule enforced</CardTitle>
                  <CardDescription>No public signup for operational roles.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>Teachers, students, parents, and accountants are not onboarded here.</p>
              <p>Only the first School Admin is invited, then that admin can create or invite the rest privately.</p>
            </CardContent>
          </Card>

          {result ? (
            <Card className="rounded-[28px] border-success/20 bg-success/5 shadow-sm">
              <CardHeader>
                <Badge variant="success" className="w-fit">
                  School Created
                </Badge>
                <CardTitle>{result.organization.name}</CardTitle>
                <CardDescription>
                  School Admin invitation expires on {new Date(result.invitation.expiresAt).toLocaleString()}.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="rounded-2xl bg-white/80 px-4 py-3">
                  <p className="font-medium text-foreground">Admin</p>
                  <p className="text-muted-foreground">
                    {result.admin.fullName} • {result.admin.email} • {result.admin.status}
                  </p>
                </div>
                {inviteLink ? (
                  <div className="rounded-2xl bg-white/80 px-4 py-3">
                    <p className="font-medium text-foreground">Development invite link</p>
                    <p className="mt-1 break-all text-muted-foreground">{inviteLink}</p>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-white/80 px-4 py-3">
                    <p className="font-medium text-foreground">Invitation created securely</p>
                    <p className="mt-1 text-muted-foreground">
                      The invitation token was created, but the direct invite URL is hidden outside development environments.
                    </p>
                  </div>
                )}
                <div className="flex flex-wrap gap-3">
                  {inviteLink ? (
                    <Button type="button" variant="outline" onClick={() => void handleCopyInviteLink()}>
                      {copyState === 'copied' ? 'Invite Link Copied' : 'Copy Invite Link'}
                    </Button>
                  ) : null}
                  {inviteLink ? (
                    <Button
                      type="button"
                      onClick={() => window.open(inviteLink, '_blank', 'noopener,noreferrer')}
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open Invite Page
                    </Button>
                  ) : null}
                  <Button type="button" variant="outline" onClick={() => navigate('/super-admin/schools')}>
                    Go to Schools
                  </Button>
                </div>
                {copyState === 'failed' ? (
                  <p className="text-sm text-destructive">
                    Could not copy the invite link automatically. You can still open it directly.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
