import { Exception, HttpStatus, statusMap } from '@lib';
import { TYPES } from '@server/types';
import { isAuthenticated } from '@middlewares/isAuthenticated.middleware';
import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { ProjectService } from '@services/Project.service';
import { parseProjectsFilters } from '@middlewares/parseProjectsFilters.middleware';

@injectable()
export class ProjectController {
  public router: Router = Router();
  constructor(@inject(TYPES.PROJECT_SERVICE) private readonly projectService: ProjectService) {
    this.router.get(
      '/',
      isAuthenticated,
      parseProjectsFilters,
      async (req: Request, res: Response) => {
        try {
          const page: number = typeof req.query.page === 'string' ? parseInt(req.query.page) : 0;

          const pageSize: number =
            typeof req.query.pageSize === 'string' ? parseInt(req.query.pageSize) : 10;

          const filters = req.projectsFilters ?? {};

          const projects = await this.projectService.getAll(filters, page, pageSize);

          console.log(projects);

          res.status(200).send(projects);
        } catch (error: any) {
          const errorType: Exception = error.constructor.name;
          return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      },
    );

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
