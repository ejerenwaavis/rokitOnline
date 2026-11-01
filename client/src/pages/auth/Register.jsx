import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const formLoadedAtRef = useRef(Date.now());

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    website: '', // honeypot trap for bots
  });
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
      await register(form.name, form.email, form.password, form.phone, {
        website: form.website,
        _formLoadedAt: formLoadedAtRef.current,
      });
      toast.success('Account created! Welcome to rOKIt.');
      navigate('/portal');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account — rOKIt</title>
        <meta name="description" content="Register for a rOKIt account to manage briefs, quotes, and production orders." />
      </Helmet>

      <div className="font-body text-paper py-20 px-gutter flex items-center justify-center">
        <div className="w-full max-w-md border border-paper/15 bg-surface p-8 md:p-10">
          <div className="mb-8">
            <p className="section-label">New Client</p>
            <h1 className="mt-4 font-display text-3xl md:text-4xl text-paper">Create Account.</h1>
            <p className="mt-3 text-sm text-paper/70 leading-relaxed">
              Track project milestones, approve proofs, and coordinate directly with rOKIt.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Hidden anti-bot honeypot field */}
            <div aria-hidden="true" className="hidden" style={{ display: 'none' }}>
              <label>
                Website
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label className="form-field">
              <span>Full Name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Your name"
              />
            </label>

            <label className="form-field">
              <span>Email Address</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="you@domain.com"
              />
            </label>

            <label className="form-field">
              <span>Phone Number <small>(optional)</small></span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+234..."
              />
            </label>

            <div className="grid gap-2">
              <span className="text-xs uppercase text-neutral">Password (min 8 chars)</span>
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
              <span>Confirm Password</span>
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
              {loading ? 'Creating account…' : 'Create account'} <ArrowRight className="size-4" />
            </button>
          </form>

          <div className="mt-8 border-t border-paper/15 pt-6 text-center text-xs text-neutral">
            Already registered?{' '}
            <Link to="/auth/login" className="text-signal hover:text-paper ml-1">
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
