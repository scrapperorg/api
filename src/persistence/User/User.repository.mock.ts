import { TYPES } from './../../server/types/index';
import { inject, injectable } from 'inversify';
import { UserMap } from '../../app/mappers/User.map';
import { IUserPersistenceDTO } from '@domain/User';
import { User, IUserRepository } from '@domain/User';

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
  async save(user: IUserPersistenceDTO): Promise<void> {
    this.entries.push(user);
  }

  async getById(id: string): Promise<User | null> {
    const user = this.entries.find((u) => u.id === id);
    if (!user) return null;
    return this.userMap.toDomain(user);
  }

  async getByEmail(email: string): Promise<IUserPersistenceDTO | null> {
    const user = this.entries.find((u) => u.email === email);
    if (!user) return null;
    return this.userMap.toDomain(user);
  }
}
