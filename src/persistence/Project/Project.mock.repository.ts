import { IProjectProps, IProjectRepository, Project } from '@domain/Project';
import { Collection } from '@mikro-orm/core';
import { injectable } from 'inversify';

@injectable()
export class ProjectMockRepository implements IProjectRepository {
  private entries: Array<Project> = [
    {
      id: '822b7f37-1faa-4da5-8bd6-ee75eb59613e',
      createdAt: new Date(),
      updatedAt: new Date(),
      title: 'primul doc',
      documents: new Collection({}),
      presentsInterest: false,
      attachments: [],
    },
  ];

  async save(dto: IProjectProps) {
    // to implement
    return this.entries[0];
  }

  async update(dto: Project) {
    // to implement
    return dto;
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
}
