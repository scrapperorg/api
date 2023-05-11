import { OptionalProps } from '@mikro-orm/core';
import { BaseEntity, NotificationType } from '..';

export interface INotificationProps {
  message: string;
  type: NotificationType;
  user: string;
  document?: string;
  seen?: boolean;
}

export class Notification extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'seen';

  message: string;
  type: NotificationType;
  user: string;
  document?: string;
  seen?: boolean;

  constructor(props: INotificationProps) {
    super();

    this.message = props.message;
    this.type = props.type;
    this.user = props.user;
    if (props.document !== null) this.document = props.document;
  }
}
