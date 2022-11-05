import { IUserPersistenceDTO } from './../../domain/User/User.repository.interface';
import { EntitySchema } from '@mikro-orm/core';

export const UserSchema = new EntitySchema<IUserPersistenceDTO>({
  name: 'User',
  properties: {
    id: { type: 'string', primary: true },
    name: { type: 'string' },
    surname: { type: 'string' },
    role: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' }
  }
})