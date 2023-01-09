import { BaseEntity } from '@domain/BaseEntity/BaseEntity';
import { User, Role } from '@domain/User/User';
import { EntitySchema } from '@mikro-orm/core';
import { Source } from '@domain/Document';

export const UserSchema = new EntitySchema<User, BaseEntity>({
  class: User,
  extends: 'BaseEntity',
  properties: {
    name: { type: 'string' },
    surname: { type: 'string' },
    role: { enum: true, array: false, default: Role.GU, items: () => Role },
    email: { type: 'string', unique: true },
    password: { type: 'string' },
    sourcesOfInterest: { enum: true, array: true, default: [], items: () => Source },
  },
});
