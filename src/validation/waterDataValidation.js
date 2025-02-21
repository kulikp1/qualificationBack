import Joi from 'joi';

export const addMoneyrDataSchema = Joi.object({
  value: Joi.number().required(),
  date: Joi.string(),
  time: Joi.string(),
});

export const updateMoneyDataSchema = Joi.object({
  date: Joi.string(),
  time: Joi.string(),
  value: Joi.number(),
});