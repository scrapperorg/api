import { User } from './User'

export interface IUserAPIDTO {
  name: string,
  surname: string,
  role: string,
  email: string,
}

export interface IUserAPIincomingDTO extends IUserAPIDTO {
  plainPassword: string,
}

export interface IUserPersistenceDTO {
  id: string,
  name: string,
  surname: string,
  role: string,
  password: string,
  email: string,
}

export interface IUserRepository {
  getAll(): Promise<User[]>
  save(userProps: IUserPersistenceDTO): Promise<boolean|Error>
  getById(id: string): Promise<User|null>
}