import { User } from '../../domain/User';
import { IUserAPIDTO, IUserPersistenceDTO } from './../../domain/User/User.repository.interface';

export class UserMap {
  toDomain(user: IUserAPIDTO): User {
    return User.create(user)
  }
  toPersistence(user: User): IUserPersistenceDTO {
    // api dto and persistnce dto are the same
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      role: user.role,
    }
  }
  toDTO(user: User): IUserAPIDTO {
    return {
      name: user.name,
      surname: user.surname,
      role: user.role,
    }
  }
}