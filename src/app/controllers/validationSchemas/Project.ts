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

export const updateSchema = Joi.object({
  title: Joi.string(),
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
  title: Joi.string().optional().allow(null, ''),
  createdAfter: Joi.date().optional().allow(null, ''),
  createdBefore: Joi.date().optional().allow(null, ''),
  presentsInterest: Joi.boolean().optional(),
  postOcrContent: Joi.string().optional().allow(null, ''),
});
