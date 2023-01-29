import { ProjectMap } from '@mappers/Project.map';
import { EntityRepository, MikroORM } from '@mikro-orm/core';
import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';
import { Attachment } from '@domain/Attachment';
import { AttachmentSchema } from '@persistence';
import { IAttachmentRepository } from '@domain/Attachment/Attachment.repository.interface';

@injectable()
export class AttachmentRepository implements IAttachmentRepository {
  private entityRepository: EntityRepository<Attachment>;

  constructor(
    @inject(TYPES.DATABASE_CONNECTION) private readonly orm: MikroORM,
    @inject(TYPES.PROJECT_MAP) private readonly mapper: ProjectMap,
  ) {
    const entityManager = this.orm.em.fork();
    this.entityRepository = entityManager.getRepository(AttachmentSchema);
  }
}
