import { IUserAPIDTO } from '@controllers/dtos/User';
import { injectable } from 'inversify';
import { User } from '@domain/User';

@injectable()
export class UserMap {
  toDTO(user: User): IUserAPIDTO {
    return {
      id: user.id,
      createdAt: user.createdAt,
      name: user.name,
      surname: user.surname,
      role: user.role,
      email: user.email,
      sourcesOfInterest: user.sourcesOfInterest,
      status: user.status,
    };
  }
}
