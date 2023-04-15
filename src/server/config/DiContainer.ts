import { AsyncContainerModule, Container } from 'inversify';
import { MikroORM, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { Client as ElasticSearchClient } from '@elastic/elasticsearch';

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
  IAttachmentRepository,
  IElasticDocumentRepository,
  IElasticProjectRepository,
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
  AttachmentRepository,
  AttachmentMockRepository,
  DocumentElasticRepository,
  DocumentMockElasticRepository,
  ProjectElasticRepository,
  ProjectMockElasticRepository,
} from '@persistence';

import {
  AuthController,
  UserController,
  DocumentController,
  ProjectController,
  RobotController,
} from '@controllers';

import { ResetPasswordTokenMap, DocumentMap, UserMap, ProjectMap } from '@mappers';
import { FileRepositoryService } from '@services/FileRepository.service';
import { AttachmentMap } from '@mappers/Attachment.map';
import { AttachmentService } from '@services/Attachment.service';
import { AttachmentController } from '@controllers/validationSchemas/attachment.controller';
import { IRobotRepository } from '@domain/Robot';
import { RobotRepository } from '@persistence/Robot';
import { RobotService } from '@services/Robot.service';
import { RobotMap } from '@mappers/Robot.map';

export class DiContainer {
  private readonly diContainer: Container;
  private databaseClient?: DatabaseClient;
  private elasticClient?: ElasticSearchClient;

  constructor() {
    this.diContainer = new Container();
  }

  public async init(
    databaseClient: DatabaseClient,
    elasticClient: ElasticSearchClient,
  ): Promise<Container> {
    this.elasticClient = elasticClient;
    this.databaseClient = databaseClient;
    await this.diContainer.loadAsync(this.getBindings());
    return this.diContainer;
  }

  private getBindings() {
    return new AsyncContainerModule(async (bind): Promise<void> => {
      if (!this.databaseClient) throw new Error('no database client configured');
      if (!this.elasticClient) throw new Error('no elastic search client configured');
      const connection = await this.databaseClient.connect();
      if (connection) {
        await connection.getMigrator().up();
        bind<MikroORM<IDatabaseDriver<Connection>>>(TYPES.DATABASE_CONNECTION).toConstantValue(
          connection,
        );
        this.configure();
      }

      bind<ElasticSearchClient>(TYPES.ELASTIC_SEARCH_CONNECTION).toConstantValue(
        this.elasticClient,
      );
    });
  }

  public configure() {
    // mappers
    this.diContainer.bind<UserMap>(TYPES.USER_MAP).to(UserMap).inSingletonScope();
    this.diContainer
      .bind<ResetPasswordTokenMap>(TYPES.RESET_PASSWORD_TOKEN_MAP)
      .to(ResetPasswordTokenMap)
      .inSingletonScope();
    this.diContainer.bind<DocumentMap>(TYPES.DOCUMENT_MAP).to(DocumentMap).inSingletonScope();
    this.diContainer.bind<ProjectMap>(TYPES.PROJECT_MAP).to(ProjectMap).inSingletonScope();
    this.diContainer.bind<AttachmentMap>(TYPES.ATTACHMENT_MAP).to(AttachmentMap).inSingletonScope();
    this.diContainer.bind<RobotMap>(TYPES.ROBOT_MAP).to(RobotMap).inSingletonScope();

    // repositories
    if (process.env.MOCK === 'true') {
      this.configureMockRepositories();
    } else {
      this.configureRepositories();
    }

    // services
    this.diContainer.bind<UserService>(TYPES.USER_SERVICE).to(UserService).inSingletonScope();
    this.diContainer.bind<AuthService>(TYPES.AUTH_SERVICE).to(AuthService).inSingletonScope();
    this.diContainer.bind<EmailService>(TYPES.EMAIL_SERVICE).to(EmailService).inSingletonScope();
    this.diContainer
      .bind<EncryptionService>(TYPES.ENCRYPTION_SERVICE)
      .to(EncryptionService)
      .inSingletonScope();
    this.diContainer.bind<DocumentService>(TYPES.DOCUMENT_SERVICE).to(DocumentService);
    this.diContainer.bind<ProjectService>(TYPES.PROJECT_SERVICE).to(ProjectService);
    this.diContainer.bind<RobotService>(TYPES.ROBOT_SERVICE).to(RobotService);
    this.diContainer
      .bind<FileRepositoryService>(TYPES.FILE_REPOSITORY_SERVICE)
      .to(FileRepositoryService)
      .inSingletonScope();
    this.diContainer
      .bind<AttachmentService>(TYPES.ATTACHMENT_SERVICE)
      .to(AttachmentService)
      .inSingletonScope();

    // controllers
    this.diContainer
      .bind<UserController>(TYPES.USER_CONTROLLER)
      .to(UserController)
      .inSingletonScope();
    this.diContainer
      .bind<AuthController>(TYPES.AUTH_CONTROLLER)
      .to(AuthController)
      .inSingletonScope();
    this.diContainer
      .bind<DocumentController>(TYPES.DOCUMENT_CONTROLLER)
      .to(DocumentController)
      .inSingletonScope();
    this.diContainer
      .bind<ProjectController>(TYPES.PROJECT_CONTROLLER)
      .to(ProjectController)
      .inSingletonScope();
    this.diContainer
      .bind<AttachmentController>(TYPES.ATTACHMENT_CONTROLLER)
      .to(AttachmentController)
      .inSingletonScope();
    this.diContainer
      .bind<RobotController>(TYPES.ROBOT_CONTROLLER)
      .to(RobotController)
      .inSingletonScope();

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

    this.diContainer
      .bind<IAttachmentRepository>(TYPES.ATTACHMENT_REPOSITORY)
      .to(AttachmentRepository)
      .inSingletonScope();

    this.diContainer
      .bind<IRobotRepository>(TYPES.ROBOT_REPOSITORY)
      .to(RobotRepository)
      .inSingletonScope();

    this.diContainer
      .bind<IElasticDocumentRepository>(TYPES.DOCUMENT_ELASTIC_REPOSITORY)
      .to(DocumentElasticRepository)
      .inSingletonScope();

    this.diContainer
      .bind<IElasticProjectRepository>(TYPES.PROJECT_ELASTIC_REPOSITORY)
      .to(ProjectElasticRepository)
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

    this.diContainer
      .bind<IAttachmentRepository>(TYPES.ATTACHMENT_REPOSITORY)
      .to(AttachmentMockRepository)
      .inSingletonScope();

    this.diContainer
      .bind<IElasticDocumentRepository>(TYPES.DOCUMENT_ELASTIC_REPOSITORY)
      .to(DocumentMockElasticRepository)
      .inSingletonScope();

    this.diContainer
      .bind<IElasticProjectRepository>(TYPES.PROJECT_ELASTIC_REPOSITORY)
      .to(ProjectMockElasticRepository)
      .inSingletonScope();
  }
}
