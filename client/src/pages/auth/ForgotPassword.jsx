import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
      <Helmet><title>Forgot Password – Rokit Media</title></Helmet>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src="/assets/images/rokit-logo.png" alt="Rokit Media" className="h-12 mx-auto mb-4" />
            <h1 className="text-3xl font-black text-rokit-dark">Forgot Password</h1>
            <p className="text-rokit-body mt-1">We'll send you a reset link by email.</p>
          </div>

          <div className="bg-white p-8 shadow-lg rounded-xl">
            {sent ? (
              <div className="text-center space-y-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-rokit-dark font-semibold">Check your inbox</p>
                <p className="text-sm text-rokit-body">
                  If an account exists for <strong>{email}</strong>, a reset link has been sent. Check your spam folder too.
                </p>
                <Link to="/auth/login" className="btn-primary inline-block mt-2">Back to Login</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-rokit-dark mb-1">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="form-input"
                    placeholder="your@email.com"
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
                <p className="text-center text-sm text-rokit-body">
                  <Link to="/auth/login" className="text-rokit-orange font-semibold hover:underline">Back to Login</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
