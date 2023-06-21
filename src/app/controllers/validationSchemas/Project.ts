import Joi from 'joi';

export const createSchema = Joi.object({
  title: Joi.string().required(),
  presentsInterest: Joi.boolean(),
  numarInregistrareSenat: Joi.string(),
  numarInregistrareGuvern: Joi.string(),
  numarInregistrareCDep: Joi.string(),
  proceduraLegislativa: Joi.string(),
  cameraDecizionala: Joi.string(),
  termenAdoptare: Joi.string(),
  tipInitiativa: Joi.string(),
  caracter: Joi.string(),
  esteProceduraDeUrgenta: Joi.boolean(),
  stadiu: Joi.string(),
  initiator: Joi.string(),
  source: Joi.string(),
  consultati: Joi.string(),
  publicationDate: Joi.string(),
  url: Joi.string(),
});

export const updateSchema = Joi.object({
  title: Joi.string(),
  presentsInterest: Joi.boolean(),
  numarInregistrareSenat: Joi.string(),
  numarInregistrareGuvern: Joi.string(),
  numarInregistrareCDep: Joi.string(),
  proceduraLegislativa: Joi.string(),
  cameraDecizionala: Joi.string(),
  termenAdoptare: Joi.string(),
  tipInitiativa: Joi.string(),
  caracter: Joi.string(),
  source: Joi.string(),
  esteProceduraDeUrgenta: Joi.boolean(),
  stadiu: Joi.string(),
  initiator: Joi.string(),
  consultati: Joi.string(),
  publicationDate: Joi.string(),
  url: Joi.string(),
});

export const findSchema = Joi.object({
  title: Joi.string(),
});

export const searchSchema = Joi.object({
  title: Joi.string().optional().allow(null, ''),
  initiator: Joi.string().optional().allow(null, ''),
  source: Joi.string().optional().allow(null, ''),
  createdAfter: Joi.date().optional().allow(null, ''),
  createdBefore: Joi.date().optional().allow(null, ''),
  presentsInterest: Joi.boolean().optional(),
  postOcrContent: Joi.string().optional().allow(null, ''),
});
