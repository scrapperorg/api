import request from 'supertest'
import { IUserRepository } from '../../../src/domain/User'
import { app } from '../../testServer'

describe('User controller test', () => {
  test('root path should return welcome message', async () => {
    const result = await request(app).get('/')
    const resultJSON = JSON.parse(result.text)
    expect(resultJSON).toHaveProperty('message')
    expect(resultJSON.message).toBe('Welcome to anap screening app!!')
  })

  test('/user/ should return all users', async () => {
    const response = await request(app)
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
    const response = await request(app)
      .post('/user/create')
      .send(user)
      .set('Accept', 'application/json')
    expect(response.status).toEqual(200)
    const repositories = app.get('repositories')
    const userRepo: IUserRepository = repositories['userRepository']
    const savedUser = await userRepo.getByEmail(user.email)
    expect(savedUser).not.toBeFalsy()
    expect(savedUser?.name).toBe('vasile')
  })

  test.skip('/user/create should return 400 if mandatory user details are missing from request', async () => {})

  test.skip('/user/recover-password should save a generated token', async () => {})
  test.skip('/user/recover-password should send an email with the generated token', async () => {})
  test.skip('/user/recover-password should return 400 if the request does not contain the email', async () => {})

  test.skip('/user/validate-reset-password-token/:token should respond with 404 if token does not exist', async () => {})
  test.skip('/user/validate-reset-password-token/:token should respond with 404 if the token is expired', async () => {})
  test.skip('/user/validate-reset-password-token/:token should respond with 200 token exists and is not expired', async () => {})
  test.skip('/user/reset-password should update user with a new hashed password', async () => {})
  
})