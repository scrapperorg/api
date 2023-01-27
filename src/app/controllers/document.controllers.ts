import { assignResponsibleSchema, setDeadlineSchema } from './validationSchemas/Document';
import { Exception, HttpStatus, statusMap } from '@lib';
import { TYPES } from '@server/types';
import { DocumentService } from '@services';
import { isAuthenticated } from '@middlewares/isAuthenticated.middleware';
import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { parseDocumentsFilters } from '@middlewares/parseDocumentsFilters.middleware';
import { hasRoleAtLeast } from '@middlewares/hasRole.middleware';
import { Role } from '@domain/User';

@injectable()
export class DocumentController {
  public router: Router = Router();
  constructor(@inject(TYPES.DOCUMENT_SERVICE) private readonly documentService: DocumentService) {
    this.router.get(
      '/',
      isAuthenticated,
      parseDocumentsFilters,
      async (req: Request, res: Response) => {
        try {
          const page: number = typeof req.query.page === 'string' ? parseInt(req.query.page) : 0;

          const pageSize: number =
            typeof req.query.pageSize === 'string' ? parseInt(req.query.pageSize) : 10;

          const filters = req.documentsFilters ?? {};

          const documents = await this.documentService.getAll(filters, page, pageSize);

          res.status(200).send(documents);
        } catch (error: any) {
          const errorType: Exception = error.constructor.name;
          return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      },
    );

    this.router.get('/:id', isAuthenticated, async (req: Request, res: Response) => {
      try {
        const document = await this.documentService.getById(req.params.id);
        return res.status(HttpStatus.OK).json(document);
      } catch (error: any) {
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.post(
      '/assign-responsible',
      isAuthenticated,
      hasRoleAtLeast(Role.LSS),
      async (req: Request, res: Response) => {
        try {
          await assignResponsibleSchema.validateAsync(req.body);
        } catch (err: any) {
          const error: Error = err;
          return res.status(statusMap[Exception.INVALID]).json(error.message);
        }

        const { documentId, userId } = req.body;

        try {
          const document = await documentService.assignResponsible(documentId, userId);

          return res.status(200).json(document);
        } catch (err: any) {
          console.log(err);
          const errorType: Exception = err.constructor.name;
          return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(err);
        }
      },
    );

    this.router.post('/set-deadline', isAuthenticated, async (req: Request, res: Response) => {
      try {
        await setDeadlineSchema.validateAsync(req.body);
      } catch (err: any) {
        const error: Error = err;
        return res.status(statusMap[Exception.INVALID]).json(error.message);
      }

      const { documentId, date } = req.body;

      try {
        const document = await documentService.setDeadline(documentId, date);

        return res.status(200).json(document);
      } catch (err: any) {
        console.log(err);
        const errorType: Exception = err.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(err);
      }
    });
  }
}
