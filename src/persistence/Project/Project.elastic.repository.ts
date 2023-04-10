import { inject, injectable } from 'inversify';
import { Client as ElasticSearchClient } from '@elastic/elasticsearch';
import { TYPES } from '@server/types';
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import {
  ProjectElasticSearchProps,
  IElasticProject,
  IElasticProjectRepository,
} from '@domain/Project';

enum RangeOperator {
  GREATER_THAN = 'gte',
  LESS_THAN = 'lte',
}

@injectable()
export class ProjectElasticRepository implements IElasticProjectRepository {
  private indexName = 'project';
  constructor(
    @inject(TYPES.ELASTIC_SEARCH_CONNECTION) private readonly elasticClient: ElasticSearchClient,
  ) {}

  async search(query: ProjectElasticSearchProps) {
    const titleQuery = this.computeFuzyQuery('title', query.title);
    const presentsInterestQuery = this.computeFuzyQuery(
      'presents_interest',
      query.presentsInterest,
      true,
    );
    const createdAfterQuery = this.computeRangeQuery(
      'created_at',
      RangeOperator.GREATER_THAN,
      query.createdAfter,
    );

    const createdBeforeQuery = this.computeRangeQuery(
      'created_at',
      RangeOperator.LESS_THAN,
      query.createdBefore,
    );

    const criterion: QueryDslQueryContainer[] = [];

    if (titleQuery) criterion.push(titleQuery);
    if (presentsInterestQuery) criterion.push(presentsInterestQuery);
    if (createdAfterQuery) criterion.push(createdAfterQuery);
    if (createdBeforeQuery) criterion.push(createdBeforeQuery);

    const result = await this.elasticClient.search({
      index: this.indexName,
      size: 25,
      query: {
        bool: {
          must: criterion,
        },
      },
    });

    const projects: IElasticProject[] = result.hits.hits.map((hit) => <IElasticProject>hit._source);
    return projects;
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
