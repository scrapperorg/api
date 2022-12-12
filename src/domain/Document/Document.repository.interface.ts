import { IDocumentPersistenceDTO } from '@persistence/dtos/Document';
import { Document } from './Document';

export interface IDocumentRepository {
  getAll(
    sourcesOfInterest?: string[],
    offset?: number,
    limit?: number,
  ): Promise<{ entries: Document[]; count: number }>;
  save(dto: IDocumentPersistenceDTO): Promise<Document>;
  update(dto: IDocumentPersistenceDTO): Promise<Document>;
  getById(id: string): Promise<Document | null>;
}
