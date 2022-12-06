import { injectable } from 'inversify';
import { IProjectPersistenceDTO } from '@persistence/dtos/Project';
import { Project } from '@domain/Project';

@injectable()
export class ProjectMap {
  toPersistence(project: Project): IProjectPersistenceDTO {
    const persitenceObject = {
      id: project.id,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      title: document.title,
      presentsInterest: project.presentsInterest,
    };

    return persitenceObject;
  }

  toDomain(persistenceProject: IProjectPersistenceDTO): Project {
    return Project.create(persistenceProject);
  }
}
