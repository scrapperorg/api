import { Exception, HttpStatus, statusMap } from '@lib';
import { TYPES } from '@server/types';
import { DocumentService } from '@services';
import { isAuthenticated } from '@middlewares/isAuthenticated.middleware';
import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { parseDocumentsFilters } from '@middlewares/parseDocumentsFilters.middleware';
import { isTrustedSourceMiddleware } from '@middlewares/isTrustedSource.middleware';
import { createSchema } from '@controllers/validationSchemas/Document';
import { isAuthenticatedOrTrustedSource } from '@middlewares/isAuthenticatedOrTrustedSource.middleware';

@injectable()
export class DocumentController {
  public router: Router = Router();
  constructor(@inject(TYPES.DOCUMENT_SERVICE) private readonly documentService: DocumentService) {
    this.router.get(
      '/',
      isAuthenticatedOrTrustedSource,
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

    this.router.post('/', isTrustedSourceMiddleware, async (req: Request, res: Response) => {
      try {
        try {
          await createSchema.validateAsync(req.body);
        } catch (err: any) {
          const error: Error = err;
          return res.status(statusMap[Exception.INVALID]).json(error.message);
        }
        const document = await this.documentService.createDocument(req.body);
        return res.status(HttpStatus.OK).json(document);
      } catch (error: any) {
        console.log(error);
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });
  }
}
