import { IUserPersistenceDTO } from './../dtos/User';
import { EntitySchema } from '@mikro-orm/core';

export const UserSchema = new EntitySchema<IUserPersistenceDTO>({
  name: 'User',
  properties: {
    id: { type: 'string', primary: true }, // todo: add uuid generation here
    name: { type: 'string' },
    surname: { type: 'string' },
    role: { type: 'string' }, // todo: use role enum here, defaults to generic user https://mikro-orm.io/docs/defining-entities#enum-arrays
    email: { type: 'string', unique: true },
    password: { type: 'string' },
  },
});
