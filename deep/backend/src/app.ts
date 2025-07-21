import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyJwt, { JWT } from '@fastify/jwt';
import fastifySecureSession from '@fastify/secure-session';
import authRoutes from './routes/auth';
import config from './utils/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extended JWT interface to match your user structure
interface UserJwtPayload {
  id: string;
  email: string;
  [key: string]: any;
}

// Type extension for Fastify
declare module 'fastify' {
  interface FastifyRequest {
    authUser: UserJwtPayload | null;
  }
  
  interface FastifyInstance {
    jwt: JWT;
  }
}

const app = fastify({
  logger: true
});

// 1. Register core plugins
app.register(fastifyCookie, {
  secret: config.COOKIE_SECRET
});

app.register(fastifySecureSession, {
  key: config.COOKIE_SECRET_BUFFER,
  cookie: {
    secure: config.NODE_ENV === 'production',
    sameSite: 'lax'
  }
});

// 2. Configure JWT
app.register(fastifyJwt, {
  secret: config.JWT_SECRET,
  cookie: {
    cookieName: 'token',
    signed: true
  }
});

// 3. Configure CORS
app.register(fastifyCors, {
  origin: config.BASE_URL,
  credentials: true
});

// 4. Manually decorate request with auth user
app.decorateRequest('authUser', null);

// 5. Authentication hook with proper type assertion
app.addHook('onRequest', async (request) => {
  try {
    const token = request.cookies.token || request.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = await app.jwt.verify<UserJwtPayload>(token);
      request.authUser = decoded;
    }
  } catch (err) {
    request.authUser = null;
  }
});

// Register routes
app.register(authRoutes, { prefix: '/api/auth' });

// Health check
app.get('/api/health', async () => {
  await prisma.$queryRaw`SELECT 1`;
  return { status: 'ok' };
});

// Error handler
app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  reply.status(500).send({ error: 'Internal Server Error' });
});

// Start server
const start = async () => {
  try {
    await app.listen({
      port: config.PORT,
      host: '0.0.0.0'
    });
    console.log(`Server running on ${config.BASE_URL}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  await app.close();
  process.exit(0);
});

export { app };