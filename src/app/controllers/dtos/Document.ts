import { Status } from '@domain/Document';

export interface IDocumentIncomingDTO {
  title: string;
  project: string;
  identificator: string;
  publicationDate: Date;
  source: string;
  status: Status;
  assignedUser?: string;
  deadline?: Date;
  originalFormat?: string;
  numberOfPages?: number;
  textInterpretationPrecision?: number;
  numberOfIdentifiedArticles?: number;
  numberOfIdentifiedTerms?: number;
  attachments?: string[];
}

export interface IDocumentOutgoingDTO extends IDocumentIncomingDTO {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
