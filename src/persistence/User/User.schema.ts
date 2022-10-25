import { EntitySchema } from '@mikro-orm/core';
import { User, Role } from '../../domain/User'

export const UserSchema = new EntitySchema<User>({
  name: 'User',
  properties: {
    id: { type: String, primary: true },
    name: { type: String },
    surname: { type: String },
    role: { enum: true, items: () => Role }
  }
})