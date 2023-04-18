import { BaseEntity } from '@domain';
import { OptionalProps } from '@mikro-orm/core';

export enum RobotStatus {
  FUNCTIONAL = 'FUNCTIONAL',
  NOT_FUNCTIONAL = 'NOT_FUNCTIONAL',
}

export interface IRobotProps {
  id?: string;
  name: string;
  status: RobotStatus;
  last_run: Date;
  info: string;
}

export class Robot extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  name: string;
  status: RobotStatus;
  last_run: Date;
  info: string;

  constructor(props: IRobotProps) {
    super();
    this.name = props.name;
    this.status = props.status;
    this.last_run = props.last_run;
    this.info = props.info;
  }
}
