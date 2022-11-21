import { EntityRepository, MikroORM, wrap } from '@mikro-orm/core';
import { Document, IDocumentRepository } from '@domain/Document';
import { IDocumentPersistenceDTO } from '@persistence/dtos/Document';
import { inject, injectable } from 'inversify';
import { TYPES } from '@server/types';
import { DocumentMap } from '@mappers';
import { DocumentSchema } from './Document.schema';
import { NoSuchElementException } from '@lib';

@injectable()
export class DocumentRepository implements IDocumentRepository {
  private entityRepository: EntityRepository<IDocumentPersistenceDTO>;
  constructor(
    @inject(TYPES.DATABASE_CONNECTION) private readonly orm: MikroORM,
    @inject(TYPES.DOCUMENT_MAP) private readonly mapper: DocumentMap,
  ) {
    const entityManager = this.orm.em.fork();
    this.entityRepository = entityManager.getRepository(DocumentSchema);
  }

  async getAll(): Promise<Document[]> {
    const entries = await this.entityRepository.findAll();
    return entries.map((entry) => this.mapper.toDomain(entry));
  }

  async save(dto: IDocumentPersistenceDTO): Promise<Document> {
    const document = this.entityRepository.create(dto);
    await this.entityRepository.persistAndFlush(document);
    return this.mapper.toDomain(document);
  }

  async update(dto: IDocumentPersistenceDTO): Promise<Document> {
    const entry = await this.entityRepository.findOne({ id: dto.id });

    if (!entry) {
      throw new NoSuchElementException('Document not found');
    }

    const updated = wrap(entry).assign(dto, { mergeObjects: true });
    await this.entityRepository.flush();
    return this.mapper.toDomain(updated);
  }

  async getById(id: string): Promise<Document | null> {
    const entry = await this.entityRepository.findOne({ id });
    if (!entry) return null;
    return this.mapper.toDomain(entry);
  }
}
