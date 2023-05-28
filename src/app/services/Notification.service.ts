import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';
import {
  INotificationRepository,
  IGetNotificationsParams,
  Notification,
  NotificationType,
} from '@domain';
import { NotificationMap } from '@mappers/Notification.map';
import { INotificationAPIDTO, INotificationAPIIncomingDTO } from '@controllers/dtos';
import { QueueService } from './Queue.service';

@injectable()
export class NotificationService {
  constructor(
    @inject(TYPES.NOTIFICATION_REPOSITORY) private readonly repository: INotificationRepository,
    @inject(TYPES.NOTIFICATION_MAP) private readonly mapper: NotificationMap,
    @inject(TYPES.QUEUE_SERVICE) private readonly queueService: QueueService,
  ) {
    this.subscribeToNotificationQueue();
  }

  private async subscribeToNotificationQueue(): Promise<void> {
    await this.queueService.subscribeHandler<INotificationAPIIncomingDTO>(
      'notification-*',
      async (job) => {
        await this.create(job.data);
      },
    );
  }

  async getAll(params: IGetNotificationsParams): Promise<INotificationAPIDTO[]> {
    const notifications = await this.repository.get(params);
    const dtos = notifications.map((entry) => this.mapper.toDTO(entry));
    return dtos;
  }

  async getNew(params: IGetNotificationsParams): Promise<INotificationAPIDTO[]> {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 1);
    params.createdAt = { $gte: minDate };
    const notifications = await this.repository.get(params);
    const dtos = notifications.map((entry) => this.mapper.toDTO(entry));
    return dtos;
  }

  async create(dto: INotificationAPIIncomingDTO): Promise<INotificationAPIDTO> {
    const notification = new Notification(dto);
    const savedNotification = await this.repository.save(notification);
    return this.mapper.toDTO(savedNotification);
  }

  async update(id: string, dto: INotificationAPIDTO): Promise<INotificationAPIDTO> {
    const entry = await this.repository.update(id, dto);
    return this.mapper.toDTO(entry);
  }

  async delete(id: string): Promise<void> {
    const entry = await this.repository.getById(id);

    if (!entry) {
      throw new Error('Notification not found');
    }

    return await this.repository.delete(id);
  }

  async schedule(
    type: NotificationType,
    data: INotificationAPIIncomingDTO,
    executionDate: Date,
  ): Promise<void> {
    const queueName = `notification-${type}-${data.user}-${data.document}`;
    await this.queueService.scheduleJob(queueName, data, executionDate);
  }

  async cancelNotificationsOnQueue(queueName: string): Promise<void> {
    const notificationJobs = await this.queueService.getJobs(queueName);

    if (
      notificationJobs === undefined ||
      notificationJobs === null ||
      notificationJobs.length === 0
    ) {
      return;
    }

    for (let i = 0; i < notificationJobs.length; i++) {
      const job = notificationJobs[i];
      await this.queueService.cancelJob(job.id);
    }
  }
}
