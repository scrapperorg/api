import Joi from 'joi';

export const recoverPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const resetPasswrodSchema = Joi.object({
  token: Joi.string().token().required(),
  password: Joi.string().required(),
});
