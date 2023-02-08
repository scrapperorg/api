import { Exception, statusMap, HttpStatus } from '../../lib';
import { Router, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '@server/types';
import { AuthService } from '@services';
import { UserService } from '@services';
import { recoverPasswordSchema, resetPasswordSchema } from './validationSchemas/Auth';

@injectable()
export class AuthController {
  public router: Router = Router();
  constructor(
    @inject(TYPES.USER_SERVICE) private readonly userService: UserService,
    @inject(TYPES.AUTH_SERVICE)
    private readonly authService: AuthService,
  ) {
    this.router.post('/refresh-token', async (req: Request, res: Response) => {
      const tokenFromHeader: string = req.headers['authorization'] ?? '';

      if (tokenFromHeader.length === 0) {
        return res.status(HttpStatus.UNAUTHORIZED).json({});
      }

      try {
        const { user, token } = await this.authService.refreshToken(tokenFromHeader);
        return res.status(HttpStatus.OK).json({ user, token });
      } catch (error: any) {
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.post('/login', async (req: Request, res: Response) => {
      const { email, password } = req.body;

      try {
        const { user, token } = await this.authService.login(email, password);
        return res.status(HttpStatus.OK).json({ user, token });
      } catch (error: any) {
        console.log(error);
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.post('/recover-password', async (req: Request, res: Response) => {
      const { email } = req.body;

      try {
        await recoverPasswordSchema.validateAsync(req.body);
      } catch (err: any) {
        const error: Error = err;
        return res.status(statusMap[Exception.INVALID]).json(error.message);
      }

      try {
        const token = await this.authService.generateResetPasswordToken(email);
        return res.status(HttpStatus.OK).send(token);
      } catch (error: any) {
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.post('/validate-reset-password-token', async (req: Request, res: Response) => {
      const { token } = req.body;

      try {
        await this.authService.validateResetPasswordToken(token);
        return res.sendStatus(HttpStatus.OK);
      } catch (error: any) {
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.post('/reset-password', async (req: Request, res: Response) => {
      const { token, password } = req.body;

      try {
        await resetPasswordSchema.validateAsync(req.body);
      } catch (err: any) {
        const error: Error = err;
        return res.status(statusMap[Exception.INVALID]).json(error.message);
      }

      try {
        await this.authService.resetUserPassword(token, password);
        return res.sendStatus(HttpStatus.OK);
      } catch (error: any) {
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });
  }
}
