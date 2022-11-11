import Joi from 'joi';

export const createSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  role: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
