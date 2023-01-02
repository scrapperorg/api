import { NoSuchElementException } from './../../lib/exceptions/NoSuchElement.exception';
import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';
import { IProjectRepository } from '@domain/Project';
import { ProjectMap } from '@mappers';
import { IProjectOutgoingDTO } from '@controllers/dtos';

@injectable()
export class ProjectService {
  constructor(
    @inject(TYPES.PROJECT_REPOSITORY) private repository: IProjectRepository,
    @inject(TYPES.PROJECT_MAP) private mapper: ProjectMap,
  ) {}

  async getById(id: string): Promise<IProjectOutgoingDTO | null> {
    const entry = await this.repository.getById(id);
    if (!entry) {
      throw new NoSuchElementException('project not found');
    }
    return this.mapper.toDTO(entry);
  }
}
