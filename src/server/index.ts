import { Application } from 'express';
import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DiContainer } from './config/DiContainer';
import { DatabaseClient } from './config/DatabaseClient';
import { Container } from 'inversify';
import { App } from './config/App';

dotenv.config();

export class Server {
  public app: Application | null = null;
  constructor() {
    const databaseClient = new DatabaseClient();
    const diContainer = new DiContainer({ databaseClient });
    diContainer.init().then((container: Container) => {
      this.app = new App(container).app;
    });
  }
}

new Server();
