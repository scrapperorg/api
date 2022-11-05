import { AsyncContainerModule, Container } from 'inversify';
import { MikroORM, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { EmailService } from './../../app/services/Email.service';
import { UserController } from './../../app/controllers/user.controller';
import { IResetPasswordTokenRepository } from './../../domain/ResetPasswordToken/ResetPasswordToken.repository.interface';
import { ResetPasswordTokenMap } from './../../app/mappers/ResetPasswordToken.map';
import { UserMap } from './../../app/mappers/User.map';
import { ResetPasswordService } from './../../app/services/ResetPassword.service';
import { UserService } from './../../app/services/User.service';
import { UserMockRepository } from './../../persistence/User/User.repository.mock';
import { UserRepository } from './../../persistence/User/User.repository';
import { IUserRepository } from './../../domain/User/User.repository.interface';
import { DatabaseClient } from './DatabaseClient';
import { TYPES } from '../types';
import { ResetPasswordTokenRepository } from './../../persistence/ResetPasswordToken';
import { ResetPasswordTokenTestRepository } from './../../persistence/ResetPasswordToken/ResetPasswordToken.test.repository';

interface IDiContainerProps {
  databaseClient: DatabaseClient;
}

export class DiContainer {
  private diContainer: Container;
  private databaseClient: DatabaseClient;

  constructor(props: IDiContainerProps) {
    this.databaseClient = props.databaseClient;
    this.diContainer = new Container();
  }

  public async init(): Promise<Container> {
    this.diContainer.loadAsync(this.bindings);
    return this.diContainer;
  }

  get bindings() {
    return new AsyncContainerModule(async (bind): Promise<void> => {
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
    this.diContainer.bind<UserMap>(TYPES.USER_MAP).toSelf();
    this.diContainer.bind<ResetPasswordTokenMap>(TYPES.RESET_PASSWORD_TOKEN_MAP).toSelf();

    if (process.env.MOCK === 'true') {
      this.configureMockRepositories();
    } else {
      this.configureRepositories();
    }

    this.diContainer.bind<UserService>(TYPES.USER_SERVICE).toSelf();
    this.diContainer.bind<ResetPasswordService>(TYPES.RESET_PASSWORD_SERVICE).toSelf();
    this.diContainer.bind<EmailService>(TYPES.EMAIL_SERVICE).toSelf();

    this.diContainer.bind<UserController>(TYPES.USER_CONTROLLER).toSelf();
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
