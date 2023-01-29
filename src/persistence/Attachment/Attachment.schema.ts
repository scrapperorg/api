import { EntitySchema } from '@mikro-orm/core';
import { BaseEntity } from '@domain/BaseEntity/BaseEntity';
import { Attachment } from '@domain/Attachment/Attachment';

export const AttachmentSchema = new EntitySchema<Attachment, BaseEntity>({
  class: Attachment,
  extends: 'BaseEntity',
  properties: {
    // general
    name: { type: 'text', nullable: false },
    size: { type: 'int', nullable: false },
    path: { type: 'text', nullable: false },
    document: { reference: 'm:1', entity: 'Document', nullable: true },
  },
});
