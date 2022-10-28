import { UserMap } from './../../app/mappers/User.map';
import { IUserDTO } from './../../domain/User/User.repository.interface';
import { UserSchema } from './User.schema';
import { User, IUserRepository } from '../../domain/User';

import { MikroORM, EntityRepository } from '@mikro-orm/core';
// import { IRepository } from "./base.repo";

export class UserRepository implements IUserRepository {
  private user: EntityRepository<IUserDTO>
  constructor(private readonly orm: MikroORM, private readonly userMap: UserMap) {
    const em = this.orm.em.fork()
    this.user = em.getRepository(UserSchema)
  }
  async getAll() {
    const users = await this.user.findAll()
    return users.map(u => this.userMap.toDomain(u))
  }
  async save(user: IUserDTO): Promise<boolean|Error> {
    return new Promise((resolve, reject) => {
      this.user.persistAndFlush(user)
        .then(() => resolve(true))
        .catch(err => reject(new Error(err)))
    })
  }

  async getById(id: string): Promise<User|null> {
    const user = await this.user.findOne({ id })
    if (!user) return user
    return this.userMap.toDomain(user)
  }
  
}