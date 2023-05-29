import { BaseEntity, Notification, NotificationType } from '@domain';
import { EntitySchema } from '@mikro-orm/core';

export const NotificationSchema = new EntitySchema<Notification, BaseEntity>({
  class: Notification,
  extends: 'BaseEntity',
  properties: {
    message: { type: 'string' },
    type: {
      enum: true,
      array: false,
      items: () => NotificationType,
      nullable: false,
      default: NotificationType.GENERIC,
    },
    user: { reference: 'm:1', entity: 'User' },
    document: { reference: 'm:1', entity: 'Document', nullable: true },
    seen: { type: 'boolean', default: false },
  },
});
