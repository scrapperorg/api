import { NoSuchElementException } from './../../lib/exceptions/NoSuchElement.exception';
import { User } from './../../domain/User/User';
import { IUserPersistenceDTO } from './../dtos/User';
import { TYPES } from './../../server/types/index';
import { inject, injectable } from 'inversify';
import { UserMap } from '../../app/mappers/User.map';
import { IUserRepository } from '../../domain/User';

@injectable()
export class UserMockRepository implements IUserRepository {
  constructor(@inject(TYPES.USER_MAP) private readonly userMap: UserMap) {}
  public entries: Array<IUserPersistenceDTO> = [
    {
      id: '1',
      name: 'ion',
      surname: 'popescu',
      role: 'LSE',
      email: 'ion@fundatiax.ro',
      password: 'hashedpassowrd',
    },
    {
      id: '1',
      name: 'gheorghe',
      surname: 'ionescu',
      role: 'LSS',
      email: 'gheorghe@fundatiax.ro',
      password: 'hashedpassowrd',
    },
  ];

  async getAll() {
    return this.entries.map((user) => this.userMap.toDomain(user));
  }

  async save(user: IUserPersistenceDTO): Promise<User> {
    const indexOfExistingEntry = this.entries.findIndex((entry) => entry.id === user.id);
    if (indexOfExistingEntry === -1) {
      this.entries.push(user);
    } else {
      this.entries[indexOfExistingEntry] = user;
    }
    return this.userMap.toDomain(user);
  }

  async update(user: IUserPersistenceDTO): Promise<User> {
    const indexOfExistingEntry = this.entries.findIndex((entry) => entry.id === user.id);
    if (indexOfExistingEntry === -1) {
      throw new NoSuchElementException('User not found');
    } else {
      this.entries[indexOfExistingEntry] = user;
    }
    return this.userMap.toDomain(user);
  }

  async getById(id: string): Promise<User | null> {
    const user = this.entries.find((u) => u.id === id);
    if (!user) return null;
    return this.userMap.toDomain(user);
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = this.entries.find((u) => u.email === email);
    if (!user) return null;
    return this.userMap.toDomain(user);
  }
}
