import { NoSuchElementException } from '@lib';
import { Role, User } from '@domain/User';
import { injectable } from 'inversify';
import { IUserRepository } from '@domain/User';
import { IRobotRepository, Robot } from '@domain/Robot';

@injectable()
export class RobotMockRepository implements IRobotRepository {
  public entries: Array<Robot> = [];

  async getAll() {
    return this.entries;
  }

  async save(robotDTO: Robot): Promise<Robot> {
    this.entries.push(robotDTO);
    return robotDTO;
  }

  async getById(id: string): Promise<Robot | null> {
    const robot = this.entries.find((r) => r.id === id);
    if (!robot) return null;
    return robot;
  }

  async update(robotDTO: Robot): Promise<Robot> {
    const robot = await this.getById(robotDTO.id);
    if (!robot) {
      throw new NoSuchElementException('Robot not found');
    }
    return robotDTO;
  }

  async getByName(name: string): Promise<Robot | null> {
    const robot = this.entries.find((r) => r.name === name);
    if (!robot) return null;
    return robot;
  }
}
