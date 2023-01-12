import { NoSuchElementException } from '@lib';
import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';
import { IProjectProps, IProjectRepository } from '@domain/Project';
import { DocumentMap, ProjectMap } from '@mappers';
import { IProjectOutgoingDTO, ProjectFiltersDTO } from '@controllers/dtos';

@injectable()
export class ProjectService {
  constructor(
    @inject(TYPES.PROJECT_REPOSITORY) private repository: IProjectRepository,
    @inject(TYPES.PROJECT_MAP) private mapper: ProjectMap,
    @inject(TYPES.DOCUMENT_MAP) private documentMapper: DocumentMap,
  ) {}

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

  async getAllProjects(): Promise<IProjectOutgoingDTO[]> {
    const { entries } = await this.repository.getAll();
    return entries.map((entry) => this.mapper.toDTO(entry));
  }

  async find(filters: ProjectFiltersDTO): Promise<IProjectOutgoingDTO[]> {
    const { entries } = await this.repository.getBy(filters);
    return entries.map((entry) => this.mapper.toDTO(entry));
  }
}
