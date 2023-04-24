import Joi from 'joi';
import { Role } from '@domain/User';

export const createSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  role: Joi.string().valid(Role.LSE, Role.ITA, Role.GU, Role.LSS).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().optional(),
});

export const updatedSourcesSchema = Joi.object({
  sourcesOfInterest: Joi.array().items(Joi.string()).required(),
});

export const updatePasswordSchema = Joi.object({
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});
