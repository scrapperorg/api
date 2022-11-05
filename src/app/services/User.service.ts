import {
  IUserPersistenceDTO,
  IUserAPIincomingDTO,
} from './../../domain/User/User.repository.interface';
import { v4 } from 'uuid';
import { UserMap } from 'app/mappers/User.map';
import { IUserAPIDTO, IUserRepository } from '../../domain/User';

export class UserService {
  constructor(private repository: IUserRepository, private userMap: UserMap) {}
  async getAll(): Promise<IUserAPIDTO[]> {
    const users = await this.repository.getAll();
    return users.map((u) => this.userMap.toDTO(u));
  }
  async getById(id: string): Promise<IUserAPIDTO | null> {
    const user = await this.repository.getById(id);
    if (!user) return user;
    return this.userMap.toDTO(user);
  }
  async create(userDTO: IUserAPIincomingDTO) {
    const id = v4();
    const userPersistenceDTO: IUserPersistenceDTO = {
      id,
      name: userDTO.name,
      role: userDTO.role,
      surname: userDTO.surname,
      email: userDTO.email,
      password: userDTO.plainPassword, // <--- hash
    };
    return this.repository.save(userPersistenceDTO);
  }
}
