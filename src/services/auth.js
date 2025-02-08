import createHttpError from 'http-errors';
import { UserCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { SessionCollection } from '../db/models/session.js';
import { randomBytes } from 'crypto';

export const registerUser = async (payload) => {
  const newUser = await UserCollection.findOne({
    email: payload.email,
  });

  if (newUser) {
    throw createHttpError(409, 'Email is already used');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return await UserCollection.create({ ...payload, password: hashedPassword });
};

const createNewSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const loginUser = async (payload) => {
  const user = await UserCollection.findOne({
    email: payload.email,
  });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const passwordIsEqual = await bcrypt.compare(payload.password, user.password);
  if (!passwordIsEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const newSession = createNewSession();

  return await SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token expired');
  }

  const user = await UserCollection.findById(session.userId);

  if (!user) {
    throw createHttpError(401, 'Session for such user not found');
  }

  await SessionCollection.deleteOne({ _id: sessionId });

  const newSession = createNewSession();

  return await SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};