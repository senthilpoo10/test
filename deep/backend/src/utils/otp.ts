import { authenticator } from 'otplib';
import crypto from 'crypto';

// Workaround for TypeScript definitions
const customAuthenticator = Object.create(authenticator);
customAuthenticator.options = {
  crypto,
  window: 1
};

export const generateOTP = (email: string, secret?: string) => {
  const otpSecret = secret || customAuthenticator.generateSecret();
  const otp = customAuthenticator.generate(otpSecret);
  return { otp, secret: otpSecret };
};

export const verifyOTP = (token: string, secret: string) => {
  return customAuthenticator.verify({ token, secret });
};