import { EntitySchema } from '@mikro-orm/core';
import { IResetPasswordTokenPersistenceDTO } from '../../domain/ResetPasswordToken/ResetPasswordToken.repository.interface';

export const ResetPasswordTokenSchema = new EntitySchema<IResetPasswordTokenPersistenceDTO>({
  name: 'ResetPasswordToken',
  properties: {
    id: { type: 'string', primary: true },
    user: { reference: 'm:1', entity: 'User' },
    token: { type: 'string' },
    expirationDate: { type: 'Date' },
  },
});
