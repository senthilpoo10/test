import api from './api';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface VerifyOTPData {
  userId: string;
  token: string;
}

export const register = async (data: RegisterData) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const verifyOTP = async (data: VerifyOTPData) => {
  const response = await api.post('/auth/verify-otp', data);
  return response.data;
};

export const resendOTP = async (userId: string) => {
  const response = await api.post('/auth/resend-otp', { userId });
  return response.data;
};

export const getGoogleAuthUrl = async () => {
  const response = await api.get('/auth/google');
  return response.data;
};