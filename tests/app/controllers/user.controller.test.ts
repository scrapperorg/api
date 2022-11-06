import { Container } from 'inversify';
import { Application } from 'express';
import { TYPES } from './../../../src/server/types/index';
import { configServer } from './../../../src/server/server';
import request from 'supertest'
import { IUserRepository } from '../../../src/domain/User'

describe('User controller test', () => {
  let server: {
    app: Application,
    container: Container
  }
  beforeAll(async () => {
    server = await configServer(true);
  })
  test('/user/ should return all users', async () => {
    const response = await request(server.app)
      .get('/user')
      .set('Accept', 'application/json')

    expect(response.body.length).toBeGreaterThan(1)
  })

  test.skip('/user/:id should return 404 if user not found', async () => {})

  test('/user/create should create an user', async () => {
    const user = {
      name: 'vasile',
      surname: 'vasilache',
      role: 'LSE',
      email: 'vasile@yahoo.com',
      plainPassword: '1234'
    }
    const response = await request(server.app)
      .post('/user/create')
      .send(user)
      .set('Accept', 'application/json')
    expect(response.status).toEqual(200)
    const userRepo = server.container.get<IUserRepository>(TYPES.USER_REPOSITORY)
    const savedUser = await userRepo.getByEmail(user.email)
    expect(savedUser).not.toBeFalsy()
    expect(savedUser?.name).toBe('vasile')
  })
})