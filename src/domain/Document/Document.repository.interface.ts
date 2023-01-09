import { Document, IDocumentProps } from './Document';

export interface IDocumentRepository {
  getAll(
    sourcesOfInterest?: string[],
    offset?: number,
    limit?: number,
  ): Promise<{ entries: Document[]; count: number }>;
  save(dto: IDocumentProps): Promise<Document>;
  update(dto: Document): Promise<Document>;
  getById(id: string): Promise<Document | null>;
}
