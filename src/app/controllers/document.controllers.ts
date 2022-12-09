import { Exception, HttpStatus, statusMap } from '@lib';
import { TYPES } from '@server/types';
import { DocumentService } from '@services';
import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';

@injectable()
export class DocumentController {
  public router: Router = Router();
  constructor(@inject(TYPES.DOCUMENT_SERVICE) private readonly documentService: DocumentService) {
    this.router.get('/', async (req: Request, res: Response) => {
      const token: string = req.headers['authorization'] ?? '';

      if (token.length === 0) {
        return res.status(HttpStatus.UNAUTHORIZED).json({});
      }

      const page: number = typeof req.query.page === 'string' ? parseInt(req.query.page) : 0;

      const pageSize: number =
        typeof req.query.pageSize === 'string' ? parseInt(req.query.pageSize) : 10;

      let sourcesOfInterest: string[];

      if (Array.isArray(req.query.sourcesOfInterest)) {
        sourcesOfInterest = <string[]>req.query.sourcesOfInterest;
      } else if (typeof req.query.sourcesOfInterest === 'string') {
        sourcesOfInterest = [req.query.sourcesOfInterest];
      } else {
        sourcesOfInterest = req.query.sourcesOfInterest = [];
      }

      const documents = await this.documentService.getAll(sourcesOfInterest, page, pageSize);
      res.status(200).send(documents);
    });

    this.router.get('/:id', async (req: Request, res: Response) => {
      const token: string = req.headers['authorization'] ?? '';

      if (token.length === 0) {
        return res.status(HttpStatus.UNAUTHORIZED).json({});
      }

      try {
        const user = await this.documentService.getById(req.params.id);
        return res.status(HttpStatus.OK).json(user);
      } catch (error: any) {
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });
  }
}
