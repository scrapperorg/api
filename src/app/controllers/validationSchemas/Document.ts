import Joi from 'joi';

export const assignResponsibleSchema = Joi.object({
  documentId: Joi.string().required(),
  userId: Joi.string().required(),
});

export const setDeadlineSchema = Joi.object({
  documentId: Joi.string().required(),
  date: Joi.string().allow('').required(),
});
