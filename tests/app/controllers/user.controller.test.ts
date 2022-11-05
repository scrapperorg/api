import { ResetPasswordTokenMap } from './../../../src/app/mappers/ResetPasswordToken.map';
import { ResetPasswordTokenTestRepository } from './../../../src/persistence/ResetPasswordToken/ResetPasswordToken.test.repository';
import { ResetPasswordService } from './../../../src/app/services/ResetPassword.service';
import request from 'supertest'
import { UserController } from '../../../src/app/controllers';
import { UserService } from '../../../src/app/services';
import { UserTestRepository } from './../../../src/persistence/User/User.test.repository';
import { UserMap } from '../../../src/app/mappers/User.map';
import { Router } from 'express';
import { app } from '../../testServer'
import { EmailService } from '../../../src/app/services/Email.service';

describe('User controller test', () => {

  let userRouter: Router

  beforeAll(async () => {
    const userMapper = new UserMap()
    const userRepository = new UserTestRepository(userMapper)
    const userService = new UserService(userRepository, userMapper)
    const resetPasswordTokenMapper = new ResetPasswordTokenMap()
    const resetPasswordTokenRepository = new ResetPasswordTokenTestRepository(resetPasswordTokenMapper)
    const emailService = new EmailService
    const resetPasswordService = new ResetPasswordService(
      userRepository,
      resetPasswordTokenRepository,
      userMapper,
      resetPasswordTokenMapper,
      emailService,
    )

    userRouter = new UserController(userService, resetPasswordService).router
    app.use('/user', userRouter)
  })

  test('root path should return welcome message', async () => {
    const result = await request(app).get('/')
    const resultJSON = JSON.parse(result.text)
    expect(resultJSON).toHaveProperty('message')
    expect(resultJSON.message).toBe('Welcome to anap screening app!!')
  })
})