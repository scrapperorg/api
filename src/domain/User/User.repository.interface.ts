import { IUserPersistenceDTO } from './../../persistence/dtos/User';
import { IUserAPIDTO } from './../../app/controllers/dtos/User';
import { User } from './User';

export interface IUserRepository {
  getAll(): Promise<User[]>;
  save(userProps: IUserPersistenceDTO): Promise<IUserAPIDTO>;
  getById(id: string): Promise<IUserPersistenceDTO | null>;
  getByEmail(email: string): Promise<IUserPersistenceDTO | null>;
}
