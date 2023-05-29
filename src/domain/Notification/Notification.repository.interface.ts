import { INotificationProps, Notification } from './Notification';

export enum NotificationType {
  GENERIC = 'GENERIC',
  NEW_DOCUMENT = 'NEW_DOCUMENT',
  NEW_ASSIGNMENT = 'NEW_ASSIGNMENT',
  DEADLINE_APPROACHING = 'DEADLINE_APPROACHING',
  DEADLINE_REACHED = 'DEADLINE_REACHED',
  DEADLINE_PASSED = 'DEADLINE_PASSED',
}

export interface IGetNotificationsParams {
  id?: string;
  user?: string;
  read?: boolean;
  type?: NotificationType;
  createdAt?: Date | Record<string, Date>;
}

export interface INotificationRepository {
  get(params: IGetNotificationsParams): Promise<Notification[]>;
  getById(id: string): Promise<Notification | null>;
  save(dto: INotificationProps): Promise<Notification>;
  update(id: string, dto: Partial<Notification>): Promise<Notification>;
  delete(id: string): Promise<void>;
}
