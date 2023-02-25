import { NoSuchElementException } from './../../lib/exceptions/NoSuchElement.exception';
import { IAllDocumentsOutgoingDTO, IDocumentOutgoingDTO } from '@controllers/dtos';
import {
  ElasticSearchProps,
  IDocumentProps,
  IDocumentRepository,
  IElasticDocumentRepository,
} from '@domain/Document';
import { DocumentMap } from '@mappers';
import { TYPES } from '@server/types';
import { inject, injectable } from 'inversify';
import { IDocumentsFilters } from '@middlewares/parseDocumentsFilters.middleware';
import path from 'path';
import { FileRepositoryService } from '@services/FileRepository.service';
import { Attachment, IAttachmentRepository } from '@domain/Attachment';
import { IUserRepository } from '@domain/User';
import { InvalidException } from '@lib';

@injectable()
export class DocumentService {
  constructor(
    @inject(TYPES.DOCUMENT_REPOSITORY) private readonly documentRepository: IDocumentRepository,
    @inject(TYPES.DOCUMENT_ELASTIC_REPOSITORY)
    private readonly elasticDocumentRepository: IElasticDocumentRepository,
    @inject(TYPES.USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @inject(TYPES.ATTACHMENT_REPOSITORY)
    private readonly attachmentRepository: IAttachmentRepository,
    @inject(TYPES.DOCUMENT_MAP) private readonly documentMap: DocumentMap,
    @inject(TYPES.FILE_REPOSITORY_SERVICE) private readonly fileRepo: FileRepositoryService,
  ) {}

  async getAll(
    documentsFilters: IDocumentsFilters,
    page: number,
    pageSize: number,
  ): Promise<IAllDocumentsOutgoingDTO> {
    const offset = page * pageSize;

    const { entries, count } = await this.documentRepository.getAll(
      documentsFilters,
      offset,
      pageSize,
    );
    const dtoDocuments = entries.map((entry) => this.documentMap.toDTO(entry));
    return {
      totalNumberOfResults: count,
      results: dtoDocuments,
    };
  }

  async getById(id: string): Promise<IDocumentOutgoingDTO | null> {
    const entry = await this.documentRepository.getById(id);
    if (!entry) {
      throw new NoSuchElementException('document not found');
    }
    return this.documentMap.toDTO(entry);
  }

  async createDocument(document: IDocumentProps): Promise<IDocumentOutgoingDTO> {
    const entry = await this.documentRepository.save(document);
    return this.documentMap.toDTO(entry);
  }

  async updateDocument(id: string, document: any): Promise<IDocumentOutgoingDTO> {
    const entry = await this.documentRepository.update({ ...document, id });
    return this.documentMap.toDTO(entry);
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
    const document = await this.documentRepository.getById(documentId);
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

    const updatedDoc = await this.documentRepository.update(document);

    return this.documentMap.toDTO(updatedDoc);
  }

  async setDeadline(documentId: string, date: string): Promise<IDocumentOutgoingDTO> {
    const document = await this.documentRepository.getById(documentId);
    if (!document) {
      throw new NoSuchElementException('document not found');
    }

    if (date === '') {
      document.deadline = undefined;
    } else {
      document.deadline = new Date(date);
    }

    const updatedDoc = await this.documentRepository.update(document);

    return this.documentMap.toDTO(updatedDoc);
  }

  async addAttachment(id: string, file: Express.Multer.File): Promise<IDocumentOutgoingDTO | null> {
    const document = await this.documentRepository.getById(id);

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

    const updatedDocument = await this.documentRepository.update(document);

    return this.documentMap.toDTO(updatedDocument);
  }

  async deleteAttachment(documentId: string, attachmentId: string): Promise<IDocumentOutgoingDTO> {
    const attachment = await this.attachmentRepository.getById(attachmentId);

    if (!attachment) {
      throw new NoSuchElementException(`Attachment ${attachmentId} does not exist`);
    }

    // TODO add transaction when switching to aws/real servers
    // to prevent entity delete when delete io fails
    await this.fileRepo.delete(attachment.path);
    await this.documentRepository.removeAttachment(documentId, attachmentId);

    const document = await this.documentRepository.getById(documentId);

    if (!document) {
      throw new NoSuchElementException(`Document ${documentId} does not exist`);
    }

    return this.documentMap.toDTO(document);
  }

  async search(query: ElasticSearchProps): Promise<IDocumentOutgoingDTO[]> {
    const nonEmptyQuery = Object.keys(query)
      .filter((key) => query[<keyof ElasticSearchProps>key] !== '')
      .reduce((docObj: Record<string, any>, key: string) => {
        docObj[key] = query[<keyof ElasticSearchProps>key];
        return docObj;
      }, {});

    const elasticResults = await this.elasticDocumentRepository.search(nonEmptyQuery);

    const documents: IDocumentOutgoingDTO[] = [];

    for (let i = 0; i < elasticResults.length; i++) {
      const result = elasticResults[i];

      if (result.id === null) {
        // no reason to throw the current op. just log and move on
        console.log(
          new InvalidException(`Document index cannot not have an id. Document: ${result.title}`),
        );
        continue;
      }

      const pgDoc = await this.documentRepository.getById(result.id);

      if (pgDoc === null) {
        // no reason to throw the current op. just log and move on
        console.log(
          new NoSuchElementException(
            `Document with id: ${result.id}, found in the elastic db does not exist in the pg database`,
          ),
        );
        continue;
      }

      documents.push(this.documentMap.toDTO(pgDoc));
    }

    return documents;
  }
}
