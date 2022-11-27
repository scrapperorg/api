import { TYPES } from '@server/types';
import { DocumentService } from '@services';
import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class DocumentController {
  public router: Router = Router();
  constructor(@inject(TYPES.DOCUMENT_SERVICE) private readonly documentService: DocumentService) {
    this.router.get('/', async (req: Request, res: Response) => {
      const page: number = typeof req.query.page === 'string' ? parseInt(req.query.page) : 0;
      const pageSize: number =
        typeof req.query.pageSize === 'string' ? parseInt(req.query.pageSize) : 10;

      const documents = await this.documentService.getAll(page, pageSize);
      res.status(200).send(documents);
    });
  }
}
