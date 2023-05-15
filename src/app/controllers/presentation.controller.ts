import { Request, Response, Router } from 'express';
import { inject, injectable } from 'inversify';
import { isAuthenticatedOrTrustedSource } from '@middlewares/isAuthenticatedOrTrustedSource.middleware';
import { Exception, HttpStatus, statusMap } from '@lib';
import { TYPES } from '@server/types';
import { PresentationService } from '@services/Presentation.service';

@injectable()
export class PresentationController {
  public router: Router = Router();
  constructor(
    @inject(TYPES.PRESENTATION_SERVICE) private presentationService: PresentationService,
  ) {
    this.router.get(
      '/monitor-cards-list',
      isAuthenticatedOrTrustedSource,
      async (req: Request, res: Response) => {
        try {
          const result = await this.presentationService.getMonitorCardsListData();
          return res.status(200).send(result);
        } catch (error: any) {
          const errorType: Exception = error.constructor.name;
          return res.status(statusMap[errorType] ?? HttpStatus.INTERNAL_SERVER_ERROR).json(error);
        }
      },
    );
  }
}
