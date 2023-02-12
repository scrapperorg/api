import 'reflect-metadata';
import { Container } from 'inversify';
import { Application } from 'express';
import { DiContainer } from './config/DiContainer';
import { DatabaseClient } from './config/DatabaseClient';
import { App } from './config/App';
import { ElasticClient } from './config/ElasticClient';

export async function configServer(isTestServer = false) {
  const diContainer = new DiContainer();
  let container: Container;
  if (isTestServer) {
    process.env.MOCK = 'true';
    container = diContainer.configure();
  } else {
    const databaseClient = new DatabaseClient();
    const elasticClient = new ElasticClient();
    container = await diContainer.init(databaseClient, elasticClient);
  }

  const app: Application = new App(container).app;
  return {
    app,
    container,
  };
}
