import { BaseEntity } from '@domain/BaseEntity/BaseEntity';
import { Robot, RobotStatus } from '@domain/Robot/Robot';
import { EntitySchema } from '@mikro-orm/core';

export const RobotSchema = new EntitySchema<Robot, BaseEntity>({
  class: Robot,
  extends: 'BaseEntity',
  properties: {
    name: {
      type: 'string',
      length: 255,
    },
    status: {
      type: 'string',
      length: 255,
      enum: true,
      items: () => Object.values(RobotStatus),
    },
    last_run: {
      type: 'Date',
    },
    info: {
      type: 'text',
    },
  },
});
