import { InvalidException, NoSuchElementException } from '@lib';
import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';
import {
  IProjectFiltersProps,
  IProjectRepository,
  IProjectProps,
  IElasticProjectRepository,
  ProjectElasticSearchProps,
} from '@domain/Project';
import { ProjectMap } from '@mappers';
import { IProjectFilters } from '@middlewares/parseProjectsFilters.middleware';
import { IPaginatedOutgoingDto } from '@controllers/dtos/Paginated';
import { IProjectOutgoingDTO, ProjectFiltersDTO } from '@controllers/dtos';

@injectable()
export class ProjectService {
  constructor(
    @inject(TYPES.PROJECT_REPOSITORY) private repository: IProjectRepository,
    @inject(TYPES.PROJECT_MAP) private mapper: ProjectMap,
    @inject(TYPES.PROJECT_ELASTIC_REPOSITORY)
    private elasticProjectRepository: IElasticProjectRepository,
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

  async createProject(project: IProjectProps): Promise<IProjectOutgoingDTO> {
    const entry = await this.repository.save(project);
    return this.mapper.toDTO(entry);
  }

  async updateProject(id: string, project: IProjectProps): Promise<IProjectOutgoingDTO> {
    const entry = await this.repository.update(id, project);
    return this.mapper.toDTO(entry);
  }

  async find(filters: ProjectFiltersDTO): Promise<IProjectOutgoingDTO[]> {
    const { entries } = await this.repository.getBy(filters);
    return entries.map((entry) => this.mapper.toDTO(entry));
  }

  async search(query: ProjectElasticSearchProps): Promise<IProjectOutgoingDTO[]> {
    const nonEmptyQuery = Object.keys(query)
      .filter((key) => query[<keyof ProjectElasticSearchProps>key] !== '')
      .reduce((docObj: Record<string, any>, key: string) => {
        docObj[key] = query[<keyof ProjectElasticSearchProps>key];
        return docObj;
      }, {});

    const elasticResults = await this.elasticProjectRepository.search(nonEmptyQuery);

    const projects: IProjectOutgoingDTO[] = [];

    for (let i = 0; i < elasticResults.length; i++) {
      const result = elasticResults[i];

      if (result.project_id === null) {
        // no reason to throw the current op. just log and move on
        console.log(
          new InvalidException(`Project index cannot not have an id. Project: ${result.title}`),
        );
        continue;
      }

      const pgProject = await this.repository.getById(result.project_id);

      if (pgProject === null) {
        // no reason to throw the current op. just log and move on
        console.log(
          new NoSuchElementException(
            `Project with id: ${result.project_id}, found in the elastic db does not exist in the pg database`,
          ),
        );
        continue;
      }

      projects.push(this.mapper.toDTO(pgProject));
    }

    return projects;
  }
}
