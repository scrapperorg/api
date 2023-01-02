import { IProjectRepository } from '@domain/Project';
import { ProjectMap } from '@mappers';
import { IProjectPersistenceDTO } from '@persistence/dtos/Project';
import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';

@injectable()
export class ProjectMockRepository implements IProjectRepository {
  constructor(@inject(TYPES.PROJECT_MAP) private readonly mapper: ProjectMap) {}

  private entries: Array<IProjectPersistenceDTO> = [
    {
      id: '822b7f37-1faa-4da5-8bd6-ee75eb59613e',
      createdAt: new Date(),
      updatedAt: new Date(),
      title: 'primul doc',

      presentsInterest: false,

      numarInregistrareSenat: null,
      numarInregistrareGuvern: null,
      proceduraLegislativa: null,
      cameraDecizionala: null,
      termenAdoptare: null,
      tipInitiativa: null,
      caracter: null,
      esteProceduraDeUrgenta: false,
      stadiu: null,
      initiator: null,
      consultati: null,

      attachments: [],
    },
  ];

  async save(dto: IProjectPersistenceDTO) {
    // to implement
    return this.mapper.toDomain(dto);
  }

  async update(dto: IProjectPersistenceDTO) {
    // to implement
    return this.mapper.toDomain(dto);
  }

  async getAll() {
    return {
      entries: this.entries.map((entry) => this.mapper.toDomain(entry)),
      count: this.entries.length,
    };
  }

  async getById(id: string) {
    // to implement
    return this.mapper.toDomain(this.entries[0]);
  }
}
