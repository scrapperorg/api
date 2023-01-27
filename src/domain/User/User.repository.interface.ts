import { Role } from '@domain/User';
import { IUserProps, User } from './User';

export interface IUserRepository {
  getAll(): Promise<User[]>;
  save(userProps: IUserProps): Promise<User>;
  update(userProps: User): Promise<User>;
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  getByRoles(roles: string[]): Promise<User[]>;
}
