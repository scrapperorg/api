import { UserController, AuthContoller } from '@controllers';
import { Container } from 'inversify';
import { RequestContext, MikroORM, IDatabaseDriver, Connection } from '@mikro-orm/core';
import bodyParser from 'body-parser';
import express, { Express, NextFunction } from 'express';
import { TYPES } from '../types';
import cors from 'cors';
import { ConfigService } from './ConfigService';

export class App {
  public app: Express;

  constructor(
    private readonly container: Container,
    private readonly configService: ConfigService,
  ) {
    this.app = express();
    this.container = container;
    this.middleware();
    this.setRoutes();
  }

  private middleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(bodyParser.json());
    this.app.use((_req, _res, next: NextFunction): void => {
      if (this.configService.getVar('MOCK')) return next();
      const connection = this.container.get<MikroORM<IDatabaseDriver<Connection>>>(
        TYPES.DATABASE_CONNECTION,
      );
      RequestContext.create(connection.em, next);
    });
  }

  private setRoutes(): void {
    this.app.use('/', this.container.get<AuthContoller>(TYPES.AUTH_CONTROLLER).router);
    this.app.use('/user', this.container.get<UserController>(TYPES.USER_CONTROLLER).router);
  }
}
