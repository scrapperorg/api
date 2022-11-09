import { HttpStatus } from './../../lib/HttpStatus';
import { Exception, statusMap } from './../../lib/';
import { createSchema } from './validationSchemas/User';
import { TYPES } from './../../server/types/index';
import { UserService } from './../services';
import { Router, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class UserController {
  public router: Router = Router();
  constructor(@inject(TYPES.USER_SERVICE) private readonly userService: UserService) {
    this.router.get('/', async (req: Request, res: Response) => {
      const users = await this.userService.getAll();
      res.send(users);
    });
    this.router.get('/:id', async (req: Request, res: Response) => {
      const user = await this.userService.getById(req.params.id);
      res.send(user);
    });
    this.router.post('/create', async (req: Request, res: Response) => {
      const { name, surname, role, password, email } = req.body;

      try {
        await createSchema.validateAsync(req.body);
      } catch (err: any) {
        const error: Error = err;
        return res.status(statusMap[Exception.INVALID]).json(error.message);
      }

      try {
        const createdUser = await this.userService.create({
          name,
          surname,
          role,
          email,
          password,
        });
        return res.status(200).send(createdUser);
      } catch (err: any) {
        const error: Error = err;
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(error.message);
      }
    });
  }
}
