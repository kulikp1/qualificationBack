import jwt from 'jsonwebtoken';
import { env } from './env.js';
import { SMTP } from '../constants/index.js';

export const JwtTokenDecodedTokenEmail = (token) =>
  jwt.verify(token, env(SMTP.JWT_SECRET));