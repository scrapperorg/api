import { injectable } from 'inversify';
import { Robot } from '@domain/Robot';
import { IRobotAPIDTO } from '@controllers/dtos/Robot';

@injectable()
export class RobotMap {
  toDTO(robot: Robot): IRobotAPIDTO {
    return {
      id: robot.id,
      name: robot.name,
      status: robot.status,
      last_run: robot.last_run,
      info: robot.info,
    };
  }
}
