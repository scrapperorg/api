import { IUserAPIDTO } from '@controllers/dtos/User';
import { IUserPersistenceDTO } from '@persistence/dtos/User';
import { injectable } from 'inversify';
import { User } from '@domain/User';

@injectable()
export class UserMap {
  toDomain(user: IUserPersistenceDTO): User {
    return User.create(user);
  }
  toPersistence(user: User): IUserPersistenceDTO {
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      role: user.role,
      password: user.password,
      email: user.email,
    };
  }
  toDTO(user: User): IUserAPIDTO {
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      role: user.role,
      email: user.email,
    };
  }
}
