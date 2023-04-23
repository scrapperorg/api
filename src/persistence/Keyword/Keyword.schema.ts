import { EntitySchema } from '@mikro-orm/core';
import { BaseEntity } from '@domain/BaseEntity/BaseEntity';
import { Keyword } from '@domain/Keyword';

export const KeywordSchema = new EntitySchema<Keyword, BaseEntity>({
  class: Keyword,
  extends: 'BaseEntity',
  properties: {
    // general
    name: { type: 'text', nullable: false },
  },
});
