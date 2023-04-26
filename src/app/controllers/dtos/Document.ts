import { Status, Decision } from '@domain/Document';

export interface IDocumentIncomingDTO {
  title: string;
  project?: string;
  identifier: string;
  publicationDate: Date;
  source: string;
  status: Status;
  decision?: Decision;
  isRulesBreaker?: boolean;
  assignedUser?: string;
  deadline?: Date;
  link?: string;
  originalFormat?: string;
  numberOfPages?: number;
  textInterpretationPrecision?: number;
  numberOfIdentifiedArticles?: number;
  numberOfIdentifiedTerms?: number;
  attachments?: { name: string }[];
}

export interface IDocumentOutgoingDTO extends IDocumentIncomingDTO {
  id: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  assignedUser: string | undefined;
}

export interface IAllDocumentsOutgoingDTO {
  totalNumberOfResults: number;
  results: IDocumentOutgoingDTO[];
}

export interface IDocumentAnalysisDTO {
  status: Status;
  decision: Decision;
  assignedUser?: string;
  deadline?: Date;
}
