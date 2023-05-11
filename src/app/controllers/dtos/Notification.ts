import { NotificationType } from '@domain';

export interface INotificationAPIIncomingDTO {
  message: string;
  type: NotificationType;
  user: string;
  document?: string;
  seen?: boolean;
}

export interface INotificationAPIDTO extends INotificationAPIIncomingDTO {
  id: string;
  createdAt: Date;
}
