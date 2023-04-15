import { RobotStatus } from '@domain/Robot';

export interface IRobotAPIDTO {
  id: string;
  name: string;
  status: RobotStatus;
  last_run: Date;
  info: string;
}

export interface IRobotAPIincomingDTO {
  name?: string;
  status?: RobotStatus;
  last_run?: Date;
  info?: string;
}
