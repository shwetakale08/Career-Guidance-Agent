import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { loginUser, resendVerification } from '../api/authApi';
import { Mail } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showVerifyBanner, setShowVerifyBanner] = useState(false);
  const [resending, setResending] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowVerifyBanner(false);
    try {
      const res = await loginUser(form);
      const { token, email, role } = res.data;
      login({ email, role }, token);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.error || '';
      if (errorMsg === 'EMAIL_NOT_VERIFIED') {
        setShowVerifyBanner(true);
      } else {
        toast.error(errorMsg || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendVerification(form.email);
      toast.success('Verification email sent! Check your inbox.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to resend email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">AI Career Guidance Agent</h1>
          <p className="text-gray-500 mt-2">Sign in to your account</p>
        </div>

        {/* Email not verified banner */}
        {showVerifyBanner && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail size={16} className="text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-amber-800 font-semibold text-sm">Please verify your email first</p>
                <p className="text-amber-600 text-xs mt-0.5">
                  We sent a verification link to <strong>{form.email}</strong>. Check your inbox and spam folder.
                </p>
                <button onClick={handleResend} disabled={resending}
                  className="mt-2 text-xs text-indigo-600 font-semibold hover:underline disabled:opacity-50">
                  {resending ? 'Sending...' : 'Resend verification email'}
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" />
          </div>
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-indigo-500 hover:underline">
              Forgot your password?
            </Link>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
