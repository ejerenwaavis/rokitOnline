import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password: form.password });
      toast.success('Password updated! Please log in with your new credentials.');
      navigate('/auth/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Reset link is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Set New Password — rOKIt</title>
        <meta name="description" content="Set a new password for your rOKIt account." />
      </Helmet>

      <div className="font-body text-paper py-20 px-gutter flex items-center justify-center">
        <div className="w-full max-w-md border border-paper/15 bg-surface p-8 md:p-10">
          <div className="mb-8">
            <p className="section-label">Security Update</p>
            <h1 className="mt-4 font-display text-3xl md:text-4xl text-paper">New Password.</h1>
            <p className="mt-3 text-sm text-paper/70 leading-relaxed">
              Create a secure passphrase with at least 8 characters.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-2">
              <span className="text-xs uppercase text-neutral">New Password (min 8 chars)</span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="min-h-12 w-full border border-paper/25 bg-transparent px-3.5 py-3 pr-12 text-xs text-paper focus:outline-none focus:border-signal"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral hover:text-paper"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <label className="form-field">
              <span>Confirm New Password</span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="action-link mt-6 min-h-12 w-full bg-signal px-7 font-semibold text-night hover:bg-paper disabled:opacity-50"
            >
              {loading ? 'Updating…' : 'Update password'} <ArrowRight className="size-4" />
            </button>
          </form>

          <div className="mt-8 border-t border-paper/15 pt-6 text-center text-xs">
            <Link to="/auth/login" className="text-neutral hover:text-signal transition-colors">
              ← Return to Sign in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
