import { EntitySchema } from '@mikro-orm/core';
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
    numar_inregistrare_senat: { type: 'string', nullable: true },
    numar_inregistrare_guvern: { type: 'string', nullable: true },
    procedura_legislativa: { type: 'string', nullable: true },
    camera_decizionala: { type: 'string', nullable: true },
    termen_adoptare: { type: 'string', nullable: true },
    tip_initiativa: { type: 'string', nullable: true },
    caracter: { type: 'string', nullable: true },
    este_procedura_de_urgenta: { type: 'boolean', default: false },
    stadiu: { type: 'string', nullable: true },
    initiator: { type: 'string', nullable: true },
    consultati: { type: 'string', nullable: true },
    // end project technical details
    attachments: { type: 'string[]', default: [] }, // todo: create Attachement : { reference: '1:m', entity: 'Attachement' },
  },
});
