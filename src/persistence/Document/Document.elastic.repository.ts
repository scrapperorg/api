import { inject, injectable } from 'inversify';
import { Client as ElasticSearchClient } from '@elastic/elasticsearch';
import { IElasticDocumentRepository, IElasticDocument } from '@domain/Document';
import { TYPES } from '@server/types';

@injectable()
export class DocumentElasticRepository implements IElasticDocumentRepository {
  private indexName = 'post-ocr-document';
  constructor(
    @inject(TYPES.ELASTIC_SEARCH_CONNECTION) private readonly elasticClient: ElasticSearchClient,
  ) {}

  async indexOrUpdate(id: string, dto: IElasticDocument): Promise<void> {
    const documentExists = await this.elasticClient.exists({
      index: this.indexName,
      id,
    });

    if (documentExists) {
      await this.elasticClient.update({
        index: this.indexName,
        id,
        doc: {
          post_ocr_content: dto.post_ocr_content,
        },
      });
    } else {
      await this.elasticClient.index({
        index: this.indexName,
        id,
        document: dto,
      });
    }
  }
}
