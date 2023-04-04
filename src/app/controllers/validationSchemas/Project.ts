import Joi from 'joi';

export const createSchema = Joi.object({
  title: Joi.string().required(),
  presentsInterest: Joi.boolean(),
  numarInregistrareSenat: Joi.string(),
  numarInregistrareGuvern: Joi.string(),
  proceduraLegislativa: Joi.string(),
  cameraDecizionala: Joi.string(),
  termenAdoptare: Joi.string(),
  tipInitiativa: Joi.string(),
  caracter: Joi.string(),
  esteProceduraDeUrgenta: Joi.boolean(),
  stadiu: Joi.string(),
  initiator: Joi.string(),
  consultati: Joi.string(),
});

export const findSchema = Joi.object({
  title: Joi.string(),
});

export const searchSchema = Joi.object({
  title: Joi.string().optional().allow(''),
  createddAfter: Joi.date().optional().allow('').less(Date.now()),
  createddBefore: Joi.date().optional().allow('').less(Date.now()),
  presentsInterest: Joi.boolean().optional(),
  postOcrContent: Joi.string().optional().allow(''),
});
