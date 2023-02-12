import { Client } from '@elastic/elasticsearch';

export class ElasticClient {
  constructor() {
    if (process.env.ELASTIC_PASSWORD === undefined)
      throw new Error('cant connect to elastic search');

    const elasticConfigs = {
      node: `http://${process.env.LOCAL_INTERNAL_HOST}:9200`,
      auth: {
        username: 'elastic',
        password: process.env.ELASTIC_PASSWORD,
      },
    };

    return new Client(elasticConfigs);
  }
}
