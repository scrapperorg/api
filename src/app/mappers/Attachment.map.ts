import { injectable } from 'inversify';
import { Attachment } from '@domain/Attachment';
import { IAttachmentOutgoingDTO } from '@controllers/dtos/Attachment';

@injectable()
export class AttachmentMap {
  toDTO(attachment: Attachment): IAttachmentOutgoingDTO {
    const dtoObject = {
      id: attachment.id,
      createdAt: attachment.createdAt,
      updatedAt: attachment.updatedAt,
      name: attachment.name,
      size: attachment.size,
      path: attachment.path,
    };

    return dtoObject;
  }
}
