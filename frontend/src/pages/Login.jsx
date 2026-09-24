import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { BookOpen, LogIn, AlertCircle, ArrowRight, UserCheck, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = (email || '').trim();
    const cleanPassword = (password || '').trim();
    if (!cleanEmail || !cleanPassword) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      await login(cleanEmail, cleanPassword);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error('[Login Component Error]', err);
      const msg =
        err.response?.data?.message ||
        'Invalid email or password. Please verify your credentials or click a preseeded test account below.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    try {
      setSubmitting(true);
      await login(demoEmail, demoPassword);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error('[Demo Login Error]', err);
      const msg =
        err.response?.data?.message ||
        'Failed to log in with test account. Please try again.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-xs mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Sign in to your account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Student Task & Assignment Manager
          </p>
        </div>

        {/* Card */}
        <div className="bg-white py-8 px-6 sm:px-8 rounded-2xl border border-slate-200 shadow-xs">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-xs disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Seeded Test Accounts Section */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2 text-center">
              1-Click Instant Demo Login
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* <button
                type="button"
                disabled={submitting}
                onClick={() => handleFillDemo('Shantanu@student.edu', 'password123')}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold transition-all cursor-pointer text-center disabled:opacity-50"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">Shantanu@student.edu</span>
              </button> */}

              <button
                type="button"
                disabled={submitting}
                onClick={() => handleFillDemo('demo@student.com', 'Student@123')}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold transition-all cursor-pointer text-center disabled:opacity-50"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">demo@student.com</span>
              </button>
            </div>
             
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center text-xs text-slate-600">
            Don't have a student account?{' '}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              Register here <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
