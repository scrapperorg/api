import { UserMap } from './../../app/mappers/User.map';
import { IUserPersistenceDTO } from './../../domain/User/User.repository.interface';
import { UserSchema } from './User.schema';
import { User, IUserRepository } from '../../domain/User';

import { MikroORM, EntityRepository } from '@mikro-orm/core';

export class UserRepository implements IUserRepository {
  private userEM: EntityRepository<IUserPersistenceDTO>
  constructor(private readonly orm: MikroORM, private readonly userMap: UserMap) {
    const em = this.orm.em.fork()
    this.userEM = em.getRepository(UserSchema)
  }
  async getAll() {
    const users = await this.userEM.findAll()
    return users.map(u => this.userMap.toDomain(u))
  }
  async save(userDTO: IUserPersistenceDTO): Promise<boolean|Error> {
    const user = this.userEM.create(userDTO)
    return this.userEM.persistAndFlush(user)
        .then(() => true)
        .catch(err => new Error(err))
  }

  async getById(id: string): Promise<User|null> {
    const user = await this.userEM.findOne({ id })
    if (!user) return user
    return this.userMap.toDomain(user)
  }
  
}