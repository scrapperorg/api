import 'reflect-metadata';
import { Container } from 'inversify';
import { Application } from 'express';
import { DiContainer } from './config/DiContainer';
import { DatabaseClient } from './config/DatabaseClient';
import { App } from './config/App';

export async function configServer(isTestServer = false) {
  const diContainer = new DiContainer();
  let container: Container;
  if (isTestServer) {
    process.env.MOCK = 'true';
    container = diContainer.configure();
  } else {
    const databaseClient = new DatabaseClient();
    container = await diContainer.init(databaseClient);
  }

  const app: Application = new App(container).app;
  return {
    app,
    container,
  };
}
