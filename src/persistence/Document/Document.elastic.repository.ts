import { inject, injectable } from 'inversify';
import { Client as ElasticSearchClient } from '@elastic/elasticsearch';
import { Document, IElasticDocument, IElasticDocumentRepository } from '@domain/Document';
import { TYPES } from '@server/types';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';

@injectable()
export class DocumentElasticRepository implements IElasticDocumentRepository {
  private indexName = 'documents';
  constructor(
    @inject(TYPES.ELASTIC_SEARCH_CONNECTION) private readonly elasticClient: ElasticSearchClient,
  ) {}

  async search(query: Partial<Document>) {
    const postOcrContentQuery = this.computePostOcrContectQuery(query.postOcrContent);
    const titleQuery = this.computeTitleQuery(query.title);

    const criterion: QueryDslQueryContainer[] = [];

    if (postOcrContentQuery !== undefined) Object.assign(criterion, { ...postOcrContentQuery });
    if (titleQuery !== undefined) Object.assign(criterion, { ...titleQuery });

    const result = await this.elasticClient.search({
      index: this.indexName,
      query: {
        bool: {
          must: criterion,
        },
      },
    });

    const documents: IElasticDocument[] = result.hits.hits.map(
      (hit) => <IElasticDocument>hit._source,
    );
    return documents;
  }

  private computePostOcrContectQuery(queryParam: string | undefined) {
    if (queryParam === undefined) return undefined;

    const elasticQuery = {
      match: {
        post_ocr_content: {
          query: queryParam,
          fuzziness: 'auto',
        },
      },
    };

    return elasticQuery;
  }

  private computeTitleQuery(queryParam: string | undefined) {
    if (queryParam === undefined) return undefined;

    const elasticQuery = {
      match: {
        title: queryParam,
      },
    };

    return elasticQuery;
  }
}
