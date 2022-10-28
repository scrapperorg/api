import { User } from '../../domain/User';
import { IUserDTO } from './../../domain/User/User.repository.interface';

export class UserMap {
  toDomain(user: IUserDTO): User {
    return User.create(user)
  }
  toPersistence(user: IUserDTO): IUserDTO {
    // api dto and persistnce dto are the same
    return user
  }
  toDTO(user: User): IUserDTO {
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      role: user.role,
    }
  }
}