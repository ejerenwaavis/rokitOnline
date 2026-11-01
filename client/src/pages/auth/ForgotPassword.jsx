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

      <div className="font-body text-paper py-20 px-gutter flex items-center justify-center">
        <div className="w-full max-w-md border border-paper/15 bg-surface p-8 md:p-10">
          <div className="mb-8">
            <p className="section-label">Account Recovery</p>
            <h1 className="mt-4 font-display text-3xl md:text-4xl text-paper">Reset Password.</h1>
            <p className="mt-3 text-sm text-paper/70 leading-relaxed">
              We’ll send an encrypted password reset link to your email.
            </p>
          </div>

          {sent ? (
            <div className="border-l-2 border-signal pl-6 py-4 space-y-4" role="status">
              <Check className="size-6 text-signal" aria-hidden="true" />
              <h2 className="font-display text-2xl text-paper">Check your inbox.</h2>
              <p className="text-sm leading-relaxed text-paper/75">
                If an account exists for <strong className="text-paper">{email}</strong>, a secure reset link has been dispatched.
              </p>
              <Link
                to="/auth/login"
                className="action-link mt-6 min-h-11 border border-signal px-6 text-signal hover:bg-signal hover:text-night"
              >
                Back to Sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <label className="form-field">
                <span>Registered Email Address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@domain.com"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="action-link min-h-12 w-full bg-signal px-7 font-semibold text-night hover:bg-paper disabled:opacity-50"
              >
                {loading ? 'Sending link…' : 'Send reset link'} <ArrowRight className="size-4" />
              </button>

              <div className="text-center pt-2">
                <Link to="/auth/login" className="text-xs text-neutral hover:text-signal transition-colors">
                  ← Back to Sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
