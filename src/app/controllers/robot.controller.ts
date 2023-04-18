import { Router, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatus } from '@lib';
import { Exception, statusMap } from '@lib';
import { createSchema, updatedSchema } from './validationSchemas/Robot';
import { TYPES } from '@server/types';
import { isAuthenticated } from '@middlewares/isAuthenticated.middleware';
import { RobotService } from '@services/Robot.service';
import { isTrustedSourceMiddleware } from '@middlewares/isTrustedSource.middleware';

@injectable()
export class RobotController {
  public router: Router = Router();
  constructor(@inject(TYPES.ROBOT_SERVICE) private readonly robotService: RobotService) {
    this.router.get('/', isAuthenticated, async (req: Request, res: Response) => {
      const robots = await this.robotService.getAll();
      res.send(robots);
    });

    this.router.get('/:name', isTrustedSourceMiddleware, async (req: Request, res: Response) => {
      try {
        const robot = await this.robotService.getByName(req.params.name);
        return res.status(HttpStatus.OK).json(robot);
      } catch (error: any) {
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.post('/', isTrustedSourceMiddleware, async (req: Request, res: Response) => {
      const { name } = req.body;
      try {
        await createSchema.validateAsync(req.body);
      } catch (err: any) {
        const error: Error = err;
        return res.status(statusMap[Exception.INVALID]).json(error.message);
      }

      try {
        const createdRobot = await this.robotService.create({
          name,
        });
        return res.status(200).send(createdRobot);
      } catch (error: any) {
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.put('/:id', isTrustedSourceMiddleware, async (req: Request, res: Response) => {
      const { id } = req.params;
      const { status, info } = req.body;

      try {
        await updatedSchema.validateAsync(req.body);
      } catch (err: any) {
        const error: Error = err;
        return res.status(statusMap[Exception.INVALID]).json(error.message);
      }

      try {
        const updatedRobot = await this.robotService.update(id, {
          status,
          info,
        });
        return res.status(200).send(updatedRobot);
      } catch (error: any) {
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });
  }
}
