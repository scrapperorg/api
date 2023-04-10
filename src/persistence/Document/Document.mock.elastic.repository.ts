import { injectable } from 'inversify';
import { Document, IElasticDocument, IElasticDocumentRepository } from '@domain/Document';

@injectable()
export class DocumentMockElasticRepository implements IElasticDocumentRepository {
  private elasticDocuments: IElasticDocument[] = [
    {
      assigned_user_id: '1',
      publication_date: '',
      identifier: '1',
      title: 'title',
      document_id: 'id',
      status: 'nou',
      source: '',
      processing_status: '',
    },
  ];

  async search(query: Partial<Document>) {
    return this.elasticDocuments;
  }
}
