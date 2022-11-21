import { IDocumentOutgoingDTO } from '@controllers/dtos';
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

  async getAll(): Promise<IDocumentOutgoingDTO[]> {
    const documents = await this.repository.getAll();
    return documents.map((document) => this.mapper.toDTO(document));
  }
}
