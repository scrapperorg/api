import { inject, injectable } from 'inversify';
import { v4 } from 'uuid';
import { IUserPersistenceDTO } from '@persistence/dtos/User';
import { IUserAPIincomingDTO, IUserAPIDTO } from '@controllers/dtos/User';
import { EncryptionService, UserTokenClaims } from './Encryption.service';
import { TYPES } from '@server/types';
import { UserMap } from '../mappers/User.map';
import { IUserRepository } from '@domain/User';
import { NoSuchElementException } from '@lib';
import { Source } from '@domain/Document';

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
    if (!user) {
      throw new NoSuchElementException('user not found');
    }
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

  async updateSourcesOfInterest(token: string, sourcesOfInterest: Source[]) {
    const claims = this.encryptionService.verify<UserTokenClaims>(token);
    const user = await this.repository.getById(claims.id);

    if (!user) {
      throw new NoSuchElementException('user not found');
    }

    user.updateSources(sourcesOfInterest);

    await this.repository.update(this.userMap.toPersistence(user));
  }
}
