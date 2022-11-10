import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';
import { IUserPersistenceDTO } from './../../persistence/dtos/User';
import { IUserAPIincomingDTO, IUserAPIDTO } from './../controllers/dtos/User';
import { EncryptionService } from './Encryption.service';
import { TYPES } from './../../server/types/index';
import { UserMap } from '../mappers/User.map';
import { IUserRepository } from '../../domain/User';

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.USER_REPOSITORY) private repository: IUserRepository,
    @inject(TYPES.USER_MAP) private userMap: UserMap,
    @inject(TYPES.ENCRYPTION_SERVICE) private readonly encryptionService: EncryptionService,
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
    const userToSave: IUserPersistenceDTO = {
      id,
      name: userDTO.name,
      role: userDTO.role,
      surname: userDTO.surname,
      email: userDTO.email,
      password: this.encryptionService.hash(userDTO.password),
    };

    const savedUser = await this.repository.save(userToSave);
    return this.userMap.toDTO(savedUser);
  }
}
