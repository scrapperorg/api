import { inject, injectable } from 'inversify';
import { Project } from '@domain/Project';
import { IDocumentOutgoingDTO, IProjectOutgoingDTO } from '@controllers/dtos';
import { assignPropertyIfItHasValue } from './helpers/assignPropertyIfItHasValue';
import { DocumentMap } from './Document.map';
import { TYPES } from '@server/types';
import { Document } from '@domain';

@injectable()
export class ProjectMap {
  constructor(@inject(TYPES.DOCUMENT_MAP) private documentMapper: DocumentMap) {}

  toDTO(project: Project): IProjectOutgoingDTO {
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

    if (project.documents) {
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
