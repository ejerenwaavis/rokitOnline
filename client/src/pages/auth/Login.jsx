import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/portal';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(isAdmin() ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Log In – Rokit Media</title></Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src="/assets/images/rokit-logo.png" alt="Rokit Media" className="h-12 mx-auto mb-4" />
            <h1 className="text-3xl font-black text-rokit-dark">Log In</h1>
            <p className="text-rokit-body mt-1">Welcome back! Sign in to your account.</p>
          </div>

          <div className="bg-white p-8 shadow-lg rounded-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-rokit-dark mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="form-input"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-rokit-dark mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className="form-input pr-10"
                    placeholder="Your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rokit-body"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? 'Signing in…' : 'Sign In'}
              </button>

              <p className="text-center text-sm">
                <Link to="/auth/forgot-password" className="text-rokit-body hover:text-rokit-orange transition-colors">Forgot password?</Link>
              </p>
            </form>

            <p className="text-center text-sm text-rokit-body mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-rokit-orange font-semibold hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
