import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

interface Config {
  // Server Configuration
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  BASE_URL: string;
  
  // Database Configuration
  DATABASE_URL: string;
  
  // Authentication Configuration
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  COOKIE_SECRET: string;
  COOKIE_SECRET_BUFFER: Buffer;
  
  // Email Configuration
  SMTP_HOST?: string;
  SMTP_PORT?: number;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  EMAIL_FROM?: string;
  
  // Google OAuth Configuration
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_CALLBACK_URL: string;
  
  // Session Configuration
  SESSION_TTL: number;
}

const config: Config = {
  // Server Configuration
  PORT: parseInt(process.env.PORT || '3001'),
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
  
  // Database Configuration
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  
  // Authentication Configuration
  JWT_SECRET: process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  COOKIE_SECRET: process.env.COOKIE_SECRET || crypto.randomBytes(32).toString('hex'),
  COOKIE_SECRET_BUFFER: Buffer.from(process.env.COOKIE_SECRET || crypto.randomBytes(32).toString('hex'), 'hex'),
  
  // Email Configuration
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM || 'no-reply@example.com',
  
  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
  
  // Session Configuration
  SESSION_TTL: parseInt(process.env.SESSION_TTL || '86400')
};

// Validate required configuration
if (config.COOKIE_SECRET_BUFFER.length !== 32) {
  throw new Error('COOKIE_SECRET must decode to exactly 32 bytes (64 hex characters)');
}

if (config.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long');
}

export default config;