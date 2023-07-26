import { Project, BaseEntity, Document, Attachment } from '@domain';
import { EntitySchema } from '@mikro-orm/core';

export const ProjectSchema = new EntitySchema<Project, BaseEntity>({
  class: Project,
  extends: 'BaseEntity',
  properties: {
    title: { type: 'text', nullable: false },
    publicationDate: { type: 'string', nullable: true },
    url: { type: 'string', nullable: true },
    presentsInterest: { type: 'boolean', default: false },
    // project technical details
    numarInregistrareSenat: { type: 'string', nullable: true },
    numarInregistrareGuvern: { type: 'string', nullable: true },
    numarInregistrareCDep: { type: 'string', nullable: true },
    proceduraLegislativa: { type: 'string', nullable: true },
    cameraDecizionala: { type: 'string', nullable: true },
    termenAdoptare: { type: 'text', nullable: true },
    tipInitiativa: { type: 'text', nullable: true },
    caracter: { type: 'string', nullable: true },
    esteProceduraDeUrgenta: { type: 'boolean', default: false },
    stadiu: { type: 'text', nullable: true },
    initiator: { type: 'text', nullable: true },
    consultati: { type: 'text', nullable: true },
    source: { type: 'string', nullable: true },
    // end project technical details
    attachments: {
      reference: '1:m',
      entity: () => 'Attachment',
      mappedBy: (attachment: Attachment) => attachment.project,
      orphanRemoval: true,
    },
    documents: {
      reference: '1:m',
      entity: () => 'Document',
      mappedBy: (document: Document) => document.project,
    },
  },
});
