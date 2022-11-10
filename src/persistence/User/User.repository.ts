import { IUserPersistenceDTO } from './../dtos/User';
import { IUserAPIDTO } from './../../app/controllers/dtos/User';
import { inject, injectable } from 'inversify';
import { MikroORM, EntityRepository } from '@mikro-orm/core';
import { TYPES } from '../../server/types';
import { UserMap } from './../../app/mappers/User.map';
import { UserSchema } from './User.schema';
import { User, IUserRepository } from '../../domain/User';
@injectable()
export class UserRepository implements IUserRepository {
  private userEM: EntityRepository<IUserPersistenceDTO>;
  constructor(
    @inject(TYPES.DATABASE_CONNECTION) private readonly orm: MikroORM,
    @inject(TYPES.USER_MAP) private readonly userMap: UserMap,
  ) {
    const em = this.orm.em.fork();
    this.userEM = em.getRepository(UserSchema);
  }
  async getAll() {
    const users = await this.userEM.findAll();
    return users.map((u) => this.userMap.toDomain(u));
  }
  async save(userDTO: IUserPersistenceDTO): Promise<User> {
    const user = this.userEM.create(userDTO);
    this.userEM.persistAndFlush(user);
    return this.userMap.toDomain(userDTO);
  }

  async getById(id: string): Promise<User | null> {
    const user = await this.userEM.findOne({ id });
    if (!user) return null;
    return this.userMap.toDomain(user);
  }

  async getByEmail(email: string): Promise<IUserPersistenceDTO | null> {
    const user = await this.userEM.findOne({ email });
    if (!user) return null;
    return this.userMap.toDomain(user);
  }
}
