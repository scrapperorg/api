import { NoSuchElementException } from '@lib';
import { Role, User } from '@domain/User';
import { injectable } from 'inversify';
import { IUserRepository } from '@domain/User';

@injectable()
export class UserMockRepository implements IUserRepository {
  public entries: Array<User> = [
    new User({
      name: 'ion',
      surname: 'popescu',
      role: Role.LSE,
      email: 'ion@fundatiax.ro',
      password: 'hashedpassowrd',
    }),
    new User({
      name: 'gheorghe',
      surname: 'ionescu',
      role: Role.LSS,
      email: 'gheorghe@fundatiax.ro',
      password: 'hashedpassowrd',
    }),
  ];

  async getAll() {
    return this.entries;
  }

  async save(user: User): Promise<User> {
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

  async getByRoles(roles: string[]): Promise<User[]> {
    return this.entries.filter((entry) => roles.includes(entry.role));
  }
}
