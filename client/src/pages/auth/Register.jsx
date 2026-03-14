import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { T } from '../../theme';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
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
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Account created! Welcome to Rokit Media.');
      navigate('/portal');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Create Account – Rokit Media</title></Helmet>
      <div className="min-h-screen bg-rokit-cream flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src="/assets/images/rokit-logo.png" alt="Rokit Media" className="h-10 mx-auto mb-5" />
            <h1 className={`${T.h2} mb-1`}>Create Account</h1>
            <p className={T.body}>Join Rokit Media to manage your orders and quotes.</p>
          </div>

          <div className={T.formCard}>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-rokit-dark mb-1">Full Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required className="form-input" placeholder="Your full name" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-rokit-dark mb-1">Email Address *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required autoComplete="email" className="form-input" placeholder="your@email.com" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-rokit-dark mb-1">Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="form-input" placeholder="+234 …" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-rokit-dark mb-1">Password *</label>
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
                  <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-rokit-dark mb-1">Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="form-input"
                  placeholder="Repeat password"
                />
              </div>

              <p className="text-xs text-rokit-body">
                By creating an account you agree to our{' '}
                <Link to="/terms" className="text-rokit-orange hover:underline">Terms & Conditions</Link> and{' '}
                <Link to="/privacy" className="text-rokit-orange hover:underline">Privacy Policy</Link>.
              </p>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-rokit-body mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-rokit-orange font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
