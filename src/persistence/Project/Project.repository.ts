import { IProjectFiltersProps, IProjectRepository, Project } from '@domain/Project';
import { ProjectMap } from '@mappers/Project.map';
import { Connection, EntityManager, FilterQuery, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';
import { ProjectSchema } from './Project.schema';
import { UniqueConstraintViolationException } from '@lib/exceptions/UniqueConstraintValidation.exception';
import { ProjectFiltersDTO } from '@controllers/dtos';
import { Attachment, Document } from '@domain';

@injectable()
export class ProjectRepository implements IProjectRepository {
  private entityRepository: EntityRepository<Project>;
  private entityManager: EntityManager<IDatabaseDriver<Connection>>;
  constructor(
    @inject(TYPES.DATABASE_CONNECTION) private readonly orm: MikroORM,
    @inject(TYPES.PROJECT_MAP) private readonly mapper: ProjectMap,
  ) {
    // const entityManager = this.orm.em.fork();
    this.entityManager = this.orm.em.fork();
    this.entityRepository = this.entityManager.getRepository(ProjectSchema);
  }

  async removeAttachment(projectId: string, attachmentId: string) {
    const project = await this.entityManager.findOneOrFail(Project, projectId, {
      populate: ['attachments'],
    });

    const attachment = this.entityManager.getReference<Attachment>(Attachment, attachmentId);

    project.attachments?.remove(attachment);

    await this.entityManager.flush();
  }

  async countNewProjects(): Promise<number> {
    return this.entityRepository
      .qb('p')
      .join('p.documents', 'd')
      .where({
        'd.status': 'nou',
      })
      .getCount();
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
  async update(id: string, dto: Partial<Project>): Promise<Project> {
    const project = await this.entityRepository.findOneOrFail(id);
    this.entityRepository.assign(project, dto);
    await this.entityRepository.persistAndFlush(project);
    return project;
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
    let processedFilters: any = { ...filters };
    if (filters.numarInregistrareCDep != null) {
      processedFilters = {
        $or: [
          { numarInregistrareCDep: filters.numarInregistrareCDep },
          { numarInregistrareCDep: filters.numarInregistrareCDep.replace('L', 'l') },
        ],
      };
    }

    const [entries, count] = await this.entityRepository.findAndCount(processedFilters, {
      populate: ['documents'],
      refresh: true,
      cache: false,
    });
    return { entries, count };
  }
}
