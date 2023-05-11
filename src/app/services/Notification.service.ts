import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';
import { INotificationRepository, IGetNotificationsParams, Notification } from '@domain';
import { NotificationMap } from '@mappers/Notification.map';
import { INotificationAPIDTO, INotificationAPIIncomingDTO } from '@controllers/dtos';

@injectable()
export class NotificationService {
  constructor(
    @inject(TYPES.NOTIFICATION_REPOSITORY) private readonly repository: INotificationRepository,
    @inject(TYPES.NOTIFICATION_MAP) private readonly mapper: NotificationMap,
  ) {}
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
    return await this.repository.delete(id);
  }
}
