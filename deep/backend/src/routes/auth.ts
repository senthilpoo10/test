import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  registerUser,
  loginUser,
  verifyUserOTP,
  resendOTP,
  generateGoogleAuthUrl,
  handleGoogleCallback
} from '../services/auth.service';
import config from '../utils/config';

export default async function authRoutes(fastify: FastifyInstance) {
  // Register new user
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { username, email, password } = request.body as {
        username: string;
        email: string;
        password: string;
      };

      const user = await registerUser({ username, email, password });
      reply.send({ 
        success: true, 
        data: { 
          userId: user.id,
          email: user.email,
          requiresVerification: true
        }
      });
    } catch (error: any) {
      reply.status(400).send({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // Login user
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { username, password } = request.body as {
        username: string;
        password: string;
      };

      const result = await loginUser(fastify, { username, password });

      if (result.requires2FA) {
        return reply.send({ 
          success: true, 
          requires2FA: true, 
          userId: result.userId 
        });
      }

      if (!result.token) {
        throw new Error('Token not generated');
      }

      reply
        .setCookie('token', result.token, {
          path: '/',
          httpOnly: true,
          secure: config.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 86400 // 1 day
        })
        .send({ 
          success: true, 
          user: result.user 
        });
    } catch (error: any) {
      reply.status(400).send({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // Verify OTP
  fastify.post('/verify-otp', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { userId, token } = request.body as {
        userId: string;
        token: string;
      };

      const result = await verifyUserOTP(fastify, { userId, token });

      if (result.isRegistration) {
        return reply.send({ 
          success: true, 
          verified: true 
        });
      }

      if (!result.token) {
        throw new Error('Token not generated');
      }

      reply
        .setCookie('token', result.token, {
          path: '/',
          httpOnly: true,
          secure: config.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 86400 // 1 day
        })
        .send({ 
          success: true, 
          user: result.user 
        });
    } catch (error: any) {
      reply.status(400).send({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // Resend OTP
  fastify.post('/resend-otp', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { userId } = request.body as { userId: string };
      await resendOTP(userId);
      reply.send({ success: true });
    } catch (error: any) {
      reply.status(400).send({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // Google OAuth
  fastify.get('/google', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { url } = await generateGoogleAuthUrl();
      reply.redirect(url);
    } catch (error: any) {
      reply.status(400).send({ 
        success: false, 
        error: error.message 
      });
    }
  });

  // Google OAuth callback
  fastify.get('/google/callback', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { code } = request.query as { code: string };
      const result = await handleGoogleCallback(fastify, code);

      if (!result.token) {
        throw new Error('Token not generated');
      }

      reply
        .setCookie('token', result.token, {
          path: '/',
          httpOnly: true,
          secure: config.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 86400 // 1 day
        })
        .redirect(config.BASE_URL);
    } catch (error: any) {
      reply.status(400).send({ 
        success: false, 
        error: error.message 
      });
    }
  });
}