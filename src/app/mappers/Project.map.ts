import { inject, injectable } from 'inversify';
import { Project } from '@domain/Project';
import { IProjectOutgoingDTO } from '@controllers/dtos';
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
      attachments: project.attachments,
      esteProceduraDeUrgenta: project.esteProceduraDeUrgenta,
    };

    if (!excludeDocuments && project.documents) {
      Object.assign(dtoObject, {
        documents: project.documents
          .getItems()
          .map((document) => this.documentMapper.toDTO(document, true)),
      });
    }

    if (typeof project.presentsInterest === 'boolean') {
      Object.assign(dtoObject, {
        presentsInterest: project.presentsInterest,
      });
    }

    const optionalProperties: Array<keyof Project> = [
      'numarInregistrareSenat',
      'numarInregistrareGuvern',
      'proceduraLegislativa',
      'cameraDecizionala',
      'termenAdoptare',
      'tipInitiativa',
      'caracter',
      'stadiu',
      'initiator',
      'consultati',
    ];

    optionalProperties.forEach((property) =>
      assignPropertyIfItHasValue(dtoObject, project, property),
    );

    return dtoObject;
  }
}
