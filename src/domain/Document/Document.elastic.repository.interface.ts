export interface IElasticDocument {
  id: string;
  identifier: string;
  title: string;
  source: string;
  status: string;
  assigned_user_id?: string;
  publication_date: string;
  post_ocr_content?: string;
  is_rules_breaker?: boolean;
  processing_status: string;
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
