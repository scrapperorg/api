import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { isAuthenticated } from '@middlewares/isAuthenticated.middleware';
import { TYPES } from '@server/types';
import { NotificationService } from '@services';
import { Exception, HttpStatus, statusMap } from '@lib';
import { createSchema, updateSchema } from './validationSchemas/Notification';

@injectable()
export class NotificationController {
  public router: Router = Router();
  constructor(
    @inject(TYPES.NOTIFICATION_SERVICE) private readonly notificationService: NotificationService,
  ) {
    this.router.get('/', isAuthenticated, async (req: Request, res: Response) => {
      try {
        const notifications = await this.notificationService.getAll(req.query);
        return res.status(200).send(notifications);
      } catch (error: any) {
        console.log(error);
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.get('/new', isAuthenticated, async (req: Request, res: Response) => {
      try {
        const notifications = await this.notificationService.getNew(req.query);
        return res.status(200).send(notifications);
      } catch (error: any) {
        console.log(error);
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.post('/', isAuthenticated, async (req, res) => {
      try {
        await createSchema.validateAsync(req.body);
      } catch (err: any) {
        const error: Error = err;
        return res.status(statusMap[Exception.INVALID]).json(error.message);
      }

      try {
        const createdNotification = await this.notificationService.create(req.body);
        return res.status(201).send(createdNotification);
      } catch (error: any) {
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.put('/:id', isAuthenticated, async (req, res) => {
      try {
        await updateSchema.validateAsync(req.body);
      } catch (err: any) {
        const error: Error = err;
        return res.status(statusMap[Exception.INVALID]).json(error.message);
      }

      try {
        const updatedNotification = await this.notificationService.update(req.params.id, req.body);
        return res.status(201).send(updatedNotification);
      } catch (error: any) {
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.delete('/:id', isAuthenticated, async (req, res) => {
      try {
        await this.notificationService.delete(req.params.id);
        return res.status(HttpStatus.OK).json({ message: 'Notification deleted' });
      } catch (error: any) {
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });
  }
}
