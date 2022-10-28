import { EntitySchema } from '@mikro-orm/core';
import { User } from '../../domain/User'

export const UserSchema = new EntitySchema<User>({
  name: 'User',
  properties: {
    id: { type: 'string', primary: true },
    name: { type: 'string' },
    surname: { type: 'string' },
    role: { type: 'string' }
  }
})