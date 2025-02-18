import createHttpError from 'http-errors';
import {
  findUserByIdAndEmail,
  getAuthUserByEmail,
  updateUserPassword,
} from '../services/authUserService.js';
import { JwtTokenCreateResetEmail } from '../utils/JwtTokenCreate.js';
import sendEmail from '../utils/sendEmail.js';
import { env } from '../utils/env.js';
import { SMTP } from '../constants/index.js';
import { JwtTokenDecodedTokenEmail } from '../utils/JwtTokenDecoded.js';
import { getEncryptedPassword } from '../utils/password.js';
import { deleteSessionByUserId } from '../services/authUserSessionService.js';

export const requestResetEmailController = async (req, res, next) => {
  const { email } = req.body;

  const user = await getAuthUserByEmail(email);

  if (user === null) {
    throw createHttpError(404, 'User not found!');
  }

  const resetToken = JwtTokenCreateResetEmail({
    id: user._id,
    email,
  });

  try {
    await sendEmail({
      from: env(SMTP.FROM),
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${env(
        SMTP.APP_DOMAIN,
      )}/reset-password?token=${resetToken}">here</a> to reset your password!</p>`,
    });
  } catch (error) {
    console.log(error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res, next) => {
  const { token, password } = req.body;
  let id, email;

  try {
    ({ id, email } = JwtTokenDecodedTokenEmail(token));
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    )
      throw createHttpError(401, 'Token is expired or invalid.');

    throw error;
  }

  const user = await findUserByIdAndEmail(id, email);

  if (user === null) throw createHttpError(404, 'User not found!');

  const newHashPassword = await getEncryptedPassword(password);

  await Promise.all([
    updateUserPassword(id, newHashPassword),
    deleteSessionByUserId(id),
  ]);

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};