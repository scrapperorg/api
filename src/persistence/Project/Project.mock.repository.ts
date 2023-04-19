import { IProjectProps, IProjectRepository, Project } from '@domain/Project';
import { Collection } from '@mikro-orm/core';
import { injectable } from 'inversify';

@injectable()
export class ProjectMockRepository implements IProjectRepository {
  private entries: Array<Project> = [
    new Project({
      title: 'primul doc',
    }),
  ];

  async save(dto: IProjectProps) {
    // to implement
    return this.entries[0];
  }

  async update(id: string, dto: Partial<Project>): Promise<Project> {
    // to implement
    return dto as Project;
  }

  async getAll() {
    return {
      entries: this.entries,
      count: this.entries.length,
    };
  }

  async getById(id: string) {
    // to implement
    return this.entries[0];
  }

  async getBy(filters: any) {
    // to implement
    return {
      entries: this.entries,
      count: this.entries.length,
    };
  }
}
