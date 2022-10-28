import request from 'supertest'
import { UserController } from '../../../src/app/controllers';
import { UserService } from '../../../src/app/services';
import { UserTestRepository } from './../../../src/persistence/User/User.test.repository';
import { UserMap } from '../../../src/app/mappers/User.map';
import { Router } from 'express';
import { app } from '../../testServer'

describe('User controller test', () => {

  let userRouter: Router

  beforeAll(async () => {
    const userMapper = new UserMap()
    const userRepository = new UserTestRepository(userMapper)
    const userService = new UserService(userRepository, userMapper)
    userRouter = new UserController(userService).router
    app.use('/user', userRouter)
  })

  test('root path should return welcome message', async () => {
    const result = await request(app).get('/')
    const resultJSON = JSON.parse(result.text)
    expect(resultJSON).toHaveProperty('message')
    expect(resultJSON.message).toBe('Welcome to anap screening app!!')
  })
})