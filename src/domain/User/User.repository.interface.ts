import { User } from './User'

export interface IUserAPIDTO {
  name: string,
  surname: string,
  role: string,
}

export interface IUserPersistenceDTO {
  id: string,
  name: string,
  surname: string,
  role: string,
}

export interface IUserRepository {
  getAll(): Promise<User[]>
  save(userProps: IUserPersistenceDTO): Promise<boolean|Error>
  getById(id: string): Promise<User|null>
}