import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as registerApi, login as loginApi, verifyOTP as verifyOTPApi, resendOTP as resendOTPApi } from '../services/auth.api';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerApi({ username, email, password });
      if (response.success) {
        navigate('/verify-2fa', { state: { userId: response.data.id } });
      }
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        setError((err as any).response?.data?.error || 'Registration failed');
      } else {
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginApi({ username, password });
      if (response.success) {
        if (response.requires2FA) {
          navigate('/verify-2fa', { state: { userId: response.userId } });
        } else {
          navigate('/tournament');
        }
      }
    } catch (err) {
      // setError(err.response?.data?.error || 'Login failed');
      if (err && typeof err === 'object' && 'response' in err) {
        setError((err as any).response?.data?.error || 'Login failed');
      } else {
        setError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (userId: string, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await verifyOTPApi({ userId, token });
      if (response.success) {
        if (response.verified) {
          navigate('/login', { state: { registrationSuccess: true } });
        } else {
          navigate('/tournament');
        }
      }
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        setError((err as any).response?.data?.error || 'Verification failed');
      } else {
        setError('Verification failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await resendOTPApi(userId);
    } catch (err) {
      // setError(err.response?.data?.error || 'Failed to resend code');
      if (err && typeof err === 'object' && 'response' in err) {
        setError((err as any).response?.data?.error || 'Failed to resend code');
      } else {
        setError('Failed to resend code');
      }
    } finally {
      setLoading(false);
    }
  };

  return { register, login, verifyOTP, resendOTP, loading, error };
};