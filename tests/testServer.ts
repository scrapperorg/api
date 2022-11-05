import express, { Application } from 'express'
import bodyParser from 'body-parser'
import { UserMap } from '../src/app/mappers/User.map'
import { UserTestRepository } from '../src/persistence/User/User.repository.mock'
import { ResetPasswordService, UserService } from '../src/app/services'
import { ResetPasswordTokenMap } from '../src/app/mappers/ResetPasswordToken.map'
import { ResetPasswordTokenTestRepository } from '../src/persistence/ResetPasswordToken/ResetPasswordToken.test.repository'
import { EmailService } from '../src/app/services/Email.service'
import { UserController } from '../src/app/controllers'

const userMapper = new UserMap()
const userRepository = new UserTestRepository(userMapper)
const userService = new UserService(userRepository, userMapper)
const resetPasswordTokenMapper = new ResetPasswordTokenMap()
const resetPasswordTokenRepository = new ResetPasswordTokenTestRepository(resetPasswordTokenMapper)
const emailService = new EmailService()
const resetPasswordService = new ResetPasswordService(
  userRepository,
  resetPasswordTokenRepository,
  userMapper,
  resetPasswordTokenMapper,
  emailService,
)

const userRouter = new UserController(userService, resetPasswordService).router

export const app: Application = express();
app.use(express.json());
app.use(bodyParser.json())
app.set('userRepo', userRepository)
app.get('/', (req, res) => res.json({ message: 'Welcome to anap screening app!!' }));
app.use('/user', userRouter);
app.use((req, res) => res.status(404).json({ message: 'No route found' }));
