import { injectable } from 'inversify';
import { IProjectPersistenceDTO, IProjectPersistenceIncomingDTO } from '@persistence/dtos/Project';
import { Project } from '@domain/Project';
import { IProjectOutgoingDTO } from '@controllers/dtos';
import { assignPropertyIfItHasValue } from './helpers/assignPropertyIfItHasValue';
import { Document } from '@domain/Document';

@injectable()
export class ProjectMap {
  toPersistence(project: Project): IProjectPersistenceIncomingDTO {
    const persistenceObject = {
      id: project.id,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      title: project.title,
      presentsInterest: project.presentsInterest,

      numarInregistrareSenat: project.numarInregistrareSenat,
      numarInregistrareGuvern: project.numarInregistrareGuvern,
      proceduraLegislativa: project.proceduraLegislativa,
      cameraDecizionala: project.cameraDecizionala,
      termenAdoptare: project.termenAdoptare,
      tipInitiativa: project.tipInitiativa,
      caracter: project.caracter,
      esteProceduraDeUrgenta: project.esteProceduraDeUrgenta,
      stadiu: project.stadiu,
      initiator: project.initiator,
      consultati: project.consultati,

      attachments: project.attachments,
    };

    return persistenceObject;
  }

  toDomain(persistenceProject: IProjectPersistenceDTO): Project {
    const persistedDocuments = Array.prototype.slice.call(persistenceProject.documents, 0);
    const documents = persistedDocuments.map((doc) => {
      return Document.create(doc);
    });
    const projectWithMappedDocuments = Object.assign(persistenceProject, { documents });
    return Project.create(projectWithMappedDocuments);
  }

  toDTO(project: Project): IProjectOutgoingDTO {
    const dtoObject = {
      id: project.id,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      title: project.title,
      documents: project.documents,
      presentsInterest: project.presentsInterest,
      attachments: project.attachments,
      esteProceduraDeUrgenta: project.esteProceduraDeUrgenta,
    };

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
