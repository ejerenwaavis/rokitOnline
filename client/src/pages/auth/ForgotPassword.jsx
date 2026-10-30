import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Check, ArrowRight } from 'lucide-react';
import api from '../../utils/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      // Always show success to avoid email enumeration
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password — rOKIt</title>
        <meta name="description" content="Reset your rOKIt account password." />
      </Helmet>

      <div className="font-v4-body text-paper py-20 px-gutter flex items-center justify-center">
        <div className="w-full max-w-md border border-paper/15 bg-surface p-8 md:p-10">
          <div className="mb-8">
            <p className="v4-section-label">Account Recovery</p>
            <h1 className="mt-3 font-v4-display text-3xl md:text-4xl text-paper">Reset Password</h1>
            <p className="mt-2 text-sm text-paper/70 leading-relaxed">
              We’ll send an encrypted password reset link to your email.
            </p>
          </div>

          {sent ? (
            <div className="border-l-2 border-signal pl-6 py-4 space-y-4" role="status">
              <Check className="size-6 text-signal" aria-hidden="true" />
              <h2 className="font-v4-display text-2xl text-paper">CHECK YOUR INBOX</h2>
              <p className="text-sm leading-relaxed text-paper/75">
                If an account exists for <strong className="text-paper">{email}</strong>, a secure reset link has been dispatched. Please inspect your spam or junk directory if it doesn't arrive within 2 minutes.
              </p>
              <Link
                to="/auth/login"
                className="v4-action-link mt-6 min-h-12 border border-signal px-6 text-xs uppercase font-mono tracking-wider text-signal hover:bg-signal hover:text-night transition-colors inline-flex"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <label className="block space-y-2">
                <span className="text-xs uppercase font-mono tracking-wider text-neutral block">
                  Registered Email Address
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full min-h-[3rem] border border-paper/25 bg-transparent p-3 text-paper focus:outline-none focus:border-signal"
                  placeholder="you@domain.com"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="v4-action-link min-h-12 w-full border border-signal bg-signal text-night font-semibold text-xs uppercase font-mono tracking-wider hover:bg-paper transition-colors justify-center disabled:opacity-50"
              >
                {loading ? 'Sending Link…' : 'Send Reset Link'} <ArrowRight className="size-4 ml-2" />
              </button>

              <div className="text-center pt-2">
                <Link to="/auth/login" className="text-xs font-mono text-neutral hover:text-signal transition-colors">
                  ← Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
