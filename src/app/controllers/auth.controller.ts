import { Router, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '@server/types';
import { AuthService, NoSuchElementException, UnauthorizedException } from '@services';
import { UserService } from '@services';

export enum HttpStatus {
  'OK' = 200,
  'UNAUTHORIZED' = 401,
  'NOT_FOUND' = 404,
  'INTERNAL_SERVER_ERROR' = 500,
}

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
        switch (error.constructor) {
          case NoSuchElementException: {
            return res.status(HttpStatus.NOT_FOUND).json({});
          }
          case UnauthorizedException: {
            return res.status(HttpStatus.UNAUTHORIZED).json({});
          }
          default: {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});
          }
        }
      }
    });

    this.router.post('/recover-password', async (req: Request, res: Response) => {
      const { email } = req.body;
      await this.authService.generateResetPasswordToken(email);
      res.send('insert response');
    });

    this.router.get(
      '/validate-reset-password-token/:token',
      async (req: Request, res: Response) => {
        const token = req.params.token;
        await this.authService.validateResetPasswordToken();
        res.send('insert response');
      },
    );

    this.router.post('/reset-password', async (req: Request, res: Response) => {
      const { token, password } = req.body; // plain password
      await this.authService.resetUserPassword();
      res.send('insert response');
    });
  }
}
