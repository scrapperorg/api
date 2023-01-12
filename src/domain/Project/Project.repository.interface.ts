import { IProjectProps, Project } from './Project';

export interface IProjectRepository {
  getAll(offset?: number, limit?: number): Promise<{ entries: Project[]; count: number }>;
  save(dto: IProjectProps): Promise<Project>;
  update(dto: Project): Promise<Project>;
  getById(id: string): Promise<Project | null>;
  getBy(filters: any): Promise<{ entries: Project[]; count: number }>;
}
