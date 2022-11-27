import { IAllDocumentsOutgoingDTO } from '@controllers/dtos';
import { IDocumentRepository } from '@domain/Document';
import { DocumentMap } from '@mappers';
import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';

@injectable()
export class DocumentService {
  constructor(
    @inject(TYPES.DOCUMENT_REPOSITORY) private repository: IDocumentRepository,
    @inject(TYPES.DOCUMENT_MAP) private mapper: DocumentMap,
  ) {}

  async getAll(page = 0, pageSize = 10): Promise<IAllDocumentsOutgoingDTO> {
    const offset = Math.max(0, page - 1) * pageSize;

    const { entries, count } = await this.repository.getAll(offset, pageSize);
    const dtoDocuments = entries.map((entry) => this.mapper.toDTO(entry));
    return {
      totalNumberOfResults: count,
      results: dtoDocuments,
    };
  }
}
