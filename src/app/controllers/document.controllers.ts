import { TYPES } from '@server/types';
import { DocumentService } from '@services';
import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class DocumentController {
  public router: Router = Router();
  constructor(@inject(TYPES.DOCUMENT_SERVICE) private readonly documentService: DocumentService) {
    this.router.get('/', async (req: Request, res: Response) => {
      const documents = await this.documentService.getAll();
      res.status(200).send(documents);
    });
  }
}
