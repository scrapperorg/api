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
    const postOcrContentQuery = this.computePostOcrContentQuery(query.postOcrContent);
    const titleQuery = this.computeTitleQuery(query.title);

    const criterion: QueryDslQueryContainer[] = [];

    if (postOcrContentQuery !== undefined) criterion.push(postOcrContentQuery);
    if (titleQuery !== undefined) criterion.push(titleQuery);

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

  private computePostOcrContentQuery(
    queryParam: string | undefined,
  ): QueryDslQueryContainer | undefined {
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

  private computeTitleQuery(queryParam: string | undefined): QueryDslQueryContainer | undefined {
    if (queryParam === undefined) return undefined;

    const elasticQuery = {
      match: {
        title: queryParam,
      },
    };

    return elasticQuery;
  }
}
