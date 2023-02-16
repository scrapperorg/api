import { NoSuchElementException } from './../../lib/exceptions/NoSuchElement.exception';
import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';
import { FileRepositoryService } from '@services/FileRepository.service';
import { Attachment, IAttachmentRepository } from '@domain/Attachment';

import { fromBuffer } from 'file-type';

@injectable()
export class AttachmentService {
  constructor(
    @inject(TYPES.ATTACHMENT_REPOSITORY)
    private readonly attachmentRepository: IAttachmentRepository,
    @inject(TYPES.FILE_REPOSITORY_SERVICE) private readonly fileRepo: FileRepositoryService,
  ) {}

  async getAttachmentFile(id: string): Promise<{
    attachment: Attachment;
    buffer: Buffer;
    fileType: Awaited<ReturnType<typeof fromBuffer>>;
  }> {
    const attachment = await this.attachmentRepository.getById(id);

    if (!attachment) {
      throw new NoSuchElementException(`Attachment ${id} is missing`);
    }

    const buffer = await this.fileRepo.get(attachment.path);
    const fileType = await fromBuffer(buffer);

    return {
      attachment,
      buffer,
      fileType,
    };
  }
}
