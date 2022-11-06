import { TYPES } from './../../server/types/index';
import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';
import {
  IUserPersistenceDTO,
  IUserAPIincomingDTO,
} from './../../domain/User/User.repository.interface';
import { UserMap } from '../mappers/User.map';
import { IUserAPIDTO, IUserRepository } from '../../domain/User';

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.USER_REPOSITORY) private repository: IUserRepository,
    @inject(TYPES.USER_MAP) private userMap: UserMap,
  ) {}
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
