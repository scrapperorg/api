import { Status } from '@domain/Document';

export interface IDocumentIncomingDTO {
  title: string;
  project?: string;
  identifier: string;
  publicationDate: Date;
  source: string;
  status: Status;
  isRulesBreaker: boolean;
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

export interface IAllDocumentsOutgoingDTO {
  totalNumberOfResults: number;
  results: IDocumentOutgoingDTO[];
}
