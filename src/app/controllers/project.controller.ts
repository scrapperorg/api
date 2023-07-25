import { Exception, HttpStatus, statusMap } from '@lib';
import { TYPES } from '@server/types';
import { isAuthenticated } from '@middlewares/isAuthenticated.middleware';
import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { ProjectService } from '@services/Project.service';
import { isTrustedSourceMiddleware } from '@middlewares/isTrustedSource.middleware';
import { createSchema, searchSchema, updateSchema } from '@controllers/validationSchemas/Project';
import { isAuthenticatedOrTrustedSource } from '@middlewares/isAuthenticatedOrTrustedSource.middleware';
import { parseProjectsFilters } from '@middlewares/parseProjectsFilters.middleware';
import multer from 'multer';

const m = multer();

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
          const filters: any = {};
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (req.query.title) {
            filters['title'] = req.query.title;
          }
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (req.query.nrInrCDep) {
            filters['numarInregistrareCDep'] = req.query.nrInrCDep;
          }
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (req.query.nrInrSenat) {
            filters['numarInregistrareSenat'] = req.query.nrInrSenat;
          }
          const project = await this.projectService.find(filters);
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

    this.router.put('/:id', isTrustedSourceMiddleware, async (req: Request, res: Response) => {
      try {
        await updateSchema.validateAsync(req.body);
        const project = await this.projectService.updateProject(req.params.id, req.body);
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

    this.router.delete(
      '/:documentId/attachment/:attachmentId',
      isAuthenticated,
      async (req: Request, res: Response) => {
        const { documentId, attachmentId } = req.params;

        const noDocumentId = documentId === '' || documentId === undefined;
        const noAttachmentId = documentId === '' || documentId === undefined;

        if (noDocumentId || noAttachmentId) {
          return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Document id missing' });
        }

        try {
          const document = await this.projectService.deleteAttachment(documentId, attachmentId);
          return res.status(HttpStatus.OK).json(document);
        } catch (error: any) {
          const errorType: Exception = error.constructor.name;
          return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      },
    );

    this.router.post(
      '/upload/:documentId',
      m.single('attachment'),
      async (req: Request, res: Response) => {
        const params = req.params;

        if (params.documentId === '' || params.documentId === undefined) {
          return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Project id missing' });
        }

        if (!req.file) {
          return res.status(HttpStatus.BAD_REQUEST).json({ error: 'File missing' });
        }

        try {
          const document = await this.projectService.addAttachment(params.documentId, req.file);
          return res.status(HttpStatus.OK).json(document);
        } catch (error: any) {
          const errorType: Exception = error.constructor.name;
          return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      },
    );
  }
}
