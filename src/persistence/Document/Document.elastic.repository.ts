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
    const isRulesBreakerQuery = this.computeExactMatch('is_rules_breaker', query.isRulesBreaker);
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

    const exactMatchCriterion: QueryDslQueryContainer[] = [];
    const fuzzyCriterion: QueryDslQueryContainer[] = [];
    const rangeCriterion: QueryDslQueryContainer[] = [];

    if (postOcrContentQuery) fuzzyCriterion.push(postOcrContentQuery);
    if (titleQuery) fuzzyCriterion.push(titleQuery);
    if (identificatorQuery) exactMatchCriterion.push(identificatorQuery);
    if (sourceQuery) exactMatchCriterion.push(sourceQuery);
    if (statusQuery) exactMatchCriterion.push(statusQuery);
    if (assignedUserIdQuery) exactMatchCriterion.push(assignedUserIdQuery);
    if (projectIdQuery) exactMatchCriterion.push(projectIdQuery);
    if (isRulesBreakerQuery) exactMatchCriterion.push(isRulesBreakerQuery);
    if (publishedAfterQuery) rangeCriterion.push(publishedAfterQuery);
    if (publishedBeforeQuery) rangeCriterion.push(publishedBeforeQuery);

    console.log(exactMatchCriterion);

    const result = await this.elasticClient.search({
      index: this.indexName,
      query: {
        bool: {
          must: exactMatchCriterion,
          filter: [...fuzzyCriterion, ...rangeCriterion],
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
    value: string | undefined,
  ): QueryDslQueryContainer | undefined {
    if (value === undefined) return undefined;

    const elasticQuery = {
      match: {
        [key]: {
          query: value,
          fuzziness: 'auto',
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

    const elasticQuery = {
      term: {
        [key]: value,
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
