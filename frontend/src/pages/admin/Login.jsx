import { AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { isEmail } from '../../lib/validation.js';

const DEMO_CREDENTIALS = { email: 'demo@nexora.dev', password: 'Demo@12345' };

export default function AdminLogin() {
  const { signIn, isAuthenticated, isSubmitting } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const redirectTo = location.state?.from?.pathname ?? '/admin/dashboard';

  useDocumentTitle('Admin sign in');

  // Visiting the login page while already signed in should not show a form.
  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, navigate, redirectTo]);

  const updateField = (field) => (event) => {
    const { value } = event.target;
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);

    const nextErrors = {};
    if (!values.email.trim()) nextErrors.email = 'Please enter your email address';
    else if (!isEmail(values.email)) nextErrors.email = 'Enter a valid email address';
    if (!values.password) nextErrors.password = 'Please enter your password';

    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    try {
      const admin = await signIn(values.email.trim(), values.password);
      toast.success(`Signed in as ${admin?.name ?? 'admin'}`);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setSubmitError(error);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink-950 text-sm font-bold text-white">
            N
          </span>
          <span className="text-base font-semibold tracking-tight text-ink-950">NEXORA</span>
          <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-600">
            Admin
          </span>
        </div>

        <h1 className="mt-8 text-2xl font-semibold tracking-tight text-ink-950">Sign in</h1>
        <p className="mt-2 text-sm text-ink-500">
          Staff access only. This dashboard manages the live product catalogue and orders.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          {submitError ? (
            <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertCircle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">Could not sign you in</p>
                <p className="mt-1 text-sm text-red-700">{submitError.message}</p>
              </div>
            </div>
          ) : null}

          <Input
            id="email"
            type="email"
            label="Email"
            required
            autoComplete="username"
            autoFocus
            value={values.email}
            onChange={updateField('email')}
            error={errors.email}
            placeholder="you@nexora.dev"
          />

          <Input
            id="password"
            type="password"
            label="Password"
            required
            autoComplete="current-password"
            value={values.password}
            onChange={updateField('password')}
            error={errors.password}
            placeholder="••••••••"
          />

          <Button type="submit" size="lg" fullWidth isLoading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-8 rounded-card border border-ink-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <KeyRound aria-hidden="true" className="h-4 w-4 text-ink-400" />
            <p className="text-sm font-medium text-ink-900">Demo credentials</p>
          </div>
          <p className="mt-1.5 text-sm text-ink-500">
            {DEMO_CREDENTIALS.email} · {DEMO_CREDENTIALS.password}
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-3"
            onClick={() => setValues(DEMO_CREDENTIALS)}
          >
            Fill demo credentials
          </Button>
        </div>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-1.5 text-sm text-ink-500 transition hover:text-ink-900"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to the store
        </Link>
      </div>
    </div>
  );
}
