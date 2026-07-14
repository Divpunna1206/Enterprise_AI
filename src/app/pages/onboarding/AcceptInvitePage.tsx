import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { CheckCircle2, KeyRound, LoaderCircle } from 'lucide-react';

import { normalizeApiError } from '../../api/client';
import { onboardingApi } from '../../api/onboarding.api';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import type { ApiError } from '../../types/api.types';
import type { InvitationLookupResponse } from '../../types/onboarding.types';

export function AcceptInvitePage() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'submitting' | 'success'>('loading');
  const [lookupError, setLookupError] = useState<ApiError | null>(null);
  const [submitError, setSubmitError] = useState<ApiError | null>(null);
  const [invitation, setInvitation] = useState<InvitationLookupResponse | null>(null);

  useEffect(() => {
    if (!token) {
      setLookupError({ message: 'Invitation token is missing.' });
      setStatus('ready');
      return;
    }

    let cancelled = false;

    void onboardingApi
      .getInvitation(token)
      .then((response) => {
        if (cancelled) return;
        setInvitation(response);
        setLookupError(null);
        setStatus('ready');
      })
      .catch((error) => {
        if (cancelled) return;
        setLookupError(normalizeApiError(error));
        setStatus('ready');
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleAccept = async () => {
    setPasswordError('');
    setSubmitError(null);

    if (password.trim().length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Password and confirm password must match.');
      return;
    }

    if (!token) {
      setSubmitError({ message: 'Invitation token is missing.' });
      return;
    }

    setStatus('submitting');

    try {
      await onboardingApi.acceptInvitation(token, {
        password,
        confirmPassword,
      });
      setStatus('success');
      window.setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1400);
    } catch (error) {
      setSubmitError(normalizeApiError(error));
      setStatus('ready');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#eef4ff_0%,#f8fbff_50%,#ffffff_100%)] px-4 py-8">
      <Card className="w-full max-w-3xl rounded-[36px] border-white/70 bg-white/90 shadow-2xl shadow-slate-200/70">
        <CardHeader className="space-y-4">
          <Badge variant="primary" className="w-fit">
            Invite Acceptance
          </Badge>
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <KeyRound className="h-7 w-7" />
            </div>
            <div>
              <CardTitle className="text-3xl">Set your password and activate the admin account</CardTitle>
              <CardDescription className="mt-2 text-sm">
                This page only completes invite-based onboarding. Public signup remains disabled for all operational roles.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {status === 'loading' ? (
            <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-4 text-sm text-primary">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Validating your invitation...
            </div>
          ) : null}

          {lookupError ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-4 text-sm text-destructive">
              {lookupError.message}
            </div>
          ) : null}

          {invitation ? (
            <div className="grid gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-5 md:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">School</p>
                <p className="mt-2 font-medium">{invitation.organization.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Invited Email</p>
                <p className="mt-2 font-medium">{invitation.invitation.email}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Invited Role</p>
                <p className="mt-2 font-medium">{invitation.invitation.role}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Expires</p>
                <p className="mt-2 font-medium">{new Date(invitation.invitation.expiresAt).toLocaleString()}</p>
              </div>
            </div>
          ) : null}

          {!lookupError && invitation ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                error={passwordError || undefined}
              />
              <Input
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>
          ) : null}

          {submitError ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-4 text-sm text-destructive">
              {submitError.message}
            </div>
          ) : null}

          {status === 'success' ? (
            <div className="rounded-2xl border border-success/20 bg-success/5 px-4 py-4 text-sm text-success">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4" />
                <div>
                  <p className="font-medium">Password set successfully. Please login.</p>
                  <p className="mt-1 text-success/80">Redirecting you to login so you can sign in with the new password.</p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleAccept}
              disabled={!invitation || !!lookupError || status === 'loading' || status === 'submitting' || status === 'success'}
            >
              {status === 'submitting' ? 'Activating...' : 'Set Password'}
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
