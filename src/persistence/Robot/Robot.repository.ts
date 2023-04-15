import { NoSuchElementException } from '@lib';
import { UniqueConstraintViolationException } from '@lib/exceptions/UniqueConstraintValidation.exception';
import { inject, injectable } from 'inversify';
import { MikroORM, EntityRepository, wrap } from '@mikro-orm/core';
import { TYPES } from '@server/types';
import { RobotSchema } from './Robot.schema';
import { RobotMap } from '@mappers/Robot.map';
import { IRobotProps, IRobotRepository, Robot } from '@domain/Robot';
@injectable()
export class RobotRepository implements IRobotRepository {
  private robotEM: EntityRepository<Robot>;
  constructor(
    @inject(TYPES.DATABASE_CONNECTION) private readonly orm: MikroORM,
    @inject(TYPES.ROBOT_MAP) private readonly userMap: RobotMap,
  ) {
    const em = this.orm.em.fork();
    this.robotEM = em.getRepository(RobotSchema);
  }

  async getAll() {
    return await this.robotEM.findAll();
  }

  async save(userDTO: IRobotProps): Promise<Robot> {
    const robot = this.robotEM.create(userDTO);
    try {
      await this.robotEM.persistAndFlush(robot);
    } catch (err: any) {
      // to do: the error here is missleading. it can be another error too. we should let the orm throw this kind of errors
      throw new UniqueConstraintViolationException('User with this email address already exists');
    }
    return robot;
  }

  async update(robotDTO: Robot): Promise<Robot> {
    const robot = await this.robotEM.findOne({ id: robotDTO.id });

    if (!robot) {
      throw new NoSuchElementException('Robot not found');
    }

    const updatedRobot = wrap(robot).assign(robotDTO, { mergeObjects: true });
    await this.robotEM.flush();
    return updatedRobot;
  }

  async getById(id: string): Promise<Robot | null> {
    const robot = await this.robotEM.findOne({ id });
    if (!robot) return null;
    return robot;
  }

  async getByName(name: string): Promise<Robot | null> {
    const robot = await this.robotEM.findOne({ name });
    if (!robot) return null;
    return robot;
  }
}
