import { inject, injectable } from 'inversify';
import { TYPES } from '@server/types';
import { NoSuchElementException } from '@lib';
import { IRobotRepository, Robot, RobotStatus } from '@domain/Robot';
import { RobotMap } from '@mappers/Robot.map';
import { IRobotAPIDTO, IRobotAPIincomingDTO } from '@controllers/dtos/Robot';
import { NotificationService } from './Notification.service';

@injectable()
export class RobotService {
  constructor(
    @inject(TYPES.ROBOT_REPOSITORY) private repository: IRobotRepository,
    @inject(TYPES.ROBOT_MAP) private robotMap: RobotMap,
    @inject(TYPES.NOTIFICATION_SERVICE) private readonly notificationService: NotificationService,
  ) {}
  async getAll(): Promise<IRobotAPIDTO[]> {
    const robots = await this.repository.getAll();
    return robots.map((u) => this.robotMap.toDTO(u));
  }

  async getById(id: string): Promise<IRobotAPIDTO | null> {
    const robot = await this.repository.getById(id);
    if (!robot) {
      throw new NoSuchElementException('robot not found');
    }
    return this.robotMap.toDTO(robot);
  }

  async getByName(name: string): Promise<IRobotAPIDTO | null> {
    const robot = await this.repository.getByName(name);
    if (!robot) {
      throw new NoSuchElementException('robot not found');
    }
    return this.robotMap.toDTO(robot);
  }

  async create(robotDTO: { name: string }) {
    const robotToSave = new Robot({
      name: robotDTO.name,
      last_run: new Date(),
      status: RobotStatus.FUNCTIONAL,
      info: '',
    });

    const savedRobot = await this.repository.save(robotToSave);
    return this.robotMap.toDTO(savedRobot);
  }

  async update(id: string, robotDTO: IRobotAPIincomingDTO) {
    const robot = await this.repository.getById(id);

    if (!robot) {
      throw new NoSuchElementException('robot not found');
    }

    if (robotDTO.status === RobotStatus.NOT_FUNCTIONAL) {
      await this.notificationService.createRobotNotFunctionalNotifications(robot.name);
    }

    if (robotDTO.status === RobotStatus.FUNCTIONAL) {
      await this.notificationService.cancelRobotNotFunctionalNotifications(robot.name);
    }

    const updatedRobot = await this.repository.update({
      ...robot,
      ...robotDTO,
      last_run: new Date(),
    });

    return this.robotMap.toDTO(updatedRobot);
  }
}
