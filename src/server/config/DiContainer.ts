import { AsyncContainerModule, Container } from 'inversify';
import { MikroORM, IDatabaseDriver, Connection } from '@mikro-orm/core';

import { DatabaseClient } from './DatabaseClient';
import { TYPES } from '../types';

import {
  EmailService,
  AuthService,
  UserService,
  DocumentService,
  EncryptionService,
  ProjectService,
} from '@services';

import {
  IResetPasswordTokenRepository,
  IUserRepository,
  IDocumentRepository,
  IProjectRepository,
} from '@domain';

import {
  UserRepository,
  UserMockRepository,
  ResetPasswordTokenRepository,
  ResetPasswordTokenTestRepository,
  DocumentRepository,
  DocumentMockRepository,
  ProjectRepository,
  ProjectMockRepository,
} from '@persistence';

import { AuthContoller, UserController, DocumentController, ProjectController } from '@controllers';

import { ResetPasswordTokenMap, DocumentMap, UserMap, ProjectMap } from '@mappers';

export class DiContainer {
  private diContainer: Container;
  private databaseClient?: DatabaseClient;

  constructor() {
    this.diContainer = new Container();
  }

  public async init(databaseClient: DatabaseClient): Promise<Container> {
    this.databaseClient = databaseClient;
    await this.diContainer.loadAsync(this.getBindings());
    return this.diContainer;
  }

  private getBindings() {
    return new AsyncContainerModule(async (bind): Promise<void> => {
      if (!this.databaseClient) return;
      const connection = await this.databaseClient.connect();
      if (connection) {
        await connection.getMigrator().up();
        bind<MikroORM<IDatabaseDriver<Connection>>>(TYPES.DATABASE_CONNECTION).toConstantValue(
          connection,
        );
        this.configure();
      }
    });
  }

  public configure() {
    // mappers
    this.diContainer.bind<UserMap>(TYPES.USER_MAP).to(UserMap).inSingletonScope();
    this.diContainer
      .bind<ResetPasswordTokenMap>(TYPES.RESET_PASSWORD_TOKEN_MAP)
      .to(ResetPasswordTokenMap).inSingletonScope;
    this.diContainer.bind<DocumentMap>(TYPES.DOCUMENT_MAP).to(DocumentMap).inSingletonScope;
    this.diContainer.bind<ProjectMap>(TYPES.PROJECT_MAP).to(ProjectMap).inSingletonScope;

    // repositories
    if (process.env.MOCK === 'true') {
      this.configureMockRepositories();
    } else {
      this.configureRepositories();
    }

    // services
    this.diContainer.bind<UserService>(TYPES.USER_SERVICE).to(UserService).inSingletonScope;
    this.diContainer.bind<AuthService>(TYPES.AUTH_SERVICE).to(AuthService).inSingletonScope;
    this.diContainer.bind<EmailService>(TYPES.EMAIL_SERVICE).to(EmailService).inSingletonScope;
    this.diContainer.bind<EncryptionService>(TYPES.ENCRYPTION_SERVICE).to(EncryptionService)
      .inSingletonScope;
    this.diContainer.bind<DocumentService>(TYPES.DOCUMENT_SERVICE).to(DocumentService);
    this.diContainer.bind<ProjectService>(TYPES.PROJECT_SERVICE).to(ProjectService);

    // controllers
    this.diContainer.bind<UserController>(TYPES.USER_CONTROLLER).to(UserController)
      .inSingletonScope;
    this.diContainer.bind<AuthContoller>(TYPES.AUTH_CONTROLLER).to(AuthContoller).inSingletonScope;
    this.diContainer.bind<DocumentController>(TYPES.DOCUMENT_CONTROLLER).to(DocumentController)
      .inSingletonScope;
    this.diContainer.bind<ProjectController>(TYPES.PROJECT_CONTROLLER).to(ProjectController)
      .inSingletonScope;

    return this.diContainer;
  }

  public configureRepositories() {
    this.diContainer
      .bind<IUserRepository>(TYPES.USER_REPOSITORY)
      .to(UserRepository)
      .inSingletonScope();

    this.diContainer
      .bind<IResetPasswordTokenRepository>(TYPES.RESET_PASSWORD_TOKEN_REPOSITORY)
      .to(ResetPasswordTokenRepository)
      .inSingletonScope();

    this.diContainer
      .bind<IDocumentRepository>(TYPES.DOCUMENT_REPOSITORY)
      .to(DocumentRepository)
      .inSingletonScope();

    this.diContainer
      .bind<IProjectRepository>(TYPES.PROJECT_REPOSITORY)
      .to(ProjectRepository)
      .inSingletonScope();
  }

  public configureMockRepositories() {
    this.diContainer
      .bind<IUserRepository>(TYPES.USER_REPOSITORY)
      .to(UserMockRepository)
      .inSingletonScope();

    this.diContainer
      .bind<IResetPasswordTokenRepository>(TYPES.RESET_PASSWORD_TOKEN_REPOSITORY)
      .to(ResetPasswordTokenTestRepository)
      .inSingletonScope();

    this.diContainer
      .bind<IDocumentRepository>(TYPES.DOCUMENT_REPOSITORY)
      .to(DocumentMockRepository)
      .inSingletonScope();

    this.diContainer
      .bind<IProjectRepository>(TYPES.PROJECT_REPOSITORY)
      .to(ProjectMockRepository)
      .inSingletonScope();
  }
}
