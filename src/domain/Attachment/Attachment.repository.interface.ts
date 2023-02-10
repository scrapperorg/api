import { Attachment } from '@domain/Attachment/Attachment';

export interface IAttachmentRepository {
  getById(id: string): Promise<Attachment | null>;

  delete(id: string): Promise<boolean>;
}
