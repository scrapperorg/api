import { IDocumentOutgoingDTO } from '@controllers/dtos';
import { Document, IDocumentProps, IElasticDocument, Source, Status } from '@domain/Document';
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
      attachments: document.attachments?.toArray(),
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

  toDocumentProps(elasticDocument: IElasticDocument): IDocumentProps {
    const dtoObject = {
      id: elasticDocument.id,
      createdAt: new Date(elasticDocument.created_at),
      updatedAt: new Date(elasticDocument.updated_at),
      title: elasticDocument.title,
      project: elasticDocument.project_id,
      identifier: elasticDocument.identifier,
      publicationDate: new Date(elasticDocument.publication_date),
      source: <Source>elasticDocument.source,
      status: <Status>elasticDocument.status,
      link: elasticDocument.link,
      isRulesBreaker: elasticDocument.is_rules_breaker,
      assignedUser: elasticDocument.assigned_user_id,
      deadline:
        elasticDocument.deadline !== undefined ? new Date(elasticDocument.deadline) : undefined,
      originalFormat: elasticDocument.original_format,
      numberOfPages: elasticDocument.number_of_pages,
      textInterpretationPrecision: elasticDocument.text_interpretation_precision,
      numberOfIdentifiedArticles: elasticDocument.number_of_identified_articles,
      numberOfIdentifiedTerms: elasticDocument.number_of_identified_terms,
      postOcrContent: elasticDocument.post_ocr_content,
    };

    return dtoObject;
  }
}
