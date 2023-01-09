import { BaseEntity } from '@domain';
import { EntitySchema } from '@mikro-orm/core';

export const BaseEntitySchema = new EntitySchema<BaseEntity>({
  class: BaseEntity,
  abstract: true,
  properties: {
    id: { type: 'uuid', primary: true },
    createdAt: { type: 'Date', nullable: true },
    updatedAt: {
      type: 'Date',
      onUpdate: () => new Date(),
      nullable: true,
    },
  },
});
