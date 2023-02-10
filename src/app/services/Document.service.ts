import { NoSuchElementException } from './../../lib/exceptions/NoSuchElement.exception';
import { IAllDocumentsOutgoingDTO, IDocumentOutgoingDTO } from '@controllers/dtos';
import { IDocumentProps, IDocumentRepository, Document } from '@domain/Document';
import { DocumentMap } from '@mappers';
import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';
import { IDocumentsFilters } from '@middlewares/parseDocumentsFilters.middleware';
import path from 'path';
import { FileRepositoryService } from '@services/FileRepository.service';
import { Attachment } from '@domain/Attachment';
import { IUserRepository } from '@domain/User';
import { InvalidException } from '@lib';

@injectable()
export class DocumentService {
  constructor(
    @inject(TYPES.DOCUMENT_REPOSITORY) private repository: IDocumentRepository,
    @inject(TYPES.DOCUMENT_MAP) private mapper: DocumentMap,

    @inject(TYPES.FILE_REPOSITORY_SERVICE) private fileRepo: FileRepositoryService,
    @inject(TYPES.USER_REPOSITORY) private userRepository: IUserRepository,
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

  async updateDocument(id: string, document: any): Promise<IDocumentOutgoingDTO> {
    const entry = await this.repository.update({ ...document, id });
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

  async uploadDocument(
    id: string,
    file: Express.Multer.File,
  ): Promise<IDocumentOutgoingDTO | null> {
    const document = await this.repository.getById(id);

    if (!document) {
      throw new NoSuchElementException('Document not found.');
    }

    const uploadPath = path.resolve(`./file-repository-bucket/${id}/${file.originalname}`);

    const isPathAlreadyUsed = document.attachments?.toArray().find((attachment) => {
      return attachment.path === uploadPath;
    });

    if (isPathAlreadyUsed) {
      throw new Error('Path already exists.');
    }

    await this.fileRepo.upload(uploadPath, file.buffer);

    const attachment = new Attachment({
      name: file.originalname,
      size: file.size,
      path: uploadPath,
      document,
    });

    document.addAttachment(attachment);

    const updatedDocument = await this.repository.update(document);

    return this.mapper.toDTO(updatedDocument);
  }
}
