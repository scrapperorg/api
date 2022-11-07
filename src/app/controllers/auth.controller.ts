import { Exception, statusMap, HttpStatus } from './../../lib';
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
    this.router.post('/login', async (req: Request, res: Response) => {
      const { email, password } = req.body;

      try {
        const { user, token } = await this.authService.login(email, password);
        return res.status(HttpStatus.OK).json({ user, token });
      } catch (error: any) {
        const errorType: Exception = error.constructor;
        return statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR;
      }
    });

    this.router.post('/recover-password', async (req: Request, res: Response) => {
      const { email } = req.body;

      try {
        this.authService.generateResetPasswordToken(email);
        return res.status(HttpStatus.OK);
      } catch (error: any) {
        const errorType: Exception = error.constructor;
        return statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR;
      }
    });

    this.router.get(
      '/validate-reset-password-token/:token',
      async (req: Request, res: Response) => {
        const token = req.params.token;

        try {
          this.authService.validateResetPasswordToken(token);
          return res.status(HttpStatus.OK);
        } catch (error: any) {
          const errorType: Exception = error.constructor;
          return statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR;
        }
      },
    );

    this.router.post('/reset-password', async (req: Request, res: Response) => {
      const { token, password } = req.body; // plain password

      try {
        this.authService.resetUserPassword(token, password);
        return res.status(HttpStatus.OK);
      } catch (error: any) {
        const errorType: Exception = error.constructor;
        return statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR;
      }
    });
  }
}
