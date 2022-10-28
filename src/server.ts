import { UserMap } from './app/mappers/User.map';
import { UserRepository } from './persistence/User';
import 'reflect-metadata'
import express from 'express'
import * as dotenv from 'dotenv'
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { UserController } from './app/controllers';
import { UserService } from './app/services';

dotenv.config()

export const app = express();
const port = process.env.PORT ?? 3000;

export const init = (async () => {
  const orm = await MikroORM.init();

  const userMapper = new UserMap()
  const userRepository = new UserRepository(orm, userMapper)
  const userService = new UserService(userRepository, userMapper)
  const userController = new UserController(userService).router

  app.use(express.json());
  app.use((req, res, next) => RequestContext.create(orm.em, next));
  app.get('/', (req, res) => res.json({ message: 'Welcome to anap screening app!!' }));
  app.use('/user', userController);
  app.use((req, res) => res.status(404).json({ message: 'No route found' }));

  app.listen(port, () => {
    console.log(`anap screening server started at http://localhost:${port}`);
  });
})();