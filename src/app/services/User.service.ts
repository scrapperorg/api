
import { UserMap } from 'app/mappers/User.map';
import { IUserDTO, IUserRepository } from '../../domain/User'

export class UserService {
  constructor(private repository: IUserRepository, private userMap: UserMap) {}
  async getAll(): Promise<IUserDTO[]> {
    const users = await this.repository.getAll()
    return users.map(u => this.userMap.toDTO(u))
  }
  async getById(id: string): Promise<IUserDTO|null> {
    const user = await this.repository.getById(id)
    console.log(user)
    if (!user) return user
    return this.userMap.toDTO(user)
  }
  async create(userDTO: IUserDTO) {
    return this.repository.save(userDTO)
  }
}