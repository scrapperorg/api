import { Role, User } from '@domain/User/User';
import { Collection, OptionalProps } from '@mikro-orm/core';
import { BaseEntity } from '../BaseEntity/BaseEntity';
import { Attachment } from '@domain/Attachment';

export enum Status {
  NOU = 'nou',
  IN_ANALIZA = 'in analiza',
  REVIZUIT = 'revizuit',
}

export enum ProcessingStatus {
  downloaded = 'downloaded',
  'locked' = 'locked',
  'ocr_in_progress' = 'ocr_in_progress',
  'ocr_done' = 'ocr_done',
  'ocr_failed' = 'ocr_failed',
  'failed' = 'failed',
}

export enum Source {
  CAMERA_DEPUTATILOR = 'camera_deputatilor',
  SENAT = 'senat',
  GUVERN = 'guvern',
}

export interface IDocumentProps {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  title: string;
  project: string;
  identifier: string;
  publicationDate: Date;
  source: Source;
  status: Status;
  link?: string;
  isRulesBreaker?: boolean;
  assignedUser?: string;
  deadline?: Date;
  originalFormat?: string;
  numberOfPages?: number;
  textInterpretationPrecision?: number;
  numberOfIdentifiedArticles?: number;
  numberOfIdentifiedTerms?: number;
  attachments?: Collection<Attachment>;
  postOcrContent?: string;
  processingStatus?: ProcessingStatus;
  part?: number;
  totalParts?: number;
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
  link?: string;
  storagePath?: string;
  originalFormat?: string;
  numberOfPages?: number;
  textInterpretationPrecision?: number;
  numberOfIdentifiedArticles?: number;
  numberOfIdentifiedTerms?: number;
  attachments?: Collection<Attachment>;
  postOcrContent?: string;
  processingStatus?: ProcessingStatus = ProcessingStatus.downloaded;
  part?: number;
  totalParts?: number;

  constructor(props: IDocumentProps) {
    super({
      id: props.id,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
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
    if (props.postOcrContent !== null) this.postOcrContent = props.postOcrContent;
    if (props.processingStatus !== null) this.processingStatus = props.processingStatus;
  }

  addAttachment(attachment: Attachment): void {
    if (this.attachments) {
      this.attachments.add(attachment);
    } else {
      // TODO change this to not be collection
      this.attachments = new Collection<Attachment>(attachment);
    }
  }

  /**
   * Assign responsible on a document.
   * The assigner is required to be at least a LSE or LSS as per specification.
   * This is verified at the controller level.
   *
   * The asignee is a LSS or LSE as per current specification.
   * This is a domain constraint enforced here.
   *
   * @param user
   */
  assignResponsible(user: User): void {
    if (user.role !== Role.LSS && user.role !== Role.LSE)
      throw new Error('user to be assigned does not have the required LSS or LSE role');

    this.assignedUser = user.id;
  }
}
