export interface IDocumentPersistenceDTO {
  title: string;
  project: string; // todo: replace with project_id
  identificator: string;
  publicationDate: Date;
  source: string; // maybe replace with source entity?
  status?: string; // todo: status enum
  assignedUser?: string; // replace with uuid after change on user id
  deadline?: Date;
  originalFormat?: string;
  numberOfPages?: number;
  textInterpretationPrecision?: number;
  numberOfIdentifiedArticles?: number;
  numberOfIdentifiedTerms?: number;
  attachments?: string[]; // todo: replace with uuid[] after Attachement creation
}
