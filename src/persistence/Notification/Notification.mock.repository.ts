import { injectable } from 'inversify';
import { Notification, INotificationRepository, NotificationType } from '@domain';
import { NoSuchElementException } from '@lib';

@injectable()
export class NotificationMockRepository implements INotificationRepository {
  deleteMany(notifications: Notification[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteAllByUserId(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  bulkSave(dtos: Partial<Notification>[]): Promise<void> {
    throw new Error('Method not implemented.');
  }
  private entries: Array<Notification> = [
    new Notification({
      message: 'Notification 1',
      type: NotificationType.NEW_DOCUMENT,
      user: 'user 1',
    }),
    new Notification({
      message: 'Notification 2',
      type: NotificationType.NEW_ASSIGNMENT,
      user: 'user 2',
    }),
  ];

  async get(): Promise<Notification[]> {
    return this.entries;
  }

  async getById(id: string): Promise<Notification> {
    const entry = this.entries.find((entry) => entry.id === id);
    if (!entry) {
      throw new NoSuchElementException('Notification not found');
    }
    return entry;
  }

  async save(dto: Notification): Promise<Notification> {
    this.entries.push(dto);
    return dto;
  }

  async update(id: string, dto: Partial<Notification>): Promise<Notification> {
    const indexOfExistingEntry = this.entries.findIndex((entry) => entry.id === id);
    if (indexOfExistingEntry === -1) {
      throw new NoSuchElementException('Notification not found');
    }
    return this.entries[indexOfExistingEntry];
  }

  async delete(id: string): Promise<void> {
    return Promise.resolve();
  }
}
