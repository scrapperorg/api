import { TYPES } from '@server/types';
import { UserService } from '@services';
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
        await this.userService.create({
          name,
          surname,
          role,
          email,
          plainPassword: password,
        });
      } catch (err) {
        return res.status(500).send(err);
      }
      return res.send(200);
    });
  }
}
