import { Exception, HttpStatus, statusMap } from '@lib';
import { TYPES } from '@server/types';
import { isAuthenticated } from '@middlewares/isAuthenticated.middleware';
import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { ProjectService } from '@services/Project.service';

@injectable()
export class ProjectController {
  public router: Router = Router();
  constructor(@inject(TYPES.PROJECT_SERVICE) private readonly projectService: ProjectService) {
    this.router.get('/:id', isAuthenticated, async (req: Request, res: Response) => {
      try {
        const project = await this.projectService.getById(req.params.id);
        return res.status(HttpStatus.OK).json(project);
      } catch (error: any) {
        console.log(error);
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });
  }
}
