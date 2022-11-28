import 'reflect-metadata';
import { Container } from 'inversify';
import { Application } from 'express';
import { DiContainer } from './config/DiContainer';
import { DatabaseClient } from './config/DatabaseClient';
import { App } from './config/App';
import { ConfigService } from './config/ConfigService';

export async function configServer(isTestServer = false) {
  const configService = new ConfigService();

  try {
    configService.loadVars(isTestServer ? { MOCK: true } : {});
  } catch (err: any) {
    console.log('Could not start server', err.message);
  }

  const diContainer = new DiContainer(configService);
  let container: Container;
  if (isTestServer) {
    container = diContainer.configure();
  } else {
    const databaseClient = new DatabaseClient();
    container = await diContainer.init(databaseClient);
  }

  const app: Application = new App(container, configService).app;
  return {
    app,
    container,
    port: configService.getVar<number>('PORT'),
  };
}
