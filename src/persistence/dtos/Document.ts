import { Status } from '@domain/Document';
export interface IDocumentPersistenceIncomingDTO {
  title: string;
  project: string;
  identifier: string;
  publicationDate: Date;
  source: string;
  status?: Status;
  assignedUser?: string;
  deadline?: Date;
  originalFormat?: string;
  numberOfPages?: number;
  textInterpretationPrecision?: number;
  numberOfIdentifiedArticles?: number;
  numberOfIdentifiedTerms?: number;
  attachments: string[];
}

export interface IDocumentPersistenceDTO {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  project: string; // todo: replace with project_id
  identifier: string;
  publicationDate: Date;
  source: string; // maybe replace with source entity?
  status: Status;
  assignedUser: string | null;
  deadline: Date | null;
  originalFormat: string | null;
  numberOfPages: number | null;
  textInterpretationPrecision: number | null;
  numberOfIdentifiedArticles: number | null;
  numberOfIdentifiedTerms: number | null;
  attachments: string[]; // todo: replace with uuid[] after Attachement creation
}
