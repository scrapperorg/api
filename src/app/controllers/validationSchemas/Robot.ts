import Joi from 'joi';

export const createSchema = Joi.object({
  name: Joi.string().required(),
});

export const updatedSchema = Joi.object({
  status: Joi.string().required(),
  info: Joi.string().required(),
});
