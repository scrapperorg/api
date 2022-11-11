import { IUserPersistenceDTO } from './../../../src/persistence/dtos/User';
import { IUserAPIDTO } from './../../../src/app/controllers/dtos/User';
import request from 'supertest';
import { Container } from 'inversify';
import { Application } from 'express';
import * as http from 'http';
import { IResetPasswordTokenRepository, IResetPasswordTokenAPIDTO, IResetPasswordTokenPersistenceDTO } from './../../../src/domain/ResetPasswordToken/ResetPasswordToken.repository.interface';
import { configServer } from './../../../src/server/server';
import { TYPES } from '../../../src/server/types';
import { EncryptionService } from '../../../src/app/services/Encryption.service';
import { IUserRepository, User } from '../../../src/domain/User';

describe('User controller test', () => {
  let server: {
    app: Application;
    container: Container;
  };

  beforeAll(async () => {
    server = await configServer(true);
  });

  test('/recover-password should save a generated token', async () => {
    const resetPasswordTokenRepo = server.container.get<IResetPasswordTokenRepository>(
      TYPES.RESET_PASSWORD_TOKEN_REPOSITORY,
    );

    const userEmail = 'vasile1@yahoo.com';

    const user = {
      name: 'vasile',
      surname: 'vasilache',
      role: 'LSE',
      email: userEmail,
      password: '1234',
    };

    const response = await request(server.app)
      .post('/user/create')
      .send(user)
      .set('Accept', 'application/json');
    
    const savedUser = response.body;

    const recoverPasswordResponse = await request(server.app)
      .post('/recover-password')
      .send({ email: userEmail })
      .set('Accept', 'application/json');

    expect(recoverPasswordResponse.status).toBe(200);

    const savedTokens = await resetPasswordTokenRepo.getAllByUserId(savedUser.id);

    expect(savedTokens.length).toBeGreaterThanOrEqual(1);

  });

  test('/recover-password should return 400 if the request does not contain the email', async () => {
    const response = await request(server.app)
      .post('/recover-password')
      .send({})
      .set('Acccept', 'application/json');

    expect(response.status).toBe(400);
  });
  
  
  test('/validate-reset-password-token/:token should respond with 404 if token does not exist', async () => {
    const response = await request(server.app).post('/validate-reset-password-token').send({ token: '123423131' });

    expect(response.status).toBe(404);
  });
  
  test('/validate-reset-password-token should return 404 if the token is expired', async () => {
    const encryptionService = server.container.get<EncryptionService>(TYPES.ENCRYPTION_SERVICE);
    const resetPasswordTokenRepository = server.container.get<IResetPasswordTokenRepository>(TYPES.RESET_PASSWORD_TOKEN_REPOSITORY)
    const userRepository = server.container.get<IUserRepository>(TYPES.USER_REPOSITORY);

    const userId = 'vasielsIdealid1';
    const resetPasswordTokenId = 'randomTokenIdwhatever1';
    const resetPasswordTokenValue = 'some-random-token1';
    const currentPassword = 'currentPassword';
    const userEmail = 'vasile2@yahoo.com';

    const user: IUserPersistenceDTO = {
      id: userId,
      name: 'vasile',
      surname: 'vasilache',
      role: 'LSE',
      email: userEmail,
      password: encryptionService.hash(currentPassword),
    };

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - 1);

    const resetPasswordToken: IResetPasswordTokenPersistenceDTO = {
      id: resetPasswordTokenId,
      userId,
      token: resetPasswordTokenValue,
      expirationDate
    }

    const createdUser: User = await userRepository.save(user);

    const createdResetPasswordToken = await resetPasswordTokenRepository.save(resetPasswordToken);

    const response = await request(server.app).post(`/validate-reset-password-token`).send({ token: resetPasswordToken });

    expect(response.status).toBe(404)
  });
  
  test('/reset-password should return 400 if the token or password are missing from the request', async () => {
    const response = await request(server.app).post('/reset-password').send({ token: '123431' });

    expect(response.status).toBe(400);
  });

  test('/reset-password should return 404 if the token is expired', async () => {
    const encryptionService = server.container.get<EncryptionService>(TYPES.ENCRYPTION_SERVICE);
    const resetPasswordTokenRepository = server.container.get<IResetPasswordTokenRepository>(TYPES.RESET_PASSWORD_TOKEN_REPOSITORY)
    const userRepository = server.container.get<IUserRepository>(TYPES.USER_REPOSITORY);

    const userId = 'vasielsIdealid2';
    const resetPasswordTokenId = 'randomTokenIdwhatever2';
    const resetPasswordTokenValue = 'some-random-token2';
    const currentPassword = 'currentPassword';
    const newPassword = 'newPassword';
    const userEmail = 'vasile3@yahoo.com';

    const user: IUserPersistenceDTO = {
      id: userId,
      name: 'vasile',
      surname: 'vasilache',
      role: 'LSE',
      email: userEmail,
      password: encryptionService.hash(currentPassword),
    };

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - 1);

    const resetPasswordToken: IResetPasswordTokenPersistenceDTO = {
      id: resetPasswordTokenId,
      userId,
      token: resetPasswordTokenValue,
      expirationDate
    }

    const createdUser: User = await userRepository.save(user);

    const createdResetPasswordToken = await resetPasswordTokenRepository.save(resetPasswordToken);

    const response = await request(server.app).post('/reset-password').send({ token: resetPasswordTokenValue, password: newPassword });

    expect(response.status).toBe(404)

  });

  test('/reset-password should update the users password', async () => {

    const encryptionService = server.container.get<EncryptionService>(TYPES.ENCRYPTION_SERVICE);
    const resetPasswordTokenRepository = server.container.get<IResetPasswordTokenRepository>(TYPES.RESET_PASSWORD_TOKEN_REPOSITORY)
    const userRepository = server.container.get<IUserRepository>(TYPES.USER_REPOSITORY);

    const userId = 'vasielsid3';
    const resetPasswordTokenValue = 'some-random-token3';
    const resetPasswordTokenId = 'randomTokenIdwhateve3';
    const currentPassword = 'currentPassword';
    const newPassword = 'newPassword';
    const userEmail = 'vasile4@yahoo.com';

    const user: IUserPersistenceDTO = {
      id: userId,
      name: 'vasile',
      surname: 'vasilache',
      role: 'LSE',
      email: userEmail,
      password: encryptionService.hash(currentPassword),
    };

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);

    const resetPasswordToken: IResetPasswordTokenPersistenceDTO = {
      id: resetPasswordTokenId,
      userId,
      token: resetPasswordTokenValue,
      expirationDate
    }

    const createdUser: User = await userRepository.save(user);

    expect(encryptionService.compare(currentPassword, createdUser.password)).toBe(true);

    const createdResetPasswordToken = await resetPasswordTokenRepository.save(resetPasswordToken);

    const response = await request(server.app).post('/reset-password').send({ token: resetPasswordTokenValue, password: newPassword });

    expect(response.status).toBe(200)

    const updatedUser = await userRepository.getById(createdUser.id)

    const updatedUserHashedPassword = updatedUser?.password || 'ALWAYS_WRONG';

    expect(encryptionService.compare(newPassword, updatedUserHashedPassword)).toBe(true)
  })
});
