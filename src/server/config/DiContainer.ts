import { AsyncContainerModule, Container } from 'inversify';
import { MikroORM, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { Client as ElasticSearchClient } from '@elastic/elasticsearch';

import { DatabaseClient } from './DatabaseClient';
import { JobSchedulerClient } from './JobSchedulerClient';
import { TYPES } from '../types';

import {
  EmailService,
  AuthService,
  UserService,
  DocumentService,
  EncryptionService,
  ProjectService,
  NotificationService,
  FileRepositoryService,
  AttachmentService,
  RobotService,
  KeywordService,
  PresentationService,
  QueueService,
  IQueueService,
  QueueMockService,
} from '@services';

import {
  IResetPasswordTokenRepository,
  IUserRepository,
  IDocumentRepository,
  IProjectRepository,
  IAttachmentRepository,
  IElasticDocumentRepository,
  IElasticProjectRepository,
  INotificationRepository,
  IRobotRepository,
  IKeywordRepository,
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
  NotificationRepository,
  NotificationMockRepository,
  KeywordMockRepository,
  KeywordRepository,
  RobotRepository,
  RobotMockRepository,
} from '@persistence';

import {
  AuthController,
  UserController,
  DocumentController,
  ProjectController,
  RobotController,
  NotificationController,
  AttachmentController,
  KeywordController,
  PresentationController,
} from '@controllers';

import {
  ResetPasswordTokenMap,
  DocumentMap,
  UserMap,
  ProjectMap,
  AttachmentMap,
  RobotMap,
  KeywordMap,
  NotificationMap,
} from '@mappers';

export class DiContainer {
  private readonly diContainer: Container;
  private databaseClient?: DatabaseClient;
  private elasticClient?: ElasticSearchClient;
  private jobSchedulerClient?: JobSchedulerClient;

  constructor() {
    this.diContainer = new Container();
  }

  public async init(
    databaseClient: DatabaseClient,
    elasticClient: ElasticSearchClient,
    jobSchedulerClient: JobSchedulerClient,
  ): Promise<Container> {
    this.elasticClient = elasticClient;
    this.databaseClient = databaseClient;
    this.jobSchedulerClient = jobSchedulerClient;
    await this.diContainer.loadAsync(this.getBindings());
    return this.diContainer;
  }

  private getBindings() {
    return new AsyncContainerModule(async (bind): Promise<void> => {
      if (!this.databaseClient) throw new Error('no database client configured');
      if (!this.elasticClient) throw new Error('no elastic search client configured');
      if (!this.jobSchedulerClient) throw new Error('no job scheduler client configured');

      bind<ElasticSearchClient>(TYPES.ELASTIC_SEARCH_CONNECTION).toConstantValue(
        this.elasticClient,
      );

      bind<JobSchedulerClient>(TYPES.JOB_SCHEDULER_CONNECTION).toConstantValue(
        this.jobSchedulerClient,
      );

      const connection = await this.databaseClient.connect();
      if (connection) {
        await connection.getMigrator().up();
        bind<MikroORM<IDatabaseDriver<Connection>>>(TYPES.DATABASE_CONNECTION).toConstantValue(
          connection,
        );
        await this.customDbSetup(connection);
        this.configure();
        await this.postConfigure();
      }
    });
  }

  private async customDbSetup(connection: MikroORM<IDatabaseDriver<Connection>>) {
    await connection.em.getConnection().execute('CREATE EXTENSION IF NOT EXISTS pgcrypto');
    await connection.em
      .getConnection()
      .execute(
        `GRANT CREATE ON DATABASE ${process.env.MIKRO_ORM_DB_NAME} TO ${process.env.MIKRO_ORM_USER}`,
      );
  }

  private async postConfigure() {
    const notificationService = this.diContainer.get<NotificationService>(
      TYPES.NOTIFICATION_SERVICE,
    );
    const queueService = this.diContainer.get<IQueueService>(TYPES.QUEUE_SERVICE);

    await queueService.startQueueManager();
    await notificationService.subscribeToNotificationQueue();
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
    this.diContainer.bind<KeywordMap>(TYPES.KEYWORD_MAP).to(KeywordMap).inSingletonScope();
    this.diContainer.bind<NotificationMap>(TYPES.NOTIFICATION_MAP).to(NotificationMap);

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
    this.diContainer
      .bind<KeywordService>(TYPES.KEYWORD_SERVICE)
      .to(KeywordService)
      .inSingletonScope();
    this.diContainer
      .bind<PresentationService>(TYPES.PRESENTATION_SERVICE)
      .to(PresentationService)
      .inSingletonScope();
    this.diContainer
      .bind<NotificationService>(TYPES.NOTIFICATION_SERVICE)
      .to(NotificationService)
      .inSingletonScope();

    if (process.env.MOCK === 'true') {
      this.diContainer
        .bind<IQueueService>(TYPES.QUEUE_SERVICE)
        .to(QueueMockService)
        .inSingletonScope();
    } else {
      this.diContainer.bind<IQueueService>(TYPES.QUEUE_SERVICE).to(QueueService).inSingletonScope();
    }

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
    this.diContainer
      .bind<KeywordController>(TYPES.KEYWORD_CONTROLLER)
      .to(KeywordController)
      .inSingletonScope();
    this.diContainer
      .bind<PresentationController>(TYPES.PRESENTATION_CONTROLLER)
      .to(PresentationController)
      .inSingletonScope();
    this.diContainer
      .bind<NotificationController>(TYPES.NOTIFICATION_CONTROLLER)
      .to(NotificationController)
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
      .bind<IKeywordRepository>(TYPES.KEYWORD_REPOSITORY)
      .to(KeywordRepository)
      .inSingletonScope();

    this.diContainer
      .bind<IElasticDocumentRepository>(TYPES.DOCUMENT_ELASTIC_REPOSITORY)
      .to(DocumentElasticRepository)
      .inSingletonScope();

    this.diContainer
      .bind<IElasticProjectRepository>(TYPES.PROJECT_ELASTIC_REPOSITORY)
      .to(ProjectElasticRepository)
      .inSingletonScope();

    this.diContainer
      .bind<INotificationRepository>(TYPES.NOTIFICATION_REPOSITORY)
      .to(NotificationRepository)
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

    this.diContainer
      .bind<IRobotRepository>(TYPES.ROBOT_REPOSITORY)
      .to(RobotMockRepository)
      .inSingletonScope();

    this.diContainer
      .bind<IKeywordRepository>(TYPES.KEYWORD_REPOSITORY)
      .to(KeywordMockRepository)
      .inSingletonScope();

    this.diContainer
      .bind<INotificationRepository>(TYPES.NOTIFICATION_REPOSITORY)
      .to(NotificationMockRepository)
      .inSingletonScope();
  }
}
