import { Collection } from 'typescript';
import { IDocumentPersistenceDTO } from './Document';

export interface IProjectPersistenceDTO {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  presentsInterest: boolean;
  documents: Collection<IDocumentPersistenceDTO>;

  numarInregistrareSenat: string | null;
  numarInregistrareGuvern: string | null;
  proceduraLegislativa: string | null;
  cameraDecizionala: string | null;
  termenAdoptare: string | null;
  tipInitiativa: string | null;
  caracter: string | null;
  esteProceduraDeUrgenta: boolean;
  stadiu: string | null;
  initiator: string | null;
  consultati: string | null;

  attachments: string[];
}

export interface IProjectPersistenceIncomingDTO {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  presentsInterest: boolean;

  numarInregistrareSenat?: string;
  numarInregistrareGuvern?: string;
  proceduraLegislativa?: string;
  cameraDecizionala?: string;
  termenAdoptare?: string;
  tipInitiativa?: string;
  caracter?: string;
  esteProceduraDeUrgenta?: boolean;
  stadiu?: string;
  initiator?: string;
  consultati?: string;

  attachments: string[];
}
