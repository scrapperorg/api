import { IDocumentOutgoingDTO } from './Document';
export interface IProjectIncomingDTO {
  title: string;
}

export interface IProjectOutgoingDTO {
  id: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  title: string;

  documents: IDocumentOutgoingDTO[];

  presentsInterest: boolean;

  numarInregistrareSenat?: string;
  numarInregistrareGuvern?: string;
  numarInregistrareCDep?: string;
  proceduraLegislativa?: string;
  cameraDecizionala?: string;
  termenAdoptare?: string;
  tipInitiativa?: string;
  caracter?: string;
  esteProceduraDeUrgenta?: boolean;
  stadiu?: string;
  initiator?: string;
  consultati?: string;
  source?: string;
  publicationDate?: string;
  url?: string;
  attachments?: { name: string; id: string }[];
}

export interface ProjectFiltersDTO {
  title?: string;
  numarInregistrareSenat?: string;
  numarInregistrareGuvern?: string;
  numarInregistrareCDep?: string;
}
