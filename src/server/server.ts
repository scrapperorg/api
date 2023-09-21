import 'reflect-metadata';
import { Container } from 'inversify';
import { Application } from 'express';
import { Pool } from 'pg';
import { DiContainer } from './config/DiContainer';
import { DatabaseClient } from './config/DatabaseClient';
import { App } from './config/App';
import { ElasticClient } from './config/ElasticClient';
import { JobSchedulerClient } from './config/JobSchedulerClient';

export async function configServer(isTestServer = false) {
  const diContainer = new DiContainer();
  let container: Container;
  if (isTestServer) {
    process.env.MOCK = 'true';
    container = diContainer.configure();
  } else {
    const pgConfig = {
      database: process.env.MIKRO_ORM_DB_NAME,
      user: process.env.MIKRO_ORM_USER,
      password: process.env.MIKRO_ORM_PASSWORD,
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.MIKRO_ORM_PORT ?? '5432'),
      type: 'postgresql',
    };

    const pgPool = new Pool({
      ...pgConfig,
      max: 10, // Maximum number of connections in the pool
      idleTimeoutMillis: 30000, // Time a connection is allowed to remain idle (30 seconds)
    });

    const databaseClient = new DatabaseClient();
    const elasticClient = ElasticClient.connect();
    const jobSchedulerClient = JobSchedulerClient.connect(pgConfig);

    container = await diContainer.init(databaseClient, elasticClient, jobSchedulerClient);
  }

  const app: Application = new App(container).app;
  return {
    app,
    container,
  };
}
