import { Exception, HttpStatus, statusMap } from '@lib';
import { TYPES } from '@server/types';
import { DocumentService } from '@services';
import { isAuthenticated } from '@middlewares/isAuthenticated.middleware';
import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { parseDocumentsFilters } from '@middlewares/parseDocumentsFilters.middleware';

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

    this.router.post('/upload', async (req: Request, res: Response) => {
      try {
        if (req.body.file == undefined) {
          return res.status(400).send({ message: 'No uploaded file' });
        } else {
          await this.documentService.uploadDocument(req.body.file);
          res.status(200).send({
            message: 'File uploaded ' + req.body.file,
          });
        }
      } catch (err: any) {
        res.status(500).send({
          message: `File can't be loaded. ${err}`,
        });
      }
    });
  }
}
