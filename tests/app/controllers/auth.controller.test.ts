import { Container } from 'inversify';
import { Application } from 'express';
import { configServer } from './../../../src/server/server';

describe.skip('User controller test', () => {
  let server: {
    app: Application,
    container: Container
  }
  beforeAll(async () => {
    server = await configServer(true);
  })
  test('/user/create should return 400 if mandatory user details are missing from request', async () => {})

  test('/recover-password should save a generated token', async () => {})
  test('/recover-password should send an email with the generated token', async () => {})
  test('/recover-password should return 400 if the request does not contain the email', async () => {})

  test('/validate-reset-password-token/:token should respond with 404 if token does not exist', async () => {})
  test('/validate-reset-password-token/:token should respond with 404 if the token is expired', async () => {})
  test('/validate-reset-password-token/:token should respond with 200 token exists and is not expired', async () => {})
  test('/reset-password should update user with a new hashed password', async () => {})
  
})