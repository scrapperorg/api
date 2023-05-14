import { Document, IDocumentProps } from './Document';
import { IDocumentsFilters } from '@middlewares/parseDocumentsFilters.middleware';

export interface IDocumentRepository {
  getAll(
    filters: IDocumentsFilters,
    offset?: number,
    limit?: number,
  ): Promise<{ entries: Document[]; count: number }>;
  save(dto: IDocumentProps): Promise<Document>;
  update(dto: Document): Promise<Document>;
  getById(id: string): Promise<Document | null>;
  removeAttachment(documentId: string, attachmentId: string): Promise<void>;
  countNewDocuments(): Promise<number>;
}
