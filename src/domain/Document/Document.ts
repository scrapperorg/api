export enum Status {
  NOU = 'nou',
  IN_ANALIZA = 'in analiza',
  REVIZUIT = 'revizuit',
}

export interface IDocumentProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  project: string;
  identificator: string;
  publicationDate: Date;
  source: string;
  status: Status;
  assignedUser: string | null;
  deadline: Date | null;
  originalFormat: string | null;
  numberOfPages: number | null;
  textInterpretationPrecision: number | null;
  numberOfIdentifiedArticles: number | null;
  numberOfIdentifiedTerms: number | null;
  attachments: string[];
}

export class Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  project: string;
  identificator: string;
  publicationDate: Date;
  source: string;
  status: Status;
  assignedUser: string | null;
  deadline: Date | null;
  originalFormat: string | null;
  numberOfPages: number | null;
  textInterpretationPrecision: number | null;
  numberOfIdentifiedArticles: number | null;
  numberOfIdentifiedTerms: number | null;
  attachments: string[];

  private constructor(props: IDocumentProps) {
    this.id = props.id;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.title = props.title;
    this.project = props.project;
    this.identificator = props.identificator;
    this.publicationDate = props.publicationDate;
    this.source = props.source;
    this.status = props.status;
    this.assignedUser = props.assignedUser;
    this.deadline = props.deadline;
    this.originalFormat = props.originalFormat;
    this.numberOfPages = props.numberOfPages;
    this.textInterpretationPrecision = props.textInterpretationPrecision;
    this.numberOfIdentifiedArticles = props.numberOfIdentifiedArticles;
    this.numberOfIdentifiedTerms = props.numberOfIdentifiedTerms;
    this.attachments = props.attachments;
  }

  public static create(props: IDocumentProps) {
    return new Document(props);
  }
}
