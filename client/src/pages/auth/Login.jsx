import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login, verifyMfa, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/portal';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // MFA state
  const [mfaPending, setMfaPending] = useState(false);
  const [mfaToken, setMfaToken] = useState('');
  const [otp, setOtp] = useState('');

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(form.email, form.password);
      if (result?.mfaPending) {
        setMfaToken(result.mfaToken);
        setMfaPending(true);
        toast.success('Check your email for a 6-digit code.');
        return;
      }
      toast.success('Welcome back!');
      navigate(isAdmin() ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMfa = async (e) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      toast.error('Please enter the 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      await verifyMfa(mfaToken, otp.trim());
      toast.success('Identity verified!');
      navigate(isAdmin() ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Verification failed.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setOtp('');
    setLoading(true);
    try {
      const result = await login(form.email, form.password);
      if (result?.mfaPending) {
        setMfaToken(result.mfaToken);
        toast.success('A new code has been sent to your email.');
      }
    } catch {
      toast.error('Could not resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Account Sign In — rOKIt</title>
        <meta name="description" content="Sign in to your rOKIt account or client portal." />
      </Helmet>

      <div className="font-v4-body text-paper py-20 px-gutter flex items-center justify-center">
        <div className="w-full max-w-md border border-paper/15 bg-surface p-8 md:p-10">
          <div className="mb-8">
            <p className="v4-section-label">{mfaPending ? 'Two-Factor Challenge' : 'Account Access'}</p>
            <h1 className="mt-3 font-v4-display text-3xl md:text-4xl text-paper">
              {mfaPending ? 'Verify Identity' : 'Log In'}
            </h1>
            <p className="mt-2 text-sm text-paper/70 leading-relaxed">
              {mfaPending
                ? `Enter the 6-digit security code sent to ${form.email}`
                : 'Welcome back. Sign in to access your projects and briefs.'}
            </p>
          </div>

          {!mfaPending ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <label className="block space-y-2">
                <span className="text-xs uppercase font-mono tracking-wider text-neutral block">
                  Email Address
                </span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full min-h-[3rem] border border-paper/25 bg-transparent p-3 text-paper focus:outline-none focus:border-signal"
                  placeholder="your@email.com"
                />
              </label>

              <label className="block space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono tracking-wider text-neutral">
                    Password
                  </span>
                  <Link
                    to="/auth/forgot-password"
                    className="text-xs font-mono text-signal hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className="w-full min-h-[3rem] border border-paper/25 bg-transparent p-3 pr-12 text-paper focus:outline-none focus:border-signal"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral hover:text-paper"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="v4-action-link min-h-12 w-full border border-signal bg-signal text-night font-semibold text-xs uppercase font-mono tracking-wider hover:bg-paper transition-colors justify-center disabled:opacity-50"
              >
                {loading ? 'Authenticating…' : 'Sign In'} <ArrowRight className="size-4 ml-2" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyMfa} className="space-y-6">
              <div className="flex items-center gap-3 border border-signal/30 bg-signal/10 p-3 text-xs font-mono text-signal">
                <ShieldCheck size={18} className="shrink-0" />
                <span>Multi-factor authentication active</span>
              </div>

              <label className="block space-y-2">
                <span className="text-xs uppercase font-mono tracking-wider text-neutral block">
                  6-Digit OTP Code
                </span>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                  autoFocus
                  className="w-full min-h-[3.5rem] border border-paper/25 bg-transparent p-3 text-center text-2xl tracking-[0.5em] font-mono text-paper focus:outline-none focus:border-signal"
                  placeholder="000000"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="v4-action-link min-h-12 w-full border border-signal bg-signal text-night font-semibold text-xs uppercase font-mono tracking-wider hover:bg-paper transition-colors justify-center disabled:opacity-50"
              >
                {loading ? 'Verifying…' : 'Confirm Code'} <ArrowRight className="size-4 ml-2" />
              </button>

              <div className="flex items-center justify-between pt-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-signal hover:underline disabled:opacity-50"
                >
                  Resend Code
                </button>
                <button
                  type="button"
                  onClick={() => setMfaPending(false)}
                  className="text-neutral hover:text-paper"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {!mfaPending && (
            <div className="mt-8 border-t border-paper/15 pt-6 text-center text-xs font-mono text-neutral">
              Don’t have an account yet?{' '}
              <Link to="/auth/register" className="text-signal hover:underline ml-1">
                Create one here
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
