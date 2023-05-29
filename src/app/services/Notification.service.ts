import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';
import {
  INotificationRepository,
  IGetNotificationsParams,
  Notification,
  NotificationType,
  Document,
  User,
} from '@domain';
import { NotificationMap } from '@mappers/Notification.map';
import { INotificationAPIDTO, INotificationAPIIncomingDTO } from '@controllers/dtos';
import { QueueService } from './Queue.service';

interface Reminder {
  notificationType: NotificationType;
  message: string;
  executionDate: Date;
}

@injectable()
export class NotificationService {
  constructor(
    @inject(TYPES.NOTIFICATION_REPOSITORY) private readonly repository: INotificationRepository,
    @inject(TYPES.NOTIFICATION_MAP) private readonly mapper: NotificationMap,
    @inject(TYPES.QUEUE_SERVICE) private readonly queueService: QueueService,
  ) {}

  private notificationMessages = {
    GENERIC: () => 'Aveti o notificare noua',
    NEW_DOCUMENT: (title: string) => `Exista un nou document ce necesita atentie: ${title}`,
    NEW_ASSIGNMENT: (title: string) => `Ati fost asignat unui nou document: ${title}`,
    DEADLINE_APPROACHING: (title: string) =>
      `Mai sunt 3 zile pana la termenul limita pentru documentul: ${title}`,
    DEADLINE_REACHED: (title: string) => `Termenul limita a fost atins pentru documentul: ${title}`,
    DEADLINE_PASSED: (title: string) =>
      `Termenul limita a fost depasit pentru documentul: ${title}`,
  };

  public async subscribeToNotificationQueue(): Promise<void> {
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

  async cancelDeadlineReminders(document: Document): Promise<void> {
    if (document.assignedUser === null || !document.deadline) {
      return;
    }

    // todo fix below
    // eslint-disable-next-line
    // @ts-ignore
    const assignedUser: User = document.assignedUser;

    const notificationQueues = [
      `notification-${NotificationType.DEADLINE_APPROACHING}-${assignedUser.id}-${document.id}`,
      `notification-${NotificationType.DEADLINE_REACHED}-${assignedUser.id}-${document.id}`,
      `notification-${NotificationType.DEADLINE_PASSED}-${assignedUser.id}-${document.id}`,
    ];

    for (let i = 0; i < notificationQueues.length; i++) {
      const queue = notificationQueues[i];
      await this.queueService.cancelJobsOnQueue(queue);
    }
  }

  async setDeadlineReminders(document: Document) {
    if (
      document.assignedUser === null ||
      document.assignedUser === undefined ||
      !document.deadline
    ) {
      return;
    }

    // todo fix below
    // eslint-disable-next-line
    // @ts-ignore
    const assignedUser: User = document.assignedUser;

    const reminders: Reminder[] = [
      {
        notificationType: NotificationType.DEADLINE_APPROACHING,
        message: this.notificationMessages.DEADLINE_APPROACHING(document.title),
        executionDate: new Date(document.deadline.getTime() - 1000 * 60 * 60 * 24 * 3),
      },
      {
        notificationType: NotificationType.DEADLINE_REACHED,
        message: this.notificationMessages.DEADLINE_REACHED(document.title),
        executionDate: document.deadline,
      },
      {
        notificationType: NotificationType.DEADLINE_PASSED,
        message: this.notificationMessages.DEADLINE_PASSED(document.title),
        executionDate: new Date(document.deadline.getTime() + 1000 * 60 * 60 * 24 * 1),
      },
    ];

    for (let i = 0; i < reminders.length; i++) {
      const reminder = reminders[i];
      await this.schedule(
        reminder.notificationType,
        {
          message: reminder.message,
          type: reminder.notificationType,
          user: assignedUser.id,
          document: document.id,
        },
        reminder.executionDate,
      );
    }
  }
}
