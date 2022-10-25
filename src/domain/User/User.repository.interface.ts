import { User } from './User'

export interface IUserRepository {
  getAll(): Promise<User[]>
  // craete()
  // getById
}