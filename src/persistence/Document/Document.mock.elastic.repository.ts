import { injectable } from 'inversify';
import { Document, IElasticDocument, IElasticDocumentRepository } from '@domain/Document';

@injectable()
export class DocumentMockElasticRepository implements IElasticDocumentRepository {
  private elasticDocuments: IElasticDocument[] = [
    {
      assigned_user_id: '1',
      publication_date: '',
      identifier: '1',
      updated_at: '',
      title: 'title',
      project_id: 'id',
      created_at: '',
      id: 'id',
      status: 'nou',
      source: '',
    },
  ];

  async search(query: Partial<Document>) {
    return this.elasticDocuments;
  }
}
