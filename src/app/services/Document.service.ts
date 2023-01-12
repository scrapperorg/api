import { NoSuchElementException } from './../../lib/exceptions/NoSuchElement.exception';
import { IAllDocumentsOutgoingDTO, IDocumentOutgoingDTO } from '@controllers/dtos';
import { IDocumentProps, IDocumentRepository } from '@domain/Document';
import { DocumentMap } from '@mappers';
import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';
import { IDocumentsFilters } from '@middlewares/parseDocumentsFilters.middleware';

@injectable()
export class DocumentService {
  constructor(
    @inject(TYPES.DOCUMENT_REPOSITORY) private repository: IDocumentRepository,
    @inject(TYPES.DOCUMENT_MAP) private mapper: DocumentMap,
  ) {}

  async getAll(
    documentsFilters: IDocumentsFilters,
    page: number,
    pageSize: number,
  ): Promise<IAllDocumentsOutgoingDTO> {
    const offset = page * pageSize;

    const { entries, count } = await this.repository.getAll(documentsFilters, offset, pageSize);
    const dtoDocuments = entries.map((entry) => this.mapper.toDTO(entry));
    return {
      totalNumberOfResults: count,
      results: dtoDocuments,
    };
  }

  async getById(id: string): Promise<IDocumentOutgoingDTO | null> {
    const entry = await this.repository.getById(id);
    if (!entry) {
      throw new NoSuchElementException('document not found');
    }
    return this.mapper.toDTO(entry);
  }

  async createDocument(document: IDocumentProps): Promise<IDocumentOutgoingDTO> {
    const entry = await this.repository.save(document);
    return this.mapper.toDTO(entry);
  }
}
