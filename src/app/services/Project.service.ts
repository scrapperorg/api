import { NoSuchElementException } from './../../lib/exceptions/NoSuchElement.exception';
import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';
import { IProjectFiltersProps, IProjectRepository } from '@domain/Project';
import { DocumentMap, ProjectMap } from '@mappers';
import { IProjectOutgoingDTO } from '@controllers/dtos';
import { IProjectFilters } from '@middlewares/parseProjectsFilters.middleware';
import { IPaginatedOutgoingDto } from '@controllers/dtos/Paginated';

@injectable()
export class ProjectService {
  constructor(
    @inject(TYPES.PROJECT_REPOSITORY) private repository: IProjectRepository,
    @inject(TYPES.PROJECT_MAP) private mapper: ProjectMap,
    @inject(TYPES.DOCUMENT_MAP) private documentMapper: DocumentMap,
  ) {}

  async getAll(
    projectFilters: IProjectFilters,
    page: number,
    pageSize: number,
  ): Promise<IPaginatedOutgoingDto<IProjectOutgoingDTO>> {
    const offset = page * pageSize;

    const filters: IProjectFiltersProps = {
      forumLegislativ: projectFilters.forumLegislativ,
    };

    const { entries, count } = await this.repository.getAll(filters, offset, pageSize);

    const dtoProjects = entries.map((entry) => this.mapper.toDTO(entry));

    return {
      totalNumberOfResults: count,
      results: dtoProjects,
    };
  }

  async getById(id: string): Promise<IProjectOutgoingDTO | null> {
    const entry = await this.repository.getById(id);

    if (!entry) {
      throw new NoSuchElementException('project not found');
    }

    return this.mapper.toDTO(entry);
  }
}
