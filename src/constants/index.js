import path from 'node:path';

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
export const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
export const TEMP_DIR = path.join(process.cwd(), 'temp');

export const FIFTEEN_MINUTES = 900000; //15 * 60 * 1000;
export const ONE_DAY = 86400000; //24 * 60 * 60 * 1000;

export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUD_NAME',
  API_KEY: 'API_KEY',
  API_SECRET: 'API_SECRET',
};

export const SMTP = {
  HOST: 'SMTP_HOST',
  PORT: 'SMTP_PORT',
  USER: 'SMTP_USER',
  PASSWORD: 'SMTP_PASSWORD',
  FROM: 'SMTP_FROM',
  APP_DOMAIN: 'APP_DOMAIN',
  JWT_SECRET: 'JWT_SECRET',
};

export const JWT_TOKEN_TIME = {
  EMAIL_RESET: '15m',
};