import { inject, injectable } from 'inversify';
import { Project } from '@domain/Project';
import { IDocumentOutgoingDTO, IProjectOutgoingDTO } from '@controllers/dtos';
import { assignPropertyIfItHasValue } from './helpers/assignPropertyIfItHasValue';
import { DocumentMap } from './Document.map';
import { TYPES } from '@server/types';

@injectable()
export class ProjectMap {
  constructor(@inject(TYPES.DOCUMENT_MAP) private documentMapper: DocumentMap) {}

  toDTO(project: Project, excludeDocuments = false): IProjectOutgoingDTO {
    const dtoObject = {
      id: project.id,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      title: project.title,
      documents: [],
      presentsInterest: false,
      attachments: project.attachments?.toArray(),
      source: project.source,
      esteProceduraDeUrgenta: project.esteProceduraDeUrgenta,
    };

    if (!excludeDocuments && project.documents) {
      (dtoObject.documents as IDocumentOutgoingDTO[]) = project.documents
        .getItems(false)
        .map((document) => this.documentMapper.toDTO(document, true));
    }

    if (typeof project.presentsInterest === 'boolean') {
      Object.assign(dtoObject, {
        presentsInterest: project.presentsInterest,
      });
    }

    const optionalProperties: Array<keyof Project> = [
      'numarInregistrareSenat',
      'numarInregistrareGuvern',
      'numarInregistrareCDep',
      'proceduraLegislativa',
      'cameraDecizionala',
      'termenAdoptare',
      'tipInitiativa',
      'caracter',
      'stadiu',
      'initiator',
      'consultati',
      'publicationDate',
      'url',
    ];

    optionalProperties.forEach((property) =>
      assignPropertyIfItHasValue(dtoObject, project, property),
    );

    return dtoObject;
  }
}
