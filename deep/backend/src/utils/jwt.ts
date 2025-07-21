// import jwt from 'jsonwebtoken';
// import config from './config';

// interface UserPayload {
//   sub: string;
// }

// export const signJWT = (payload: UserPayload, options?: { expiresIn?: string }) => {
//   return jwt.sign(payload, config.JWT_SECRET, {
//     expiresIn: options?.expiresIn || config.JWT_EXPIRES_IN
//   } as jwt.SignOptions);
// };

// export const verifyJWT = (token: string) => {
//   return jwt.verify(token, config.JWT_SECRET) as UserPayload;
// };

// export const extractUserFromRequest = (request: any) => {
//   try {
//     const token = request.cookies?.token || 
//                  request.headers?.authorization?.split(' ')[1];
//     if (!token) return null;
//     return verifyJWT(token);
//   } catch {
//     return null;
//   }
// };


import { FastifyInstance, FastifyRequest } from 'fastify';
import config from './config';

interface UserPayload {
  sub: string;
  [key: string]: any; // Allow additional properties
}

// Note: We now accept Fastify instance as first parameter
export const signJWT = (app: FastifyInstance, payload: UserPayload, options?: { expiresIn?: string }) => {
  return app.jwt.sign(payload, {
    expiresIn: options?.expiresIn || config.JWT_EXPIRES_IN
  });
};

export const verifyJWT = (app: FastifyInstance, token: string) => {
  return app.jwt.verify<UserPayload>(token);
};

export const extractUserFromRequest = (app: FastifyInstance, request: FastifyRequest) => {
  try {
    const token = request.cookies?.token || 
                 request.headers?.authorization?.split(' ')[1];
    if (!token) return null;
    return verifyJWT(app, token);
  } catch {
    return null;
  }
};