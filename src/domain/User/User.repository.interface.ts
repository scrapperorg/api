import { IUserPersistenceDTO } from './../../persistence/dtos/User';
import { User } from './User';

export interface IUserRepository {
  getAll(): Promise<User[]>;
  save(userProps: IUserPersistenceDTO): Promise<User>;
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
}
