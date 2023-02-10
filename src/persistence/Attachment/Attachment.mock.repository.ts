import { injectable } from 'inversify';
import { Attachment, IAttachmentRepository } from '@domain';

@injectable()
export class AttachmentMockRepository implements IAttachmentRepository {
  getById(id: string): Promise<Attachment | null> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
