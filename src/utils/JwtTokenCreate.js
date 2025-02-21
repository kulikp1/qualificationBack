import jwt from 'jsonwebtoken';
import { env } from './env.js';
import { JWT_TOKEN_TIME, SMTP } from '../constants/index.js';

export const JwtTokenCreateResetEmail = ({ id, email }) =>
  jwt.sign(
    {
      id,
      email,
    },
    env(SMTP.JWT_SECRET),
    {
      expiresIn: JWT_TOKEN_TIME.EMAIL_RESET,
    },
  );