import Joi from 'joi';

export const recoverPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required(),
});
