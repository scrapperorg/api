import { OptionalProps } from '@mikro-orm/core';
import { BaseEntity } from '../BaseEntity/BaseEntity';

export enum Status {
  NOU = 'nou',
  IN_ANALIZA = 'in analiza',
  REVIZUIT = 'revizuit',
}

export enum Source {
  CAMERA_DEPUTATILOR = 'camera_deputatilor',
  SENAT = 'senat',
  GUVERN = 'guvern',
}

export interface IDocumentProps {
  title: string;
  project: string;
  identifier: string;
  publicationDate: Date;
  source: Source;
  status: Status;
  isRulesBreaker?: boolean;
  assignedUser?: string;
  deadline?: Date;
  originalFormat?: string;
  numberOfPages?: number;
  textInterpretationPrecision?: number;
  numberOfIdentifiedArticles?: number;
  numberOfIdentifiedTerms?: number;
  attachments?: string[];
}

export class Document extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'isRulesBreaker' | 'attachments';

  title: string;
  project: string;
  identifier: string;
  publicationDate: Date;
  source: Source;
  status: Status;
  isRulesBreaker = false;
  assignedUser?: string;
  deadline?: Date;
  originalFormat?: string;
  numberOfPages?: number;
  textInterpretationPrecision?: number;
  numberOfIdentifiedArticles?: number;
  numberOfIdentifiedTerms?: number;
  attachments: string[] = [];

  constructor(props: IDocumentProps) {
    super();
    this.title = props.title;
    this.project = props.project;
    this.identifier = props.identifier;
    this.publicationDate = props.publicationDate;
    this.source = props.source;
    this.status = props.status;
    if (typeof props.isRulesBreaker === 'boolean') this.isRulesBreaker = props.isRulesBreaker;
    if (props.assignedUser !== null) this.assignedUser = props.assignedUser;
    if (props.deadline !== null) this.deadline = props.deadline;
    if (props.originalFormat !== null) this.originalFormat = props.originalFormat;
    if (props.numberOfPages !== null) this.numberOfPages = props.numberOfPages;
    if (props.textInterpretationPrecision !== null)
      this.textInterpretationPrecision = props.textInterpretationPrecision;
    if (props.numberOfIdentifiedArticles !== null)
      this.numberOfIdentifiedArticles = props.numberOfIdentifiedArticles;
    if (props.numberOfIdentifiedTerms !== null)
      this.numberOfIdentifiedTerms = props.numberOfIdentifiedTerms;
    if (props.numberOfIdentifiedArticles !== null)
      this.numberOfIdentifiedArticles = props.numberOfIdentifiedArticles;
    if (props.attachments) this.attachments = props.attachments;
  }
}
