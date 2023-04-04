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
  storagePath: Joi.string().optional(),
  originalFormat: Joi.string().optional(),
  numberOfPages: Joi.number().optional(),
  textInterpretationPrecision: Joi.number().optional(),
  numberOfIdentifiedArticles: Joi.number().optional(),
  numberOfIdentifiedTerms: Joi.number().optional(),
  attachments: Joi.array().items(Joi.string()).optional(),
  processingStatus: Joi.string().optional(),
});

export const updateSchema = Joi.object({
  title: Joi.string().optional(),
  project: Joi.string().optional(),
  link: Joi.string().optional(),
  identifier: Joi.string().optional(),
  publicationDate: Joi.string().optional(),
  source: Joi.string().optional(),
  status: Joi.string().optional(),
  isRulesBreaker: Joi.boolean().optional(),
  assignedUser: Joi.string().optional(),
  deadline: Joi.date().optional(),
  storagePath: Joi.string().optional(),
  originalFormat: Joi.string().optional(),
  numberOfPages: Joi.number().optional(),
  textInterpretationPrecision: Joi.number().optional(),
  numberOfIdentifiedArticles: Joi.number().optional(),
  numberOfIdentifiedTerms: Joi.number().optional(),
  attachments: Joi.array().items(Joi.string()).optional(),
  postOcrContent: Joi.string().optional(),
  processingStatus: Joi.string().optional(),
  part: Joi.number().optional(),
  totalParts: Joi.number().optional(),
  highlightFile: Joi.string().optional(),
  highlightMetadata: Joi.array().optional(),
});

export const searchContentSchema = Joi.object({
  identificator: Joi.string().optional().allow(''),
  title: Joi.string().optional().allow(''),
  source: Joi.string().optional().allow(''),
  status: Joi.string().optional().allow(''),
  assignedUserId: Joi.string().optional().allow(''),
  projectId: Joi.string().optional().allow(''),
  publishedAfter: Joi.date().optional().allow('').less(Date.now()),
  publishedBefore: Joi.date().optional().allow('').less(Date.now()),
  postOcrContent: Joi.string().optional().allow(''),
  isRulesBreaker: Joi.boolean().optional(),
});
