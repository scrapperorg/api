import { User, IUserRepository } from '../../domain/User';

import { MikroORM, EntityRepository } from '@mikro-orm/core';
// import { IRepository } from "./base.repo";

export class UserRepository implements IUserRepository {
  private user: EntityRepository<User>
  constructor(private readonly orm: MikroORM) {
    this.user = this.orm.em.getRepository(User)
  }
  async getAll() {
    return this.user.findAll()
  }
  // async create(user: Partial<User>) {
  //   // const newUser = new User()
  //   const savedUser = await this.ormRepo.create(newUser)
  // }
}