import { Router, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from './../../server/types/index';
import { AuthService } from '../services/Auth.service';
import { UserService } from './../services/User.service';

@injectable()
export class AuthContoller {
  public router: Router = Router();
  constructor(
    @inject(TYPES.USER_SERVICE) private readonly userService: UserService,
    @inject(TYPES.AUTH_SERVICE)
    private readonly authService: AuthService,
  ) {
    this.router.post('/recover-password', async (req: Request, res: Response) => {
      const { email } = req.body;
      this.authService.generateResetPasswordToken(email);
      res.send('insert response');
    });
    this.router.get(
      '/validate-reset-password-token/:token',
      async (req: Request, res: Response) => {
        const token = req.params.token;
        this.authService.validateResetPasswordToken();
        res.send('insert response');
      },
    );
    this.router.post('/reset-password', async (req: Request, res: Response) => {
      const { token, password } = req.body; // plain password
      this.authService.resetUserPassword();
      res.send('insert response');
    });
  }
}
