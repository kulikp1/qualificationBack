import { UserCollection } from '../db/models/userModel.js';
import { AuthUserSessionCollection } from '../db/models/authUserSessionModel.js';
import { getEncryptedPassword } from '../utils/password.js';
import createHttpError from 'http-errors';
// import {
//   getFullNameFromGoogleTokenPayload,
//   validateCode,
// } from '../utils/googleOAuth2.js';
import { getAuthUserSessionObject } from './authUserSessionService.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

export const getAuthUsersService = async () => {
  const authUsers = UserCollection.find();
  return authUsers;
};

export const getAuthUserById = (id) => UserCollection.findById(id);

export const getAuthUserByEmail = (email) => UserCollection.findOne({ email });

export const findUserByIdAndEmail = (_id, email) =>
  UserCollection.findOne({ _id, email });

export const updateUserPassword = (_id, password) =>
  UserCollection.findOneAndUpdate({ _id }, { password });

export const createAuthUserService = async (userData) => {
  const encryptedPassword = await getEncryptedPassword(userData.password);

  return await UserCollection.create({
    ...userData,
    password: encryptedPassword,
  });
};

export const logoutAuthUserService = async (sessionId) => {
  await AuthUserSessionCollection.deleteOne({ _id: sessionId });
};

export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401);

  let user = await UserCollection.findOne({ email: payload.email });
  if (!user) {
    const password = await bcrypt.hash(randomBytes(10), 10);
    user = await UserCollection.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      password,
    });
  }

  const newSession = getAuthUserSessionObject();

  const authUserSession = await AuthUserSessionCollection.create({
    userId: user._id,
    ...newSession,
  });

  return authUserSession;
};

export const updateUser = async (userId, payload) => {
  const rawResult = await UserCollection.findOneAndUpdate(
    { _id: userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return rawResult.value;
};

export const updateUsersById = (id, update, options = { new: true }) =>
  UserCollection.findByIdAndUpdate(id, update, options);