import Joi from 'joi';

export const registerAuthUserSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

export const loginAuthUserSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

export const requestAuthUserResetEmailSchema = Joi.object({
  email: Joi.string().required().email(),
});

export const resetAuthUserPasswordSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});

export const loginWithGoogleOAuthSchema = Joi.object({
  code: Joi.string().required(),
});