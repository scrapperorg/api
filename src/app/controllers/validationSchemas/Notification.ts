import { NotificationType } from '@domain/Notification';
import Joi from 'joi';

export const createSchema = Joi.object({
  message: Joi.string().required(),
  user: Joi.string().required(),
  document: Joi.string().optional(),
  type: Joi.string().valid(NotificationType).required(),
});

export const updateSchema = Joi.object({
  id: Joi.string().required(),
  seen: Joi.boolean().optional(),
  message: Joi.string().optional(),
  user: Joi.string().optional(),
  document: Joi.string().optional(),
});
