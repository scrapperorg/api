import { EntityRepository, MikroORM, wrap } from '@mikro-orm/core';
import { Document, IDocumentProps, IDocumentRepository } from '@domain/Document';
import { inject, injectable } from 'inversify';
import { TYPES } from '@server/types';
import { DocumentMap } from '@mappers';
import { DocumentSchema } from './Document.schema';
import { NoSuchElementException } from '@lib';
import { IDocumentsFilters } from '@middlewares/parseDocumentsFilters.middleware';

@injectable()
export class DocumentRepository implements IDocumentRepository {
  private entityRepository: EntityRepository<Document>;
  constructor(
    @inject(TYPES.DATABASE_CONNECTION) private readonly orm: MikroORM,
    @inject(TYPES.DOCUMENT_MAP) private readonly mapper: DocumentMap,
  ) {
    const entityManager = this.orm.em.fork();
    this.entityRepository = entityManager.getRepository(DocumentSchema);
  }

  async getAll(filters: IDocumentsFilters, offset = 0, limit = 0) {
    const sourceCondition: any =
      filters.sourcesOfInterest!.length === 0 ? {} : { source: { $in: filters.sourcesOfInterest } };

    if (filters.title != null || filters.title !== undefined) {
      sourceCondition['title'] = filters.title;
    }

    if (filters.link != null || filters.link !== undefined) {
      sourceCondition['link'] = filters.link;
    }

    if (filters.project != null || filters.project !== undefined) {
      sourceCondition['project'] = filters.project;
    }

    const [entries, count] = await this.entityRepository.findAndCount(sourceCondition, {
      limit,
      offset,
      populate: ['project'],
    });

    return {
      entries,
      count,
    };
  }

  async save(dto: IDocumentProps): Promise<Document> {
    const document = this.entityRepository.create(dto);
    await this.entityRepository.persistAndFlush(document);
    return document;
  }

  async update(dto: Document): Promise<Document> {
    const entry = await this.getById(dto.id);

    if (!entry) {
      throw new NoSuchElementException('Document not found');
    }

    const updated = wrap(entry).assign(dto, { mergeObjects: true });
    await this.entityRepository.flush();

    return updated;
  }

  async getById(id: string): Promise<Document | null> {
    const entry = await this.entityRepository.findOne(
      { id },
      { populate: ['project', 'assignedUser'], refresh: true, cache: false },
    );
    if (!entry) return null;
    return entry;
  }
}
