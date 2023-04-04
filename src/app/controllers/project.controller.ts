import { Exception, HttpStatus, statusMap } from '@lib';
import { TYPES } from '@server/types';
import { isAuthenticated } from '@middlewares/isAuthenticated.middleware';
import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { ProjectService } from '@services/Project.service';
import { isTrustedSourceMiddleware } from '@middlewares/isTrustedSource.middleware';
import { createSchema, searchSchema } from '@controllers/validationSchemas/Project';
import { isAuthenticatedOrTrustedSource } from '@middlewares/isAuthenticatedOrTrustedSource.middleware';
import { parseProjectsFilters } from '@middlewares/parseProjectsFilters.middleware';

@injectable()
export class ProjectController {
  public router: Router = Router();
  constructor(@inject(TYPES.PROJECT_SERVICE) private readonly projectService: ProjectService) {
    this.router.get(
      '/',
      isAuthenticatedOrTrustedSource,
      parseProjectsFilters,
      async (req: Request, res: Response) => {
        try {
          const page: number = typeof req.query.page === 'string' ? parseInt(req.query.page) : 0;

          const pageSize: number =
            typeof req.query.pageSize === 'string' ? parseInt(req.query.pageSize) : 10;

          const filters = req.projectsFilters ?? {};

          const projects = await this.projectService.getAll(filters, page, pageSize);

          res.status(200).send(projects);
        } catch (error: any) {
          const errorType: Exception = error.constructor.name;
          return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      },
    );

    this.router.get(
      '/find',
      isAuthenticatedOrTrustedSource,
      async (req: Request, res: Response) => {
        try {
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (!req.query.title) {
            return res.status(HttpStatus.BAD_REQUEST).json('Missing title');
          }
          const project = await this.projectService.find({ title: req.query.title as string });
          return res.status(HttpStatus.OK).json(project);
        } catch (error: any) {
          console.log(error);
          const errorType: Exception = error.constructor.name;
          return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      },
    );

    this.router.get('/:id', isAuthenticatedOrTrustedSource, async (req: Request, res: Response) => {
      try {
        const project = await this.projectService.getById(req.params.id);
        return res.status(HttpStatus.OK).json(project);
      } catch (error: any) {
        console.log(error);
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.post('/', isTrustedSourceMiddleware, async (req: Request, res: Response) => {
      try {
        await createSchema.validateAsync(req.body);
        const project = await this.projectService.createProject(req.body);
        return res.status(HttpStatus.OK).json(project);
      } catch (error: any) {
        console.log(error);
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.post('/search', isAuthenticated, async (req: Request, res: Response) => {
      try {
        await searchSchema.validateAsync(req.body);
      } catch (err: any) {
        console.log(err);
        const error: Error = err;
        return res.status(statusMap[Exception.INVALID]).json(error.message);
      }

      try {
        const documents = await this.projectService.search(req.body);
        return res.status(HttpStatus.OK).json(documents);
      } catch (error: any) {
        console.log(error);
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });
  }
}
