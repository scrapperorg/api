import { NoSuchElementException } from '@lib';
import { IUserProps, User } from '@domain/User';
import { injectable } from 'inversify';
import { IUserRepository } from '@domain/User';

@injectable()
export class UserMockRepository implements IUserRepository {
  public entries: Array<User> = [
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
    return this.entries;
  }

  async save(userProps: IUserProps): Promise<User> {
    const user = new User(userProps);
    this.entries.push(user);
    return user;
  }

  async update(user: User): Promise<User> {
    const indexOfExistingEntry = this.entries.findIndex((entry) => entry.id === user.id);
    if (indexOfExistingEntry === -1) {
      throw new NoSuchElementException('User not found');
    } else {
      this.entries[indexOfExistingEntry] = user;
    }
    return user;
  }

  async getById(id: string): Promise<User | null> {
    const user = this.entries.find((u) => u.id === id);
    if (!user) return null;
    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = this.entries.find((u) => u.email === email);
    if (!user) return null;
    return user;
  }
}
