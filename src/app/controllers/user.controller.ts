import { Router, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IUserAPIDTO } from '@controllers/dtos/User';
import { HttpStatus } from '@lib';
import { Exception, statusMap } from '@lib';
import { createSchema, updatePasswordSchema, updatedSourcesSchema } from './validationSchemas/User';
import { TYPES } from '@server/types';
import { UserService } from '@services';
import { isAuthenticated } from '../middlewares/isAuthenticated.middleware';
import { EncryptionService, UserTokenClaims } from '@services/Encryption.service';
import { Source } from '@domain/Document';
import { hasExactRole } from '@middlewares/hasRole.middleware';
import { Role } from '@domain/index';

@injectable()
export class UserController {
  public router: Router = Router();
  constructor(
    @inject(TYPES.USER_SERVICE) private readonly userService: UserService,
    @inject(TYPES.ENCRYPTION_SERVICE) private readonly encryptionService: EncryptionService,
  ) {
    this.router.get('/', isAuthenticated, async (req: Request, res: Response) => {
      let roles: string[] = [];
      if (Array.isArray(req.query.roles)) {
        roles = <string[]>req.query.roles;
      } else if (typeof req.query.roles === 'string') {
        roles = [req.query.roles];
      }

      let users: IUserAPIDTO[];

      if (roles.length > 0) {
        users = await this.userService.getByRoles(roles);
      } else {
        users = await this.userService.getAll();
      }
      res.send(users);
    });

    this.router.get('/:id', async (req: Request, res: Response) => {
      try {
        const user = await this.userService.getById(req.params.id);
        return res.status(HttpStatus.OK).json(user);
      } catch (error: any) {
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.delete(
      '/:id',
      isAuthenticated,
      hasExactRole(Role.ITA),
      async (req: Request, res: Response) => {
        try {
          await this.userService.delete(req.params.id);
          return res.status(HttpStatus.OK).json({ message: 'User deleted' });
        } catch (error: any) {
          const errorType: Exception = error.constructor.name;
          return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      },
    );

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
      } catch (error: any) {
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.post('/update-sources', isAuthenticated, async (req: Request, res: Response) => {
      try {
        await updatedSourcesSchema.validateAsync(req.body);
      } catch (err: any) {
        const error: Error = err;
        return res.status(statusMap[Exception.INVALID]).json(error.message);
      }

      const { sourcesOfInterest }: { sourcesOfInterest: Source[] } = req.body;

      try {
        await this.userService.updateSourcesOfInterest(
          <UserTokenClaims>req.user,
          sourcesOfInterest,
        );

        return res.sendStatus(200);
      } catch (err: any) {
        const errorType: Exception = err.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(err);
      }
    });

    this.router.put(
      '/:id/activate',
      isAuthenticated,
      hasExactRole(Role.ITA),
      async (req: Request, res: Response) => {
        try {
          await this.userService.activate(req.params.id);
          return res.status(HttpStatus.OK).json({ message: 'User activated' });
        } catch (error: any) {
          const errorType: Exception = error.constructor.name;
          return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      },
    );

    this.router.put(
      '/:id/update-password',
      isAuthenticated,
      hasExactRole(Role.ITA),
      async (req: Request, res: Response) => {
        try {
          await updatePasswordSchema.validateAsync(req.body);
        } catch (err: any) {
          const error = err;
          return res.status(statusMap[Exception.INVALID]).json(error.message);
        }

        try {
          await this.userService.updatePassword(req.params.id, req.body);
          return res
            .status(HttpStatus.OK)
            .json({ message: 'Users password is successfully updated' });
        } catch (error: any) {
          const errorType: Exception = error.constructor.name;
          return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      },
    );
  }
}
