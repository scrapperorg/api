import { Role, User } from '@domain/User/User';
import { Collection, OptionalProps } from '@mikro-orm/core';
import { BaseEntity } from '../BaseEntity/BaseEntity';
import { Attachment } from '@domain/Attachment';

export enum Status {
  NOU = 'nou',
  IN_ANALIZA = 'in_analiza',
  REVIZUIT = 'revizuit',
}

export enum ProcessingStatus {
  created = 'created',
  downloaded = 'downloaded',
  unable_to_download = 'unable_to_download',
  locked = 'locked',
  ocr_in_progress = 'ocr_in_progress',
  ocr_done = 'ocr_done',
  ocr_failed = 'ocr_failed',
}

export enum Source {
  CAMERA_DEPUTATILOR = 'camera_deputatilor',
  SENAT = 'senat',
  GUVERN = 'guvern',
  MINISTERUL_DEZVOLTARII = 'mdezvoltarii',
  MINISTERUL_FINANTELOR = 'mfinante',
  MINISTERUL_EDUCATIEI = 'meducatiei',
  MINISTERUL_MEDIU = 'mmediu',
  MINISTERUL_TRANSPORT = 'mtransport',
}

export enum Decision {
  FARA_CONCLUZIE = 'fara_concluzie',
  CONTRAVINE_LEGISLATIEI = 'contravine_legislatiei',
  ADERA_LEGISLATIEI = 'adera_legislatiei',
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
  decision?: Decision;
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
  highlightFile?: string;
  highlightMetadata?: string;
}

export class Document extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | 'isRulesBreaker' | 'attachments';

  title: string;
  project: string;
  identifier: string;
  publicationDate: Date;
  source: Source;
  status: Status;
  decision?: Decision;
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
  highlightFile?: string;
  highlightMetadata?: string;

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
    if (props.decision !== null) this.decision = props.decision;
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
    if (props.highlightFile !== null) this.highlightFile = props.highlightFile;
    if (props.highlightMetadata !== null) this.highlightMetadata = props.highlightMetadata;
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
