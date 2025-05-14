import createHttpError from 'http-errors';

import {
  getAuthUserByEmail,
  getAuthUsersService,
  createAuthUserService,
  logoutAuthUserService,
  loginOrSignupWithGoogle,
  updateUser,
  getAuthUserById,
} from '../services/authUserService.js';
import {
  getAuthUserSessionById,
  getAuthUserSessionService,
  getAuthUsersSessionsService,
  refreshAuthUsersSessionService,
  setupAuthUserSessionCookies,
  isRefreshTokenExpired,
} from '../services/authUserSessionService.js';

import { comparePasswords } from '../utils/password.js';

// import { generateAuthUrl } from '../utils/googleOAuth2.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { UserCollection } from '../db/models/userModel.js';

export const getAuthController = async (req, res) => {
  res.send({
    sender: 'authUserController',
    methods: {
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth\refresh',
      register: '/auth\register',
      request: '/auth/request-reset-email',
      reset: '/auth/reset-password',
    },
    datetimestamp: new Date(),
  });
};

export const getAuthUsersController = async (req, res) => {
  const authUsers = await getAuthUsersService(req.query);
  res.send({
    datetimestamp: new Date(),
    count: authUsers.length,
    data: authUsers,
  });
};
export const getAuthUsersSessionsController = async (req, res) => {
  const authUsersSessions = await getAuthUsersSessionsService();
  res.send({
    datetimestamp: new Date(),
    count: authUsersSessions.length,
    data: authUsersSessions,
  });
};

export const registerAuthUserController = async (req, res) => {
  const { email } = req.body;
  let authUser = await getAuthUserByEmail(email);
  if (authUser) {
    throw createHttpError(409, 'Email in use');
  }

  authUser = await createAuthUserService(req.body);
  const session = await setupAuthUserSession(authUser, res);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      accessToken: session.accessToken,
      user: authUser,
    },
  });
};

const setupAuthUserSession = async (authUser, res) => {
  const session = await getAuthUserSessionService(authUser._id);
  setupAuthUserSessionCookies(res, session);
  return session;
};

export const loginAuthUserController = async (req, res) => {
  const { email, password } = req.body;
  const authUser = await getAuthUserByEmail(email);
  if (!authUser) {
    throw createHttpError(404, 'User not found');
  }

  const isPasswordCorrect = await comparePasswords(password, authUser.password);
  if (!isPasswordCorrect) {
    throw createHttpError(401, 'Invalid password');
  }

  const session = await setupAuthUserSession(authUser, res);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
      user: authUser,
    },
  });
};

export const logoutAuthUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutAuthUserService(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

export const refreshAuthUserSessionController = async (req, res) => {
  console.log('request from frontend', req.cookies);
  const { sessionId } = req.cookies;

  const session = await getAuthUserSessionById(sessionId);
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired = await isRefreshTokenExpired(session);
  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const authUserSession = await refreshAuthUsersSessionService(session);
  const authUser = await getAuthUserById(authUserSession.userId);
  setupAuthUserSessionCookies(res, authUserSession);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: authUserSession.accessToken,
      user: authUser,
    },
  });
};

// export const getGoogleOAuthUrlController = async (req, res) => {
//   const url = generateAuthUrl();
//   res.json({
//     status: 200,
//     message: 'Successfully get Google OAuth url!',
//     data: {
//       url,
//     },
//   });
// };

// export const loginWithGoogleController = async (req, res) => {
//   const session = await loginOrSignupWithGoogle(req.body.code);

//   const user = await UserCollection.findById(session.userId);

//   setupAuthUserSessionCookies(res, session);

//   res.json({
//     status: 200,
//     message: 'Successfully logged in via Google OAuth!',
//     data: {
//       accessToken: session.accessToken,
//       user
//     },
//   });
// };

export const patchUserPhotoController = async (req, res) => {
  const userId = req.authUser._id;

  if (!req.file) {
    throw createHttpError(400, 'No file uploaded');
  }

  const photoUrl = await saveFileToCloudinary(req.file);

  const updatedUser = await updateUser(userId, { photo: photoUrl });

  if (!updatedUser) {
    throw createHttpError(404, 'User not found');
  }

  res.json({
    status: 200,
    message: 'Successfully updated user photo!',
    data: {
      photo: updatedUser.photo,
    },
  });
};