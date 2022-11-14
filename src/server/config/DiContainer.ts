import { AuthContoller } from './../../app/controllers/auth.controller';
import { AsyncContainerModule, Container } from 'inversify';
import { MikroORM, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { EmailService } from './../../app/services/Email.service';
import { UserController } from './../../app/controllers/user.controller';
import { IResetPasswordTokenRepository } from './../../domain/ResetPasswordToken/ResetPasswordToken.repository.interface';
import { ResetPasswordTokenMap } from './../../app/mappers/ResetPasswordToken.map';
import { UserMap } from './../../app/mappers/User.map';
import { AuthService } from '../../app/services/Auth.service';
import { UserService } from './../../app/services/User.service';
import { UserMockRepository } from './../../persistence/User/User.repository.mock';
import { UserRepository } from './../../persistence/User/User.repository';
import { IUserRepository } from './../../domain/User/User.repository.interface';
import { DatabaseClient } from './DatabaseClient';
import { TYPES } from '../types';
import { ResetPasswordTokenRepository } from './../../persistence/ResetPasswordToken';
import { ResetPasswordTokenTestRepository } from '../../persistence/ResetPasswordToken/ResetPasswordToken.mock.repository';
import { EncryptionService } from '../../app/services/Encryption.service';

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
    this.diContainer.bind<UserMap>(TYPES.USER_MAP).to(UserMap).inSingletonScope();
    this.diContainer
      .bind<ResetPasswordTokenMap>(TYPES.RESET_PASSWORD_TOKEN_MAP)
      .to(ResetPasswordTokenMap).inSingletonScope;

    if (process.env.MOCK === 'true') {
      this.configureMockRepositories();
    } else {
      this.configureRepositories();
    }

    this.diContainer.bind<UserService>(TYPES.USER_SERVICE).to(UserService).inSingletonScope;
    this.diContainer.bind<AuthService>(TYPES.AUTH_SERVICE).to(AuthService).inSingletonScope;
    this.diContainer.bind<EmailService>(TYPES.EMAIL_SERVICE).to(EmailService).inSingletonScope;
    this.diContainer.bind<EncryptionService>(TYPES.ENCRYPTION_SERVICE).to(EncryptionService)
      .inSingletonScope;

    this.diContainer.bind<UserController>(TYPES.USER_CONTROLLER).to(UserController)
      .inSingletonScope;

    this.diContainer.bind<AuthContoller>(TYPES.AUTH_CONTROLLER).to(AuthContoller).inSingletonScope;

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
  }
}
