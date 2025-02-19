import createHttpError from 'http-errors';
import { getAuthUserById } from '../services/authUserService.js';
import { getAuthUserSessionByAccessToken } from '../services/authUserSessionService.js';

export async function auth(req, res, next) {
  const { authorization } = req.headers;

  if (typeof authorization !== 'string') {
    return next(createHttpError(401, 'Please provide Authorization header'));
  }

  const [authType, accessToken] = authorization.split(' ', 2);

  if (authType !== 'Bearer' || typeof accessToken !== 'string') {
    return next(createHttpError(401, 'Auth header should be type of Bearer'));
  }

  const session = await getAuthUserSessionByAccessToken(accessToken);

  if (session === null) {
    return next(createHttpError(401, 'Session not found'));
  }

  if (new Date() > new Date(session.accessTokenValidUntil)) {
    return next(createHttpError(401, 'Access token is expired'));
  }

  const authUser = await getAuthUserById(session.userId);

  if (authUser === null) {
    return next(createHttpError(401, 'User not found'));
  }

  req.authUser = authUser;

  next();
}