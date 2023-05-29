import {
  UserController,
  AuthController,
  RobotController,
  DocumentController,
  ProjectController,
  NotificationController,
  AttachmentController,
  KeywordController,
  PresentationController,
} from '@controllers';
import { Container } from 'inversify';
import { RequestContext, MikroORM, IDatabaseDriver, Connection } from '@mikro-orm/core';
import bodyParser from 'body-parser';
import express, { Express, NextFunction } from 'express';
import { TYPES } from '../types';
import cors from 'cors';

export class App {
  public app: Express;
  private container: Container;

  constructor(container: Container) {
    this.app = express();
    this.container = container;
    this.middleware();
    this.setRoutes();
  }

  private middleware(): void {
    this.app.use(
      cors({
        exposedHeaders: ['Content-Disposition'],
      }),
    );
    this.app.use(express.json());
    this.app.use(bodyParser.json());
    this.app.use((_req, _res, next: NextFunction): void => {
      if (process.env.MOCK === 'true') return next();
      const connection = this.container.get<MikroORM<IDatabaseDriver<Connection>>>(
        TYPES.DATABASE_CONNECTION,
      );
      RequestContext.create(connection.em, next);
    });
  }

  private setRoutes(): void {
    this.app.use('/', this.container.get<AuthController>(TYPES.AUTH_CONTROLLER).router);
    this.app.use('/user', this.container.get<UserController>(TYPES.USER_CONTROLLER).router);
    this.app.use(
      '/document',
      this.container.get<DocumentController>(TYPES.DOCUMENT_CONTROLLER).router,
    );
    this.app.use(
      '/project',
      this.container.get<ProjectController>(TYPES.PROJECT_CONTROLLER).router,
    );
    this.app.use(
      '/attachment',
      this.container.get<AttachmentController>(TYPES.ATTACHMENT_CONTROLLER).router,
    );
    this.app.use('/robot', this.container.get<RobotController>(TYPES.ROBOT_CONTROLLER).router);
    this.app.use(
      '/keyword',
      this.container.get<KeywordController>(TYPES.KEYWORD_CONTROLLER).router,
    );
    this.app.use(
      '/presentation',
      this.container.get<PresentationController>(TYPES.PRESENTATION_CONTROLLER).router,
    );
    this.app.use(
      '/notification',
      this.container.get<NotificationController>(TYPES.NOTIFICATION_CONTROLLER).router,
    );
  }
}
