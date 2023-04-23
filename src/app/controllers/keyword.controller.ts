import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { isAuthenticatedOrTrustedSource } from '@middlewares/isAuthenticatedOrTrustedSource.middleware';
import { Exception, HttpStatus, statusMap } from '@lib';
import { TYPES } from '@server/types';
import { KeywordService } from '@services/Keyword.service';

@injectable()
export class KeywordController {
  public router: Router = Router();
  constructor(@inject(TYPES.KEYWORD_SERVICE) private readonly keywordService: KeywordService) {
    this.router.get('/', isAuthenticatedOrTrustedSource, async (req: Request, res: Response) => {
      try {
        const keywords = await this.keywordService.getAll();
        return res.status(200).send(keywords);
      } catch (error: any) {
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.post('/', isAuthenticatedOrTrustedSource, async (req: Request, res: Response) => {
      const { name } = req.body;

      if (name === undefined) {
        return res.status(400).send({ error: 'Bad Request' });
      }

      try {
        const keyword = await this.keywordService.create(name);
        return res.status(201).send(keyword);
      } catch (error: any) {
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });

    this.router.delete(
      '/:id',
      isAuthenticatedOrTrustedSource,
      async (req: Request, res: Response) => {
        if (req.params.id === undefined) {
          return res.status(400).send({ error: 'Bad Request' });
        }

        const id = req.params.id;

        try {
          await this.keywordService.delete(id);
          return res.status(200).send({ success: true });
        } catch (error: any) {
          const errorType: Exception = error.constructor.name;
          return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      },
    );

    this.router.put('/:id', isAuthenticatedOrTrustedSource, async (req: Request, res: Response) => {
      const { name } = req.body;
      const { id } = req.params;

      if (id === undefined || name === undefined) {
        res.status(400).send({ error: 'Bad Request' });
      }

      try {
        const keywords = await this.keywordService.update(id, name);
        res.status(200).send({ keywords });
      } catch (error: any) {
        const errorType: Exception = error.constructor.name;
        return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
      }
    });
  }
}
