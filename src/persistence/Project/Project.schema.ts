import { EntitySchema } from '@mikro-orm/core';
import { IDocumentPersistenceDTO } from '@persistence/dtos';
import { IProjectPersistenceDTO } from '@persistence/dtos/Project';
import { v4 } from 'uuid';

export const ProjectSchema = new EntitySchema<IProjectPersistenceDTO>({
  name: 'Project',
  properties: {
    id: { type: 'uuid', primary: true, onCreate: () => v4() },
    createdAt: { type: 'Date', onCreate: () => new Date() },
    updatedAt: {
      type: 'Date',
      onCreate: () => new Date(),
      onUpdate: () => new Date(),
    },
    title: { type: 'string', nullable: false },
    presentsInterest: { type: 'boolean', onCreate: () => false },
    // project technical details
    numarInregistrareSenat: { type: 'string', nullable: true },
    numarInregistrareGuvern: { type: 'string', nullable: true },
    proceduraLegislativa: { type: 'string', nullable: true },
    cameraDecizionala: { type: 'string', nullable: true },
    termenAdoptare: { type: 'string', nullable: true },
    tipInitiativa: { type: 'string', nullable: true },
    caracter: { type: 'string', nullable: true },
    esteProceduraDeUrgenta: { type: 'boolean', default: false },
    stadiu: { type: 'string', nullable: true },
    initiator: { type: 'string', nullable: true },
    consultati: { type: 'string', nullable: true },
    // end project technical details
    attachments: { type: 'string[]', default: [] }, // todo: create Attachement : { reference: '1:m', entity: 'Attachement' },
    documents: {
      reference: '1:m',
      entity: () => 'Document',
      mappedBy: (document: IDocumentPersistenceDTO) => document.project,
    },
  },
});
