
import { UserRepository } from 'persistence/User';
import { User } from '../../domain/User'

export class UserService {
  constructor(private repository: UserRepository) {}
  // async createUser(user: User): Promise<User> {
  //   return this.repository.create(user)
  // }
  async getAllUsers(): Promise<User[]> {
    return this.repository.getAll()
  }
}