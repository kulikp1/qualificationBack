import { env } from '../utils/env.js';

export const APP_CONFIG = {
  PORT: env('PORT', '3000'),
};