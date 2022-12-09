import { Document, IDocumentRepository, Status } from '@domain/Document';
import { DocumentMap } from '@mappers';
import { IDocumentPersistenceDTO } from '@persistence/dtos';
import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';

@injectable()
export class DocumentMockRepository implements IDocumentRepository {
  constructor(@inject(TYPES.DOCUMENT_MAP) private readonly mapper: DocumentMap) {}

  private entries: Array<IDocumentPersistenceDTO> = [
    {
      id: '822b7f37-1faa-4da5-8bd6-ee75eb59613e',
      createdAt: new Date(),
      updatedAt: new Date(),
      title: 'primul doc',
      project: 'un proiect',
      identifier: '1',
      isRulesBreaker: false,
      publicationDate: new Date(),
      source: 'senat',
      status: Status.NOU,
      assignedUser: '822b7f37-1faa-4da5-8bd6-ee75eb59613e',
      deadline: null,
      originalFormat: null,
      numberOfPages: null,
      textInterpretationPrecision: null,
      numberOfIdentifiedArticles: null,
      numberOfIdentifiedTerms: null,
      attachments: [],
    },
  ];

  async save(dto: IDocumentPersistenceDTO): Promise<Document> {
    // to implement
    return this.mapper.toDomain(dto);
  }

  async update(dto: IDocumentPersistenceDTO): Promise<Document> {
    // to implement
    return this.mapper.toDomain(dto);
  }

  async getAll() {
    return {
      entries: this.entries.map((entry) => this.mapper.toDomain(entry)),
      count: this.entries.length,
    };
  }

  async getById(id: string): Promise<Document | null> {
    // to implement
    return this.mapper.toDomain(this.entries[0]);
  }
}
