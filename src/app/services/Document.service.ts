import { NoSuchElementException } from './../../lib/exceptions/NoSuchElement.exception';
import { IAllDocumentsOutgoingDTO, IDocumentOutgoingDTO } from '@controllers/dtos';
import { IDocumentRepository } from '@domain/Document';
import { DocumentMap } from '@mappers';
import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';
import { IDocumentsFilters } from '@middlewares/parseDocumentsFilters.middleware';
import { IUserRepository } from '@domain/User';
import { InvalidException } from '@lib';

@injectable()
export class DocumentService {
  constructor(
    @inject(TYPES.DOCUMENT_REPOSITORY) private repository: IDocumentRepository,
    @inject(TYPES.DOCUMENT_MAP) private mapper: DocumentMap,
    @inject(TYPES.USER_REPOSITORY) private userRepository: IUserRepository,
  ) {}

  async getAll(
    documentsFilters: IDocumentsFilters,
    page: number,
    pageSize: number,
  ): Promise<IAllDocumentsOutgoingDTO> {
    const offset = page * pageSize;

    const { entries, count } = await this.repository.getAll(
      documentsFilters.sourcesOfInterest,
      offset,
      pageSize,
    );
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

  /**
   * Assign responsible on a document.
   * The assigner is required to be at least a LSE as per specification.
   * The asignee is a LSS as per current specification.
   *
   * @param documentId
   * @param userId
   */
  async assignResponsible(documentId: string, userId: string): Promise<IDocumentOutgoingDTO> {
    const document = await this.repository.getById(documentId);
    if (!document) {
      throw new NoSuchElementException('document not found');
    }
    const user = await this.userRepository.getById(userId);
    if (!user) {
      throw new NoSuchElementException('user not found');
    }

    try {
      document.assignResponsible(user);
    } catch (err: any) {
      // the only possible error here is a role missmatch
      throw new InvalidException(err.message);
    }

    try {
      const updatedDoc = await this.repository.update(document);
      return this.mapper.toDTO(updatedDoc);
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async setDeadline(documentId: string, date: string): Promise<IDocumentOutgoingDTO> {
    const document = await this.repository.getById(documentId);
    if (!document) {
      throw new NoSuchElementException('document not found');
    }

    if (date === '') {
      document.deadline = undefined;
    } else {
      document.deadline = new Date(date);
    }

    try {
      const updatedDoc = await this.repository.update(document);
      return this.mapper.toDTO(updatedDoc);
    } catch (e: any) {
      throw new Error(e);
    }
  }
}
