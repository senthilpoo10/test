import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Verify2FAForm = () => {
  const [token, setToken] = useState('');
  const [countdown, setCountdown] = useState(30);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { verifyOTP, resendOTP, loading, error } = useAuth();

  const userId = state?.userId;

  useEffect(() => {
    if (!userId) {
      navigate('/login');
    }
  }, [userId, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId) {
      verifyOTP(userId, token);
    }
  };

  const handleResend = () => {
    if (userId) {
      resendOTP(userId);
      setCountdown(30);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Verify 2FA</h2>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="token">
            Verification Code
          </label>
          <input
            id="token"
            type="text"
            className="w-full p-2 border rounded"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 mb-4"
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
        <button
          type="button"
          className="w-full bg-gray-200 text-gray-700 p-2 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
          onClick={handleResend}
          disabled={countdown > 0}
        >
          {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
        </button>
      </form>
    </div>
  );
};