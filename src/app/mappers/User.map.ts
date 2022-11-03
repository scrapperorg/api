import { User } from '../../domain/User';
import { IUserAPIDTO, IUserPersistenceDTO } from './../../domain/User/User.repository.interface';

export class UserMap {
  toDomain(user: IUserPersistenceDTO): User {
    return User.create(user)
  }
  toPersistence(user: User): IUserPersistenceDTO {
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      role: user.role,
      password: user.password,
      email: user.email,
    }
  }
  toDTO(user: User): IUserAPIDTO {
    return {
      name: user.name,
      surname: user.surname,
      role: user.role,
      email: user.email
    }
  }
}