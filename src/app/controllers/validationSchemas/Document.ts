import Joi from 'joi';

export const assignResponsibleSchema = Joi.object({
  documentId: Joi.string().required(),
  userId: Joi.string().required(),
});

export const setDeadlineSchema = Joi.object({
  documentId: Joi.string().required(),
  date: Joi.date()
    .allow('')
    .required()
    .greater(Date.now())
    .less(Date.now() + 365 * 24 * 60 * 60 * 1000),
});

export const createSchema = Joi.object({
  title: Joi.string().required(),
  project: Joi.string().required(),
  link: Joi.string().required(),
  identifier: Joi.string().required(),
  publicationDate: Joi.string().required(),
  source: Joi.string().required(),
  status: Joi.string().required(),
  isRulesBreaker: Joi.boolean().optional(),
  assignedUser: Joi.string().optional(),
  deadline: Joi.date().optional(),
  originalFormat: Joi.string().optional(),
  numberOfPages: Joi.number().optional(),
  textInterpretationPrecision: Joi.number().optional(),
  numberOfIdentifiedArticles: Joi.number().optional(),
  numberOfIdentifiedTerms: Joi.number().optional(),
  attachments: Joi.array().items(Joi.string()).optional(),
});

export const addPostOCRContentSchema = Joi.object({
  documentId: Joi.string().required(),
  postOcrContent: Joi.string().required(),
});
