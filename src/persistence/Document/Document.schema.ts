import { v4 } from 'uuid';
import { IDocumentPersistenceDTO } from './../dtos/Document';
import { EntitySchema } from '@mikro-orm/core';
import { Status } from '@domain/Document/Document';

export const DocumentSchema = new EntitySchema<IDocumentPersistenceDTO>({
  name: 'Document',
  properties: {
    // base
    id: { type: 'uuid', primary: true, onCreate: () => v4() },
    createdAt: { type: 'Date', onCreate: () => new Date() },
    updatedAt: {
      type: 'Date',
      onCreate: () => new Date(),
      onUpdate: () => new Date(),
    },
    // general
    title: { type: 'string', nullable: false },
    identificator: { type: 'string', nullable: false },
    publicationDate: { type: 'Date', nullable: false },
    source: { type: 'string', nullable: false }, // if Source will ever become entity, replace with relation
    // activity
    status: { enum: true, array: true, default: [Status.NOU], items: () => Status },
    assignedUser: { reference: 'm:1', entity: 'User', nullable: true },
    project: { reference: 'm:1', entity: 'Project' },
    deadline: { type: 'Date', nullable: true },
    // AI
    originalFormat: { type: 'string', nullable: true },
    numberOfPages: { type: 'number', nullable: true },
    textInterpretationPrecision: { type: 'number', nullable: true },
    numberOfIdentifiedArticles: { type: 'number', nullable: true },
    numberOfIdentifiedTerms: { type: 'number', nullable: true },
    // attachments
    attachments: { type: 'string[]', default: [] }, // todo: create Attachement : { reference: '1:m', entity: 'Attachement' },
  },
});
