import * as argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';
import { generateOTP, verifyOTP } from '../utils/otp';
import { sendEmail } from './email.service';
import config from '../utils/config';
import { FastifyInstance } from 'fastify';

const prisma = new PrismaClient();

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

interface LoginInput {
  username: string;
  password: string;
}

interface VerifyOTPInput {
  userId: string;
  token: string;
}

interface AuthResult {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface LoginResult {
  requires2FA: boolean;
  userId?: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export const registerUser = async (input: RegisterInput) => {
  const { username, email, password } = input;

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] }
  });

  if (existingUser) {
    throw new Error('Username or email already exists');
  }

  const hashedPassword = await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
    hashLength: 32
  });

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword
    }
  });

  const { otp, secret } = generateOTP(user.email);

  await prisma.user.update({
    where: { id: user.id },
    data: { otpSecret: secret }
  });

  await sendEmail({
    to: user.email,
    subject: 'Verify your email',
    text: `Your verification code is: ${otp}`,
    html: `<p>Your verification code is: <strong>${otp}</strong></p>`
  });

  return { id: user.id, email: user.email };
};

export const loginUser = async (app: FastifyInstance, input: LoginInput): Promise<LoginResult> => {
  const { username, password } = input;

  const user = await prisma.user.findUnique({
    where: { username }
  });

  if (!user) {
    throw new Error('Invalid username or password');
  }

  const isValidPassword = await argon2.verify(user.password, password);
  if (!isValidPassword) {
    throw new Error('Invalid username or password');
  }

  if (!user.isVerified) {
    throw new Error('Please verify your email first');
  }

  if (user.otpEnabled && user.otpSecret) {
    const { otp } = generateOTP(user.email, user.otpSecret);
    
    await sendEmail({
      to: user.email,
      subject: 'Your login verification code',
      text: `Your verification code is: ${otp}`,
      html: `<p>Your verification code is: <strong>${otp}</strong></p>`
    });

    return { requires2FA: true, userId: user.id };
  }

  const { token } = await generateTokens(app, user.id);
  
  return {
    requires2FA: false,
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  };
};

export const verifyUserOTP = async (app: FastifyInstance, input: VerifyOTPInput): Promise<AuthResult & { isRegistration?: boolean }> => {
  const { userId, token } = input;

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.otpSecret) {
    throw new Error('OTP not set up for this user');
  }

  const isValid = verifyOTP(token, user.otpSecret);
  if (!isValid) {
    throw new Error('Invalid verification code');
  }

  if (!user.isVerified) {
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, otpVerified: true }
    });

    return { isRegistration: true } as any;
  }

  const { token: accessToken } = await generateTokens(app, user.id);

  return {
    token: accessToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  };
};

export const resendOTP = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.otpSecret) {
    throw new Error('OTP not set up for this user');
  }

  const { otp } = generateOTP(user.email, user.otpSecret);

  await sendEmail({
    to: user.email,
    subject: 'Your new verification code',
    text: `Your new verification code is: ${otp}`,
    html: `<p>Your new verification code is: <strong>${otp}</strong></p>`
  });

  return { success: true };
};

export const generateGoogleAuthUrl = async () => {
  if (!config.GOOGLE_CLIENT_ID) {
    throw new Error('Google OAuth not configured');
  }

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.GOOGLE_CLIENT_ID}&redirect_uri=${config.BASE_URL}${config.GOOGLE_CALLBACK_URL}&response_type=code&scope=profile email`;
  return { url };
};

export const handleGoogleCallback = async (app: FastifyInstance, code: string): Promise<AuthResult> => {
  // Implementation would go here
  throw new Error('Google OAuth callback not fully implemented');
};

// Updated to use Fastify JWT
const generateTokens = async (app: FastifyInstance, userId: string): Promise<{ token: string; refreshToken: string }> => {
  const token = app.jwt.sign(
    { sub: userId },
    { expiresIn: config.JWT_EXPIRES_IN }
  );
  
  const refreshToken = app.jwt.sign(
    { sub: userId },
    { expiresIn: '7d' }
  );

  await prisma.session.create({
    data: {
      userId,
      token,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });

  return { token, refreshToken };
};