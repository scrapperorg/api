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
  },
});
