import { INotificationProps, Notification } from './Notification';

export enum NotificationType {
  GENERIC = 'GENERIC',
  NEW_DOCUMENT = 'NEW_DOCUMENT',
  NEW_ASSIGNMENT = 'NEW_ASSIGNMENT',
  DEADLINE_APPROACHING = 'DEADLINE_APPROACHING',
  DEADLINE_REACHED = 'DEADLINE_REACHED',
  DEADLINE_PASSED = 'DEADLINE_PASSED',
}

export enum NotificationTypeMessages {
  GENERIC = 'Aveti o notificare noua',
  NEW_DOCUMENT = 'Exista un nou document ce necesita atentie',
  NEW_ASSIGNMENT = 'Ati fost asignat unui nou document',
  DEADLINE_APPROACHING = 'Mai sunt 3 zile pana la termenul limita',
  DEADLINE_REACHED = 'Termenul limita a fost atins',
  DEADLINE_PASSED = 'Termenul limita a fost depasit',
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
