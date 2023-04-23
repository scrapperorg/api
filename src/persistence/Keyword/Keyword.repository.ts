import { EntityRepository, MikroORM } from '@mikro-orm/core';
import { inject, injectable } from 'inversify';
import { TYPES } from '@server/types';
import { IKeywordRepository, Keyword } from '@domain/Keyword';
import { KeywordSchema } from '@persistence/Keyword/Keyword.schema';
import { NoSuchElementException } from '@lib';

@injectable()
export class KeywordRepository implements IKeywordRepository {
  private entityRepository: EntityRepository<Keyword>;

  constructor(
    @inject(TYPES.DATABASE_CONNECTION) private readonly orm: MikroORM, // @inject(TYPES.DOCUMENT_MAP) private readonly mapper: DocumentMap,
  ) {
    const entityManager = this.orm.em.fork();
    this.entityRepository = entityManager.getRepository(KeywordSchema);
  }

  async create(name: string): Promise<Keyword> {
    const keyword = new Keyword({ name });
    try {
      await this.entityRepository.persistAndFlush(keyword);
      return keyword;
    } catch (error: any) {
      throw new Error(`Error while creating keyword: ${error.message}`);
    }
  }

  async getAll(): Promise<Keyword[]> {
    try {
      return await this.entityRepository.findAll();
    } catch (error: any) {
      throw new Error(`Error while fetching keywords: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    const keyword = await this.entityRepository.findOne(id);
    if (keyword === null || keyword === undefined) {
      throw new NoSuchElementException(`Keyword not found with id: ${id}`);
    }
    try {
      await this.entityRepository.removeAndFlush(keyword);
      return true;
    } catch (error: any) {
      throw new Error(`Error while deleting keyword: ${error.message}`);
    }
  }

  async update(id: string, name: string): Promise<Keyword> {
    const keyword = await this.entityRepository.findOne(id);
    if (keyword === null || keyword === undefined) {
      throw new NoSuchElementException(`Keyword not found with id: ${id}`);
    }
    keyword.name = name;
    try {
      await this.entityRepository.persistAndFlush(keyword);
      return keyword;
    } catch (error: any) {
      throw new Error(`Error while updating keyword: ${error.message}`);
    }
  }
}
