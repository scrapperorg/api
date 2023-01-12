import { IProjectProps, IProjectRepository, Project } from '@domain/Project';
import { ProjectMap } from '@mappers/Project.map';
import { EntityRepository, MikroORM } from '@mikro-orm/core';
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
    offset?: number | undefined,
    limit?: number | undefined,
  ): Promise<{ entries: Project[]; count: number }> {
    throw new Error('Method not implemented.');
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
        refresh: true,
        cache: false,
      },
    );
    if (!entry) return null;
    return entry;
  }
}
