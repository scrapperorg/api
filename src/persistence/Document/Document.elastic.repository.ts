import { inject, injectable } from 'inversify';
import { Client as ElasticSearchClient } from '@elastic/elasticsearch';
import { ElasticSearchProps, IElasticDocument, IElasticDocumentRepository } from '@domain/Document';
import { TYPES } from '@server/types';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';

enum RangeOperator {
  GREATER_THAN = 'gte',
  LESS_THAN = 'lte',
}

@injectable()
export class DocumentElasticRepository implements IElasticDocumentRepository {
  private indexName = 'documents';
  constructor(
    @inject(TYPES.ELASTIC_SEARCH_CONNECTION) private readonly elasticClient: ElasticSearchClient,
  ) {}

  async search(query: ElasticSearchProps) {
    const postOcrContentQuery = this.computeFuzyQuery('post_ocr_content', query.postOcrContent);
    const titleQuery = this.computeFuzyQuery('title', query.title);
    const identificatorQuery = this.computeExactMatch('identifier', query.identificator);
    const sourceQuery = this.computeExactMatch('source', query.source);
    const statusQuery = this.computeExactMatch('status', query.status);
    const assignedUserIdQuery = this.computeExactMatch('assigned_user_id', query.assignedUserId);
    const projectIdQuery = this.computeExactMatch('project_id', query.projectId);
    const isRulesBreakerQuery = this.computeFuzyQuery(
      'is_rules_breaker',
      query.isRulesBreaker,
      true,
    );
    const publishedAfterQuery = this.computeRangeQuery(
      'publication_date',
      RangeOperator.GREATER_THAN,
      query.publishedAfter,
    );

    const publishedBeforeQuery = this.computeRangeQuery(
      'publication_date',
      RangeOperator.LESS_THAN,
      query.publishedBefore,
    );

    const criterion: QueryDslQueryContainer[] = [];

    if (postOcrContentQuery) criterion.push(postOcrContentQuery);
    if (titleQuery) criterion.push(titleQuery);
    if (identificatorQuery) criterion.push(identificatorQuery);
    if (sourceQuery) criterion.push(sourceQuery);
    if (statusQuery) criterion.push(statusQuery);
    if (assignedUserIdQuery) criterion.push(assignedUserIdQuery);
    if (projectIdQuery) criterion.push(projectIdQuery);
    if (isRulesBreakerQuery) criterion.push(isRulesBreakerQuery);
    if (publishedAfterQuery) criterion.push(publishedAfterQuery);
    if (publishedBeforeQuery) criterion.push(publishedBeforeQuery);

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

  private computeFuzyQuery(
    key: string,
    value: string | boolean | undefined,
    isBoolean = false,
  ): QueryDslQueryContainer | undefined {
    if (value === undefined) return undefined;

    const elasticQuery = {
      match: {
        [key]: {
          query: value,
          ...(!isBoolean && { fuzziness: 'auto' }),
        },
      },
    };

    return elasticQuery;
  }

  private computeExactMatch(
    key: string,
    value: string | boolean | undefined,
  ): QueryDslQueryContainer | undefined {
    if (value === undefined) return undefined;

    const keyword = `${key}.keyword`;

    const elasticQuery = {
      term: {
        [keyword]: {
          value,
        },
      },
    };

    return elasticQuery;
  }

  private computeRangeQuery(key: string, operator: RangeOperator, value: string | undefined) {
    if (value === undefined) return undefined;

    const elasticQuery = {
      range: {
        [key]: {
          [operator]: new Date(value).toISOString(),
        },
      },
    };

    return elasticQuery;
  }
}
