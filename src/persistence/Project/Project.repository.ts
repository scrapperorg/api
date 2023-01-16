import { IProjectFiltersProps, IProjectProps, IProjectRepository, Project } from '@domain/Project';
import { ProjectMap } from '@mappers/Project.map';
import { EntityRepository, FilterQuery, MikroORM } from '@mikro-orm/core';
import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';
import { ProjectSchema } from './Project.schema';

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
    filters: IProjectFiltersProps,
    offset = 0,
    limit = 0,
  ): Promise<{ entries: Project[]; count: number }> {
    const filterQuery: FilterQuery<Project> = {};

    if (filters.forumLegislativ) {
      if (filters.forumLegislativ.length > 0) {
        filterQuery.cameraDecizionala = { $in: filters.forumLegislativ };
      }
    }

    const [entries, count] = await this.entityRepository.findAndCount(filterQuery, {
      limit,
      offset,
    });

    return {
      entries,
      count,
    };
  }
  async save(dto: IProjectProps): Promise<Project> {
    throw new Error('Method not implemented.');
  }
  async update(dto: Project): Promise<Project> {
    throw new Error('Method not implemented.');
  }
  async getById(id: string): Promise<Project | null> {
    const entry = await this.entityRepository.findOne(
      { id },
      {
        populate: ['documents'],
      },
    );
    if (!entry) return null;
    return entry;
  }
}
