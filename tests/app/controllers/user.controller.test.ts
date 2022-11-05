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
    const userRepo: IUserRepository = app.get('userRepo')
    const savedUser = await userRepo.getByEmail(user.email)
    expect(savedUser).not.toBeFalsy()
    expect(savedUser?.name).toBe('vasile')
  })
  
})