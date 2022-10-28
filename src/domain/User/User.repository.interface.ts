import { User } from './User'

export interface IUserDTO {
  id: string,
  name: string,
  surname: string,
  role: string,
}
export interface IUserRepository {
  getAll(): Promise<User[]>
  save(userProps: IUserDTO): Promise<boolean|Error>
  getById(id: string): Promise<User|null>
}