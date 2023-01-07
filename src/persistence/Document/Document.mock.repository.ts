import { Document, IDocumentProps, IDocumentRepository, Source, Status } from '@domain/Document';
import { injectable } from 'inversify';

@injectable()
export class DocumentMockRepository implements IDocumentRepository {
  private entries: Array<Document> = [
    {
      id: '822b7f37-1faa-4da5-8bd6-ee75eb59613e',
      createdAt: new Date(),
      updatedAt: new Date(),
      title: 'primul doc',
      project: 'un proiect',
      identifier: '1',
      isRulesBreaker: false,
      publicationDate: new Date(),
      source: Source.SENAT,
      status: Status.NOU,
      assignedUser: '822b7f37-1faa-4da5-8bd6-ee75eb59613e',
      attachments: [],
    },
  ];

  async save(dto: IDocumentProps): Promise<Document> {
    // to implement
    return this.entries[0];
  }

  async update(dto: Document): Promise<Document> {
    // to implement
    return dto;
  }

  async getAll() {
    return {
      entries: this.entries,
      count: this.entries.length,
    };
  }

  async getById(id: string): Promise<Document | null> {
    // to implement
    return this.entries[0];
  }
}
