import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

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
      toast.success('Password updated! Please log in.');
      navigate('/auth/login');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Reset link is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Reset Password – Rokit Media</title></Helmet>
      <div className="min-h-screen bg-rokit-tan flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src="/assets/images/rokit-logo.png" alt="Rokit Media" className="h-12 mx-auto mb-4" />
            <h1 className="text-3xl font-black text-rokit-dark">Set New Password</h1>
            <p className="text-rokit-body mt-1">Choose a strong password for your account.</p>
          </div>

          <div className="bg-white p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-rokit-dark mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className="form-input pr-10"
                    placeholder="Min. 8 characters"
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

              <div>
                <label className="block text-sm font-semibold text-rokit-dark mb-1">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="form-input"
                  placeholder="Repeat your password"
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? 'Updating…' : 'Update Password'}
              </button>

              <p className="text-center text-sm text-rokit-body">
                <Link to="/auth/login" className="text-rokit-orange font-semibold hover:underline">Back to Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
