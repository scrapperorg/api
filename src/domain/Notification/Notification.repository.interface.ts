import { INotificationProps, Notification } from './Notification';

export enum NotificationType {
  GENERIC = 'GENERIC',
  NEW_DOCUMENT = 'NEW_DOCUMENT',
  NEW_ASSIGNMENT = 'NEW_ASSIGNMENT',
  DEADLINE_APPROACHING = 'DEADLINE_APPROACHING',
  DEADLINE_REACHED = 'DEADLINE_REACHED',
  DEADLINE_PASSED = 'DEADLINE_PASSED',
  RESET_PASSWORD = 'RESET_PASSWORD',
  ROBOT_NOT_FUNCTIONAL = 'ROBOT_NOT_FUNCTIONAL',
}

export interface IGetNotificationsParams {
  id?: string;
  user?: string;
  read?: boolean;
  type?: NotificationType;
  createdAt?: Date | Record<string, Date>;
  message?: string;
}

export interface INotificationRepository {
  get(params: IGetNotificationsParams): Promise<Notification[]>;
  getById(id: string): Promise<Notification | null>;
  save(dto: INotificationProps): Promise<Notification>;
  bulkSave(dtos: Partial<Notification>[]): Promise<void>;
  update(id: string, dto: Partial<Notification>): Promise<Notification>;
  delete(id: string): Promise<void>;
  deleteAllByUserId(id: string): Promise<void>;
  deleteMany(notifications: Notification[]): Promise<void>;
}
