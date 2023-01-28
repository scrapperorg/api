import { IDocumentOutgoingDTO } from '@controllers/dtos';
import { Document } from '@domain/Document';
import { injectable } from 'inversify';
import { assignPropertyIfItHasValue } from './helpers/assignPropertyIfItHasValue';

@injectable()
export class DocumentMap {
  toDTO(document: Document, excludeProject = false): IDocumentOutgoingDTO {
    const dtoObject = {
      id: document.id,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      title: document.title,
      identifier: document.identifier,
      link: document.link,
      publicationDate: document.publicationDate,
      source: document.source,
      status: document.status,
      isRulesBreaker: document.isRulesBreaker,
      attachments: document.attachments,
      assignedUser: document.assignedUser,
    };

    if (!excludeProject) {
      Object.assign(dtoObject, {
        project: document.project,
      });
    }

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
}
