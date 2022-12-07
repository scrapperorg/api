import { IProjectPersistenceDTO } from '@persistence/dtos/Project';
import { Project } from './Project';

export interface IProjectRepository {
  getAll(offset?: number, limit?: number): Promise<{ entries: Project[]; count: number }>;
  save(dto: IProjectPersistenceDTO): Promise<Project>;
  update(dto: IProjectPersistenceDTO): Promise<Project>;
  getById(id: string): Promise<Project | null>;
}
