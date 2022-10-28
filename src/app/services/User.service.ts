
import { UserMap } from 'app/mappers/User.map';
import { UserRepository } from 'persistence/User';
import { IUserDTO } from '../../domain/User'

export class UserService {
  constructor(private repository: UserRepository, private userMap: UserMap) {}
  async getAllUsers(): Promise<IUserDTO[]> {
    const users = await this.repository.getAll()
    return users.map(u => this.userMap.toDTO(u))
  }
  async getUserById(id: string): Promise<IUserDTO|null> {
    const user = await this.repository.getById(id)
    if (!user) return user
    return this.userMap.toDTO(user)
  }
  async createUser(userDTO: IUserDTO) {
    return this.repository.save(userDTO)
  }
}