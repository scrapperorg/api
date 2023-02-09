import { EntityRepository, MikroORM } from '@mikro-orm/core';
import { inject, injectable } from 'inversify';
import { TYPES } from '@server/types';
import { DocumentMap } from '@mappers';
import { IAttachmentRepository } from '@domain/Attachment/Attachment.repository.interface';
import { AttachmentSchema } from '@persistence';
import { Attachment } from '@domain/Attachment';

@injectable()
export class AttachmentRepository implements IAttachmentRepository {
  private entityRepository: EntityRepository<Attachment>;
  constructor(
    @inject(TYPES.DATABASE_CONNECTION) private readonly orm: MikroORM,
    @inject(TYPES.DOCUMENT_MAP) private readonly mapper: DocumentMap,
  ) {
    const entityManager = this.orm.em.fork();
    this.entityRepository = entityManager.getRepository(AttachmentSchema);
  }

  async delete(id: string): Promise<boolean> {
    const attachment = await this.getById(id);

    if (!attachment) return false;
    const result = await this.entityRepository.removeAndFlush(attachment);

    return Boolean(result);
  }

  async getById(id: string): Promise<Attachment | null> {
    const entry = await this.entityRepository.findOne(
      { id },
      {
        refresh: true,
        cache: false,
      },
    );
    if (!entry) return null;
    return entry;
  }
}
