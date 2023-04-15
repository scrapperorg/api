import { IRobotProps, Robot } from './Robot';

export interface IRobotRepository {
  getAll(): Promise<Robot[]>;
  save(robotProps: IRobotProps): Promise<Robot>;
  update(robotProps: Robot): Promise<Robot>;
  getById(id: string): Promise<Robot | null>;
  getByName(name: string): Promise<Robot | null>;
}
