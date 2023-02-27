export interface IElasticDocument {
  assigned_user_id?: string;
  publication_date: string;
  deadline?: string;
  is_rules_breaker?: boolean;
  number_of_identified_terms?: number;
  number_of_identified_articles?: number;
  post_ocr_content?: string;
  text_interpretation_precision?: number;
  identifier: string;
  updated_at: string;
  number_of_pages?: number;
  title: string;
  link?: string;
  project_id: string;
  created_at: string;
  id: string;
  status: string;
  original_format?: string;
  source: string;
}

export interface ElasticSearchProps {
  identificator?: string;
  title?: string;
  source?: string;
  status?: string;
  assignedUserId?: string;
  projectId?: string;
  publishedAfter?: string;
  publishedBefore?: string;
  postOcrContent?: string;
  isRulesBreaker?: boolean;
}

export interface IElasticDocumentRepository {
  search(query: ElasticSearchProps): Promise<IElasticDocument[]>;
}
