import { EntitySchema } from '@mikro-orm/core';
import { Document, ProcessingStatus, Status } from '@domain/Document/Document';
import { BaseEntity } from '@domain/BaseEntity/BaseEntity';
import { Attachment } from '@domain/Attachment';

export const DocumentSchema = new EntitySchema<Document, BaseEntity>({
  class: Document,
  extends: 'BaseEntity',
  properties: {
    // general
    title: { type: 'text', nullable: false },
    identifier: { type: 'string', nullable: false },
    publicationDate: { type: 'Date', nullable: false },
    source: { type: 'string', nullable: false }, // if Source will ever become entity, replace with relation
    link: { type: 'string', nullable: true },
    storagePath: { type: 'string', nullable: true },
    // activity
    status: { enum: true, default: Status.NOU, items: () => Status },
    assignedUser: { reference: 'm:1', entity: 'User', nullable: true },
    project: { reference: 'm:1', entity: 'Project' },
    deadline: { type: 'Date', nullable: true },
    // AI
    isRulesBreaker: { type: 'boolean', nullable: true, default: false },
    originalFormat: { type: 'string', nullable: true },
    numberOfPages: { type: 'number', nullable: true },
    textInterpretationPrecision: { type: 'decimal', nullable: true },
    numberOfIdentifiedArticles: { type: 'number', nullable: true },
    numberOfIdentifiedTerms: { type: 'number', nullable: true },
    attachments: {
      reference: '1:m',
      entity: () => 'Attachment',
      mappedBy: (attachment: Attachment) => attachment.document,
      orphanRemoval: true,
    },
    postOcrContent: { type: 'text', nullable: true },
    processingStatus: {
      enum: true,
      default: ProcessingStatus.downloaded,
      items: () => ProcessingStatus,
    },
    totalParts: { type: 'number', default: 1 },
    part: { type: 'number', default: 1 },
    highlightFile: { type: 'string', nullable: true },
    highlightMetadata: { type: 'json', nullable: true },
  },
});
