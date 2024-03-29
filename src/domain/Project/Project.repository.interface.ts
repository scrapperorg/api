import { IProjectFiltersProps, IProjectProps, Project } from './Project';

export interface IProjectRepository {
  getAll(
    filters: IProjectFiltersProps,
    offset: number,
    limit: number,
  ): Promise<{ entries: Project[]; count: number }>;

  save(dto: IProjectProps): Promise<Project>;

  update(id: string, dto: Partial<Project>): Promise<Project>;

  getById(id: string): Promise<Project | null>;
  getBy(filters: any): Promise<{ entries: Project[]; count: number }>;
  countNewProjects(): Promise<number>;
  removeAttachment(documentId: string, attachmentId: string): Promise<void>;
}
