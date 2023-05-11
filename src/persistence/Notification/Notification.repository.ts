import { inject, injectable } from 'inversify';
import { MikroORM, EntityRepository, wrap } from '@mikro-orm/core';
import {
  IGetNotificationsParams,
  INotificationRepository,
  INotificationProps,
  Notification,
} from '@domain';
import { TYPES } from '@server/types';
import { NotificationSchema } from './Notification.schema';
import { NoSuchElementException } from '@lib';

@injectable()
export class NotificationRepository implements INotificationRepository {
  private readonly notificationEM: EntityRepository<Notification>;
  constructor(@inject(TYPES.DATABASE_CONNECTION) private readonly orm: MikroORM) {
    const em = this.orm.em.fork();
    this.notificationEM = em.getRepository(NotificationSchema);
  }

  async get(params: IGetNotificationsParams): Promise<Notification[]> {
    const notifications = await this.notificationEM.find(params);
    return notifications;
  }

  async getById(id: string): Promise<Notification> {
    const notification = await this.notificationEM.findOne({ id });
    if (!notification) {
      throw new NoSuchElementException('Notification not found');
    }
    return notification;
  }

  async save(dto: INotificationProps): Promise<Notification> {
    const notification = this.notificationEM.create(dto);
    await this.notificationEM.persistAndFlush(notification);
    return notification;
  }

  async update(id: string, dto: Partial<Notification>): Promise<Notification> {
    const notification = await this.notificationEM.findOneOrFail({ id: dto.id });
    const updatedNotification = wrap(notification).assign(dto, { mergeObjects: true });
    await this.notificationEM.persistAndFlush(updatedNotification);
    return updatedNotification;
  }

  async delete(id: string): Promise<void> {
    const notification = await this.notificationEM.findOneOrFail({ id });
    try {
      await this.notificationEM.removeAndFlush(notification);
    } catch (error: any) {
      throw new Error(`Error while deleting notification: ${error.message}`);
    }
  }
}
