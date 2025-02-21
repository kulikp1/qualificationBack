import nodemailer from 'nodemailer';
import { env } from './env.js';
import { SMTP } from '../constants/index.js';

const transport = nodemailer.createTransport({
  host: env(SMTP.HOST),
  port: Number(env(SMTP.PORT)),
  secure: false,
  auth: {
    user: env(SMTP.USER),
    pass: env(SMTP.PASSWORD),
  },
});

const sendEmail = (options) => transport.sendMail(options);

export default sendEmail;