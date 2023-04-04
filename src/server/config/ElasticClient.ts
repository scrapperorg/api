import { Client } from '@elastic/elasticsearch';

export class ElasticClient {
  static connect(): Client {
    if (process.env.ELASTIC_PASSWORD === undefined)
      throw new Error('cant connect to elastic search');

    const elasticConfigs = {
      node: `http://0.0.0.0:9200`,
      auth: {
        username: 'elastic',
        password: process.env.ELASTIC_PASSWORD,
      },
    };

    return new Client(elasticConfigs);
  }
}
