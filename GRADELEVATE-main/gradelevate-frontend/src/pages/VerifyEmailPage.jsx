import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);
  const hasCalled = useRef(false);

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token found.');
      return;
    }
    handleVerify();
  }, []);

  useEffect(() => {
    if (status === 'success') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/onboarding');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status]);

  const handleVerify = async () => {
    try {
      const res = await verifyEmail(token);
      const { token: jwt, email, role } = res.data;

      // Auto-login the user with the returned JWT
      if (jwt) {
        login({ email, role }, jwt);
      }

      setStatus('success');
      setMessage(res.data?.message || 'Email verified successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.error || '';

      // If already used but user is verified in DB — treat as success
      if (errorMsg.includes('already been used')) {
        setStatus('success');
        setMessage('Your email is already verified. Redirecting you now...');
        return;
      }

      setStatus('error');
      setMessage(
        errorMsg || 'Verification failed. The link may have expired.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-indigo-600 mb-1">AI Career Guidance Agent</h1>
          <p className="text-gray-400 text-sm">Email Verification</p>
        </div>

        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
              <Loader size={32} className="text-indigo-500 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Verifying your email...</h2>
            <p className="text-gray-400 text-sm">Please wait a moment</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-2">
              <CheckCircle size={44} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Email Verified!</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your account has been successfully activated.<br />
              Let's get you set up with your career profile.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-3 mt-2">
              <p className="text-green-700 text-sm font-medium">
                Redirecting to onboarding in <span className="font-black text-lg">{countdown}</span> seconds...
              </p>
            </div>
            <button
              onClick={() => navigate('/onboarding')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition text-sm mt-2"
            >
              Get Started Now →
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-2">
              <XCircle size={44} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Verification Failed</h2>
            <p className="text-gray-500 text-sm leading-relaxed">{message}</p>
            <div className="flex flex-col gap-2 w-full mt-2">
              <Link to="/register" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition text-sm">
                Register Again
              </Link>
              <Link to="/login" className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition text-sm">
                Back to Login
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyEmailPage;