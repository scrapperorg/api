import { IProjectProps, IProjectRepository, Project } from '@domain/Project';
import { ProjectMap } from '@mappers/Project.map';
import { EntityRepository, MikroORM } from '@mikro-orm/core';
import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';
import { ProjectSchema } from './Project.schema';
import { UniqueConstraintViolationException } from '@lib/exceptions/UniqueConstraintValidation.exception';
import { ProjectFiltersDTO } from '@controllers/dtos';

@injectable()
export class ProjectRepository implements IProjectRepository {
  private entityRepository: EntityRepository<Project>;

  constructor(
    @inject(TYPES.DATABASE_CONNECTION) private readonly orm: MikroORM,
    @inject(TYPES.PROJECT_MAP) private readonly mapper: ProjectMap,
  ) {
    const entityManager = this.orm.em.fork();
    this.entityRepository = entityManager.getRepository(ProjectSchema);
  }
  async getAll(
    offset?: number | undefined,
    limit?: number | undefined,
  ): Promise<{ entries: Project[]; count: number }> {
    const [entries, count] = await this.entityRepository.findAndCount(
      {},
      {
        populate: ['documents'],
      },
    );
    return { entries, count };
  }
  async save(dto: Project): Promise<Project> {
    const project = this.entityRepository.create(dto);
    try {
      await this.entityRepository.persistAndFlush(project);
    } catch (err: any) {
      // to do: the error here is missleading. it can be another error too. we should let the orm throw this kind of errors
      throw new UniqueConstraintViolationException('Project with this name already exists');
    }
    return project;
  }
  async update(dto: Project): Promise<Project> {
    throw new Error('Method not implemented.');
  }
  async getById(id: string): Promise<Project | null> {
    const entry = await this.entityRepository.findOne(
      { id },
      {
        populate: ['documents'],
        refresh: true,
        cache: false,
      },
    );
    if (!entry) return null;
    return entry;
  }

  async getBy(filters: ProjectFiltersDTO): Promise<{ entries: Project[]; count: number }> {
    const [entries, count] = await this.entityRepository.findAndCount(filters, {
      populate: ['documents'],
      refresh: true,
      cache: false,
    });
    return { entries, count };
  }
}
