import { IDocumentPersistenceDTO } from '@persistence/dtos/Document';
import { Document } from './Document';

export interface IDocumentRepository {
  getAll(): Promise<Document[]>;
  save(dto: IDocumentPersistenceDTO): Promise<Document>;
  update(dto: IDocumentPersistenceDTO): Promise<Document>;
  getById(id: string): Promise<Document | null>;
}
