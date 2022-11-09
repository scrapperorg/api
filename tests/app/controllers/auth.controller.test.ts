import { IUserAPIDTO } from './../../../src/app/controllers/dtos/User';
import { IResetPasswordTokenRepository } from './../../../src/domain/ResetPasswordToken/ResetPasswordToken.repository.interface';
import request from 'supertest';
import { Container } from 'inversify';
import { Application } from 'express';
import { configServer } from './../../../src/server/server';
import { TYPES } from '../../../src/server/types';

describe('User controller test', () => {
  let server: {
    app: Application;
    container: Container;
  };
  beforeAll(async () => {
    server = await configServer(true);
  });
  test.skip('/recover-password should save a generated token and should send an email with it', async () => {

    const resetPasswordTokenRepo = server.container.get<IResetPasswordTokenRepository>(
      TYPES.RESET_PASSWORD_TOKEN_REPOSITORY,
    );

    const userEmail = 'vasile@yahoo.com'

    const user = {
      name: 'vasile',
      surname: 'vasilache',
      role: 'LSE',
      email: userEmail,
      password: '1234',
    };

    const userCreationResponse = await request(server.app)
      .post('/user/create')
      .send(user)
      .set('Accept', 'application/json')

    expect(userCreationResponse.status).toBe(200);

    const createdUser: IUserAPIDTO = userCreationResponse.body;

    const recoverPasswordResponse = await request(server.app)
      .post('/recover-password')
      .send({ email: userEmail })
      .set('Accept', 'application/json');

    expect(recoverPasswordResponse.status).toBe(200);

    const savedTokens = await resetPasswordTokenRepo.getAllByUserId(createdUser.id);

    expect(savedTokens.length).toBeGreaterThan(1)

  });
  
  test('/recover-password should return 400 if the request does not contain the email', async () => {
    const response = await request(server.app)
      .post('/recover-password')
      .send({})
      .set('Acccept', 'application/json');

    expect(response.status).toBe(400);
  });

  test.skip('/validate-reset-password-token/:token should respond with 404 if token does not exist', async () => {});
  test.skip('/validate-reset-password-token/:token should respond with 404 if the token is expired', async () => {});
  test.skip('/validate-reset-password-token/:token should respond with 200 token exists and is not expired', async () => {});
  test.skip('/reset-password should update user with a new hashed password', async () => {});
  test('/reset-password should return 400 if the token or password are missing from the request', async () => {
    const response = await request(server.app).post('/recover-password').send({ token: '123431' });

    expect(response.status).toBe(400);
  });
});
