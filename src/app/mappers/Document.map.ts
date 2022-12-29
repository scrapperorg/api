import { IDocumentOutgoingDTO } from '@controllers/dtos';
import { IDocumentPersistenceDTO, IDocumentPersistenceIncomingDTO } from '@persistence/dtos';
import { Document } from '@domain/Document';
import { injectable } from 'inversify';
import { assignPropertyIfItHasValue } from './helpers/assignPropertyIfItHasValue';

@injectable()
export class DocumentMap {
  toPersistence(document: Document): IDocumentPersistenceIncomingDTO {
    const persitenceObject = {
      title: document.title,
      project: document.project,
      identifier: document.identifier,
      publicationDate: document.publicationDate,
      isRulesBreaker: document.isRulesBreaker,
      source: document.source,
      status: document.status,
      assignedUser: document.assignedUser,
      attachments: document.attachments,
      deadline: document.deadline,
      originalFormat: document.originalFormat,
      numberOfPages: document.numberOfPages,
      textInterpretationPrecision: document.textInterpretationPrecision,
      numberOfIdentifiedArticles: document.textInterpretationPrecision,
      numberOfIdentifiedTerms: document.numberOfIdentifiedTerms,
    };

    return persitenceObject;
  }
  toDTO(document: Document): IDocumentOutgoingDTO {
    const dtoObject = {
      id: document.id,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      title: document.title,
      project: document.project,
      identifier: document.identifier,
      publicationDate: document.publicationDate,
      source: document.source,
      status: document.status,
      isRulesBreaker: document.isRulesBreaker,
      attachments: document.attachments,
    };

    const optionalProperties: Array<keyof Document> = [
      'deadline',
      'originalFormat',
      'numberOfPages',
      'textInterpretationPrecision',
      'numberOfIdentifiedArticles',
      'numberOfIdentifiedTerms',
    ];

    optionalProperties.forEach((property) =>
      assignPropertyIfItHasValue(dtoObject, document, property),
    );

    return dtoObject;
  }

  toDomain(persistenceDocument: IDocumentPersistenceDTO): Document {
    return Document.create(persistenceDocument);
  }
}
