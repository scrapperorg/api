import { injectable } from 'inversify';
import { Notification } from '@domain';
import { INotificationAPIDTO } from '@controllers/dtos';

@injectable()
export class NotificationMap {
  toDTO(notification: Notification): INotificationAPIDTO {
    return {
      id: notification.id,
      createdAt: notification.createdAt,
      message: notification.message,
      type: notification.type,
      user: notification.user,
      document: notification.document,
    };
  }
}
