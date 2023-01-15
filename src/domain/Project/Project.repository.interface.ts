import { IProjectFiltersProps, IProjectProps, Project } from './Project';

export interface IProjectRepository {
  getAll(
    filters: IProjectFiltersProps,
    offset: number,
    limit: number,
  ): Promise<{ entries: Project[]; count: number }>;

  save(dto: IProjectProps): Promise<Project>;

  update(dto: Project): Promise<Project>;

  getById(id: string): Promise<Project | null>;
}
