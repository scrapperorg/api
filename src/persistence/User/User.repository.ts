import { NoSuchElementException } from '@lib';
import { UniqueConstraintViolationException } from '@lib/exceptions/UniqueConstraintValidation.exception';
import { inject, injectable } from 'inversify';
import { MikroORM, EntityRepository, wrap } from '@mikro-orm/core';
import { TYPES } from '@server/types';
import { UserMap } from '../../app/mappers/User.map';
import { UserSchema } from './User.schema';
import { User, IUserRepository, IUserProps, Role } from '@domain/User';
@injectable()
export class UserRepository implements IUserRepository {
  private userEM: EntityRepository<User>;
  constructor(
    @inject(TYPES.DATABASE_CONNECTION) private readonly orm: MikroORM,
    @inject(TYPES.USER_MAP) private readonly userMap: UserMap,
  ) {
    const em = this.orm.em.fork();
    this.userEM = em.getRepository(UserSchema);
  }

  async getAll() {
    return await this.userEM.findAll();
  }

  async save(userDTO: IUserProps): Promise<User> {
    const user = this.userEM.create(userDTO);
    try {
      await this.userEM.persistAndFlush(user);
    } catch (err: any) {
      // to do: the error here is missleading. it can be another error too. we should let the orm throw this kind of errors
      throw new UniqueConstraintViolationException('User with this email address already exists');
    }
    return user;
  }

  async update(userDTO: User): Promise<User> {
    const user = await this.userEM.findOne({ id: userDTO.id });

    if (!user) {
      throw new NoSuchElementException('User not found');
    }

    const updatedUser = wrap(user).assign(userDTO, { mergeObjects: true });
    await this.userEM.flush();
    return updatedUser;
  }

  async getById(id: string): Promise<User | null> {
    const user = await this.userEM.findOne({ id });
    if (!user) return null;
    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.userEM.findOne({ email });
    if (!user) return null;
    return user;
  }

  async getByRoles(roles: string[]): Promise<User[]> {
    return await this.userEM.find({
      role: {
        $in: roles,
      },
    });
  }
}
