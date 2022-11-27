import { IDocumentOutgoingDTO } from '@controllers/dtos';
import { IDocumentPersistenceDTO, IDocumentPersistenceIncomingDTO } from '@persistence/dtos';
import { Document } from '@domain/Document';
import { injectable } from 'inversify';

function assignPropertyIfItHasValue<O extends Record<string, unknown>, E>(
  object: O,
  document: E,
  property: keyof E,
) {
  if (document[property] === null) return;
  Object.assign(object, { [property]: document[property] });
}

@injectable()
export class DocumentMap {
  toPersistence(document: Document): IDocumentPersistenceIncomingDTO {
    const persitenceObject = {
      title: document.title,
      project: document.project,
      identificator: document.identificator,
      publicationDate: document.publicationDate,
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
      identificator: document.identificator,
      publicationDate: document.publicationDate,
      source: document.source,
      status: document.status,
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
